"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SIZE_FILTERS, productSizeId, type SizeId } from "@/lib/catalog-meta";
import { PRODUCTS, categoryShort } from "@/lib/data";

type SizeFilter = SizeId | "All";

type Props = {
  size: SizeFilter;
  category: string | "All";
  categories: readonly string[];
  pool: typeof PRODUCTS;
  onSize: (size: SizeFilter) => void;
  onCategory: (category: string | "All") => void;
};

function countIn(cat: string, pool: typeof PRODUCTS) {
  return pool.filter((p) => p.category === cat).length;
}

export function CatalogFilters({ size, category, categories, pool, onSize, onCategory }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sizes = SIZE_FILTERS.filter((item) => pool.some((p) => productSizeId(p) === item.id));
  const categoryLabel = category === "All" ? "All categories" : categoryShort(category);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function pick(next: string | "All") {
    onCategory(next);
    setOpen(false);
  }

  const popup =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <button type="button" className="absolute inset-0 bg-on-background/60" aria-label="Close categories" onClick={() => setOpen(false)} />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="choose-category-title"
              className="relative z-10 w-full max-w-md bg-white border border-metallic-silver flex flex-col max-h-[min(80dvh,32rem)]"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-metallic-silver shrink-0">
                <div>
                  <p id="choose-category-title" className="font-mono text-[10px] uppercase tracking-widest text-steel-blue">
                    Category
                  </p>
                  <p className="font-display text-title-md text-on-background">Choose catalog</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="min-h-11 min-w-11 text-steel-blue" aria-label="Close">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain flex-1">
                <button
                  type="button"
                  onClick={() => pick("All")}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-left min-h-12 border-b border-industrial-gray ${
                    category === "All" ? "bg-primary-fixed text-primary font-semibold" : "text-on-surface-variant hover:bg-industrial-gray"
                  }`}
                >
                  All products
                  <span className="font-mono text-[11px] text-steel-blue">{pool.length}</span>
                </button>
                {categories
                  .filter((c) => countIn(c, pool) > 0)
                  .map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => pick(c)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left min-h-12 border-b border-industrial-gray last:border-b-0 ${
                        category === c ? "bg-primary-fixed text-primary font-semibold" : "text-on-surface-variant hover:bg-industrial-gray"
                      }`}
                    >
                      <span>{c}</span>
                      <span className="font-mono text-[11px] text-steel-blue shrink-0">{countIn(c, pool)}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-end gap-3">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[11px] uppercase tracking-widest text-steel-blue mb-2">Size</p>
        <div className="flex gap-2 overflow-x-auto chip-scroll pb-1">
          <Chip active={size === "All"} onClick={() => onSize("All")}>
            All sizes
          </Chip>
          {sizes.map((item) => (
            <Chip key={item.id} active={size === item.id} onClick={() => onSize(item.id)}>
              {item.label}
            </Chip>
          ))}
        </div>
      </div>
      <div className="w-full sm:w-72 shrink-0">
        <p className="font-mono text-[11px] uppercase tracking-widest text-steel-blue mb-2">Category</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full min-h-11 px-3.5 bg-white border border-metallic-silver flex items-center justify-between gap-2 text-left hover:border-primary"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant truncate">{categoryLabel}</span>
          <span className="material-symbols-outlined text-steel-blue text-lg shrink-0">unfold_more</span>
        </button>
      </div>
      {popup}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 min-h-11 px-3.5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest border ${
        active ? "bg-primary text-white border-primary" : "bg-white border-metallic-silver text-on-surface-variant hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
