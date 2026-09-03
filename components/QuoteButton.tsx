"use client";

import { useQuote, type QuotePrefill } from "./QuoteProvider";

type Props = {
  children: React.ReactNode;
  className?: string;
  prefill?: QuotePrefill;
  type?: "button" | "submit";
};

export function QuoteButton({ children, className, prefill, type = "button" }: Props) {
  const { openQuote, openInquiryQuote, items } = useQuote();
  const hasSpecific =
    Boolean(prefill?.product || prefill?.productId || prefill?.message || prefill?.quantity);

  return (
    <button
      type={type}
      className={className}
      onClick={() => {
        if (hasSpecific) openQuote(prefill);
        else if (items.length) openInquiryQuote();
        else openQuote(prefill);
      }}
    >
      {children}
    </button>
  );
}
