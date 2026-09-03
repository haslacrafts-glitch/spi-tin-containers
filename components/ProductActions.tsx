"use client";

import { AddToInquiryButton } from "./AddToInquiryButton";
import { QuoteButton } from "./QuoteButton";
import Link from "next/link";
import type { InquiryItem } from "./QuoteProvider";

type Props = {
  item: InquiryItem;
};

export function ProductActions({ item }: Props) {
  return (
    <div className="mt-auto flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <AddToInquiryButton
          item={item}
          className="flex-1 bg-primary text-white py-4 font-mono text-xs uppercase tracking-widest hover:bg-primary-container min-h-12 inline-flex items-center justify-center gap-2"
        />
        <QuoteButton
          prefill={{ product: item.name, productId: item.id }}
          className="flex-1 border border-metallic-silver py-4 font-mono text-xs uppercase tracking-widest hover:border-primary hover:text-primary min-h-12"
        >
          Quote this tin
        </QuoteButton>
      </div>
      <Link
        href="/contact"
        className="font-mono text-xs uppercase tracking-widest text-steel-blue hover:text-primary text-center min-h-11 inline-flex items-center justify-center"
      >
        Contact Us
      </Link>
    </div>
  );
}
