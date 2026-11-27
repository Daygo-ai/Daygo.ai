# Daygo — Privacy Policy

_Last updated: 2026-11-27_
_Operator: Marijus Dovydaitis ("we", "our")_

## 1. What this policy covers

Daygo is a personal wellbeing app. This policy explains what personal data Daygo collects, why, where it's stored, who can see it, and what your rights are.

## 2. Data we collect

### 2.1 Data you give us directly
- **Profile**: age, sex, primary goal, optional height, weight, dietary notes, sleep schedule, timezone.
- **Logs and journals**: mood, food, social, activity, symptoms, weight, hydration, supplements, medications, period, caffeine, alcohol, fasting, free-form journal entries.
- **Photos and files** you attach to chat messages (e.g. blood-work scans). These are sent to Anthropic's Claude API for analysis and are not retained on our servers beyond the request.

### 2.2 Health and wearable data
- With your permission, Daygo reads health data from **Apple Health (HealthKit)** on your device: steps and activity, workouts, heart rate and resting heart rate, heart rate variability, sleep (including sleep stages), and basic characteristics (date of birth, biological sex).
- This covers data from any device or app that writes to Apple Health — Apple Watch, Garmin, Fitbit, Whoop, Oura, and others.
- We only ever **read** from Apple Health. We never write data back to it.
- You grant this permission explicitly, per data type, and can revoke it at any time in iOS Settings → Privacy & Security → Health.
- **Health sync is your choice.** Daygo asks during setup, and you can change it any time in Settings → Privacy → Sync health data. It is **off unless you turn it on**.
  - **Off:** Apple Health data stays on your device. Only the specific values needed for an AI reply you ask for are sent to Anthropic's Claude API (see section 3).
  - **On:** your Apple Health data (sleep, heart rate variability, resting heart rate, workouts, activity), your logs and your lab values are backed up to our Supabase database (EU), linked to your account. This lets your coach, morning brief, weekly summary and pattern detection use your history, and lets a clinic you have joined see what you chose to share with it.
  - Turning it off stops new uploads. To also remove what was already uploaded, delete your account or email privacy@daygo.ai.
- We never use HealthKit data for advertising, and we never sell or share it with data brokers.

### 2.3 Garmin Connect data
- If you choose **Connect Garmin** (in onboarding or Settings), you sign in on Garmin's own page and choose what to share. Daygo never sees your Garmin password.
- With your permission, Garmin sends us: daily summaries (steps, resting heart rate, stress, Body Battery), sleep (duration, stages and their timing, sleep score), overnight heart rate variability, and your activities (type, time, distance, duration, calories, heart rate, and the GPS route with heart rate along it).
- Unlike Apple Health data, Garmin data is delivered to our servers, so it is **stored in our Supabase database** (EU), linked to your Daygo account and visible only to you.
- We use it only to give *you* your readiness, charts, 3D route maps and coaching. It is never sold, never shared with advertisers or data brokers, and never used to train or improve AI models.
- You can disconnect at any time in Settings → Garmin connected. Disconnecting removes Daygo's access at Garmin and **deletes your Garmin data from Daygo**. Removing Daygo in your Garmin Connect account does the same.

### 2.3a Oura and WHOOP
- If you connect **Oura** or **WHOOP** in Settings, you sign in on their page and Daygo receives your daily sleep, readiness or recovery, heart rate variability, resting heart rate, strain and workouts. This data is stored in our Supabase database (EU), linked to your account.
- Disconnecting removes Daygo's access and deletes everything Daygo imported from that service, including the values it added to your daily records.

### 2.3b Lab values (blood work)
- Lab values are only saved after you accept the separate blood-work consent. You can withdraw it in Settings → Privacy. Once you do, new lab values aren't saved and your lab values are no longer given to the AI coach.

### 2.3c Clinics
- If you join a clinic with an invite code, the clinic sees only the categories you choose to share (for example wearables, check-ins or tests). You can change or stop sharing at any time. Every time a clinician opens your chart, the access is logged.
- AI summaries for your clinician are only made if your AI coaching setting is on.

### 2.4 Authentication data
- If you sign in with Apple, we receive a user identifier and (if you grant it) your name and a private-relay email. We never receive your real Apple ID password.
- If you sign in with Google, we receive your Google account identifier, name and email. We never receive your Google password.

### 2.5 Device and diagnostic data
- A vendor-scoped device identifier (`identifierForVendor`) used for rate limiting.
- Crash reports (Sentry), **only if you turn them on** in Settings → Privacy: device type, OS and app version, and crash details. No health data.
- A push notification token, if you grant notification permission.
- App usage events, if you're signed in: which parts of the app you use and when (for example: opened the app, opened Chat, tapped a suggested question, set a reminder, opened a notification), with the app version. Never health values, and never what you write or say.

### 2.6 What we don't collect
- No advertising identifiers. No third-party trackers. No analytics SDKs that build a behavioral profile of you (the app usage events above stay in our own database and are only used to improve Daygo). No location beyond your timezone.

## 3. How we use your data

