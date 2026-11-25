import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Retention from the app's own analytics events (app_events). Events only
// exist from the analytics release onward, so older accounts look inactive
// until they open an updated app. Times are UTC days.

const DAY = 24 * 60 * 60 * 1000;
const dayIndex = (iso: string) => Math.floor(new Date(iso).getTime() / DAY);

type Event = { user_id: string; event: string; props: Record<string, unknown>; created_at: string };
type User = { id: string; created_at: string };

export type Retention = Awaited<ReturnType<typeof loadRetention>>;

export async function loadRetention(users: User[], subscribed: Set<string>) {
  const admin = supabaseAdmin();
  const since = new Date(Date.now() - 120 * DAY).toISOString();
  const [{ data: evData }, { data: tokens }] = await Promise.all([
    admin.from("app_events").select("user_id,event,props,created_at").gte("created_at", since).order("created_at").limit(100000),
    admin.from("device_tokens").select("user_id").not("user_id", "is", null),
  ]);
  const events = (evData ?? []) as Event[];
  const withPush = new Set(((tokens ?? []) as { user_id: string }[]).map((t) => t.user_id));
  const today = Math.floor(Date.now() / DAY);

  // Days each person was active (any event counts as active).
  const activeDays = new Map<string, Set<number>>();
  for (const e of events) {
    const s = activeDays.get(e.user_id) ?? new Set<number>();
    s.add(dayIndex(e.created_at));
    activeDays.set(e.user_id, s);
  }
  const activeWithin = (days: number) =>
    [...activeDays.values()].filter((s) => [...s].some((d) => d > today - days)).length;
  const dau = activeWithin(1), wau = activeWithin(7), mau = activeWithin(30);

  // Return rates: of people who signed up at least N days ago, how many were
  // active in the window [N, N+span) days after sign-up.
  const signup = new Map(users.map((u) => [u.id, dayIndex(u.created_at)]));
  const returnRate = (n: number, span: number) => {
    const eligible = users.filter((u) => today - (signup.get(u.id) ?? today) >= n + span - 1);
    if (!eligible.length) return null;
    const back = eligible.filter((u) => {
      const s = activeDays.get(u.id);
      const d0 = signup.get(u.id)!;
      return !!s && [...s].some((d) => d - d0 >= n && d - d0 < n + span);
    }).length;
    return { pct: Math.round((back / eligible.length) * 100), back, of: eligible.length };
  };

  // Weekly cohorts by sign-up week (Monday-based), last 8 weeks.
  const weekStart = (d: number) => d - ((new Date(d * DAY).getUTCDay() + 6) % 7);
  const cohorts = new Map<number, string[]>();
  for (const u of users) {
    const w = weekStart(signup.get(u.id)!);
    if (w < weekStart(today) - 7 * 7) continue;
    cohorts.set(w, [...(cohorts.get(w) ?? []), u.id]);
  }
  const cohortRows = [...cohorts.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([w, ids]) => {
      const cells = [0, 1, 2, 3].map((k) => {
        if (w + k * 7 > today) return "—";
        const back = ids.filter((id) => {
          const s = activeDays.get(id);
          return !!s && [...s].some((d) => d >= w + k * 7 && d < w + (k + 1) * 7);
        }).length;
        return `${Math.round((back / ids.length) * 100)}%`;
      });
      return [new Date(w * DAY).toISOString().slice(0, 10), ids.length, ...cells];
    });

  // What people use (last 30 days): count + distinct people per event.
  const recent = events.filter((e) => dayIndex(e.created_at) > today - 30);
  const usage = new Map<string, { n: number; people: Set<string> }>();
  const keyOf = (e: Event) =>
    e.event === "tab_view" ? `tab: ${e.props.tab}` :
    e.event === "notification_open" ? `notification opened: ${e.props.kind}` : e.event;
  for (const e of recent) {
    const k = keyOf(e);
    const u = usage.get(k) ?? { n: 0, people: new Set<string>() };
    u.n++; u.people.add(e.user_id);
    usage.set(k, u);
  }
  const usageRows = [...usage.entries()]
    .sort((a, b) => b[1].people.size - a[1].people.size)
    .map(([k, v]) => [k, v.people.size, v.n]);

  // Funnel: sign-up → finished onboarding → first chat → notifications on → subscribed.
  const did = (name: string) => new Set(events.filter((e) => e.event === name).map((e) => e.user_id));
  const onboarded = did("onboarding_done"), chatted = did("chat_sent");
  const funnel: [string, number][] = [
    ["Signed up", users.length],
    ["Opened the app (tracked)", activeDays.size],
    ["Finished onboarding", onboarded.size],
    ["Sent a chat message", chatted.size],
    ["Notifications on", withPush.size],
    ["Subscribed", subscribed.size],
  ];

  const sessions = new Set(recent.filter((e) => e.event === "app_open").map((e) => `${e.user_id}`)).size;
  return {
    since: events[0]?.created_at ?? null,
    dau, wau, mau,
    stickiness: mau ? Math.round((dau / mau) * 100) : 0,
    d1: returnRate(1, 1),
    d7: returnRate(7, 7),
    d30: returnRate(30, 7),
    cohortRows,
    usageRows,
    funnel,
    sessions,
  };
}
