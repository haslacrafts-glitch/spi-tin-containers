"use client";

import { useQuote, type InquiryItem } from "./QuoteProvider";

type Props = {
  item: InquiryItem;
  className?: string;
};

export function AddToInquiryButton({ item, className = "" }: Props) {
  const { addItem, removeItem, hasItem } = useQuote();
  const added = hasItem(item.id);

  return (
    <button
      type="button"
      onClick={() => (added ? removeItem(item.id) : addItem(item))}
      aria-pressed={added}
      data-testid="add-to-inquiry"
      className={className}
    >
      <span className="material-symbols-outlined text-base">{added ? "check" : "add"}</span>
      {added ? "Added" : (
        <>
          <span className="sm:hidden">Add</span>
          <span className="hidden sm:inline">Add to inquiry</span>
        </>
      )}
    </button>
  );
}
