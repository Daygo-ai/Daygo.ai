"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const COOKIE_NAME = "daygo_admin";

export async function login(_prevState: { error?: string }, formData: FormData) {
  const password = formData.get("password");
  if (typeof password !== "string" || password.length === 0 || password !== process.env.ADMIN_PASSWORD) {
    return { error: "Wrong password." };
  }
  const store = await cookies();
  // The password itself is the session token — fine for a single-admin
  // page with no per-user accounts. httpOnly + secure so it can't be
  // read from client JS or sent over plain HTTP.
  store.set(COOKIE_NAME, password, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 30,
  });
  return { error: undefined };
}

export async function logout() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  return !!value && value === process.env.ADMIN_PASSWORD;
}

/// Server actions are callable directly (not just via the form that
/// renders them), so every one of these re-checks the admin cookie
/// itself rather than trusting that only the admin page's own UI can
/// reach them.

export async function grantPro(_prevState: { error?: string }, formData: FormData) {
  if (!(await isAuthed())) return { error: "Not authorized." };
  const email = formData.get("email");
  if (typeof email !== "string" || email.trim().length === 0) {
    return { error: "Enter an email." };
  }
  const admin = supabaseAdmin();
  // No filter-by-email on listUsers, so page through and match — fine
  // at this user count; revisit if it ever grows past a few thousand.
  let user: { id: string } | null = null;
  for (let page = 1; !user; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return { error: error.message };
    const match = data.users.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());
    if (match) user = { id: match.id };
    if (data.users.length < 200) break;
  }
  if (!user) return { error: `No account found for ${email}.` };

  const { error } = await admin.from("manual_pro_grants").upsert({ user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { error: undefined };
}

export async function revokePro(userId: string) {
  if (!(await isAuthed())) return;
  await supabaseAdmin().from("manual_pro_grants").delete().eq("user_id", userId);
  revalidatePath("/admin");
}

export async function updateFreeMessageConfig(_prevState: { error?: string }, formData: FormData) {
  if (!(await isAuthed())) return { error: "Not authorized." };
  const limitRaw = formData.get("limit");
  const mode = formData.get("mode");
  const limit = typeof limitRaw === "string" ? parseInt(limitRaw, 10) : NaN;
  if (!Number.isFinite(limit) || limit < 0) return { error: "Enter a valid non-negative number." };
  if (mode !== "lifetime" && mode !== "daily") return { error: "Invalid mode." };

  const admin = supabaseAdmin();
  const { error } = await admin.from("app_config").upsert([
    { key: "free_message_limit", value: String(limit) },
    { key: "free_message_mode", value: mode },
  ]);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { error: undefined };
}

/** Finds a user id by email (no filter-by-email in the admin API, so page through). */
async function userIdForEmail(email: string): Promise<string | null> {
  const admin = supabaseAdmin();
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return null;
    const match = data.users.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());
    if (match) return match.id;
    if (data.users.length < 200) return null;
  }
}

export type BroadcastState = { error?: string; result?: string };

/** Sends a notification through the admin-broadcast edge function. */
export async function sendBroadcast(_prev: BroadcastState, formData: FormData): Promise<BroadcastState> {
  if (!(await isAuthed())) return { error: "Not authorized." };
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const audience = String(formData.get("audience") ?? "test");
  const testEmail = String(formData.get("testEmail") ?? "").trim();
  if (!title || !body) return { error: "Add a title and a message." };

  let userIds: string[] | undefined;
  if (audience !== "everyone") {
    if (!testEmail) return { error: "Enter the email of the account to test with." };
    const id = await userIdForEmail(testEmail);
    if (!id) return { error: `No account found for ${testEmail}.` };
    userIds = [id];
  } else if (formData.get("confirm") !== "yes") {
    return { error: "Tick the box to confirm sending to everyone." };
  }

  const { data, error } = await supabaseAdmin().functions.invoke("admin-broadcast", {
    body: { title, body, user_ids: userIds },
  });
  if (error) return { error: `Send failed: ${error.message}` };
  const r = data as { users: number; devices: number; delivered: number; failure: string | null };
  revalidatePath("/admin");
  if (r.devices === 0) return { error: "Nobody in that audience has notifications on yet." };
  if (r.delivered === 0) {
    return { error: `Not delivered (${r.failure ?? "unknown"}). If it says 403, the Apple push key isn't set on the server yet.` };
  }
  return { result: `Delivered to ${r.delivered} of ${r.devices} device${r.devices === 1 ? "" : "s"} (${r.users} ${r.users === 1 ? "person" : "people"}).` };
}
