import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[var(--color-bg)]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Daygo" width={28} height={28} className="rounded-full" />
              <span className="text-base font-semibold">Daygo</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Built with care. Not a medical device.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Product
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/#features" className="text-white/75 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-white/75 hover:text-white">
                  Free
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-white/75 hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Legal
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-white/75 hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/75 hover:text-white">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Reach us
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="mailto:hello@daygo.ai"
                  className="text-white/75 hover:text-white"
                >
                  hello@daygo.ai
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@daygo.ai"
                  className="text-white/75 hover:text-white"
                >
                  support@daygo.ai
                </a>
              </li>
              <li>
                <a
                  href="mailto:privacy@daygo.ai"
                  className="text-white/75 hover:text-white"
                >
                  privacy@daygo.ai
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/[0.06] pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Daygo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
