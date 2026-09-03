import { COMPANY, type Product } from "./data";

type PdfDoc = import("jspdf").jsPDF;

const HEADER = "Shri Padmavathi Industries, Catalog";
const PRIMARY: [number, number, number] = [158, 16, 0];

function wrap(doc: PdfDoc, text: string, maxWidth: number) {
  return doc.splitTextToSize(text, maxWidth) as string[];
}

function slugFile(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function imageToJpeg(src: string) {
  try {
    const url = src.startsWith("http") ? src : `${window.location.origin}${src}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);
    const max = 520;
    const scale = Math.min(max / bitmap.width, max / bitmap.height, 1);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", 0.74);
  } catch {
    return null;
  }
}

function drawHeader(doc: PdfDoc, pageW: number, section: string) {
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageW, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(HEADER, 14, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(section, 14, 20);

  doc.setTextColor(90, 90, 90);
  doc.setFontSize(8);
  doc.text(`${COMPANY.address}  |  ${COMPANY.phoneDisplay}  |  GSTIN ${COMPANY.gst}`, 14, 34);
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.4);
  doc.line(14, 37, pageW - 14, 37);
}

function drawFooter(doc: PdfDoc, pageW: number, pageH: number, page: number, total: number) {
  doc.setDrawColor(226, 228, 233);
  doc.line(14, pageH - 12, pageW - 14, pageH - 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(95, 94, 94);
  doc.text("Tin manufacturers in Chennai — paint tins, oil tins, biryani tins", 14, pageH - 7);
  doc.text(`Page ${page} of ${total}`, pageW - 14, pageH - 7, { align: "right" });
}

export async function downloadCatalogPdf(products: Product[], sectionLabel: string) {
  if (typeof window === "undefined") return;
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const cardH = 58;
  const gap = 4;
  let y = 42;
  const photos = await Promise.all(products.map((p) => imageToJpeg(p.image)));

  drawHeader(doc, pageW, sectionLabel);

  const newPage = () => {
    doc.addPage();
    drawHeader(doc, pageW, sectionLabel);
    y = 42;
  };

  products.forEach((product, index) => {
    if (y + cardH > pageH - 16) newPage();

    doc.setDrawColor(226, 228, 233);
    doc.setFillColor(252, 249, 248);
    doc.rect(margin, y, pageW - margin * 2, cardH, "FD");

    const imgX = margin + 3;
    const imgY = y + 3;
    const imgSize = 52;
    doc.setFillColor(255, 255, 255);
    doc.rect(imgX, imgY, imgSize, imgSize, "F");
    const jpeg = photos[index];
    if (jpeg) {
      try {
        doc.addImage(jpeg, "JPEG", imgX, imgY, imgSize, imgSize, undefined, "FAST");
      } catch {
        /* skip broken image */
      }
    }

    const textX = imgX + imgSize + 6;
    const textW = pageW - margin - textX - 3;
    doc.setTextColor(...PRIMARY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const nameLines = wrap(doc, product.name, textW).slice(0, 2);
    doc.text(nameLines, textX, y + 9);

    let ty = y + 9 + nameLines.length * 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(95, 94, 94);
    doc.text(product.category, textX, ty);
    ty += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(27, 28, 28);
    doc.text(product.price.replace("₹", "Rs. "), textX, ty);
    ty += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(91, 64, 59);
    for (const spec of product.specs.slice(0, 4)) {
      if (ty > y + cardH - 4) break;
      doc.text(`• ${spec}`, textX, ty);
      ty += 4.4;
    }

    y += cardH + gap;
  });

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    drawFooter(doc, pageW, pageH, i, total);
  }
  const file = `Shri-Padmavathi-Industries-Catalog-${slugFile(sectionLabel)}.pdf`;
  doc.save(file);
}
