import { CATEGORIES, PRODUCTS, specPairs, type Product } from "@/lib/data";

export const LANES = [
  {
    id: "paint",
    label: "Paint & industrial",
    blurb: "Paint tins, solvent cans, lids and bottoms.",
    image: "/images/tins/paint-coated.jpg",
    categories: [
      "Paint Tin Containers",
      "PVC Solvent Tins",
      "Canister Lid",
      "Container Lid",
      "Container Bottom",
    ],
  },
  {
    id: "food",
    label: "Food & oil",
    blurb: "Biryani tins, ghee tins, food cans, tea and protein.",
    image: "/images/tins/biryani-1kg.jpg",
    categories: [
      "Biryani Tin Containers",
      "Oil & Ghee Tin Containers",
      "Food Cans",
      "Tin Containers",
      "Tin Box",
      "Protein Powder Tin Can",
      "Tin Cans",
    ],
  },
  {
    id: "gift",
    label: "Gifting & print",
    blurb: "Custom printed gift, sweets, cookies and cosmetic tins.",
    image: "/images/tins/gift-tin-containers.jpg",
    categories: [
      "Gift Tins",
      "Customized Tin Containers",
      "Customized Cookies Tins",
      "Square Tin Boxes",
      "Kumkum Box",
      "Cosmetic Container",
      "Lip Balm Container",
      "Sweets Tin Box",
    ],
  },
] as const;

export type LaneId = (typeof LANES)[number]["id"];

export const SIZE_FILTERS = [
  { id: "100ml", label: "100 ml" },
  { id: "250g", label: "250 g" },
  { id: "500g", label: "500 g" },
  { id: "1kg", label: "1 kg" },
  { id: "5l", label: "5 L" },
] as const;

export type SizeId = (typeof SIZE_FILTERS)[number]["id"];

const MEASURE =
  /(\d+(?:\.\d+)?)\s*(millilitres?|milliliters?|ml|litres?|liters?|ltrs?|kgs?|kilograms?|grams?|gms?|gm|g|l)\b/gi;

type Unit = "ml" | "g" | "l" | "kg";

function normUnit(raw: string): Unit | null {
  const u = raw.toLowerCase();
  if (u.startsWith("ml") || u.startsWith("millil")) return "ml";
  if (u.startsWith("kg") || u.startsWith("kilo")) return "kg";
  if (u === "l" || u.startsWith("ltr") || u.startsWith("litre") || u.startsWith("liter")) return "l";
  if (u.startsWith("g")) return "g";
  return null;
}

function toMl(value: number, unit: Unit) {
  if (unit === "l" || unit === "kg") return value * 1000;
  return value;
}

function parseMeasures(text: string) {
  const out: { value: number; unit: Unit }[] = [];
  const re = new RegExp(MEASURE.source, MEASURE.flags);
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const unit = normUnit(m[2]);
    const value = Number(m[1]);
    if (!unit || !Number.isFinite(value)) continue;
    out.push({ value, unit });
  }
  return out;
}

export function capacityMl(product: Product): number | undefined {
  const capSpec = product.specs.find((s) => /^CAPACITY:/i.test(s));
  const sources = capSpec ? [capSpec, product.name] : [product.name, ...product.specs];
  for (const src of sources) {
    const found = parseMeasures(src);
    if (found[0]) return toMl(found[0].value, found[0].unit);
  }
  return undefined;
}

export function bucketForMl(ml: number): SizeId | null {
  if (ml <= 150) return "100ml";
  if (ml <= 350) return "250g";
  if (ml <= 800) return "500g";
  if (ml <= 1500) return "1kg";
  if (ml >= 1800) return "5l";
  return null;
}

export function productSizeId(product: Product): SizeId | null {
  const ml = capacityMl(product);
  return ml == null ? null : bucketForMl(ml);
}

export function capacityLabel(product: Product): string {
  const spec = specPairs(product).find((s) => /capacity/i.test(s.label));
  if (spec?.value) return spec.value;
  const nameMatch = product.name.match(/(\d+(?:\.\d+)?\s*(?:kg|g|gm|gms|grams|ml|l)\b)/i);
  return nameMatch?.[1] || "";
}

export function compactCapacity(product: Product): string {
  const label = capacityLabel(product);
  if (label) {
    return label
      .replace(/GRAMS?/i, "g")
      .replace(/GMS?/i, "g")
      .replace(/LITRES?/i, "L")
      .replace(/MILLILITRES?/i, "ml");
  }
  const ml = capacityMl(product);
  if (ml == null) return "";
  if (ml >= 1000) return `${ml / 1000} kg`;
  return `${ml} ml`;
}

