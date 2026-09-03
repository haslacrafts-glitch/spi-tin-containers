import type { Metadata } from "next";
import { COMPANY } from "@/lib/data";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-margin-desktop py-16 pb-24">
      <h1 className="font-display text-headline-lg mb-6">Terms of Use</h1>
      <div className="space-y-4 text-body-md text-on-surface-variant leading-relaxed">
        <p>
          Product images, capacities, and lead times on this site are indicative. Final specifications, MOQ, and pricing are confirmed on quotation by {COMPANY.name}, Chennai.
        </p>
        <p>Quotes submitted through this website constitute a request for information, not a purchase order.</p>
      </div>
    </main>
  );
}
