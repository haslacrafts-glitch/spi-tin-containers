import { NextResponse } from "next/server";
import { PRODUCTS, CATEGORIES, type Product } from "@/lib/data";
import { getSupabasePublic, supabaseConfigured } from "@/lib/supabase/public";
import { recordKeepalive } from "@/lib/keepalive";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function mapRow(row: Record<string, unknown>): Product {
  const extra = Array.isArray(row.images) ? (row.images as unknown[]).map((x) => String(x || "").trim()).filter(Boolean) : [];
  const primary = String(row.image || "");
  const images = Array.from(new Set([primary, ...extra].filter(Boolean))).slice(0, 5);
  const specs = Array.isArray(row.specs)
    ? (row.specs as { label?: string; value?: string }[]).map((s) =>
        s.value ? `${s.label || "Spec"}: ${s.value}` : String(s),
      )
    : [];
  return {
    id: String(row.slug),
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

export async function GET() {
  if (!supabaseConfigured()) {
    return NextResponse.json({ products: PRODUCTS, categories: CATEGORIES, source: "json" });
  }
  try {
    const db = getSupabasePublic();
    const [{ data: products, error: pErr }, { data: cats }] = await Promise.all([
      db.from("products").select("*").order("name"),
      db.from("options").select("label").eq("kind", "category").eq("enabled", true).order("sort_order"),
    ]);
    if (pErr) throw pErr;
    const list = (products || []).map(mapRow);
    recordKeepalive(db, "catalog", "catalog read").catch(() => undefined);
    const categories = Array.from(
      new Set([...(cats || []).map((c) => c.label).filter(Boolean), ...list.map((p) => p.category)]),
    );
    return NextResponse.json({
      products: list.length ? list : PRODUCTS,
      categories: categories.length ? categories : CATEGORIES,
      source: list.length ? "supabase" : "json",
    });
  } catch (err) {
    console.error("catalog supabase", err);
    return NextResponse.json({ products: PRODUCTS, categories: CATEGORIES, source: "json" });
  }
}