export function isPrinted(product: Product) {
  return /printed|offset|custom|multicolour/i.test(`${product.name} ${product.specs.join(" ")}`);
}

export function productGrade(product: Product): "Food-grade" | "Industrial" {
  if (product.specs.some((s) => /FOOD GRADE/i.test(s))) return "Food-grade";
  const lane = laneForCategory(product.category);
  return lane === "paint" ? "Industrial" : "Food-grade";
}

export function productPrint(product: Product) {
  if (isPrinted(product)) return "Offset litho";
  if (/coated/i.test(product.name)) return "Coated / plain";
  return "Plain or printed";
}

export function productMoq(product: Product) {
  if (/kumkum|lip balm|cosmetic|lid|bottom/i.test(`${product.category} ${product.name}`)) {
    return "1,000 pcs";
  }
  return "500 pcs";
}

export function productLeadTime() {
  return "7–12 working days";
}

const HIGHLIGHT_ALIASES: Record<string, string[]> = {
  Capacity: ["capacity", "size"],
  MOQ: ["moq", "minimum order", "min order"],
  "Lead time": ["lead time", "leadtime"],
  Grade: ["grade"],
  Print: ["print"],
  "Print options": ["print options", "print option"],
};

function normLabel(label: string) {
  return label.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

export function specValue(product: Product, aliases: string[]) {
  const want = aliases.map(normLabel);
  const hit = specPairs(product).find((p) => want.includes(normLabel(p.label)));
  return hit?.value?.trim() || "";
}

export function highlightSpecs(product: Product) {
  const cap = specValue(product, HIGHLIGHT_ALIASES.Capacity) || compactCapacity(product);
  const moq = specValue(product, HIGHLIGHT_ALIASES.MOQ) || productMoq(product);
  const lead = specValue(product, HIGHLIGHT_ALIASES["Lead time"]) || productLeadTime();
  const grade = specValue(product, HIGHLIGHT_ALIASES.Grade) || `${productGrade(product)} tinplate`;
  const print = specValue(product, HIGHLIGHT_ALIASES.Print) || productPrint(product);
  const printOptions = specValue(product, HIGHLIGHT_ALIASES["Print options"]);
  return [
    cap ? { label: "Capacity", value: cap } : null,
    moq ? { label: "MOQ", value: /from /i.test(moq) ? moq : `From ${moq}` } : null,
    lead ? { label: "Lead time", value: lead } : null,
    grade ? { label: "Grade", value: grade } : null,
    print ? { label: "Print", value: print } : null,
    printOptions ? { label: "Print options", value: printOptions } : null,
  ].filter((row): row is { label: string; value: string } => Boolean(row));
}

export function remainingSpecs(product: Product) {
  const shown = new Set(highlightSpecs(product).map((row) => normLabel(row.label)));
  shown.add("size");
  shown.add("capacity");
  return specPairs(product).filter((p) => p.value && !shown.has(normLabel(p.label)));
}

export function laneForCategory(category: string): LaneId | undefined {
  return LANES.find((lane) => (lane.categories as readonly string[]).includes(category))?.id;
}

export function productsInLane(laneId: LaneId | "All") {
  if (laneId === "All") return PRODUCTS;
  const lane = LANES.find((item) => item.id === laneId);
  if (!lane) return PRODUCTS;
  return PRODUCTS.filter((p) => (lane.categories as readonly string[]).includes(p.category));
}

export function categoriesForLane(laneId: LaneId | "All") {
  if (laneId === "All") return CATEGORIES;
  const lane = LANES.find((item) => item.id === laneId);
  return lane ? [...lane.categories] : [...CATEGORIES];
}

export function searchProducts(query: string, list: Product[] = PRODUCTS) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((p) => {
    const hay = `${p.name} ${p.category} ${p.specs.join(" ")} ${p.description}`.toLowerCase();
    return hay.includes(q) || q.split(/\s+/).every((part) => hay.includes(part));
  });
}

export function relatedSizes(product: Product) {
  return PRODUCTS.filter((p) => p.category === product.category).sort((a, b) => {
    const am = capacityMl(a) ?? 99999;
    const bm = capacityMl(b) ?? 99999;
    return am - bm;
  });
}

export function findProductsByIds(ids: string[]) {
  return ids
    .map((id) => PRODUCTS.find((p) => p.id === id.trim()))
    .filter((p): p is Product => Boolean(p));
}
