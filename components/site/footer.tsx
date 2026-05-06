import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-charcoal-950/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:gap-10 md:px-6 md:py-14">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/15 bg-rice-50/90 p-1">
              <Image src="/images/logo.png" alt="" fill className="object-contain" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">ONO Poké Bar</p>
              <p className="text-xs text-rice-300">Island energy, Toronto soul.</p>
            </div>
          </div>
          <p className="text-sm text-rice-300">
            Premium poké bowls near Liberty Village. Swap placeholder hero/menu photography with your professional shoot
            before launch.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-rice-100">Visit</p>
          <p className="text-sm text-rice-300">
            100 Western Battery Rd #2
            <br />
            Toronto, ON M6K 3S2
          </p>
          <p className="mt-3 text-sm text-rice-400">Hours: Mon–Sun · 11am–9pm (placeholder)</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-rice-100">Connect</p>
          <div className="flex flex-col gap-2 text-sm text-ocean-200">
            <Link className="hover:text-rice-50" href="/menu">
              Order online
            </Link>
            <a className="hover:text-rice-50" href="mailto:hello@onopokebar.com">
              hello@onopokebar.com
            </a>
            <p className="text-rice-500">Social links: add real URLs in admin settings.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-rice-500">
        © {new Date().getFullYear()} ONO Poké Bar. Crafted for demo — configure production Stripe keys & imagery.
      </div>
    </footer>
  );
}
