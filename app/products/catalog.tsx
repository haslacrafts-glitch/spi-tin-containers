"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LANES,
  SIZE_FILTERS,
  categoriesForLane,
  laneForCategory,
  productSizeId,
  productsInLane,
  searchProducts,
  compactCapacity,
  type LaneId,
  type SizeId,
} from "@/lib/catalog-meta";
import { COMPANY, PRODUCTS, categoryShort } from "@/lib/data";
import { DownloadCatalog } from "@/components/DownloadCatalog";
import { AddToInquiryButton } from "@/components/AddToInquiryButton";
import { QuoteButton } from "@/components/QuoteButton";
import { CatalogFilters } from "@/components/CatalogFilters";

const PAGE_SIZE = 9;

type LaneFilter = LaneId | "All";
type SizeFilter = SizeId | "All";

function catalogUrl(lane: LaneFilter, category: string | "All", size: SizeFilter, q: string, page: number) {
  const params = new URLSearchParams();
  if (lane !== "All") params.set("lane", lane);
  if (category !== "All") params.set("category", category);
  if (size !== "All") params.set("size", size);
  if (q.trim()) params.set("q", q.trim());
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export function ProductsCatalog() {
  const searchParams = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);
  const [lane, setLane] = useState<LaneFilter>("All");
  const [category, setCategory] = useState<string | "All">("All");
  const [size, setSize] = useState<SizeFilter>("All");
  const [query, setQuery] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const requestedCat = searchParams.get("category");
    const requestedLane = searchParams.get("lane");
    const requestedSize = searchParams.get("size");
    const requestedQ = searchParams.get("q") || "";
    const cat = requestedCat && PRODUCTS.some((p) => p.category === requestedCat) ? requestedCat : "All";
    const inferredLane = cat !== "All" ? laneForCategory(cat) : undefined;
    const nextLane: LaneFilter =
      requestedLane && LANES.some((l) => l.id === requestedLane)
        ? (requestedLane as LaneId)
        : inferredLane || "All";
    const nextSize: SizeFilter =
      requestedSize && SIZE_FILTERS.some((s) => s.id === requestedSize) ? (requestedSize as SizeId) : "All";
    const raw = Number(searchParams.get("page") || "1");
    setLane(nextLane);
    setCategory(cat);
    setSize(nextSize);
    setQuery(requestedQ);
    setQueryInput(requestedQ);
    setPage(Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1);
  }, [searchParams]);

  function goTo(
    next: { lane?: LaneFilter; category?: string | "All"; size?: SizeFilter; q?: string; page?: number },
    scroll = false,
  ) {
    const nextLane = next.lane ?? lane;
    let nextCategory = next.category ?? category;
    const nextSize = next.size ?? size;
    const nextQ = next.q ?? query;
    const nextPage = next.page ?? 1;
    if (next.lane && next.lane !== "All" && nextCategory !== "All") {
      const allowed = categoriesForLane(next.lane);
      if (!allowed.includes(nextCategory)) nextCategory = "All";
    }
    if (next.lane === "All" && next.category === undefined) {
      nextCategory = "All";
    }
    setLane(nextLane);
    setCategory(nextCategory);
    setSize(nextSize);
    setQuery(nextQ);
    setPage(nextPage);
    window.history.replaceState(null, "", catalogUrl(nextLane, nextCategory, nextSize, nextQ, nextPage));
    if (scroll) gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (queryInput.trim() === query.trim()) return;
      goTo({ q: queryInput, page: 1 });
    }, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryInput]);

  const lanePool = useMemo(() => productsInLane(lane), [lane]);
  const chipCategories = categoriesForLane(lane);

  const items = useMemo(() => {
    let list = lanePool;
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (size !== "All") list = list.filter((p) => productSizeId(p) === size);
    return searchProducts(query, list);
  }, [lanePool, category, size, query]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-6 md:py-10 pb-28">
      <div className="mb-6 md:mb-8 border-l-4 md:border-l-8 border-primary pl-4 md:pl-6">
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary uppercase tracking-tight">
          Product Catalog
        </h1>
        <p className="hidden sm:block text-body-md md:text-body-lg text-on-surface-variant max-w-2xl mt-2">
          Shop by job, size, or name. Paint tins, oil tins, ghee tins, biryani tins, and food cans from tin manufacturers in
          Chennai. {PRODUCTS.length} products.
        </p>
        <div className="mt-3">
          <DownloadCatalog className="w-full sm:w-auto" />
        </div>
      </div>

      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-steel-blue">search</span>
        <input
          type="search"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="Search 1 kg biryani, ghee, paint…"
          className="w-full min-h-12 border border-metallic-silver bg-white pl-11 pr-4 font-body text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          aria-label="Search products"
        />
      </div>

      <section className="mb-6">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-steel-blue">Shop by job</p>
            <h2 className="font-display text-title-md text-on-background">What are you packing?</h2>
          </div>
          {lane !== "All" ? (
            <button
              type="button"
              onClick={() => goTo({ lane: "All", category: "All", page: 1 })}
              className="font-mono text-[11px] uppercase tracking-widest text-primary hover:underline"
            >
              All products
            </button>
          ) : null}
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-gutter overflow-x-auto chip-scroll snap-x snap-mandatory md:overflow-visible pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          {LANES.map((item) => {
            const active = lane === item.id;
            const count = productsInLane(item.id).length;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo({ lane: active ? "All" : item.id, category: "All", page: 1 }, true)}
                className={`text-left group overflow-hidden border shrink-0 w-[min(78vw,18rem)] md:w-auto snap-center ${active ? "border-primary" : "border-metallic-silver hover:border-primary"}`}
              >
                <div className="relative aspect-[16/10] md:aspect-[16/9] bg-surface-container-low overflow-hidden">
                  <img src={item.image} alt="" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-3 md:p-4 bg-gradient-to-t from-on-background/80 to-transparent">
                    <p className="font-display text-white text-base md:text-lg leading-tight">{item.label}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-primary-fixed mt-1">
                      {count} products
                    </p>
                  </div>
                </div>
                <p className="hidden md:block px-4 py-3 text-sm text-on-surface-variant bg-white">{item.blurb}</p>
              </button>
            );
          })}
        </div>
      </section>

      <CatalogFilters
        size={size}
        category={category}
        categories={chipCategories}
        pool={lanePool}
        onSize={(next) => goTo({ size: next, page: 1 }, true)}
        onCategory={(next) => goTo({ category: next, page: 1 }, true)}
      />

      <div className="scroll-mt-24" ref={gridRef}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-steel-blue">
            {items.length
              ? `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, items.length)} of ${items.length}`
              : "No matching tins"}
          </p>
          {totalPages > 1 ? (
            <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
              Page {currentPage} of {totalPages}
            </p>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-metallic-silver p-10 text-center">
            <p className="font-display text-title-md text-on-background mb-2">Nothing in this filter</p>
            <p className="text-body-md text-on-surface-variant mb-6">Clear size or search, or browse another job.</p>
            <button
              type="button"
              onClick={() => {
                setQueryInput("");
                goTo({ lane: "All", category: "All", size: "All", q: "", page: 1 });
              }}
              className="bg-primary text-white px-6 py-3 font-mono text-xs uppercase tracking-widest"
            >
              Reset catalog
            </button>
          </div>
        ) : (
          <div key={`${lane}-${category}-${size}-${query}-${currentPage}`} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter stagger">
            {paged.map((product) => {
              const cap = compactCapacity(product);
              return (
                <div key={product.id} className="bg-white border border-metallic-silver flex flex-col hover-lift">
                  <Link href={`/products/${product.id}`} className="h-48 md:h-64 overflow-hidden relative group block bg-surface-container-low">
                    <img className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" src={product.image} alt={product.name} />
                    {product.bestSeller ? (
                      <span className="absolute top-4 right-4 bg-trust-gold text-white px-3 py-1 font-mono text-[10px] uppercase">
                        Best Seller
                      </span>
                    ) : null}
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-steel-blue mb-1">
                      {categoryShort(product.category)}
                      {cap ? ` · ${cap}` : ""}
                    </p>
                    <h3 className="font-display text-title-md text-primary mb-2">{product.name}</h3>
                    <p className="font-display text-xl text-on-background mb-3">{product.price}</p>
                    <div className="mt-auto pt-4 border-t border-industrial-gray">
                      <ul className="font-mono text-xs text-on-surface-variant space-y-1 mb-6">
                        {product.specs.slice(0, 3).map((s) => (
                          <li key={s}>• {s}</li>
                        ))}
                      </ul>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="border border-primary text-primary py-3 font-mono text-xs uppercase hover:bg-primary hover:text-white transition-all min-h-11 text-center inline-flex items-center justify-center"
                        >
                          View Details
                        </Link>
                        <AddToInquiryButton
                          item={{
                            id: product.id,
                            name: product.name,
                            image: product.image,
                            price: product.price,
                          }}
                          className="bg-primary text-white py-3 font-mono text-xs uppercase hover:opacity-90 min-h-11 inline-flex items-center justify-center gap-1.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3" aria-label="Catalog pages">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => goTo({ page: currentPage - 1 }, true)}
              className="min-h-12 px-5 border border-metallic-silver font-mono text-xs uppercase tracking-widest text-on-surface-variant disabled:opacity-40 disabled:pointer-events-none hover:border-primary hover:text-primary inline-flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
              Previous
            </button>
            <div className="hidden md:flex items-center justify-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => goTo({ page: n }, true)}
                  aria-current={n === currentPage ? "page" : undefined}
                  className={`min-h-11 min-w-11 font-mono text-xs ${n === currentPage ? "bg-primary text-white" : "border border-metallic-silver text-on-surface-variant hover:border-primary hover:text-primary"}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => goTo({ page: currentPage + 1 }, true)}
              className="min-h-12 px-5 bg-primary text-white font-mono text-xs uppercase tracking-widest disabled:opacity-40 disabled:pointer-events-none hover:bg-primary-container inline-flex items-center justify-center gap-2"
            >
              Next page
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </nav>
        ) : null}
      </div>

      <section className="bg-industrial-gray py-10 md:py-14 mt-8 overflow-hidden relative -mx-4 md:-mx-margin-desktop px-4 md:px-margin-desktop">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-full" style={{ backgroundImage: "radial-gradient(#9e1000 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-8 md:gap-12 relative z-10">
          <div>
            <h2 className="font-display text-headline-lg text-primary uppercase mb-6">Get a Customized Quotation</h2>
            <p className="text-body-lg text-steel-blue mb-8">
              Add the tins you need to an inquiry, or send a bulk requirement. Custom print from 500 pcs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase text-primary">Quality</p>
                  <p className="text-body-md font-semibold">Food-grade tinplate</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">precision_manufacturing</span>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase text-primary">Capacity</p>
                  <p className="text-body-md font-semibold">Bulk Manufacturing</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 border border-metallic-silver">
            <p className="text-body-md text-on-surface-variant mb-6">
              Tell us the tin size, quantity, and printing you need. We will call you back on {COMPANY.phoneDisplay}.
            </p>
            <QuoteButton className="w-full bg-primary text-white py-4 font-mono uppercase tracking-widest hover:opacity-90 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">send</span>
              Submit Requirement
            </QuoteButton>
          </div>
        </div>
      </section>
    </main>
  );
}
