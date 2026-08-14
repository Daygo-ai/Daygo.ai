// Posts straight to Mailchimp's classic embedded-form endpoint. No
// custom backend, no API route — Mailchimp hosts the actual signup
// list. `target="_blank"` means the Mailchimp confirmation page opens
// in a new tab instead of navigating the visitor away from daygo.ai.
//
// The hidden `b_...` field is Mailchimp's honeypot: real visitors
// never see or fill it (it's positioned off-screen), so any submission
// with it non-empty is a bot and Mailchimp silently drops it. Required
// for spam protection — don't remove it.
//
// Styled for the DARK section it now lives in. It used to sit on the
// lime hero, where a translucent-white input read fine; on dark that
// same fill turned into a heavy grey slab. Here the input is a subtle
// outline that recedes, so the section reads as a quiet footnote under
// the download CTA rather than competing with it.
export function WaitlistForm() {
  return (
    <form
      action="https://noprobs.us9.list-manage.com/subscribe/post?u=955f36884dc77e7f36303b513&id=2cdd9f479e&f_id=005deae3f0"
      method="post"
      target="_blank"
      className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center"
    >
      <input
        type="email"
        name="EMAIL"
        required
        placeholder="you@email.com"
        aria-label="Email address"
        className="w-full flex-1 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/35 focus:bg-white/[0.07]"
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
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/35 hover:text-white"
      >
        Keep me posted
      </button>
    </form>
  );
}
