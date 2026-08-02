import { Link } from "@/components/ui/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Mail, Phone, MapPin } from "lucide-react";
import { COMPANY, NAV_LINKS } from "@/lib/constants";
import { categories } from "@/data/categories";

const socialLinks = [
  { name: "LinkedIn", href: "#", label: "in" },
  { name: "Twitter", href: "#", label: "X" },
  { name: "Facebook", href: "#", label: "f" },
  { name: "Instagram", href: "#", label: "ig" },
  { name: "YouTube", href: "#", label: "yt" },
];

export function Footer() {
  return (
    <footer className="relative mt-0 pb-[var(--mobile-nav-offset)] text-primary-foreground md:mt-12 md:pb-0">
      {/* Desktop wave only — mobile merges cleanly without a hard line */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 hidden w-full -translate-y-[98%] overflow-hidden leading-[0] md:block">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[48px] w-full"
          style={{ fill: "var(--footer)" }}
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,55.05,16.22,83.1,22.87,143.21,37.12,204.11,48.56,265.34,53.86A496.31,496.31,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      <div className="relative bg-[var(--footer)] pt-2 md:pt-0">
        <div className="pointer-events-none absolute top-10 left-10 h-56 w-56 rounded-full bg-gold/25 blur-3xl" />
        <div className="pointer-events-none absolute right-10 bottom-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-10 molecular-bg" />

        <div className="relative z-10 text-[var(--footer-foreground)]">
          <div className="container-custom py-7 md:py-12">
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4 lg:gap-8">
              {/* Brand — full width on mobile */}
              <div className="col-span-2 lg:col-span-1">
                <div className="mb-4 inline-flex flex-col gap-2">
                  <div className="rounded-2xl border border-[var(--c-peach)]/35 bg-[var(--c-lime)]/25 px-3 py-2 shadow-sm backdrop-blur-sm transition hover:bg-[var(--c-lime)]/40">
                    <BrandLogo
                      className="h-12 w-44 sm:h-14 sm:w-52"
                      priority
                    />
                  </div>
                  <p className="pl-1 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--c-peach)]">
                    Healthcare Innovation
                  </p>
                </div>
                <p className="mb-5 max-w-md text-sm leading-relaxed text-[var(--footer-foreground)]/80">
                  {COMPANY.fullForm}. Advancing global healthcare through innovation, quality, and
                  compassion since 2004.
                </p>
                <div className="flex gap-2.5">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--c-peach)]/40 bg-[var(--c-lime)]/20 text-xs font-bold uppercase transition-all duration-300 hover:scale-110 hover:border-[var(--c-peach)] hover:bg-[var(--c-peach)]/30 hover:text-[var(--c-peach)]"
                      aria-label={social.name}
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links — left column beside categories on mobile */}
              <div>
                <h4 className="mb-3 text-sm font-bold tracking-wide text-gold sm:text-base">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  {NAV_LINKS.slice(0, 8).map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block text-xs text-[var(--footer-foreground)]/80 transition-all duration-300 hover:translate-x-1.5 hover:text-gold sm:text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/faq"
                      className="inline-block text-xs text-[var(--footer-foreground)]/80 transition-all duration-300 hover:translate-x-1.5 hover:text-gold sm:text-sm"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/certifications"
                      className="inline-block text-xs text-[var(--footer-foreground)]/80 transition-all duration-300 hover:translate-x-1.5 hover:text-gold sm:text-sm"
                    >
                      Certifications
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Product Categories — right of Quick Links on mobile */}
              <div>
                <h4 className="mb-3 text-sm font-bold tracking-wide text-gold sm:text-base">
                  Product Categories
                </h4>
                <ul className="space-y-2">
                  {categories.slice(0, 8).map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="inline-block text-xs text-[var(--footer-foreground)]/80 transition-all duration-300 hover:translate-x-1.5 hover:text-gold sm:text-sm"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact — full width under the two columns on mobile */}
              <div className="col-span-2 lg:col-span-1">
                <h4 className="mb-3 text-sm font-bold tracking-wide text-gold sm:text-base">
                  Contact Info
                </h4>
                <ul className="space-y-3 text-xs text-[var(--footer-foreground)]/80 sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>{COMPANY.address}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-gold" />
                    <span>{COMPANY.phone}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-gold" />
                    <span>{COMPANY.email}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <div className="container-custom flex flex-col items-center justify-between gap-3 py-4 text-xs text-[var(--footer-foreground)]/70 md:flex-row">
              <p>
                © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-4">
                <span>License: {COMPANY.licenseNumber}</span>
                <span>CIN: {COMPANY.cinNumber}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/privacy" className="transition-colors hover:text-gold">
                  Privacy
                </Link>
                <Link href="/terms" className="transition-colors hover:text-gold">
                  Terms & Conditions
                </Link>
                <Link href="/disclaimer" className="transition-colors hover:text-gold">
                  Disclaimer
                </Link>
                <a
                  href={import.meta.env.VITE_ADMIN_URL || "http://localhost:5174/admin/"}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-semibold text-gold transition hover:bg-gold hover:text-[#ffc5aa]"
                >
                  Open Admin Panel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
