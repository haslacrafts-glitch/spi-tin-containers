import Link from "next/link";
import { COMPANY, HSN_CODES, IMAGES, PRODUCTS, REVIEWS } from "@/lib/data";
import { QuoteButton } from "@/components/QuoteButton";

export default function HomePage() {
  const biryani = PRODUCTS.find((p) => p.id === "biryani-300g")!;
  const paint = PRODUCTS.find((p) => p.id === "paint-coated")!;
  const food = PRODUCTS.find((p) => p.id === "food-cans")!;

  return (
    <main>
      <section className="relative py-12 md:py-0 md:h-[62vh] md:min-h-[420px] flex items-center overflow-hidden bg-on-background">
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-cover bg-center hero-media" style={{ backgroundImage: `url('${IMAGES.hero}')` }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-on-background via-on-background/80 to-transparent" />
        <div className="relative w-full max-w-container-max mx-auto px-4 md:px-margin-desktop z-10">
          <div className="max-w-2xl">
            <span className="text-primary-fixed-dim font-mono uppercase tracking-[0.2em] mb-3 block">
              Established {COMPANY.established}
            </span>
            <h1 className="font-display text-[2rem] leading-tight md:text-display-lg text-white mb-4 md:mb-6 text-balance">
              Tin Manufacturers in Chennai Since {COMPANY.established}
            </h1>
            <p className="text-body-md md:text-body-lg text-surface-variant mb-6 md:mb-8 max-w-xl text-pretty">
              Paint tin manufacturers, oil tin manufacturers, and food-grade tin container makers from Manali, Chennai. Custom printed biryani tins, ghee tins, and industrial packaging at bulk scale.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link
                href="/products"
                className="bg-primary text-white px-8 py-4 font-mono font-bold uppercase tracking-widest hover:bg-primary-container transition-all text-center min-h-12 w-full sm:w-auto box-border"
              >
                Explore Products
              </Link>
              <QuoteButton className="border-2 border-white text-white px-8 py-4 font-mono font-bold uppercase tracking-widest hover:bg-white hover:text-on-background transition-all min-h-12 w-full sm:w-auto box-border">
                Get a Quote
              </QuoteButton>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 md:py-10 bg-industrial-gray border-b border-metallic-silver">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter stagger">
            {[
              { icon: "history", value: `${COMPANY.years}`, label: "Years Experience" },
              { icon: "verified", value: "TrustSEAL", label: "Verified Seller" },
              { icon: "speed", value: COMPANY.responseRate, label: "Response Rate" },
              { icon: "inventory_2", value: COMPANY.designs, label: "Product Designs" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center p-3 md:p-6 bg-white border border-metallic-silver">
                <span className="material-symbols-outlined text-primary text-3xl md:text-4xl mb-2">{stat.icon}</span>
                <span className="font-display text-2xl md:text-headline-lg text-on-background">{stat.value}</span>
                <span className="font-mono text-[10px] md:text-label-mono text-steel-blue uppercase leading-tight mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-6 pb-10 md:py-16 figma-dots">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-10 gap-3">
            <div>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-background mb-2">Our Core Products</h2>
              <div className="w-24 h-1 bg-primary" />
            </div>
            <Link href="/products" className="text-primary font-mono font-bold uppercase flex items-center gap-2 group">
              View Full Catalog
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter stagger md:items-stretch">
            <div className="md:col-span-8 group relative overflow-hidden bg-industrial-gray border border-metallic-silver aspect-[16/9] md:aspect-auto md:h-full min-h-[240px]">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={biryani.name} src={biryani.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8">
                <span className="text-primary-fixed font-mono uppercase mb-2 text-xs sm:text-sm">Food Packaging</span>
                <h3 className="font-display text-xl md:text-headline-lg text-white mb-2 md:mb-4">Biryani Tin Containers</h3>
                <p className="text-surface-variant max-w-lg mb-4 md:mb-6 hidden sm:block">{biryani.description}</p>
                <Link href={`/products/${biryani.id}`} className="bg-white text-on-background px-6 py-2 font-mono font-bold w-fit uppercase hover:bg-primary hover:text-white transition-colors">
                  View Specs
                </Link>
              </div>
            </div>
            <div className="md:col-span-4 group flex flex-col bg-white border border-metallic-silver h-full">
              <div className="flex-1 min-h-[180px] overflow-hidden bg-surface-container-low p-8">
                <img className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt={paint.name} src={paint.image} />
              </div>
              <div className="p-6 border-t border-metallic-silver">
                <h3 className="font-display text-title-md font-bold mb-2">Paint Coated Containers</h3>
                <p className="text-body-md text-on-surface-variant mb-4">{paint.description}</p>
                <Link href={`/products/${paint.id}`} className="text-primary font-mono text-sm font-bold uppercase hover:underline">
                  Explore Options
                </Link>
              </div>
            </div>
            <div className="md:col-span-4 group flex flex-col bg-white border border-metallic-silver h-full">
              <div className="flex-1 min-h-[180px] overflow-hidden bg-surface-container-low p-8">
                <img className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt={food.name} src={food.image} />
              </div>
              <div className="p-6 border-t border-metallic-silver">
                <h3 className="font-display text-title-md font-bold mb-2">Food Cans</h3>
                <p className="text-body-md text-on-surface-variant mb-4">{food.description}</p>
                <Link href={`/products/${food.id}`} className="text-primary font-mono text-sm font-bold uppercase hover:underline">
                  Explore Options
                </Link>
              </div>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-gutter h-full">
              <div className="bg-primary p-8 flex flex-col justify-between border border-primary-container text-white h-full">
                <div>
                  <h3 className="font-display text-title-md font-bold mb-4">Customized Branding</h3>
                  <p className="text-primary-fixed opacity-90 text-body-md">
                    We offer high-precision printing for your brand logos and designs directly on the tin surface.
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <span className="material-symbols-outlined text-4xl">print</span>
                  <span className="font-mono uppercase tracking-widest text-sm">Precision Offset</span>
                </div>
              </div>
              <div className="bg-industrial-gray p-8 flex flex-col justify-between border border-metallic-silver h-full">
                <div>
                  <h3 className="font-display text-title-md font-bold mb-4 text-on-background">Bulk Ordering</h3>
                  <p className="text-on-surface-variant text-body-md">
                    Optimized supply chain for large-scale industrial requirements with competitive B2B pricing.
                  </p>
                </div>
                <QuoteButton
                  prefill={{ product: "Bulk wholesale", message: "Need wholesale pricing for a bulk order." }}
                  className="border border-primary text-primary px-4 py-2 font-mono font-bold uppercase mt-8 hover:bg-primary hover:text-white transition-all w-fit"
                >
                  Get Wholesale Pricing
                </QuoteButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-white border-t border-metallic-silver">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-background mb-2">What we manufacture</h2>
          <div className="w-24 h-1 bg-primary mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              {
                title: "Paint tin manufacturers",
                copy: "Paint tins and enamel tin containers from 100 ml to 2 litre for industrial and retail packing.",
                href: "/products?lane=paint",
              },
              {
                title: "Oil tin manufacturers",
                copy: "Oil tins and ghee tin containers with food-grade lining for edible oil and vanaspati brands.",
                href: "/products?lane=food&category=Oil%20%26%20Ghee%20Tin%20Containers",
              },
              {
                title: "Food & biryani tin manufacturers",
                copy: "Biryani tins, food cans, and printed food-grade tin boxes for hospitality and FMCG packing.",
                href: "/products?lane=food",
              },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="border border-metallic-silver p-6 hover-lift bg-industrial-gray">
                <h3 className="font-display text-title-md text-primary mb-3">{item.title}</h3>
                <p className="text-body-md text-on-surface-variant">{item.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative">
            <div className="aspect-square w-full bg-cover bg-center border-4 border-white" style={{ backgroundImage: `url('${IMAGES.about}')` }} />
            <div className="absolute bottom-4 right-4 lg:-right-8 lg:-bottom-8 bg-primary text-white p-5 md:p-8">
              <p className="font-display text-headline-lg mb-0">{COMPANY.turnover}</p>
              <p className="font-mono uppercase tracking-widest opacity-80">Annual Turnover</p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-background mb-6">The Backbone of Your Packaging Supply Chain</h2>
            <p className="text-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Incorporated in {COMPANY.established} at Chennai, Tamil Nadu, <strong>Sri Padmavathi Industries</strong> is a tin manufacturer and wholesaler of paint tins, oil tins, ghee tins, biryani tins, food cans, and custom printed tin containers.
            </p>
            <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              With the help of our skilled workforce and well-developed facility, we offer quality bound products to our clients. Our commitment to structural integrity and aesthetic precision makes us a preferred partner for brands nationwide.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary">groups</span>
                <div>
                  <p className="font-display text-title-md font-bold text-on-background">Expert Workforce</p>
                  <p className="text-caption text-steel-blue">{COMPANY.workforce}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <div>
                  <p className="font-display text-title-md font-bold text-on-background">Chennai, TN</p>
                  <p className="text-caption text-steel-blue">Strategic Manufacturing Hub</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-white border-t border-metallic-silver">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-background uppercase tracking-widest">Technical Specifications</h2>
            <p className="font-mono text-primary mt-2">HSN Codes &amp; Classification</p>
          </div>
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white font-mono uppercase tracking-wider">
                  <th className="p-6 text-left border-r border-primary-container">HSN Code</th>
                  <th className="p-6 text-left">HSN Description</th>
                </tr>
              </thead>
              <tbody className="text-body-md text-on-surface-variant">
                {HSN_CODES.map((row, i) => (
                  <tr key={row.code} className={`border-b border-metallic-silver hover:bg-industrial-gray transition-colors ${i % 2 ? "bg-industrial-gray/50" : ""}`}>
                    <td className="p-4 md:p-6 font-mono font-bold border-r border-metallic-silver whitespace-nowrap">{row.code}</td>
                    <td className="p-4 md:p-6 min-w-[16rem]">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-industrial-gray">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-4 bg-white p-8 border border-metallic-silver">
              <h3 className="font-display text-headline-lg font-black text-on-background mb-2">
                {COMPANY.rating}
                <span className="text-body-lg font-normal text-on-surface-variant">/5</span>
              </h3>
              <div className="flex text-trust-gold mb-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined">star_half</span>
              </div>
              <p className="font-mono text-steel-blue mb-8">Based on {COMPANY.ratingsCount} Verified Ratings</p>
              <div className="space-y-3">
                {(
                  [
                    ["Quality", 100],
                    ["Delivery", 100],
                    ["Service", 90],
                  ] as const
                ).map(([label, pct], i) => (
                  <div key={label} className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.75rem] items-center gap-3">
                    <span className="font-mono text-caption md:text-sm text-on-background">{label}</span>
                    <div className="h-2 bg-surface-dim overflow-hidden min-w-0">
                      <div
                        className="rating-fill h-full bg-primary"
                        style={{ ["--bar" as string]: `${pct}%`, ["--delay" as string]: `${(0.08 + i * 0.14).toFixed(2)}s` }}
                      />
                    </div>
                    <span className="font-mono text-primary text-caption md:text-sm text-right tabular-nums">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8 space-y-gutter stagger">
              {REVIEWS.map((review) => (
                <div key={review.name} className="bg-white p-8 border border-metallic-silver flex gap-6">
                  <div className="w-12 h-12 bg-primary-fixed flex items-center justify-center text-primary font-bold shrink-0">
                    {review.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <div>
                        <h4 className="text-body-lg font-bold">{review.name}</h4>
                        <p className="text-caption text-steel-blue">{review.place}</p>
                      </div>
                      <span className="font-mono text-xs opacity-60 whitespace-nowrap">{review.date}</span>
                    </div>
                    <div className="flex text-trust-gold text-sm mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined"
                          style={{ fontSize: 16, fontVariationSettings: i < review.stars ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <p className="text-body-md text-on-surface-variant italic mb-4">&quot;{review.text}&quot;</p>
                    <span className="flex items-center gap-1 text-primary text-sm font-mono">
                      <span className="material-symbols-outlined text-sm">verified</span> Verified Purchase
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-on-background relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop text-center relative z-10">
          <h2 className="font-display text-headline-lg-mobile md:text-display-lg text-white mb-6 text-balance">Ready to upgrade your packaging?</h2>
          <p className="text-body-lg text-surface-variant max-w-2xl mx-auto mb-10">
            Connect with our specialists for a tailored quote and complimentary technical consultation on your tin packaging needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <QuoteButton className="bg-primary text-white px-10 py-4 font-mono font-bold uppercase tracking-[0.2em] hover:bg-primary-container transition-all">
              Send Inquiry
            </QuoteButton>
            <a
              href={`tel:${COMPANY.phoneTel}`}
              className="bg-white text-on-background px-10 py-4 font-mono font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
