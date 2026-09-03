import type { Metadata } from "next";
import { COMPANY, MARKETPLACES } from "@/lib/data";
import { ContactForm } from "@/components/ContactForm";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact Tin Manufacturers in Chennai",
  description:
    "Contact Sri Padmavathi Industries — tin manufacturers in Manali, Chennai. Quotes for paint tins, oil tins, ghee tins, and biryani tins.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="pt-6 md:pt-10 pb-28 md:pb-16">
      <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto mb-10">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-primary uppercase tracking-widest">Connect with us</span>
          <h1 className="font-display text-headline-lg-mobile md:text-headline-lg lg:text-display-lg text-on-background text-balance">Let&apos;s build a lasting partnership.</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Reach out for custom tin container solutions, technical specifications, or bulk order inquiries. Send the form once and our team will get back to you.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5 space-y-gutter">
            <div className="bg-industrial-gray border border-metallic-silver p-6 md:p-8">
              <h3 className="font-display text-title-md mb-6 text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">factory</span>
                Headquarters
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <div>
                    <p className="font-bold text-on-background">{COMPANY.name}</p>
                    <p className="text-on-surface-variant text-body-md">{COMPANY.address}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">person</span>
                  <div>
                    <p className="font-bold text-on-background">{COMPANY.md} (MD)</p>
                    <p className="text-on-surface-variant text-body-md">{COMPANY.mdTitle}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">call</span>
                  <div>
                    <a href={`tel:${COMPANY.phoneTel}`} className="font-bold text-on-background">
                      {COMPANY.phoneDisplay}
                    </a>
                    <p className="text-primary text-caption font-bold opacity-80">{COMPANY.responseRate} Call Response Rate</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <div>
                    <p className="font-bold text-on-background">Business Hours</p>
                    <p className="text-on-surface-variant text-body-md">{COMPANY.hours}</p>
                    <p className="text-on-surface-variant text-body-md">{COMPANY.sunday}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">storefront</span>
                  <div>
                    <p className="font-bold text-on-background">Find us online</p>
                    <div className="flex flex-col gap-1 mt-1">
                      {MARKETPLACES.map((site) => (
                        <a
                          key={site.label}
                          href={site.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary text-body-md font-bold hover:underline inline-flex items-center gap-1"
                        >
                          {site.label}
                          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">badge</span>
                  <div className="min-w-0">
                    <p className="font-bold text-on-background">GSTIN</p>
                    <p className="text-on-surface-variant text-body-md font-mono tracking-wide break-all">{COMPANY.gst}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-80 border border-metallic-silver overflow-hidden bg-surface-container-high">
              <iframe
                title={`${COMPANY.name} location on Google Maps`}
                src={COMPANY.mapsEmbed}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 p-3 border border-metallic-silver flex justify-between items-center gap-3">
                <span className="text-caption font-mono text-primary">CHINNASEKKADU, MANALI</span>
                <a href={COMPANY.mapsUrl} target="_blank" rel="noreferrer" className="text-primary flex items-center gap-1 text-caption font-bold hover:underline shrink-0">
                  OPEN MAPS <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-section-gap px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="bg-primary text-on-primary p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="font-display text-headline-lg mb-4">Trusted by 500+ Industrial Partners</h2>
              <p className="text-primary-fixed opacity-80 max-w-xl">
                Join a network of manufacturers who rely on Sri Padmavathi Industries for precision-engineered tin packaging solutions.
              </p>
            </div>
            <div className="flex md:justify-end gap-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-white">verified</span>
                </div>
                <span className="font-mono text-caption">Since {COMPANY.established}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-white">workspace_premium</span>
                </div>
                <span className="font-mono text-caption">Industry Leader</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
