"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useQuote } from "./QuoteProvider";

export function InquiryTray() {
  const { items, removeItem, clearItems, openInquiryQuote, isOpen } = useQuote();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || isOpen || items.length === 0) {
      document.body.classList.remove("inquiry-open");
      return;
    }
    document.body.classList.add("inquiry-open");
    return () => document.body.classList.remove("inquiry-open");
  }, [mounted, items.length, isOpen]);

  if (!mounted || isOpen || items.length === 0) return null;

  return createPortal(
    <div
      data-testid="inquiry-tray"
      className="fixed z-[45] inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] md:bottom-0 bg-on-background text-white border-t border-white/10"
    >
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-2.5 flex items-center gap-2 sm:gap-3">
        <p className="font-mono text-[11px] uppercase tracking-widest shrink-0">
          {items.length} {items.length === 1 ? "tin" : "tins"}
        </p>
        <ul className="hidden sm:flex items-center -space-x-2 min-w-0">
          {items.slice(0, 5).map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                title={`Remove ${item.name}`}
                className="block w-9 h-9 rounded-full overflow-hidden border border-white/30 bg-[#2a2622]"
              >
                <img src={item.image} alt="" className="w-full h-full object-contain p-0.5" />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={clearItems}
          className="font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-white shrink-0"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={openInquiryQuote}
          className="ml-auto bg-primary text-white min-h-11 px-4 sm:px-5 font-mono text-xs uppercase tracking-widest hover:bg-primary-container inline-flex items-center gap-2 shrink-0"
        >
          Quote
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
