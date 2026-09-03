import { findProductsByIds } from "@/lib/catalog-meta";
import { findProduct, specPairs, COMPANY, type Product } from "@/lib/data";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const CHAT_FILE = path.join(process.cwd(), ".telegram-chat-id");

export type QuotePayload = {
  name: string;
  phone: string;
  email?: string;
  buyerType?: "individual" | "company";
  companyName?: string;
  product?: string;
  productId?: string;
  quantity?: string;
  message?: string;
  origin?: string;
};

function getChatId(): string | undefined {
  if (process.env.TELEGRAM_CHAT_ID) return process.env.TELEGRAM_CHAT_ID;
  if (existsSync(CHAT_FILE)) {
    return readFileSync(CHAT_FILE, "utf8").trim() || undefined;
  }
  return undefined;
}

export function saveChatId(chatId: string) {
  writeFileSync(CHAT_FILE, chatId, "utf8");
}

export function isTelegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && getChatId());
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function productLink(origin: string | undefined, product: Product) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || origin || "").replace(/\/$/, "");
  if (!base) return undefined;
  return `${base}/products/${product.id}`;
}

function urgencyLine(quantity?: string) {
  if (!quantity) return "";
  const digits = quantity.replace(/[^\d]/g, "");
  if (!digits) return escapeHtml(quantity).toUpperCase();
  return `${digits} NOS NEED URGENT`;
}

function formatQuantity(quantity?: string) {
  if (!quantity?.trim()) return "";
  const q = quantity.trim();
  if (/piece|pcs|nos|unit|kg|ml|ltr|litre/i.test(q)) return q;
  if (/^\d[\d,\s]*$/.test(q)) return `${q} Piece`;
  return q;
}

function cardTitle(product?: Product, fallback?: string) {
  const name = product?.name || fallback || "General enquiry";
  if (!product) return name;
  const capacity = specPairs(product).find((s) => /capacity|volume|weight/i.test(s.label));
  if (capacity && !name.toLowerCase().includes(capacity.value.toLowerCase())) {
    return `${name}, ${capacity.label}: ${capacity.value}`;
  }
  return name;
}

function resolveProducts(quote: QuotePayload): Product[] {
  const ids = (quote.productId || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (ids.length > 1) return findProductsByIds(ids);
  const one = findProduct(quote.productId || quote.product);
  return one ? [one] : [];
}

function buildCaption(quote: QuotePayload, products: Product[]) {
  const product = products[0];
  const title =
    products.length > 1 ? `Quote · ${products.length} tins` : cardTitle(product, quote.product);
  const lines: string[] = [`<b>${escapeHtml(title)}</b>`];

  const qty = formatQuantity(quote.quantity);
  const urgency = urgencyLine(qty || quote.message);
  if (urgency) lines.push(urgency);

  lines.push("");

  if (qty) {
    lines.push(`Quantity : <b>${escapeHtml(qty)}</b>`);
  }

  if (products.length > 1) {
    for (const item of products) {
      lines.push(`• ${escapeHtml(item.name)} (${escapeHtml(item.price)})`);
    }
  } else if (product?.price) {
    lines.push(`Price : <b>${escapeHtml(product.price)}</b>`);
  }

  if (products.length === 1 && product) {
    for (const spec of specPairs(product)) {
      lines.push(`${escapeHtml(spec.label)} : <b>${escapeHtml(spec.value)}</b>`);
    }
  } else if (!products.length && quote.product) {
    lines.push(`Product : <b>${escapeHtml(quote.product)}</b>`);
  }

  if (quote.message) {
    lines.push("");
    lines.push(escapeHtml(quote.message));
  }

  lines.push("");
  lines.push(`Buyer : <b>${escapeHtml(quote.name)}</b>`);
  if (quote.buyerType === "company") {
    lines.push(`Enquiry : <b>Company</b>`);
    if (quote.companyName) lines.push(`Company : <b>${escapeHtml(quote.companyName)}</b>`);
  } else if (quote.buyerType === "individual") {
    lines.push(`Enquiry : <b>Individual</b>`);
  }
  lines.push(`Phone : <b>${escapeHtml(quote.phone)}</b>`);
  if (quote.email) lines.push(`Email : <b>${escapeHtml(quote.email)}</b>`);
  lines.push("");
  lines.push(`Suppliers from ${escapeHtml(COMPANY.city.split(",")[0] || "Chennai")} will be preferred`);
  lines.push(`<i>${escapeHtml(COMPANY.name)} · ${escapeHtml(COMPANY.city)}</i>`);

  const pageUrl = product ? productLink(quote.origin, product) : undefined;
  if (pageUrl) {
    lines.push("");
    lines.push(`<a href="${escapeHtml(pageUrl)}">View product on website</a>`);
  }

  const caption = lines.join("\n");
  return caption.length > 1024 ? `${caption.slice(0, 1020)}…` : caption;
}

function inlineKeyboard(pageUrl?: string, imageUrl?: string) {
  const row: Array<{ text: string; url: string }> = [];
  if (pageUrl?.startsWith("https://")) {
    row.push({ text: "View product", url: pageUrl });
  } else if (imageUrl?.startsWith("https://")) {
    row.push({ text: "View product photo", url: imageUrl });
  }
  if (!row.length) return undefined;
  return { inline_keyboard: [row] };
}

async function telegram(token: string, method: string, body: FormData | Record<string, unknown>) {
  const isForm = body instanceof FormData;
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : JSON.stringify(body),
  });
  return (await res.json()) as { ok: boolean; description?: string };
}

