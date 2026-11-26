import { isAuthed, logout } from "./actions";
import { LoginForm } from "./LoginForm";
import { ProGrants } from "./ProGrants";
import { FreeMessageConfig } from "./FreeMessageConfig";
import { Broadcast } from "./Broadcast";
import { loadRetention } from "./retention";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

/** How many people/devices an "everyone" broadcast reaches, and the last sends. */
async function loadBroadcasts() {
  const admin = supabaseAdmin();
  const [{ data: devices }, { data: history }] = await Promise.all([
    admin.from("device_tokens").select("user_id").not("user_id", "is", null),
    admin.from("admin_broadcasts").select("created_at,title,body,audience,devices,delivered,failure").order("created_at", { ascending: false }).limit(10),
  ]);
  const rows = (devices ?? []) as { user_id: string }[];
  return {
    reach: { users: new Set(rows.map((r) => r.user_id)).size, devices: rows.length },
    history: (history ?? []) as { created_at: string; title: string; body: string; audience: string; devices: number; delivered: number; failure: string | null }[],
  };
}

async function loadFreeMessageConfig() {
  const admin = supabaseAdmin();
  const { data, error } = await admin.from("app_config").select("key, value");
  if (error) throw error;
  const byKey = new Map(data.map((r) => [r.key, r.value]));
  return {
    limit: parseInt(byKey.get("free_message_limit") ?? "10", 10),
    mode: byKey.get("free_message_mode") ?? "lifetime",
  };
}

async function loadSubscriptions() {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("subscriptions")
    .select("user_id, product_id, status, expires_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  // Keep only the most recently updated row per user — someone can have
  // multiple subscription rows (e.g. tried Weekly, then switched to
  // Annual), and only the latest one reflects their real current status.
  const latestByUser = new Map<string, { product_id: string; status: string; expires_at: string | null }>();
  for (const row of data) {
    if (!row.user_id || latestByUser.has(row.user_id)) continue;
    latestByUser.set(row.user_id, { product_id: row.product_id, status: row.status, expires_at: row.expires_at });
  }
  return latestByUser;
}

async function loadManualGrants() {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("manual_pro_grants")
    .select("user_id, granted_at")
    .order("granted_at", { ascending: false });
  if (error) throw error;
  return data;
}

async function listAllUsers() {
  const admin = supabaseAdmin();
  const perPage = 200;
  let page = 1;
  const users: { id: string; email: string | null; name: string | null; created_at: string }[] = [];
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    users.push(
      ...data.users.map((u) => ({
        id: u.id,
        email: u.email ?? null,
        // Google sign-in forwards a real name; Apple only ever sends one
        // on a user's very first authorization, and only if the app
        // captured and forwarded it then — most existing users signed in
        // via Apple before that was wired up, so this is null for them.
        name: (u.user_metadata?.full_name || u.user_metadata?.name) ?? null,
        created_at: u.created_at,
      })),
    );
    if (data.users.length < perPage) break;
    page += 1;
  }
  return users;
}

async function loadUsageLog() {
  const admin = supabaseAdmin();
  // Last 90 days is enough for DAU/WAU/MAU and a recent-spend view without
  // pulling the whole table as this grows. Raise this once there's a real
  // reason to look further back.
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await admin
    .from("ai_usage_log")
    .select("user_id, created_at, source, model, input_tokens, output_tokens")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(50000);
  if (error) throw error;
  return data;
}

// Anthropic's published per-token rates, in USD per token (not per
// million) so the multiply below stays simple. Update if pricing or the
// default model changes — this is an estimate for cap-sizing decisions,
// not a billing-accurate number.
const PRICE_PER_INPUT_TOKEN = 3 / 1_000_000;
const PRICE_PER_OUTPUT_TOKEN = 15 / 1_000_000;

function estimateCost(inputTokens: number, outputTokens: number) {
  return inputTokens * PRICE_PER_INPUT_TOKEN + outputTokens * PRICE_PER_OUTPUT_TOKEN;
}

const PLAN_LABELS: Record<string, string> = {
  "ai.daygo.pro.weekly": "Weekly",
  "ai.daygo.pro.annual": "Annual",
};

function formatSubscriptionStatus(sub: { product_id: string; status: string } | undefined): string {
  if (!sub) return "—";
  const plan = PLAN_LABELS[sub.product_id] ?? sub.product_id;
  const statusLabel: Record<string, string> = {
    active: "Active",
    active_will_not_renew: "Active (not renewing)",
    expired: "Expired",
    in_grace_period: "Grace period",
    in_billing_retry: "Billing retry",
    revoked: "Refunded/revoked",
  };
  return `${plan} — ${statusLabel[sub.status] ?? sub.status}`;
}

