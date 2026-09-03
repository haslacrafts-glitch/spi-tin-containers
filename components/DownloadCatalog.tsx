"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CATEGORIES, PRODUCTS } from "@/lib/data";

type Props = {
  className?: string;
  compact?: boolean;
};

export function DownloadCatalog({ className = "", compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  async function download(label: string, items = PRODUCTS) {
    setError("");
    setBusy(label);
    try {
      const { downloadCatalogPdf } = await import("@/lib/catalog-pdf");
      await downloadCatalogPdf(items, label);
      setOpen(false);
    } catch {
      setError("Could not create the PDF. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  const popup =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <button type="button" className="absolute inset-0 bg-on-background/60" aria-label="Close catalog menu" onClick={() => setOpen(false)} />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="choose-catalog-title"
              className="relative z-10 w-full max-w-md bg-white border border-metallic-silver flex flex-col max-h-[min(80dvh,32rem)]"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-metallic-silver shrink-0">
                <div>
                  <p id="choose-catalog-title" className="font-mono text-[10px] uppercase tracking-widest text-steel-blue">
                    Choose catalog
                  </p>
                  <p className="font-display text-title-md text-on-background">Download a PDF</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="min-h-11 min-w-11 text-steel-blue" aria-label="Close">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain flex-1">
                <button
                  type="button"
                  disabled={Boolean(busy)}
                  className="w-full text-left px-4 py-3.5 text-sm min-h-12 hover:bg-industrial-gray border-b border-industrial-gray disabled:opacity-60"
                  onClick={() => download("All Products", PRODUCTS)}
                >
                  All products ({PRODUCTS.length})
                </button>
                {CATEGORIES.map((c) => {
                  const items = PRODUCTS.filter((p) => p.category === c);
                  return (
                    <button
                      key={c}
                      type="button"
                      disabled={Boolean(busy)}
                      className="w-full text-left px-4 py-3.5 text-sm min-h-12 hover:bg-industrial-gray border-b border-industrial-gray last:border-b-0 disabled:opacity-60"
                      onClick={() => download(c, items)}
                    >
                      {c} ({items.length})
                    </button>
                  );
                })}
              </div>
              {busy ? (
                <p className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-primary border-t border-metallic-silver shrink-0">
                  Preparing {busy}…
                </p>
              ) : null}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={Boolean(busy)}
        className={
          compact
            ? "inline-flex items-center gap-2 min-h-11 px-3 font-mono text-xs uppercase tracking-widest text-primary border border-primary hover:bg-primary hover:text-white disabled:opacity-60"
            : "inline-flex items-center justify-center gap-2 min-h-11 px-4 bg-primary text-white font-mono text-xs uppercase tracking-widest hover:bg-primary-container disabled:opacity-60 w-full sm:w-auto"
        }
      >
        <span className="material-symbols-outlined text-base">{busy ? "progress_activity" : "picture_as_pdf"}</span>
        {busy ? "Preparing PDF..." : "Download Catalog"}
      </button>
      {popup}
      {error ? <p className="text-caption text-error mt-2">{error}</p> : null}
    </div>
  );
}
