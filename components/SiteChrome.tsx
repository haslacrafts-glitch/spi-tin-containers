"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { QuoteModal } from "@/components/QuoteModal";
import { InquiryTray } from "@/components/InquiryTray";
import { AnimatePage } from "@/components/AnimatePage";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <AnimatePage>
        {children}
        <Footer />
      </AnimatePage>
      <InquiryTray />
      <MobileBar />
      <QuoteModal />
    </>
  );
}
