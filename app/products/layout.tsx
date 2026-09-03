import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Tin Container Manufacturers in Chennai — Paint, Oil & Food Tins",
  description:
    "Browse paint tins, oil tins, ghee tins, biryani tins, and food cans from tin manufacturers in Chennai. Custom printing and bulk supply from Sri Padmavathi Industries.",
  path: "/products",
});

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
