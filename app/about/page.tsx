import type { Metadata } from "next";
import { COMPANY, IMAGES, WHY_US } from "@/lib/data";
import { QuoteButton } from "@/components/QuoteButton";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About Our Tin Manufacturing Plant in Chennai",
  description:
    "Sri Padmavathi Industries is a tin manufacturer in Manali, Chennai since 2009. Paint tin, oil tin, ghee tin, and biryani tin manufacturing with custom printing.",
  path: "/about",
  image: IMAGES.aboutHero,
});

export default function AboutPage() {
  return (
    <main>
      <section className="relative bg-primary py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-cover bg-center hero-media" style={{ backgroundImage: `url('${IMAGES.aboutHero}')` }} />
        </div>
        <div className="relative max-w-container-max mx-auto px-4 md:px-margin-desktop flex flex-col items-center text-center">
          <h1 className="font-display text-headline-lg-mobile md:text-display-lg text-on-primary mb-6 max-w-3xl text-balance">
            Pioneering Industrial Packaging Solutions Since {COMPANY.established}
          </h1>
          <p className="text-body-lg text-on-primary-container max-w-2xl">
            Sri Padmavathi Industries is a cornerstone of the manufacturing sector in Chennai, delivering precision-engineered tin containers for national markets.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16 max-w-container-max mx-auto px-4 md:px-margin-desktop">
        <div className="max-w-3xl">
          <div className="mb-4">
            <span className="font-mono text-label-mono text-primary uppercase tracking-widest">The Journey</span>
            <div className="structural-line mt-2" />
          </div>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg mb-8">Crafting Excellence in Chennai</h2>
          <div className="space-y-6 text-body-md text-on-surface-variant leading-relaxed">
            <p>
              Founded in 2009 in the industrial heart of Tamil Nadu, <strong>Sri Padmavathi Industries</strong> is a tin manufacturer and wholesaler of paint tins, oil tins, ghee tins, biryani tins, and food cans. We supply custom printed tin containers to brands across India.
            </p>
            <p>
              Under the visionary leadership of {COMPANY.md}, we have established ourselves as a trusted partner for diverse industries, ranging from food processing to luxury gifting. Our commitment to utilizing superior raw materials and state-of-the-art lithography ensures that every product leaving our facility is a testament to durability and design.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-industrial-gray py-10 md:py-16">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div className="text-center mb-12">
            <h2 className="font-display text-headline-lg mb-4">Enterprise Factsheet</h2>
            <p className="font-mono text-label-mono text-steel-blue">TECHNICAL SPECIFICATIONS &amp; CORPORATE DATA</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger">
            {[
              { icon: "factory", label: "Nature of Business", value: COMPANY.natureOfBusiness },
              { icon: "badge", label: "Legal Status", value: COMPANY.legalStatus },
              { icon: "groups", label: "Workforce", value: COMPANY.workforce },
              { icon: "payments", label: "Annual Turnover", value: COMPANY.turnover },
            ].map((card) => (
              <div key={card.label} className="bg-surface p-8 border border-metallic-silver hover:border-primary transition-all group">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform block">{card.icon}</span>
                <div className="font-mono text-caption text-steel-blue uppercase mb-1">{card.label}</div>
                <div className="font-display text-title-md text-on-surface">{card.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <dl className="bg-white border border-metallic-silver divide-y divide-metallic-silver">
              {[
                ["Additional Business", COMPANY.additionalBusiness.join(", ")],
                ["Company CEO", COMPANY.md],
                ["GST Partner", COMPANY.gstPartner],
                ["Established", String(COMPANY.established)],
                ["Employees", COMPANY.workforce],
                ["Registered Address", COMPANY.registeredAddress],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-1 sm:gap-4 p-4 md:px-6">
                  <dt className="font-mono text-caption uppercase text-steel-blue">{label}</dt>
                  <dd className="text-body-md text-on-background">{value}</dd>
                </div>
              ))}
            </dl>
            <dl className="bg-white border border-metallic-silver divide-y divide-metallic-silver">
              {[
                ["GSTIN", COMPANY.gst],
                ["GST Registration", COMPANY.gstRegistrationDate],
                ["Banker", COMPANY.banker],
                ["Factory Address", COMPANY.address],
                ["Payment Mode", COMPANY.paymentModes.join(", ")],
                ["Shipment Mode", COMPANY.shipmentMode],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-1 sm:gap-4 p-4 md:px-6">
                  <dt className="font-mono text-caption uppercase text-steel-blue">{label}</dt>
                  <dd className="text-body-md text-on-background font-mono sm:font-body break-words">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 max-w-container-max mx-auto px-4 md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-4 self-center">
            <div className="mb-4">
              <span className="font-mono text-label-mono text-primary uppercase tracking-widest">Infrastructure</span>
              <div className="structural-line mt-2" />
            </div>
            <h2 className="font-display text-headline-lg mb-6">Built for High Volume Production</h2>
            <p className="text-body-md text-on-surface-variant mb-8">
              Our Chennai-based facility is equipped with automated printing and shaping machinery, capable of meeting large-scale industrial demands while maintaining precision within microns.
            </p>
            <ul className="space-y-4">
              {["Climate-controlled storage zones", "Advanced lithography printing units", "24/7 Quality monitoring station"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="text-body-md">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 gap-4 min-h-[240px] lg:h-[500px]">
            <div className="relative overflow-hidden h-full">
              <div className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: `url('${IMAGES.warehouse}')` }} />
            </div>
            <div className="grid grid-rows-2 gap-4 h-full">
              <div className="relative overflow-hidden h-full">
                <div className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: `url('${IMAGES.machine}')` }} />
              </div>
              <div className="relative overflow-hidden h-full">
                <div className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: `url('${IMAGES.print}')` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-primary text-on-primary">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter stagger">
            {WHY_US.map((point, i) => (
              <div key={point} className="p-8 border-l border-on-primary-container/30">
                <div className="font-display text-headline-lg mb-4">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display text-title-md uppercase tracking-wider">{point}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-background border-y border-metallic-silver">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop text-center">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg mb-8 text-balance">Ready to secure your packaging supply?</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <QuoteButton className="bg-primary text-on-primary px-8 md:px-10 py-4 font-mono text-label-mono uppercase tracking-widest hover:bg-surface-tint transition-all min-h-12">
              Contact Supplier Now
            </QuoteButton>
            <QuoteButton
              prefill={{ product: "Catalogue", message: "Please send the latest product catalogue." }}
              className="border border-primary text-primary px-10 py-4 font-mono text-label-mono uppercase tracking-widest hover:bg-industrial-gray transition-all"
            >
              Download Catalogue
            </QuoteButton>
          </div>
        </div>
      </section>
    </main>
  );
}
