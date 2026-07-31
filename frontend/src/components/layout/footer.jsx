import { Link } from "@/components/ui/link";
import { Image } from "@/components/ui/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLocation } from "react-router-dom";
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
  const { pathname } = useLocation();

  return (
    <footer className="bg-primary text-primary-foreground relative mt-24">
      {/* Wave effect */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] -translate-y-[98%] pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px]"
          style={{ fill: "var(--primary)" }}
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,55.05,16.22,83.1,22.87,143.21,37.12,204.11,48.56,265.34,53.86A496.31,496.31,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      {/* Decorative Ambient Glow Spheres */}
      <div className="absolute top-12 left-12 w-64 h-64 bg-emerald/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-10 molecular-bg pointer-events-none" />

      <div className="relative z-10">
        <div className="container-custom py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="mb-6">
                <div className="relative h-16 w-72 flex items-center justify-start overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="HIMU Pharmacy Logo"
                    fill
                    className="object-contain brightness-0 invert scale-[4.2]"
                  />
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {COMPANY.fullForm}. Advancing global healthcare through innovation, quality, and
                compassion since 2004.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-gold hover:text-gold hover:scale-110 transition-all duration-300 text-sm font-bold uppercase"
                    aria-label={social.name}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gold tracking-wide text-base">Quick Links</h4>
              <ul className="space-y-2.5">
                {NAV_LINKS.slice(0, 8).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-gold hover:translate-x-1.5 transition-all duration-300 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-white/70 hover:text-gold hover:translate-x-1.5 transition-all duration-300 inline-block"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/certifications"
                    className="text-sm text-white/70 hover:text-gold hover:translate-x-1.5 transition-all duration-300 inline-block"
                  >
                    Certifications
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gold tracking-wide text-base">
                Product Categories
              </h4>
              <ul className="space-y-2.5">
                {categories.slice(0, 8).map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="text-sm text-white/70 hover:text-gold hover:translate-x-1.5 transition-all duration-300 inline-block"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gold tracking-wide text-base">Contact Info</h4>
              <ul className="space-y-3.5 text-sm text-white/70">
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
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

        <div className="border-t border-white/10">
          <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p>
              © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              <span>License: {COMPANY.licenseNumber}</span>
              <span>CIN: {COMPANY.cinNumber}</span>
            </div>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-gold transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gold transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/disclaimer" className="hover:text-gold transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