async function loadPhotoBytes(imageUrl: string) {
  if (imageUrl.startsWith("/")) {
    const local = path.join(process.cwd(), "public", imageUrl.replace(/\//g, path.sep));
    if (existsSync(local)) {
      return { bytes: readFileSync(local), type: "image/webp" };
    }
  }
  const img = await fetch(imageUrl);
  if (!img.ok) return null;
  return { bytes: Buffer.from(await img.arrayBuffer()), type: img.headers.get("content-type") || "image/jpeg" };
}

async function sendPhotoCard(token: string, chatId: string, imageUrl: string, caption: string, markup?: object) {
  try {
    const photo = await loadPhotoBytes(imageUrl);
    if (photo) {
      const form = new FormData();
      form.append("chat_id", chatId);
      form.append("caption", caption);
      form.append("parse_mode", "HTML");
      form.append("photo", new Blob([photo.bytes], { type: photo.type }), "product.jpg");
      if (markup) form.append("reply_markup", JSON.stringify(markup));
      const uploaded = await telegram(token, "sendPhoto", form);
      if (uploaded.ok) return true;
    }
  } catch {
    // fall through to URL send
  }

  if (!imageUrl.startsWith("http")) return false;
  const byUrl = await telegram(token, "sendPhoto", {
    chat_id: chatId,
    photo: imageUrl,
    caption,
    parse_mode: "HTML",
    reply_markup: markup,
  });
  return byUrl.ok;
}

export async function sendQuoteToTelegram(quote: QuotePayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = getChatId();
  if (!token || !chatId) {
    throw new Error(
      "Telegram is not connected yet. Add TELEGRAM_BOT_TOKEN to .env.local, open the bot from 7010651052 and tap Start, then run npm run telegram:setup.",
    );
  }

  const products = resolveProducts(quote);
  const product = products[0];
  const caption = buildCaption(quote, products);
  const pageUrl = product ? productLink(quote.origin, product) : undefined;
  const markup = inlineKeyboard(pageUrl, product?.image);

  if (product?.image) {
    const sent = await sendPhotoCard(token, chatId, product.image, caption, markup);
    if (sent) return;
  }

  const text = await telegram(token, "sendMessage", {
    chat_id: chatId,
    text: caption,
    parse_mode: "HTML",
    disable_web_page_preview: false,
    reply_markup: markup,
  });
  if (!text.ok) {
    throw new Error(text.description || "Telegram rejected the message.");
  }
}

export async function discoverChatIdFromUpdates() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is missing.");

  const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  const data = (await res.json()) as {
    ok: boolean;
    result?: Array<{ message?: { chat?: { id?: number; first_name?: string } } }>;
    description?: string;
  };

  if (!data.ok) throw new Error(data.description || "Could not read Telegram updates.");

  const chats = (data.result || [])
    .map((u) => u.message?.chat)
    .filter((c): c is { id: number; first_name?: string } => Boolean(c?.id));

  const latest = chats.at(-1);
  if (!latest) return null;
  saveChatId(String(latest.id));
  return latest;
}
