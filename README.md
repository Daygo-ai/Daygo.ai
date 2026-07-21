# Daygo — Web

Marketing site for the Daygo iOS app. Next.js 15 + Tailwind 4.

## Run locally

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000.

## Pages

- `/` — landing
- `/privacy` — renders `legal/privacy-policy.md`
- `/terms` — renders `legal/terms.md`
- `/support` — contact + FAQ

## Deploy

Push to GitHub, import to Vercel, point `daygo.ai` at the project. Done.

The `/privacy` and `/terms` routes resolve markdown at build time from
`../legal/`, so the docs need to be present in the repo when you build.
