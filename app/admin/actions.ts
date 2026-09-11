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
