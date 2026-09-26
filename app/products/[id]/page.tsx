import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPANY, PRODUCTS, categoryShort, type Product } from "@/lib/data";
import { getLiveProduct, getLiveProducts } from "@/lib/live-products";
import { compactCapacity, highlightSpecs, remainingSpecs } from "@/lib/catalog-meta";
import { ProductActions } from "@/components/ProductActions";
import { ProductGallery } from "@/components/ProductGallery";

type Params = { id: string };

export const dynamicParams = true;
export const revalidate = 0;
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = (await getLiveProduct(params.id)) || PRODUCTS.find((p) => p.id === params.id);
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

export default async function ProductPage({ params }: { params: Params }) {
  const product = (await getLiveProduct(params.id)) || PRODUCTS.find((p) => p.id === params.id);
  if (!product) notFound();

  const all = await getLiveProducts();
  const family = all
    .filter((p: Product) => p.category === product.category)
    .sort((a, b) => a.name.localeCompare(b.name));
  const highlights = highlightSpecs(product);
  const extras = remainingSpecs(product);
  const cap = compactCapacity(product);
  const sizeFamily = family.filter((item) => {
    const label = compactCapacity(item);
    return label && label.length <= 12;
  });

  return (
    <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-6 md:py-10 pb-24 md:pb-10">
      <Link href="/products" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-steel-blue hover:text-primary mb-6 min-h-11">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to catalog
      </Link>

      <article className="bg-white border border-metallic-silver grid grid-cols-1 lg:grid-cols-2">
        <ProductGallery name={product.name} images={product.images?.length ? product.images : [product.image]} />
        <div className="p-5 md:p-8 flex flex-col">
          <p className="font-mono text-caption text-primary uppercase tracking-widest mb-2">
            {categoryShort(product.category)}
            {cap ? ` · ${cap}` : ""}
          </p>
          <h1 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-background mb-2">{product.name}</h1>
          <p className="font-display text-2xl text-primary mb-3">{product.price}</p>
          {product.description ? <p className="text-body-md text-on-surface-variant mb-6">{product.description}</p> : null}

          {highlights.length ? (
            <dl className="border-t border-metallic-silver pt-5 mb-6 grid grid-cols-2 gap-x-6 gap-y-4">
              {highlights.map((row) => (
                <div key={row.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-steel-blue">{row.label}</dt>
                  <dd className="font-display text-on-background mt-1">{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {sizeFamily.length > 1 ? (
            <div className="mb-6">
              <p className="font-mono text-[11px] uppercase tracking-widest text-steel-blue mb-2">Sizes in this family</p>
              <div className="flex gap-2 overflow-x-auto chip-scroll">
                {sizeFamily.map((item) => {
                  const label = compactCapacity(item);
                  const current = item.id === product.id;
                  return (
                    <Link
                      key={item.id}
                      href={`/products/${item.id}`}
                      aria-current={current ? "page" : undefined}
                      className={`shrink-0 min-h-10 px-3 inline-flex items-center font-mono text-xs uppercase tracking-widest border ${
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

          {extras.length ? (
            <div className="border-t border-metallic-silver pt-5 mb-6">
              {extras.map((spec) => (
                <p key={spec.label} className="flex items-baseline justify-between gap-4 text-body-md border-b border-industrial-gray py-3 last:border-b-0">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-steel-blue">{spec.label}</span>
                  <span className="font-semibold text-on-background text-right">{spec.value}</span>
                </p>
              ))}
            </div>
          ) : null}

          <p className="text-sm text-on-surface-variant mb-6">Manufacturer in {COMPANY.city}.</p>

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
    </main>
  );
}
