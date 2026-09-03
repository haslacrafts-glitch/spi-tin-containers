import { Suspense } from "react";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { ProductsCatalog } from "./catalog";

export const metadata: Metadata = pageMeta({
  title: "Tin Container Manufacturers — Paint, Oil & Food Tins",
  description:
    "Browse paint tins, oil tins, ghee tins, biryani tins, and food cans from tin manufacturers in Chennai. Download the product catalog or request a quote.",
  path: "/products",
});

function CatalogFallback() {
  return (
    <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-6 md:py-10 pb-28">
      <div className="mb-8 md:mb-12 border-l-8 border-primary pl-4 md:pl-6">
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary uppercase tracking-tight">
          Tin Container Manufacturers — Catalog
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mt-2">Loading products…</p>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <ProductsCatalog />
    </Suspense>
  );
}
