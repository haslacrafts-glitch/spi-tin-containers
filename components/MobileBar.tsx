"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { QuoteButton } from "./QuoteButton";
import { COMPANY } from "@/lib/data";
import { useQuote } from "./QuoteProvider";

export function MobileBar() {
  const pathname = usePathname();
  const { isOpen, items, openInquiryQuote } = useQuote();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  const itemClass = (active: boolean) =>
    `flex flex-col items-center justify-center gap-0.5 h-14 ${active ? "text-primary" : "text-steel-blue"}`;

  const item = (href: string, icon: string, label: string) => {
    const active = isActive(href);
    return (
      <Link href={href} className={itemClass(active)}>
        <span
          className="material-symbols-outlined text-[22px] leading-none"
          style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          {icon}
        </span>
        <span className={`text-[11px] leading-none ${active ? "font-semibold" : "font-medium"}`}>{label}</span>
      </Link>
    );
  };

  if (isOpen) return null;

  return (
    <nav
      className="mobile-tabbar md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-metallic-silver grid grid-cols-5 items-center px-1"
      style={{ paddingBottom: "max(6px, env(safe-area-inset-bottom))" }}
    >
      {item("/", "home", "Home")}
      {item("/products", "inventory_2", "Products")}
      <a href={`tel:${COMPANY.phoneTel}`} className={itemClass(false) + " text-primary"} aria-label={`Call ${COMPANY.phoneDisplay}`}>
        <span className="material-symbols-outlined text-[22px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
          call
        </span>
        <span className="text-[11px] font-semibold leading-none">Call</span>
      </a>
      {items.length ? (
        <button type="button" onClick={openInquiryQuote} className={itemClass(false)}>
          <span className="relative">
            <span className="material-symbols-outlined text-[22px] leading-none">edit_square</span>
            <span className="absolute -top-1 -right-2 min-w-4 h-4 px-0.5 bg-primary text-white font-mono text-[9px] leading-4 text-center rounded-full">
              {items.length}
            </span>
          </span>
          <span className="text-[11px] font-medium leading-none">Inquiry</span>
        </button>
      ) : (
        <QuoteButton className={itemClass(false)}>
          <span className="material-symbols-outlined text-[22px] leading-none">edit_square</span>
          <span className="text-[11px] font-medium leading-none">Inquiry</span>
        </QuoteButton>
      )}
      {item("/contact", "mail", "Contact")}
    </nav>
  );
}
