import type { Metadata } from "next";
import { COMPANY } from "@/lib/data";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-margin-desktop py-16 pb-24">
      <h1 className="font-display text-headline-lg mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-body-md text-on-surface-variant leading-relaxed">
        <p>
          {COMPANY.name} collects name, phone, email, and requirement details only to respond to quote requests. Enquiries are not sold to third parties.
        </p>
        <p>Call {COMPANY.phoneDisplay} if you want an enquiry record removed.</p>
      </div>
    </main>
  );
}
