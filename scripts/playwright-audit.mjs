import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";

const BASE = process.env.SPI_URL || "http://localhost:3001";
const OUT = path.join(process.cwd(), "playwright-audit");
const PAGES = ["/", "/about", "/products", "/photos", "/contact"];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
};

mkdirSync(OUT, { recursive: true });

async function auditPage(page, name, viewportName) {
  const issues = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const findings = [];

    if (document.documentElement.scrollWidth > docW + 2) {
      findings.push({
        type: "horizontal-overflow",
        detail: `scrollWidth ${document.documentElement.scrollWidth} > clientWidth ${docW}`,
      });
    }

    const overflowing = [];
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      if (r.right > docW + 2 && r.left < docW) {
        overflowing.push({
          tag: el.tagName,
          class: (el.className || "").toString().slice(0, 80),
          text: (el.innerText || "").slice(0, 60).replace(/\s+/g, " "),
          right: Math.round(r.right),
        });
      }
    });
    overflowing.slice(0, 8).forEach((o) => findings.push({ type: "element-overflow", ...o }));

    const brokenImgs = [...document.querySelectorAll("img")].filter((img) => !img.complete || img.naturalWidth === 0);
    brokenImgs.forEach((img) => findings.push({ type: "broken-image", src: img.src.slice(0, 120) }));

    const header = document.querySelector("header");
    if (header) {
      const hr = header.getBoundingClientRect();
      if (hr.height > 120) findings.push({ type: "tall-header", height: Math.round(hr.height) });
    }

    return findings;
  });
  return issues;
}

const report = [];

const browser = await chromium.launch({ headless: true });

for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: Boolean(vp.isMobile),
    hasTouch: Boolean(vp.hasTouch),
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(45000);

  for (const route of PAGES) {
    const label = `${vpName}${route === "/" ? "-home" : route.replaceAll("/", "-")}`;
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, `${label}-top.png`), fullPage: false });
    await page.screenshot({ path: path.join(OUT, `${label}-full.png`), fullPage: true });
    const issues = await auditPage(page, label, vpName);
    report.push({ label, route, viewport: vpName, issues });
  }

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  if (vpName === "mobile") {
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, "mobile-menu.png") });
    const menuIssues = await auditPage(page, "mobile-menu", "mobile");
    report.push({ label: "mobile-menu", route: "/", viewport: "mobile", issues: menuIssues });
    await page.keyboard.press("Escape");
    await page.locator("button[aria-label='Close menu']").first().click().catch(() => {});
  }

  await page.getByRole("button", { name: /get a quote|contact supplier|inquiry/i }).first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `${vpName}-quote-modal.png`) });
  const modalIssues = await auditPage(page, `${vpName}-modal`, vpName);
  report.push({ label: `${vpName}-quote-modal`, route: "/", viewport: vpName, issues: modalIssues });

  await context.close();
}

await browser.close();
writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
