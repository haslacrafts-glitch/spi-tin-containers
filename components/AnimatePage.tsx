"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function AnimatePage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("section, article, footer"));
    const els = Array.from(new Set(nodes));

    if (reduce) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of els) {
      el.classList.add("reveal");
      const box = el.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.92 && box.bottom > 32) {
        el.classList.add("is-visible");
      } else {
        io.observe(el);
      }
    }

    document.documentElement.classList.add("motion-on");
    return () => io.disconnect();
  }, [pathname]);

  return (
    <div key={pathname} ref={ref} className="page-enter">
      {children}
    </div>
  );
}
