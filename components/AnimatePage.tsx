"use client";

import { usePathname } from "next/navigation";
import { Suspense, useLayoutEffect } from "react";

function PageFallback() {
  return <div className="min-h-[70vh]" aria-hidden="true" />;
}

export function AnimatePage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}
