import Link from "next/link";
import Image from "next/image";

export function Nav() {
  return (
    <header className="pointer-events-none fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <div className="pointer-events-auto flex items-center gap-6 rounded-full border border-white/10 bg-black/60 px-4 py-2.5 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Daygo" width={28} height={28} className="rounded-full" />
          <span className="text-sm font-semibold tracking-tight">Daygo</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm sm:flex">
          <Link href="#features" className="text-white/60 transition hover:text-white">
            Features
          </Link>
          <Link href="#pricing" className="text-white/60 transition hover:text-white">
            Free
          </Link>
        </nav>
        <a
          href="https://apps.apple.com/us/app/daygo-ai/id6773255641"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-semibold text-[var(--color-on-accent)] transition hover:opacity-90"
        >
          Download
        </a>
      </div>
    </header>
  );
}
