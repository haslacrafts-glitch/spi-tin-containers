import type { Metadata } from "next";
import { PHOTOS } from "@/lib/data";
import { QuoteButton } from "@/components/QuoteButton";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Tin Manufacturing Plant Photos — Chennai",
  description:
    "Factory photos from tin manufacturers in Chennai: printed paint tins, oil tins, biryani tins, and food-grade packaging from Sri Padmavathi Industries.",
  path: "/photos",
});

export default function PhotosPage() {
  return (
    <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-6 md:py-10 pb-28">
      <div className="mb-8 md:mb-12">
        <span className="font-mono text-primary uppercase tracking-widest">Plant gallery</span>
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg lg:text-display-lg text-on-background mt-2 text-balance">Photos from the Chennai facility</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mt-3">
          A look at our production floor, lithography line, warehouse, and finished tin packaging.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter stagger">
        {PHOTOS.map((photo) => (
          <figure key={photo.label} className="bg-white border border-metallic-silver overflow-hidden group">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <figcaption className="p-4 border-t border-metallic-silver flex items-center justify-between">
              <span className="font-mono text-caption uppercase text-primary">{photo.label}</span>
              <span className="material-symbols-outlined text-steel-blue text-sm">photo_camera</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-10 md:mt-12 bg-primary text-white p-8 md:p-10 text-center">
        <h2 className="font-display text-headline-lg mb-4">Want a factory tour or sample photos of a specific SKU?</h2>
        <QuoteButton
          prefill={{ message: "Please share additional plant / product photos." }}
          className="bg-white text-primary px-8 py-3 font-mono uppercase tracking-widest hover:bg-primary-fixed"
        >
          Request Photos
        </QuoteButton>
      </div>
    </main>
  );
}
