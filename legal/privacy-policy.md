# Daygo — Privacy Policy

_Last updated: 2026-07-21_
_Operator: Marijus Dovydaitis ("we", "our")_

This is a draft. Have an attorney qualified in your jurisdiction (and the jurisdictions of your largest user bases — at minimum US/EU/UK) review before publication. The structure below is App-Store-friendly and matches the data we actually collect today.

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
- Health data read from HealthKit stays on your device unless it is needed to generate an AI response, in which case the relevant subset is sent to Anthropic's Claude API (see section 3). We never use HealthKit data for advertising, and we never sell or share it with data brokers.

### 2.3 Authentication data
- If you sign in with Apple, we receive a user identifier and (if you grant it) your name and a private-relay email. We never receive your real Apple ID password.

### 2.4 Device and diagnostic data
- A vendor-scoped device identifier (`identifierForVendor`) used for rate limiting.
- Device type, OS version, and app version sent to crash-reporting (Sentry).
- A push notification token, if you grant notification permission.

### 2.5 What we don't collect
- No advertising identifiers. No third-party trackers. No analytics SDKs that build a behavioral profile of you. No location beyond your timezone.

## 3. How we use your data

- **Run the app.** Render today's verdict, history, charts, reminders.
- **Generate AI coaching.** We send the relevant subset of your data to Anthropic's Claude API. Anthropic processes it under their commercial terms and does not use it to train their models.
- **Send you push notifications.** Only when you've enabled them.
- **Diagnose crashes and bugs** via Sentry.

We do not sell your data. We do not share it with advertisers.

## 4. Where your data lives

- **On your device** by default (SwiftData, Keychain).
- **In our Supabase project** when you're signed in: profile, daily verdicts, journals, weekly intents. Storage is in the EU (AWS `eu-west-1`, Ireland).
- **In transit** to and from Anthropic's API for AI features. Anthropic stores prompt data per their commercial agreement and does not train on it.
- **Apple Health data** stays on your device. We read it locally and only transmit the specific values needed for an AI response; we do not bulk-upload your Health data to our servers.

## 5. Retention

- Account data: kept until you delete your account, then erased within 30 days.
- Crash logs: 90 days.
- API request/response logs (rate limiting): 30 days.

## 6. Your rights

You can:
- See and export everything we have on you (in-app: Settings → Export PDF; or by emailing privacy@daygo.ai).
- Delete your account and all server-side data.
- Disable any class of data collection (Apple Health access, push notifications, crash reporting) in Settings.
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
