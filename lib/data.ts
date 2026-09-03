import catalog from "./catalog.json";

export const COMPANY = {
  name: "Sri Padmavathi Industries",
  short: "SPI",
  md: "R. Sugumar",
  mdTitle: "Managing Director",
  phone: "9962841083",
  phoneDisplay: "+91 99628 41083",
  phoneTel: "+919962841083",
  email: "info@sripadmavathiindustries.com",
  city: "Chennai, Tamil Nadu",
  address: "No.46, Kamarajar Salai, Chinnasekkadu, Manali, Chennai - 600068",
  mapsUrl: "https://maps.app.goo.gl/L7vDRbP43v2iUFCA9",
  mapsEmbed:
    "https://maps.google.com/maps?q=Sri+Padmavathi+Industries+SPI+TINS+46+Kamaraj+Salai+Chinnasekkadu+Manali+Chennai&z=16&output=embed",
  hours: "Mon – Sat: 09:00 AM – 08:00 PM",
  sunday: "Sunday: Closed",
  gst: "33CZZPS5795L1ZZ",
  established: 2009,
  years: "17+",
  turnover: "₹4+ Cr",
  rating: "4.2",
  ratingsCount: 55,
  responseRate: "78%",
  designs: "500+",
  workforce: "20 to 40 Professionals",
  indiaMart: "https://www.indiamart.com/sripadmavathiindustries/",
  justdial:
    "https://www.justdial.com/jdmart/Chennai/Sri-Padmavathi-Industries-Manali/044PXX44-XX44-220702130534-H9R5_BZDET/catalogue/products#products-page",
};

export const MARKETPLACES = [
  { label: "IndiaMART", href: COMPANY.indiaMart },
  { label: "Justdial", href: COMPANY.justdial },
] as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Our Products" },
  { href: "/about", label: "About Us" },
  { href: "/photos", label: "Photos" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const CATEGORIES = catalog.categories as readonly string[];

const CATEGORY_SHORT: Record<string, string> = {
  "Biryani Tin Containers": "Biryani",
  "Paint Tin Containers": "Paint",
  "Tin Containers": "General",
  "Tin Box": "Tin Box",
  "Kumkum Box": "Kumkum",
  "Oil & Ghee Tin Containers": "Oil & Ghee",
  "Customized Tin Containers": "Custom",
  "Gift Tins": "Gift",
  "Food Cans": "Food Cans",
  "Canister Lid": "Canister Lid",
  "PVC Solvent Tins": "PVC Solvent",
  "Container Lid": "Lid",
  "Container Bottom": "Bottom",
  "Customized Cookies Tins": "Cookies",
  "Protein Powder Tin Can": "Protein",
  "Square Tin Boxes": "Square",
  "Tin Cans": "Tin Cans",
  "Cosmetic Container": "Cosmetic",
  "Lip Balm Container": "Lip Balm",
  "Sweets Tin Box": "Sweets",
};

export function categoryShort(cat: string) {
  return CATEGORY_SHORT[cat] || cat;
}

export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  specs: string[];
  price: string;
  bestSeller?: boolean;
  description: string;
};

export const PRODUCTS: Product[] = catalog.products as Product[];

export function findProduct(query?: string) {
  if (!query?.trim()) return undefined;
  const q = query.trim().toLowerCase();
  return (
    PRODUCTS.find((p) => p.id === query.trim()) ||
    PRODUCTS.find((p) => p.name.toLowerCase() === q) ||
    PRODUCTS.find((p) => p.category.toLowerCase() === q) ||
    PRODUCTS.find((p) => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()))
  );
}

export function specPairs(product: Product) {
  return product.specs.map((spec) => {
    const [label, ...rest] = spec.split(":");
    return {
      label: (label || "Spec").trim().replace(/\b\w/g, (c) => c.toUpperCase()),
      value: rest.join(":").trim() || spec,
    };
  });
}

export const HSN_CODES = [
  { code: "73102190", description: "Cans which are to be closed by soldering or crimping — other" },
  { code: "73102990", description: "Other tins, cans, boxes of iron or steel, of a capacity < 50 L" },
];

export const REVIEWS = [
  {
    initial: "N",
    name: "Navaneetha Krishnan",
    place: "Karaikal, Pondicherry",
    date: "01-July-24",
    stars: 4,
    text: "The 500 Grams Printed Biryani Tin Containers are exactly as specified. Exceptional quality and very prompt response from the team.",
  },
  {
    initial: "G",
    name: "Gayathri",
    place: "Chennai, Tamil Nadu",
    date: "11-June-24",
    stars: 5,
    text: "Found them through IndiaMART. Very professional in handling bulk orders for our printing facility.",
  },
];

export const PHOTOS = [
  { src: "/images/tins/gift-tin-containers.jpg", alt: "Printed decorative gift tin containers", label: "Gift Tins" },
  { src: "/images/tins/biryani-1kg.jpg", alt: "1 kg printed biryani tin container", label: "Biryani Tins" },
  { src: "/images/tins/air-tight-printed-tin-container.jpg", alt: "Air tight printed cylindrical tin containers", label: "Printed Range" },
  { src: "/images/tins/paint-coated.jpg", alt: "Industrial paint coated tin container", label: "Paint Tins" },
  { src: "/images/tins/kumkum-20g.jpg", alt: "20gm kumkum tin containers", label: "Kumkum Boxes" },
  { src: "/images/tins/ghee-oil.jpg", alt: "Food-grade printed ghee tin container", label: "Ghee Packaging" },
  { src: "/images/tins/coffee-tea-tin-container.jpg", alt: "Coffee and tea storage tin containers", label: "Tea & Coffee Tins" },
  { src: "/images/tins/chocolate-tin-box.jpg", alt: "Custom printed chocolate tin box", label: "Confectionery Tins" },
  { src: "/images/tins/food-cans.jpg", alt: "Food-grade tin food cans", label: "Food Cans" },
  { src: "/images/tins/customized-cookies-tins.jpg", alt: "Custom printed cookies tins", label: "Cookies Tins" },
  { src: "/images/tins/sweets-tin-box.jpg", alt: "Sweets tin packaging box", label: "Sweets Boxes" },
  { src: "/images/tins/cake-custom.jpg", alt: "Customized cake tin container", label: "Cake Tins" },
];

export const IMAGES = {
  hero: "/images/tins/gift-tin-containers.jpg",
  about: "/images/tins/air-tight-printed-tin-container.jpg",
  aboutHero: "/images/tins/biryani-1kg.jpg",
  warehouse: "/images/tins/1kg-round-tin-box.jpg",
  machine: "/images/tins/2l-paint-tin-container.jpg",
  print: "/images/tins/cake-custom.jpg",
};
