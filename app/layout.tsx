import type { Metadata } from "next";
import { Hanken_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { QuoteModal } from "@/components/QuoteModal";
import { QuoteProvider } from "@/components/QuoteProvider";
import { InquiryTray } from "@/components/InquiryTray";
import { AnimatePage } from "@/components/AnimatePage";
import { JsonLd } from "@/components/JsonLd";
import { COMPANY } from "@/lib/data";
import { SEO_DESCRIPTION, SEO_KEYWORDS, SITE_URL } from "@/lib/seo";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["400", "600", "700", "900"],
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex",
  weight: ["400", "500"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["500"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.name} | Tin Manufacturers in Chennai — Paint, Oil & Food Tins`,
    template: `%s | ${COMPANY.name}`,
  },
  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: COMPANY.name }],
  creator: COMPANY.name,
  publisher: COMPANY.name,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: COMPANY.name,
    title: `${COMPANY.name} | Tin Manufacturers in Chennai`,
    description: SEO_DESCRIPTION,
    images: [{ url: "/images/tins/gift-tin-containers.jpg", alt: "Tin manufacturers in Chennai — Sri Padmavathi Industries" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} | Tin Manufacturers in Chennai`,
    description: SEO_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${hanken.variable} ${plex.variable} ${jetbrains.variable} bg-background text-on-background font-body antialiased overflow-x-hidden selection:bg-primary-fixed selection:text-on-background`}>
        <QuoteProvider>
          <JsonLd />
          <Header />
          <AnimatePage>
            {children}
            <Footer />
          </AnimatePage>
          <InquiryTray />
          <MobileBar />
          <QuoteModal />
        </QuoteProvider>
      </body>
    </html>
  );
}
