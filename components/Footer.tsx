import Link from "next/link";
import Image from "next/image";
import { BONE, NAV_LINKS } from "@/lib/brand";

const CONTACTS = ["hello@daygo.ai", "support@daygo.ai", "privacy@daygo.ai"];

export function Footer() {
  return (
    <footer style={{ background: BONE }} className="px-6 py-12 text-black md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="" width={22} height={22} className="rounded-full" />
              <span className="text-lg font-black tracking-tight">DAYGO</span>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-widest text-black/50">
              A healthier tomorrow, today.
            </p>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-black/55">
              Built with care. Not a medical device.
            </p>
          </div>

          <FooterCol title="Product">
            {NAV_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Legal">
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
            <FooterLink href="/support">Support</FooterLink>
            <FooterLink href="/labs">Lab markers</FooterLink>
          </FooterCol>

          <FooterCol title="Reach us">
            {CONTACTS.map((email) => (
              <li key={email}>
                <a href={`mailto:${email}`} className="text-black/70 transition hover:text-black">
                  {email}
                </a>
              </li>
            ))}
          </FooterCol>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] tracking-wider text-black/45">
            © {new Date().getFullYear()} Daygo. All rights reserved.
          </span>
          <div className="flex items-center gap-5 text-black/65">
            <XMark className="h-4 w-4" />
            <InstagramMark className="h-4 w-4" />
            <LinkedInMark className="h-4 w-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-black/40">{title}</div>
      <ul className="mt-3 space-y-2 text-[13px]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-black/70 transition hover:text-black">
        {children}
      </Link>
    </li>
  );
}

function XMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3L5.9 22H2.8l7.5-8.6L2.4 2h6.6l4.5 6.7L18.9 2zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20z" />
    </svg>
  );
}

function InstagramMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-4V9z" />
    </svg>
  );
}
