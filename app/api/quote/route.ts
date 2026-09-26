import { NextResponse } from "next/server";
import { sendQuoteToTelegram } from "@/lib/telegram";

const hits = new Map<string, { count: number; ts: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > 10 * 60 * 1000) {
    hits.set(ip, { count: 1, ts: now });
    return true;
  }
  if (rec.count >= 8) return false;
  rec.count += 1;
  return true;
}

function requestOrigin(req: Request, fromClient?: string) {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (env) return env;
  if (fromClient?.startsWith("http")) return fromClient.replace(/\/$/, "");
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host) return `${proto}://${host}`;
  try {
    return new URL(req.url).origin;
  } catch {
    return undefined;
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const buyerType = body.buyerType === "company" ? "company" : "individual";
  const companyName = String(body.companyName || "").trim();
  const product = String(body.product || "").trim();
  const productId = String(body.productId || "").trim();
  const quantity = String(body.quantity || "").trim();
  const message = String(body.message || "").trim();
  const origin = requestOrigin(req, String(body.origin || "").trim());

  if (name.length < 2 || phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ error: "Please enter a valid name and 10-digit phone number." }, { status: 400 });
  }

  if (buyerType === "company" && companyName.length < 2) {
    return NextResponse.json({ error: "Please enter your company name." }, { status: 400 });
  }

  try {
    try {
      const { supabaseConfigured, getSupabasePublic } = await import("@/lib/supabase/public");
      if (supabaseConfigured()) {
        await getSupabasePublic().from("enquiries").insert({
          name,
          phone,
          email,
          buyer_type: buyerType,
          company_name: buyerType === "company" ? companyName : "",
          product_name: product,
          product_slug: productId,
          quantity,
          message,
          status: "new",
        });
      }
    } catch (err) {
      console.error("enquiry persist", err);
    }

    await sendQuoteToTelegram({
      name,
      phone,
      email,
      buyerType,
      companyName: buyerType === "company" ? companyName : "",
      product,
      productId,
      quantity,
      message,
      origin,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not send your inquiry. Please try again or call us." }, { status: 500 });
  }
}