const TABS = [
  ["overview", "Overview"],
  ["users", "Users"],
  ["retention", "Retention"],
  ["money", "Money"],
  ["ai", "AI costs"],
  ["notify", "Notifications"],
] as const;
type Tab = (typeof TABS)[number][0];

const fmtDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");
const ago = (iso: string | null | undefined) => {
  if (!iso) return "never";
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : `${d} days ago`;
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  if (!(await isAuthed())) {
    return <LoginForm />;
  }
  const requested = (await searchParams).tab;
  const tab: Tab = (TABS.find(([k]) => k === requested)?.[0] ?? "overview") as Tab;

  const [users, usage, manualGrants, freeMessageConfig, broadcasts, subscriptionByUser] = await Promise.all([
    listAllUsers(),
    loadUsageLog(),
    loadManualGrants(),
    loadFreeMessageConfig(),
    loadBroadcasts(),
    loadSubscriptions(),
  ]);

  const DAY = 86_400_000;
  const now = Date.now();
  const emailById = new Map(users.map((u) => [u.id, u.email]));

  // ── AI costs ──
  const sumBy = (key: (r: (typeof usage)[number]) => string, sinceMs = 90 * DAY) => {
    const m = new Map<string, { calls: number; inputTokens: number; outputTokens: number }>();
    for (const r of usage) {
      if (now - new Date(r.created_at).getTime() > sinceMs) continue;
      const e = m.get(key(r)) ?? { calls: 0, inputTokens: 0, outputTokens: 0 };
      e.calls++; e.inputTokens += r.input_tokens; e.outputTokens += r.output_tokens;
      m.set(key(r), e);
    }
    return [...m.entries()].map(([k, v]) => ({ key: k, ...v, cost: estimateCost(v.inputTokens, v.outputTokens) })).sort((a, b) => b.cost - a.cost);
  };
  const spendByUser = sumBy((r) => r.user_id);
  const spendBySource = sumBy((r) => r.source);
  const cost90 = spendByUser.reduce((s, r) => s + r.cost, 0);
  const cost30 = sumBy((r) => r.user_id, 30 * DAY).reduce((s, r) => s + r.cost, 0);
  const costByUser = new Map(spendByUser.map((r) => [r.key, r.cost]));

  // ── Money ──
  const subs = [...subscriptionByUser.values()];
  const activeStatuses = new Set(["active", "active_will_not_renew", "in_grace_period", "in_billing_retry"]);
  const activeSubs = subs.filter((s) => activeStatuses.has(s.status));
  const everSubscribed = users.filter((u) => subscriptionByUser.has(u.id)).length;
  const conversion = users.length ? (everSubscribed / users.length) * 100 : 0;
  const planCounts = new Map<string, number>();
  for (const s of subs) {
    const k = formatSubscriptionStatus(s);
    planCounts.set(k, (planCounts.get(k) ?? 0) + 1);
  }

  // ── Retention + per-user activity ──
  const retention = await loadRetention(users, new Set(users.filter((u) => subscriptionByUser.has(u.id)).map((u) => u.id)));
  const rate = (r: { pct: number; back: number; of: number } | null) => (r ? `${r.pct}%  (${r.back} of ${r.of})` : "not enough data yet");
  const pushOn = new Set(retention.withPush);
  const newThisWeek = users.filter((u) => now - new Date(u.created_at).getTime() < 7 * DAY).length;

  const registered = [...users].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const grantRows = manualGrants.map((g) => ({ userId: g.user_id, email: emailById.get(g.user_id) ?? "(unknown)", grantedAt: g.granted_at }));

  return (
    <div style={{ colorScheme: "light", minHeight: "100vh", background: "#f6f6f4", color: "#111", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* header + tabs */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e8e4", position: "sticky", top: 0, zIndex: 5 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>Daygo admin</div>
          <form action={logout}>
            <button type="submit" style={{ fontSize: 13, background: "none", border: "none", color: "#777", cursor: "pointer" }}>Sign out</button>
          </form>
        </div>
        <nav style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", display: "flex", gap: 4, overflowX: "auto" }}>
          {TABS.map(([k, label]) => (
            <a
              key={k}
              href={`/admin?tab=${k}`}
              style={{
                padding: "12px 14px",
                fontSize: 14,
                fontWeight: tab === k ? 600 : 500,
                color: tab === k ? "#111" : "#777",
                textDecoration: "none",
                borderBottom: tab === k ? "2px solid #111" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "24px" }}>
        {tab === "overview" && (
          <>
            <Group title="Growth">
              <Stat label="Registered users" value={users.length} />
              <Stat label="New this week" value={newThisWeek} />
              <Stat label="Notifications on" value={pushOn.size} hint="can receive pushes" />
            </Group>
            <Group title="Engagement" note={retention.since ? `app events since ${fmtDate(retention.since)}` : "app events start with the next app release"}>
              <Stat label="Active today" value={retention.dau} />
              <Stat label="Active 7 days" value={retention.wau} />
              <Stat label="Active 30 days" value={retention.mau} />
              <Stat label="Back on day 1" value={retention.d1 ? `${retention.d1.pct}%` : "—"} />
              <Stat label="Back in week 2" value={retention.d7 ? `${retention.d7.pct}%` : "—"} />
            </Group>
            <Group title="Money">
              <Stat label="Paying now" value={activeSubs.length} />
              <Stat label="Ever subscribed" value={everSubscribed} />
              <Stat label="Conversion" value={`${conversion.toFixed(1)}%`} hint="ever subscribed / registered" />
              <Stat label="Pro grants" value={manualGrants.length} hint="free Pro you gave" />
            </Group>
            <Group title="Costs">
              <Stat label="AI spend, 30 days" value={`$${cost30.toFixed(2)}`} />
              <Stat label="AI spend, 90 days" value={`$${cost90.toFixed(2)}`} />
            </Group>
            <Card title="Funnel" description="How far people get, from sign-up to paying.">
              <Funnel steps={retention.funnel} />
            </Card>
          </>
        )}

        {tab === "users" && (
          <Card title={`Users (${users.length})`} description="Newest first. Last active comes from app events (newer app versions only).">
            <Table
              columns={["Name", "Email", "Signed up", "Last active", "Days active", "Notifications", "Plan", "AI cost (90d)"]}
              rows={registered.slice(0, 300).map((u) => [
                u.name ?? "—",
                u.email ?? "(no email)",
                fmtDate(u.created_at),
                ago(retention.lastActive[u.id]),
                retention.daysActive[u.id] ?? 0,
                pushOn.has(u.id) ? "on" : "—",
                formatSubscriptionStatus(subscriptionByUser.get(u.id)),
                costByUser.has(u.id) ? `$${costByUser.get(u.id)!.toFixed(2)}` : "—",
              ])}
            />
          </Card>
        )}

        {tab === "retention" && (
          <>
            <Group title="Active people" note={retention.since ? `tracked since ${fmtDate(retention.since)}` : "no app events yet"}>
              <Stat label="Today" value={retention.dau} />
              <Stat label="Last 7 days" value={retention.wau} />
              <Stat label="Last 30 days" value={retention.mau} />
              <Stat label="Stickiness" value={`${retention.stickiness}%`} hint="daily / monthly active" />
            </Group>
            <Card title="Do people come back?" description="Of people who signed up long enough ago, the share active again in each window.">
              <Table
                columns={["Window after sign-up", "Came back"]}
                rows={[
                  ["Next day (day 1)", rate(retention.d1)],
                  ["Second week (days 7–13)", rate(retention.d7)],
                  ["After a month (days 30–36)", rate(retention.d30)],
                ]}
              />
            </Card>
            <Card title="Weekly cohorts" description="Each row is a sign-up week; each column the share of that group active in the weeks after.">
              <Table columns={["Signed up week of", "People", "Week 0", "Week 1", "Week 2", "Week 3"]} rows={retention.cohortRows.length ? retention.cohortRows : [["No sign-ups in the last 8 weeks", 0, "", "", "", ""]]} />
            </Card>
            <Card title="What people use" description="Last 30 days, by number of people.">
              <Table columns={["Action", "People", "Times"]} rows={retention.usageRows.length ? retention.usageRows : [["No events yet", 0, 0]]} />
            </Card>
          </>
        )}

        {tab === "money" && (
          <>
            <Group title="Subscriptions">
              <Stat label="Paying now" value={activeSubs.length} />
              <Stat label="Ever subscribed" value={everSubscribed} />
              <Stat label="Conversion" value={`${conversion.toFixed(1)}%`} />
            </Group>
            <Card title="By plan and status" description="Latest subscription per person.">
              <Table columns={["Plan and status", "People"]} rows={planCounts.size ? [...planCounts.entries()].sort((a, b) => b[1] - a[1]) : [["No subscriptions yet", 0]]} />
            </Card>
            <Card
              title="Free chat messages"
              description='How many messages a non-subscriber can send before the paywall. "Never" resets = a one-time taste; "Every day" = an ongoing free tier.'
            >
              <FreeMessageConfig limit={freeMessageConfig.limit} mode={freeMessageConfig.mode} />
            </Card>
            <Card title="Free Pro access" description="Give someone Pro without a purchase (friends, testers, support). The app treats it like a real subscription.">
              <ProGrants grants={grantRows} />
            </Card>
          </>
        )}

        {tab === "ai" && (
          <>
            <Group title="Estimated AI spend" note="estimate from token counts, not a bill">
              <Stat label="Last 30 days" value={`$${cost30.toFixed(2)}`} />
              <Stat label="Last 90 days" value={`$${cost90.toFixed(2)}`} />
              <Stat label="Per active person (30d)" value={retention.mau ? `$${(cost30 / retention.mau).toFixed(2)}` : "—"} />
            </Group>
            <Card title="By feature (90 days)">
              <Table
                columns={["Feature", "Calls", "Input tokens", "Output tokens", "Est. cost"]}
                rows={spendBySource.map((r) => [r.key, r.calls.toLocaleString(), r.inputTokens.toLocaleString(), r.outputTokens.toLocaleString(), `$${r.cost.toFixed(3)}`])}
              />
            </Card>
            <Card title="By person (90 days)" description="Top 100.">
              <Table
                columns={["Email", "Calls", "Input tokens", "Output tokens", "Est. cost"]}
                rows={spendByUser.slice(0, 100).map((r) => [emailById.get(r.key) ?? "(unknown)", r.calls.toLocaleString(), r.inputTokens.toLocaleString(), r.outputTokens.toLocaleString(), `$${r.cost.toFixed(3)}`])}
              />
            </Card>
          </>
        )}

        {tab === "notify" && (
          <>
            <Card title="Send a notification" description="Announce an update or a new feature. Send a test to your own account first; it arrives like any other Daygo notification.">
              <Broadcast reach={broadcasts.reach} />
            </Card>
            <Card title="Sent recently">
              <Table
                columns={["When", "Title", "Message", "Audience", "Result"]}
                rows={
                  broadcasts.history.length
                    ? broadcasts.history.map((b) => [
                        new Date(b.created_at).toLocaleString("en-GB"),
                        b.title,
                        b.body,
                        b.audience === "everyone" ? "Everyone" : "Test",
                        b.failure ? `Not delivered (${b.failure})` : `Delivered ${b.delivered} of ${b.devices}`,
                      ])
                    : [["Nothing sent yet", "", "", "", ""]]
                }
              />
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

function Group({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 10 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#555", margin: 0 }}>{title}</h2>
        {note ? <span style={{ fontSize: 12, color: "#999" }}>{note}</span> : null}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12 }}>{children}</div>
    </section>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 20, padding: 20, border: "1px solid #e8e8e4", borderRadius: 14, background: "#fff" }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{title}</h2>
      {description ? <p style={{ fontSize: 13, color: "#777", margin: "6px 0 12px" }}>{description}</p> : <div style={{ height: 10 }} />}
      {children}
    </section>
  );
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div style={{ padding: "14px 16px", border: "1px solid #e8e8e4", borderRadius: 12, background: "#fff" }}>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>{label}</div>
      {hint ? <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{hint}</div> : null}
    </div>
  );
}

function Funnel({ steps }: { steps: [string, number][] }) {
  const top = steps[0]?.[1] || 1;
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {steps.map(([label, n]) => (
        <div key={label} style={{ display: "grid", gridTemplateColumns: "200px 1fr 90px", gap: 12, alignItems: "center", fontSize: 13 }}>
          <span>{label}</span>
          <div style={{ background: "#f0f0ec", borderRadius: 6, height: 14, overflow: "hidden" }}>
            <div style={{ width: `${Math.max(2, (n / top) * 100)}%`, height: "100%", background: "#CDEE3C" }} />
          </div>
          <span style={{ textAlign: "right", color: "#555" }}>
            {n} · {Math.round((n / top) * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function Table({ columns, rows }: { columns: string[]; rows: (string | number)[][] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "8px 10px", color: "#777", fontWeight: 500, whiteSpace: "nowrap" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ borderBottom: "1px solid #f4f4f2", padding: "8px 10px", verticalAlign: "top" }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
