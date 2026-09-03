"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type QuotePrefill = {
  product?: string;
  productId?: string;
  quantity?: string;
  message?: string;
};

export type InquiryItem = {
  id: string;
  name: string;
  image: string;
  price: string;
};

type QuoteContextValue = {
  openQuote: (prefill?: QuotePrefill) => void;
  openInquiryQuote: () => void;
  closeQuote: () => void;
  isOpen: boolean;
  prefill: QuotePrefill;
  items: InquiryItem[];
  addItem: (item: InquiryItem) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  hasItem: (id: string) => boolean;
};

const STORAGE = "spi-inquiry-v1";
const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<QuotePrefill>({});
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw) as InquiryItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter((item) => item?.id && item?.name));
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE, JSON.stringify(items));
  }, [items, ready]);

  const openQuote = useCallback((next?: QuotePrefill) => {
    setPrefill(next || {});
    setIsOpen(true);
  }, []);

  const closeQuote = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((item: InquiryItem) => {
    setItems((prev) => (prev.some((p) => p.id === item.id) ? prev : [...prev, item].slice(0, 12)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearItems = useCallback(() => setItems([]), []);

  const hasItem = useCallback((id: string) => items.some((item) => item.id === id), [items]);

  const openInquiryQuote = useCallback(() => {
    if (!items.length) {
      openQuote({});
      return;
    }
    openQuote({
      product: items.map((item) => item.name).join(", "),
      productId: items.map((item) => item.id).join(","),
      message:
        items.length > 1
          ? `Please quote the following:\n${items.map((item) => `• ${item.name} — ${item.price}`).join("\n")}`
          : undefined,
    });
  }, [items, openQuote]);

  const value = useMemo(
    () => ({
      openQuote,
      openInquiryQuote,
      closeQuote,
      isOpen,
      prefill,
      items,
      addItem,
      removeItem,
      clearItems,
      hasItem,
    }),
    [openQuote, openInquiryQuote, closeQuote, isOpen, prefill, items, addItem, removeItem, clearItems, hasItem],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
