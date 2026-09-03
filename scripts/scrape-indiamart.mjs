import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const START = "https://www.indiamart.com/sripadmavathiindustries/our-products.html";
const outDir = path.join(process.cwd(), "scripts", "im-scrape");
mkdirSync(outDir, { recursive: true });

function abs(href, base) {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

function biggerImage(src) {
  if (!src) return "";
  return src
    .replace(/-\d+x\d+\.(jpg|jpeg|png|webp)/i, "-500x500.$1")
    .replace(/250x250|125x125|75x75/g, "500x500");
}

async function dismiss(page) {
  for (const sel of [
    "button:has-text('Maybe later')",
    "button:has-text('No thanks')",
    "text=Maybe Later",
    ".be-cls",
    "#imclose",
  ]) {
    const el = page.locator(sel).first();
    if (await el.count()) {
      try {
        await el.click({ timeout: 1500 });
      } catch {
        /* ignore */
      }
    }
  }
}

async function collectLinks(page, pattern) {
  return page.$$eval("a[href]", (as, pat) => {
    const re = new RegExp(pat, "i");
    return [...new Set(as.map((a) => a.href).filter((h) => re.test(h)))];
  }, pattern);
}

async function scrapeListing(page, url, fallbackCategory) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);
  await dismiss(page);
  await page.evaluate(async () => {
    for (let i = 0; i < 8; i++) {
      window.scrollBy(0, 900);
      await new Promise((r) => setTimeout(r, 400));
    }
  });
  await page.waitForTimeout(1000);

  const heading = await page.locator("h1").first().innerText().catch(() => fallbackCategory);

  const products = await page.evaluate((cat) => {
    const blocks = [...document.querySelectorAll("div, li, article")].filter((el) => {
      const t = el.innerText || "";
      return /₹|Get Quote|Get Best Quote/i.test(t) && t.length < 1800 && t.length > 20;
    });
    const seen = new Set();
    const items = [];
    for (const el of blocks) {
      if (el.querySelector("[data-click], .prd-card, .product-card")) continue;
      const nameEl =
        el.querySelector("a p, h2 a, h3 a, .prd-name, [data-click] a, a.fs18, a.prd") ||
        el.querySelector("a[href*='sripadmavathiindustries']") ||
        el.querySelector("h2, h3, .prd-name");
      const name = (nameEl?.innerText || "").trim().replace(/\s+/g, " ");
      if (!name || name.length < 4 || /Get Quote|View Complete|Contact/i.test(name)) continue;
      if (seen.has(name.toLowerCase())) continue;
      const priceMatch = (el.innerText || "").match(/₹\s*[\d,.]+(?:\s*\/\s*\w+)?/i);
      const img = el.querySelector("img");
      const src = img?.getAttribute("src") || img?.getAttribute("data-src") || "";
      const link = nameEl?.closest("a")?.href || el.querySelector("a[href*='sripadmavathi']")?.href || "";
      const specs = [...el.querySelectorAll("li, .dtl, tr")]
        .map((n) => (n.innerText || "").trim().replace(/\s+/g, " "))
        .filter((t) => t.includes(":") && t.length < 80);
      seen.add(name.toLowerCase());
      items.push({
        name,
        price: priceMatch ? priceMatch[0].replace(/\s+/g, " ") : "",
        image: src,
        link,
        specs,
        category: cat,
      });
    }
    return items;
  }, heading.replace(/\s+/g, " ").trim());

  return { heading, url, products };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  viewport: { width: 1440, height: 900 },
});

await page.goto(START, { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForTimeout(3000);
await dismiss(page);
writeFileSync(path.join(outDir, "our-products.html"), await page.content());

const catLinks = (await collectLinks(page, "indiamart\\.com/sripadmavathiindustries/.+\\.html")).filter(
  (h) => !/our-products|about-us|contact|enquiry|home/i.test(h),
);
console.log("category links", catLinks.length);
catLinks.forEach((c) => console.log(" CAT", c));

const startData = await scrapeListing(page, START, "Our Products");
console.log("start products", startData.products.length);

const all = [...startData.products];
const visited = new Set([START]);

for (const url of catLinks) {
  if (visited.has(url)) continue;
  visited.add(url);
  try {
    const data = await scrapeListing(page, url, url);
    console.log("page", url, "->", data.products.length, data.heading);
    all.push(...data.products);
  } catch (err) {
    console.log("FAIL", url, err.message);
  }
}

// unique by name
const uniq = [];
const names = new Set();
for (const p of all) {
  const key = p.name.toLowerCase();
  if (names.has(key)) continue;
  names.add(key);
  p.image = biggerImage(p.image);
  uniq.push(p);
}

writeFileSync(path.join(outDir, "products.json"), JSON.stringify({ count: uniq.length, products: uniq, catLinks }, null, 2));
console.log("UNIQUE", uniq.length);
uniq.forEach((p) => console.log("-", p.category, "|", p.price, "|", p.name));

await browser.close();
