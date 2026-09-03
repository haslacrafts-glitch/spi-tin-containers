import Link from "next/link";
import { COMPANY, MARKETPLACES, NAV } from "@/lib/data";
import { QuoteButton } from "./QuoteButton";

export function Footer() {
  return (
    <footer className="bg-industrial-gray border-t-4 border-primary pb-20 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter px-4 md:px-margin-desktop py-10 md:py-14 max-w-container-max mx-auto">
        <div className="md:col-span-4">
          <h3 className="font-display text-headline-lg font-black text-primary mb-6">{COMPANY.name}</h3>
          <p className="text-body-md text-on-surface-variant mb-8 leading-relaxed max-w-sm">
            Premium industrial tin packaging solutions since 2009. Manufacturer and wholesaler of high-grade containers for food, paints, and gifts.
          </p>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-mono text-label-mono font-bold text-on-background uppercase mb-6">Quick Links</h4>
          <nav className="flex flex-col gap-3">
            {NAV.filter((n) => n.href !== "/").map((item) => (
              <Link key={item.href} href={item.href} className="text-on-surface-variant hover:text-primary font-body text-body-md">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-mono text-label-mono font-bold text-on-background uppercase mb-6">Policies</h4>
          <nav className="flex flex-col gap-3">
            <Link href="/privacy" className="text-on-surface-variant hover:text-primary font-body text-body-md">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-on-surface-variant hover:text-primary font-body text-body-md">
              Terms of Use
            </Link>
          </nav>
        </div>
        <div className="md:col-span-4">
          <h4 className="font-mono text-label-mono font-bold text-on-background uppercase mb-6">Reach Us</h4>
          <div className="space-y-4 text-on-surface-variant">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <p className="text-body-md">
                {COMPANY.name}
                <br />
                <a href={COMPANY.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-primary">
                  {COMPANY.address}
                </a>
              </p>
            </div>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary">person</span>
              <p className="text-body-md">{COMPANY.md} (MD)</p>
            </div>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary">phone_iphone</span>
              <a href={`tel:${COMPANY.phoneTel}`} className="text-body-md font-bold text-primary">
                {COMPANY.phoneDisplay}
              </a>
            </div>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary">storefront</span>
              <div className="flex flex-col gap-1">
                {MARKETPLACES.map((site) => (
                  <a
                    key={site.label}
                    href={site.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-body-md hover:text-primary"
                  >
                    {site.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <QuoteButton className="bg-primary text-white px-4 py-3 font-mono text-label-mono font-bold uppercase w-full hover:bg-primary-container transition-colors min-h-12">
                Get Quote
              </QuoteButton>
              <a
                href={`mailto:${COMPANY.email}`}
                className="border border-primary text-primary px-4 py-3 font-mono text-label-mono font-bold uppercase w-full hover:bg-primary hover:text-white transition-colors text-center min-h-12 flex items-center justify-center"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-metallic-silver py-6 px-4 md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-caption text-steel-blue">© 2026 {COMPANY.name}. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {MARKETPLACES.map((site) => (
              <a
                key={site.label}
                href={site.href}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-caption text-steel-blue hover:text-primary uppercase tracking-widest"
              >
                {site.label}
              </a>
            ))}
            <p className="font-mono text-caption text-steel-blue">GSTIN {COMPANY.gst}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
