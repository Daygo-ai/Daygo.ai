// Posts straight to Mailchimp's classic embedded-form endpoint. No
// custom backend, no API route — Mailchimp hosts the actual signup
// list. `target="_blank"` means the Mailchimp confirmation page opens
// in a new tab instead of navigating the visitor away from daygo.ai.
//
// The hidden `b_...` field is Mailchimp's honeypot: real visitors
// never see or fill it (it's positioned off-screen), so any submission
// with it non-empty is a bot and Mailchimp silently drops it. Required
// for spam protection — don't remove it.
export function WaitlistForm({
  ink,
  lime,
}: {
  ink: string;
  lime: string;
}) {
  return (
    <form
      action="https://noprobs.us9.list-manage.com/subscribe/post?u=955f36884dc77e7f36303b513&id=2cdd9f479e&f_id=005deae3f0"
      method="post"
      target="_blank"
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input
        type="email"
        name="EMAIL"
        required
        placeholder="you@email.com"
        aria-label="Email address"
        className="w-full rounded-full border px-5 py-3 text-sm outline-none transition sm:max-w-[240px]"
        style={{
          background: "#ffffff88",
          borderColor: `${ink}33`,
          color: ink,
        }}
      />
      <div aria-hidden="true" style={{ position: "absolute", left: "-5000px" }}>
        <input
          type="text"
          name="b_955f36884dc77e7f36303b513_2cdd9f479e"
          tabIndex={-1}
          defaultValue=""
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition hover:opacity-90"
        style={{ background: ink, color: lime }}
      >
        Keep me posted
        <span aria-hidden>→</span>
      </button>
    </form>
  );
}
