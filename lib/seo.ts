import type { Metadata } from "next";
import { COMPANY } from "./data";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const SEO_KEYWORDS = [
  "tin manufacturers",
  "tin manufacturer in Chennai",
  "tin container manufacturer",
  "paint tin manufacturers",
  "paint tin manufacturer",
  "oil tin manufacturers",
  "oil tin manufacturer",
  "ghee tin manufacturer",
  "biryani tin manufacturer",
  "food tin manufacturers",
  "tin can manufacturer Chennai",
  "tin box manufacturer",
  "custom printed tin containers",
];

export const SEO_DESCRIPTION =
  "Tin manufacturers in Chennai since 2009. Sri Padmavathi Industries makes paint tins, oil tins, ghee tins, biryani tins, and food-grade tin containers. Manufacturer and wholesaler in Manali, Chennai.";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMeta({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl("/images/tins/gift-tin-containers.jpg");
  return {
    title,
    description,
    keywords: SEO_KEYWORDS,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: COMPANY.name,
      locale: "en_IN",
      type: "website",
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "Manufacturer"],
    name: COMPANY.name,
    legalName: COMPANY.name,
    url: SITE_URL,
    telephone: COMPANY.phoneTel,
    email: COMPANY.email,
    foundingDate: String(COMPANY.established),
    address: {
      "@type": "PostalAddress",
      streetAddress: "No.46, Kamarajar Salai, Chinnasekkadu",
      addressLocality: "Manali",
      addressRegion: "Tamil Nadu",
      postalCode: "600068",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 13.162386,
      longitude: 80.262629,
    },
    areaServed: "IN",
    knowsAbout: SEO_KEYWORDS,
    sameAs: [COMPANY.indiaMart, COMPANY.justdial, COMPANY.mapsUrl],
    description: SEO_DESCRIPTION,
  };
}
