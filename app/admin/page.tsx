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

export default async function AdminPage() {
  if (!(await isAuthed())) {
    return <LoginForm />;
  }

  const [users, usage, manualGrants, freeMessageConfig, broadcasts, subscriptionByUser] = await Promise.all([
    listAllUsers(),
    loadUsageLog(),
    loadManualGrants(),
    loadFreeMessageConfig(),
    loadBroadcasts(),
    loadSubscriptions(),
  ]);

  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  const activeSince = (ms: number) => {
    const cutoff = now - ms;
    const set = new Set<string>();
    for (const row of usage) {
      if (new Date(row.created_at).getTime() >= cutoff) set.add(row.user_id);
    }
    return set.size;
  };
  const dau = activeSince(DAY);
  const wau = activeSince(7 * DAY);
  const mau = activeSince(30 * DAY);

  const perUser = new Map<string, { calls: number; inputTokens: number; outputTokens: number }>();
  for (const row of usage) {
    const entry = perUser.get(row.user_id) ?? { calls: 0, inputTokens: 0, outputTokens: 0 };
    entry.calls += 1;
    entry.inputTokens += row.input_tokens;
    entry.outputTokens += row.output_tokens;
    perUser.set(row.user_id, entry);
  }

  const emailById = new Map(users.map((u) => [u.id, u.email]));
  const spendRows = [...perUser.entries()]
    .map(([userId, stats]) => ({
      userId,
      email: emailById.get(userId) ?? "(unknown)",
      ...stats,
      cost: estimateCost(stats.inputTokens, stats.outputTokens),
    }))
    .sort((a, b) => b.cost - a.cost);

  const totalCost = spendRows.reduce((sum, r) => sum + r.cost, 0);

  const perSource = new Map<string, { calls: number; inputTokens: number; outputTokens: number }>();
  for (const row of usage) {
    const entry = perSource.get(row.source) ?? { calls: 0, inputTokens: 0, outputTokens: 0 };
    entry.calls += 1;
    entry.inputTokens += row.input_tokens;
    entry.outputTokens += row.output_tokens;
    perSource.set(row.source, entry);
  }
  const sourceRows = [...perSource.entries()]
    .map(([source, stats]) => ({ source, ...stats, cost: estimateCost(stats.inputTokens, stats.outputTokens) }))
    .sort((a, b) => b.cost - a.cost);

  const registered = [...users].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  // "Ever subscribed" — anyone with a row at all, regardless of current
  // status (active, expired, refunded...) — is the real conversion
  // signal: they crossed from free to paying at least once. This is
  // exactly the number the free-message experiment is meant to move.
  const everSubscribedCount = users.filter((u) => subscriptionByUser.has(u.id)).length;
  const retention = await loadRetention(users, new Set(users.filter((u) => subscriptionByUser.has(u.id)).map((u) => u.id)));
  const rate = (r: { pct: number; back: number; of: number } | null) => (r ? `${r.pct}% (${r.back}/${r.of})` : "not enough data");
  const conversionRate = users.length > 0 ? (everSubscribedCount / users.length) * 100 : 0;

  const grantRows = manualGrants.map((g) => ({
    userId: g.user_id,
    email: emailById.get(g.user_id) ?? "(unknown)",
    grantedAt: g.granted_at,
  }));

  return (
    <div
      style={{
        // Forces native form controls (input/select) to always render
        // light — without this, a browser in dark mode auto-restyles
        // their text/background independently of our own inline styles,
        // which is exactly what made "10" and "Never" nearly invisible.
        colorScheme: "light",
        width: "100%",
        padding: "32px 40px",
        fontFamily: "system-ui, sans-serif",
        background: "#fff",
        color: "#111",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Daygo admin</h1>
        <form action={logout}>
          <button type="submit" style={{ fontSize: 13, background: "none", border: "none", color: "#666", cursor: "pointer" }}>
            Sign out
          </button>
        </form>
      </div>

      <section style={{ display: "flex", gap: 16, margin: "24px 0" }}>
        <Stat label="DAU" value={dau} />
        <Stat label="WAU" value={wau} />
        <Stat label="MAU" value={mau} />
        <Stat label="Registered users" value={users.length} />
        <Stat label="Ever subscribed" value={everSubscribedCount} />
        <Stat label="Conversion rate" value={`${conversionRate.toFixed(1)}%`} />
        <Stat label="Est. AI spend (90d)" value={`$${totalCost.toFixed(2)}`} />
      </section>

      <Section
        title="Retention"
        description={
          `From the app's own activity events${retention.since ? `, tracked since ${new Date(retention.since).toLocaleDateString("en-GB")}` : " — none yet; they start arriving once people open the updated app"}. ` +
          "Active means the person opened the app or did something in it. Return rates count people who were back in that window after signing up."
        }
      >
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Stat label="Active today" value={retention.dau} />
          <Stat label="Active 7 days" value={retention.wau} />
          <Stat label="Active 30 days" value={retention.mau} />
          <Stat label="Stickiness (DAU/MAU)" value={`${retention.stickiness}%`} />
        </div>
        <Table
          columns={["Came back", "Rate"]}
          rows={[
            ["Next day (day 1)", rate(retention.d1)],
            ["Second week (days 7–13)", rate(retention.d7)],
            ["After a month (days 30–36)", rate(retention.d30)],
          ]}
        />
        <div style={{ fontSize: 12, color: "#666", marginTop: 18 }}>Weekly cohorts: share of each sign-up week active in week 0, 1, 2, 3</div>
        <Table columns={["Signed up week of", "People", "Week 0", "Week 1", "Week 2", "Week 3"]} rows={retention.cohortRows} />
        <div style={{ fontSize: 12, color: "#666", marginTop: 18 }}>Funnel</div>
        <Table
          columns={["Step", "People", "Of signed up"]}
          rows={retention.funnel.map(([k, n]) => [k, n, `${retention.funnel[0][1] ? Math.round((n / retention.funnel[0][1]) * 100) : 0}%`])}
        />
        <div style={{ fontSize: 12, color: "#666", marginTop: 18 }}>What people use (last 30 days)</div>
        <Table columns={["Action", "People", "Times"]} rows={retention.usageRows.length ? retention.usageRows : [["No events yet", 0, 0]]} />
      </Section>

      <Section
        title="Send a notification"
        description="Announce an update or a new feature. Send a test to your own account first; it arrives like any other Daygo notification."
      >
        <Broadcast reach={broadcasts.reach} />
        {broadcasts.history.length ? (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Sent recently</div>
            {broadcasts.history.map((b) => (
              <div key={b.created_at} style={{ fontSize: 13, padding: "6px 0", borderTop: "1px solid #eee" }}>
                <b>{b.title}</b> — {b.body}
                <div style={{ color: "#888", fontSize: 12 }}>
                  {new Date(b.created_at).toLocaleString("en-GB")} · {b.audience === "everyone" ? "everyone" : "test"} ·{" "}
                  {b.failure ? `not delivered (${b.failure})` : `delivered to ${b.delivered} of ${b.devices}`}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Section>

      <Section
        title="Free chat messages (non-subscribers)"
        description={
          'How many messages someone can send before the hard paywall appears. "Never" resets means a one-time ' +
          'taste of the product; "Every day" turns this into a real ongoing free tier — a bigger decision than ' +
          "the number itself."
        }
      >
        <FreeMessageConfig limit={freeMessageConfig.limit} mode={freeMessageConfig.mode} />
      </Section>

      <Section
        title="Pro access grants"
        description="Give someone free Pro (friends, family, support gestures) without a real purchase. Checked by the app alongside real subscriptions."
      >
        <ProGrants grants={grantRows} />
      </Section>

      <Section title="AI spend by feature (last 90 days)">
        <Table
          columns={["Source", "Calls", "Input tokens", "Output tokens", "Est. cost"]}
          rows={sourceRows.map((r) => [
            r.source,
            r.calls.toLocaleString(),
            r.inputTokens.toLocaleString(),
            r.outputTokens.toLocaleString(),
            `$${r.cost.toFixed(3)}`,
          ])}
        />
      </Section>

      <Section title="AI spend by user (last 90 days)">
        <Table
          columns={["Email", "Calls", "Input tokens", "Output tokens", "Est. cost"]}
          rows={spendRows.slice(0, 100).map((r) => [
            r.email,
            r.calls.toLocaleString(),
            r.inputTokens.toLocaleString(),
            r.outputTokens.toLocaleString(),
            `$${r.cost.toFixed(3)}`,
          ])}
        />
      </Section>

      <Section title="Registered users">
        <Table
          columns={["Name", "Email", "Subscription", "Registered"]}
          rows={registered.slice(0, 200).map((u) => [
            u.name ?? "—",
            u.email ?? "(no email)",
            formatSubscriptionStatus(subscriptionByUser.get(u.id)),
            new Date(u.created_at).toLocaleString(),
          ])}
        />
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginTop: 28,
        padding: 20,
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        background: "#fafafa",
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{title}</h2>
      {description ? (
        <p style={{ fontSize: 13, color: "#666", marginTop: 6, marginBottom: 14 }}>{description}</p>
      ) : (
        <div style={{ marginTop: 14 }} />
      )}
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ padding: "12px 16px", border: "1px solid #eee", borderRadius: 10, minWidth: 110 }}>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
    </div>
  );
}

function Table({ columns, rows }: { columns: string[]; rows: (string | number)[][] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 8 }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: "6px 8px", color: "#666" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ borderBottom: "1px solid #f5f5f5", padding: "6px 8px" }}>
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
