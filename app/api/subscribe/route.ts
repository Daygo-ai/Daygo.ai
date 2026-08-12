import { NextResponse } from "next/server";
import mailchimp from "@mailchimp/mailchimp_marketing";

const API_KEY = process.env.MAILCHIMP_API_KEY;
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const LIST_ID = process.env.MAILCHIMP_LIST_ID;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!API_KEY || !SERVER_PREFIX || !LIST_ID) {
    return NextResponse.json(
      { error: "Waitlist signup is not configured." },
      { status: 500 },
    );
  }

  const { email } = await request.json().catch(() => ({ email: undefined }));

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  mailchimp.setConfig({ apiKey: API_KEY, server: SERVER_PREFIX });

  try {
    await mailchimp.lists.addListMember(LIST_ID, {
      email_address: email,
      status: "pending", // double opt-in confirmation email
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const body =
      typeof error === "object" && error !== null && "response" in error
        ? (error as { response?: { body?: { title?: string } } }).response?.body
        : undefined;

    if (body?.title === "Member Exists") {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    console.error("Mailchimp subscribe error", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}
