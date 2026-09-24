"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { COMPANY, NAV } from "@/lib/data";
import { QuoteButton } from "./QuoteButton";
import { useQuote } from "./QuoteProvider";

export function Header() {
  const pathname = usePathname();
  const { isOpen } = useQuote();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, isOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.body.classList.add("menu-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="bg-surface/95 backdrop-blur-md sticky top-0 z-50 border-b border-metallic-silver">
      <div className="hidden lg:flex bg-primary text-white">
        <div className="max-w-container-max mx-auto w-full px-margin-desktop h-9 flex items-center justify-between gap-6 font-mono text-[11px] uppercase tracking-widest">
          <a href={`tel:${COMPANY.phoneTel}`} className="inline-flex items-center gap-2 hover:opacity-80">
            <span className="material-symbols-outlined text-sm">call</span>
            {COMPANY.phoneDisplay}
          </a>
          <p className="hidden xl:block opacity-90">{COMPANY.hours}</p>
          <p className="opacity-90">{COMPANY.city}</p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto h-14 lg:h-[4.25rem] px-4 md:px-margin-desktop flex items-center gap-3 lg:gap-6">
        <Link href="/" className="flex items-center gap-2 min-w-0 flex-1 lg:flex-none">
          <img
            src="/images/spi-logo.png?v=2"
            alt=""
            className="h-8 lg:h-12 w-auto shrink-0"
          />
          <span className="min-w-0">
            <span className="block font-display font-bold text-primary text-sm lg:text-base leading-tight truncate">
              <span className="sm:hidden">SPI Tins</span>
              <span className="hidden sm:inline">{COMPANY.name}</span>
            </span>
            <span className="hidden lg:block font-mono text-[10px] uppercase tracking-[0.16em] text-steel-blue">
              Tin manufacturers · Chennai
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-auto">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 font-body text-sm whitespace-nowrap rounded-sm transition-colors ${
                  active
                    ? "text-primary font-bold bg-primary-fixed"
                    : "text-on-surface-variant hover:text-primary hover:bg-industrial-gray"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto lg:ml-3 flex items-center gap-2 shrink-0">
          <QuoteButton className="hidden md:inline-flex items-center h-10 px-5 bg-primary text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-primary-container">
            Get Quote
          </QuoteButton>
          <button
            type="button"
            className="lg:hidden text-primary min-h-11 min-w-11 inline-flex items-center justify-center -mr-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Menu"}
            aria-expanded={menuOpen}
          >
            <span className="material-symbols-outlined text-[1.75rem]">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="lg:hidden">
          <button type="button" className="fixed inset-0 z-[55] bg-on-background/50" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          <nav className="fixed top-0 right-0 z-[60] h-[100dvh] w-[min(82%,20rem)] bg-white p-6 flex flex-col gap-1 shadow-xl overflow-y-auto">
            <div className="flex justify-between items-center border-b border-metallic-silver pb-4 mb-3">
              <span className="font-display text-title-md text-primary">Menu</span>
              <button type="button" className="text-steel-blue min-h-11 min-w-11" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block py-3 text-lg ${isActive(item.href) ? "text-primary font-bold" : "text-on-surface-variant"}`}
              >
                {item.label}
              </Link>
            ))}
            <a href={`tel:${COMPANY.phoneTel}`} className="mt-4 py-3 font-mono text-primary uppercase">
              Call {COMPANY.phoneDisplay}
            </a>
            <QuoteButton className="mt-2 bg-primary text-white px-4 py-3 font-mono text-label-mono font-bold uppercase" prefill={{}}>
              Get a Quote
            </QuoteButton>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
