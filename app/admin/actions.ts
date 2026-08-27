"use server";

import { cookies } from "next/headers";

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
