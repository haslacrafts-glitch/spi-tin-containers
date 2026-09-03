import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPANY, PRODUCTS, specPairs, categoryShort } from "@/lib/data";
import {
  compactCapacity,
  productGrade,
  productLeadTime,
  productMoq,
  productPrint,
  relatedSizes,
} from "@/lib/catalog-meta";
import { ProductActions } from "@/components/ProductActions";

type Params = { id: string };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const product = PRODUCTS.find((p) => p.id === params.id);
  if (!product) return { title: "Product" };
  return {
    title: `${product.name} | ${product.category} Manufacturer Chennai`,
    description: `${product.name} from tin manufacturers in Chennai. ${product.description}`,
    keywords: [product.name, product.category, "tin manufacturers", "tin manufacturer in Chennai", "paint tin manufacturers", "oil tin manufacturers"],
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: `${product.name} | Sri Padmavathi Industries`,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default function ProductPage({ params }: { params: Params }) {
  const product = PRODUCTS.find((p) => p.id === params.id);
  if (!product) notFound();

  const family = relatedSizes(product);
  const cap = compactCapacity(product);
  const grade = productGrade(product);
  const print = productPrint(product);
  const moq = productMoq(product);
  const lead = productLeadTime();
  const pairs = specPairs(product);

  return (
    <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-6 md:py-10 pb-28">
      <Link href="/products" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-steel-blue hover:text-primary mb-6 min-h-11">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to catalog
      </Link>

      <article className="bg-white border border-metallic-silver grid grid-cols-1 lg:grid-cols-2">
        <div className="aspect-square lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-surface-container-low">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-6" />
        </div>
        <div className="p-6 md:p-10 flex flex-col">
          <p className="font-mono text-caption text-primary uppercase tracking-widest mb-2">
            {categoryShort(product.category)}
            {cap ? ` · ${cap}` : ""}
          </p>
          <h1 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-background mb-3">{product.name}</h1>
          <p className="font-display text-2xl md:text-headline-lg text-primary mb-4">{product.price}</p>
          <p className="text-body-md text-on-surface-variant mb-8">{product.description}</p>

          <dl className="border-t border-metallic-silver pt-6 mb-6 grid grid-cols-2 gap-x-4 gap-y-5">
            <Spec label="Capacity" value={cap || "Custom size"} />
            <Spec label="MOQ" value={`From ${moq}`} />
            <Spec label="Lead time" value={lead} />
            <Spec label="Grade" value={`${grade} tinplate`} />
            <Spec label="Print" value={print} />
            <Spec label="Print options" value="Plain, 1-colour, offset" />
          </dl>

          {family.length > 1 ? (
            <div className="mb-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-steel-blue mb-2">Sizes in this family</p>
              <div className="flex flex-wrap gap-2">
                {family.map((item) => {
                  const label = compactCapacity(item) || item.name;
                  const current = item.id === product.id;
                  return (
                    <Link
                      key={item.id}
                      href={`/products/${item.id}`}
                      aria-current={current ? "page" : undefined}
                      className={`min-h-11 px-3 inline-flex items-center font-mono text-xs uppercase tracking-widest border ${
                        current ? "bg-primary text-white border-primary" : "border-metallic-silver text-on-surface-variant hover:border-primary hover:text-primary"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="border-t border-metallic-silver pt-6 mb-8 space-y-3">
            {pairs.map((spec) => (
              <p key={spec.label} className="flex items-baseline justify-between gap-4 text-body-md border-b border-industrial-gray pb-3">
                <span className="text-steel-blue">{spec.label}</span>
                <span className="font-semibold text-on-background text-right">{spec.value}</span>
              </p>
            ))}
          </div>

          <p className="text-sm text-on-surface-variant mb-6">
            Manufacturer in {COMPANY.city}. Plain, single-colour, or offset print. Bulk orders from {moq}.
          </p>

          <ProductActions
            item={{
              id: product.id,
              name: product.name,
              image: product.image,
              price: product.price,
            }}
          />
        </div>
      </article>

      {family.filter((item) => item.id !== product.id).length ? (
        <section className="mt-12">
          <h2 className="font-display text-title-md mb-6">Related sizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {family
              .filter((item) => item.id !== product.id)
              .slice(0, 3)
              .map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} className="bg-white border border-metallic-silver hover-lift block">
                  <div className="h-48 overflow-hidden bg-surface-container-low">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-3" />
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-steel-blue">
                      {compactCapacity(item) || categoryShort(item.category)}
                    </p>
                    <h3 className="font-display text-on-background mt-1">{item.name}</h3>
                    <p className="font-mono text-sm text-primary mt-2">{item.price}</p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-steel-blue">{label}</dt>
      <dd className="font-display text-on-background mt-1">{value}</dd>
    </div>
  );
}