- **Run the app.** Render today's verdict, history, charts, reminders.
- **Generate AI coaching.** We send the relevant subset of your data to Anthropic's Claude API. Anthropic processes it under their commercial terms and does not use it to train their models.
- **Send you push notifications.** Only when you've enabled them.
- **Diagnose crashes and bugs** via Sentry.
- **Improve the app.** App usage events show which features people use and keep coming back to. This is based on our legitimate interest in building a useful product (GDPR Art. 6(1)(f)); you can object any time by emailing privacy@daygo.ai.

We do not sell your data. We do not share it with advertisers. We never use your data, including Garmin and Apple Health data, to train or improve AI models.

## 3a. AI transparency

Daygo's coach is an AI, not a person and not a clinician.
- **What it sees:** when you chat with it or it prepares your daily brief, the relevant part of your data — profile, recent logs and journal notes, sleep, HRV, heart rate, workouts, lab values and Garmin data — is sent to Anthropic's Claude API to write the reply.
- **What it remembers:** Daygo keeps a list of things it has learned about you from your conversations. You can see, edit and delete them in Settings → Memory.
- **No training:** Anthropic processes this data under its commercial terms and does not use it to train its models. Neither do we.
- **Your choice:** you can turn AI processing on or off any time in Settings → Privacy → AI coaching. When it's off, none of your data is sent to the AI: no chat, briefs, weekly summaries, lab insights, background pattern detection or clinic AI summaries. You can also delete your conversations and memories, or your account. Logging, charts and Apple Health or Garmin data keep working without the AI.
- AI replies can be wrong. They are not medical advice (see section 9).

## 4. Where your data lives

- **On your device** by default (SwiftData, Keychain).
- **In our Supabase project** when you're signed in: profile, daily verdicts, journals, weekly intents, what the coach remembers, your consent choices, Garmin, Oura or WHOOP data if you connected them, and your Apple Health data, logs and lab values if health sync is on. Storage is in the EU (AWS `eu-west-1`, Ireland).
- **In transit** to and from Anthropic's API for AI features. Anthropic stores prompt data per their commercial agreement and does not train on it.
- **Apple Health data** stays on your device unless you turn on health sync (see section 2.2).

### Who processes your data

| Service | What for | Data |
|---|---|---|
| Supabase | Database, sign-in, server functions | Account, logs, journals, synced health data, wearable data |
| Anthropic (Claude API) | AI coaching replies and briefs | The subset of your data needed for each reply |
| Garmin | Source of Garmin data, only if you connect it | Garmin sends data to us; we send Garmin nothing about you |
| Oura, WHOOP | Source of their data, only if you connect them | They send data to us; we send them nothing about you |
| Google | Sign in with Google, only if you use it | Sign-in identifier, name, email |
| Apple | Sign in with Apple, push notifications, in-app subscriptions, HealthKit on your device | Sign-in identifier, push token, subscription status |
| Sentry | Crash reports, only if you turn them on | Device type, OS and app version, crash details |
| Vercel | Hosting the daygo.ai website | Standard web server logs |

Each processes your data only to provide its service to Daygo.

## 5. Retention

- Account data: kept until you delete your account, then erased within 30 days.
- Garmin, Oura and WHOOP data: kept while connected; deleted when you disconnect or delete your account.
- Subscription records: kept for accounting, with the link to your account removed when you delete it.
- Notification history (used only to avoid sending too many): 7 days, without notification text.
- Crash logs: 90 days.
- App usage events: 12 months, then deleted.
- Rate-limiting counters: 2 days.

## 6. Your rights

You can:
- See and export everything we have on you, on your device and on our servers (in-app: Settings → Privacy → Export my data; or by emailing privacy@daygo.ai). If part of the export can't be read, the app tells you and asks you to try again, rather than giving you an incomplete file.
- Delete your account and all server-side data.
- Correct anything Daygo has learned about you (Settings → Memory), or ask us to correct other data.
- Disconnect Garmin, Oura or WHOOP, which deletes that data from Daygo.
- Withdraw consent for AI processing, health sync or lab values at any time in Settings → Privacy (see sections 2.2, 2.3b and 3a).
- Disable any class of data collection (Apple Health access, Garmin, push notifications, crash reporting).
- (EU/UK) Object to processing, request restriction, or lodge a complaint with your local supervisory authority.
- (CA/US) Know what we collect, request deletion, opt out of "selling" or "sharing" — we don't do either.

## 7. Children

Daygo is not directed at children under 13 (or 16 in the EU). We do not knowingly collect data from them. If we learn we have, we delete it.

## 8. Security

Data in transit uses TLS. Tokens are stored in the iOS Keychain. Server data is in Supabase with row-level security policies that scope every row by user. No security is perfect — if you suspect a breach, email security@daygo.ai.

## 9. Not medical advice

Daygo is a wellbeing tool, not a medical device. Its outputs are not diagnoses. Consult a qualified clinician for any health decision.

## 10. Changes

If we make a material change, we'll notify you in-app and update the date above. Continued use after the change means you accept it.

## 11. Contact

privacy@daygo.ai
