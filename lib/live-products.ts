import { PRODUCTS, type Product } from "@/lib/data";
import { supabaseConfigured, getSupabasePublic } from "@/lib/supabase/public";

function mapRow(row: Record<string, unknown>): Product {
  const extra = Array.isArray(row.images) ? (row.images as unknown[]).map((x) => String(x || "").trim()).filter(Boolean) : [];
  const primary = String(row.image || "");
  const images = Array.from(new Set([primary, ...extra].filter(Boolean))).slice(0, 5);
  const specs = Array.isArray(row.specs)
    ? (row.specs as { label?: string; value?: string }[]).map((s) =>
        s.value ? `${(s.label || "Spec").trim()}: ${String(s.value).trim()}` : String(s),
      )
    : [];
  return {
    id: String(row.slug || row.id || ""),
    name: String(row.name),
    category: String(row.category),
    image: images[0] || "",
    images,
    specs,
    price: String(row.price || ""),
    bestSeller: Boolean(row.best_seller),
    description: String(row.description || ""),
  };
}

export async function getLiveProducts(): Promise<Product[]> {
  if (!supabaseConfigured()) return PRODUCTS;
  try {
    const { data, error } = await getSupabasePublic().from("products").select("*").order("name");
    if (error) {
      console.error("live products", error.message);
      return PRODUCTS;
    }
    if (!data?.length) return PRODUCTS;
    return data.map(mapRow);
  } catch (err) {
    console.error("live products", err);
    return PRODUCTS;
  }
}

export function matchLiveProduct(list: Product[], query?: string): Product | undefined {
  if (!query?.trim()) return undefined;
  const raw = query.trim();
  const q = raw.toLowerCase();
  return (
    list.find((p) => p.id === raw) ||
    list.find((p) => p.name.toLowerCase() === q) ||
    list.find((p) => p.category.toLowerCase() === q) ||
    list.find((p) => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()))
  );
}

export async function getLiveProduct(id: string): Promise<Product | undefined> {
  if (supabaseConfigured()) {
    try {
      const db = getSupabasePublic();
      const bySlug = await db.from("products").select("*").eq("slug", id).maybeSingle();
      if (!bySlug.error && bySlug.data) return mapRow(bySlug.data);
      const byId = await db.from("products").select("*").eq("id", id).maybeSingle();
      if (!byId.error && byId.data) return mapRow(byId.data);
    } catch {
      /* fall through */
    }
  }
  const list = await getLiveProducts();
  return matchLiveProduct(list, id) || matchLiveProduct(PRODUCTS, id);
}
