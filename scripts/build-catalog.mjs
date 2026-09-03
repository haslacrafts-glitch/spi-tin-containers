import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";

const raw = JSON.parse(readFileSync("scripts/im-scrape/products.json", "utf8"));
const imgDir = path.join(process.cwd(), "public", "images", "tins");
mkdirSync(imgDir, { recursive: true });

const SLUG_CAT = {
  "biryani-tin-containers": "Biryani Tin Containers",
  "paint-tin-containers": "Paint Tin Containers",
  "tin-containers": "Tin Containers",
  "tin-box": "Tin Box",
  "kumkum-box": "Kumkum Box",
  "oil-ghee-tin-containers": "Oil & Ghee Tin Containers",
  "customized-tin-containers": "Customized Tin Containers",
  "gift-tins": "Gift Tins",
  "food-cans": "Food Cans",
  "canister-lid": "Canister Lid",
  "pvc-solvent-tins": "PVC Solvent Tins",
  "container-lid": "Container Lid",
  "container-bottom": "Container Bottom",
  "customized-cookies-tins": "Customized Cookies Tins",
  "protein-powder-tin-can": "Protein Powder Tin Can",
  "square-tin-boxes": "Square Tin Boxes",
  "tin-cans": "Tin Cans",
  "cosmetic-container": "Cosmetic Container",
  "lip-balm-container": "Lip Balm Container",
  "sweets-tin-box": "Sweets Tin Box",
};

const NAME_CAT = [
  [/biryani/i, "Biryani Tin Containers"],
  [/kumkum/i, "Kumkum Box"],
  [/ghee|oil can/i, "Oil & Ghee Tin Containers"],
  [/paint|enamel/i, "Paint Tin Containers"],
  [/food can/i, "Food Cans"],
  [/gift tin/i, "Gift Tins"],
  [/cake/i, "Customized Tin Containers"],
  [/cookie/i, "Customized Cookies Tins"],
  [/protein/i, "Protein Powder Tin Can"],
  [/square tin/i, "Square Tin Boxes"],
  [/sweet/i, "Sweets Tin Box"],
  [/lip balm/i, "Lip Balm Container"],
  [/cosmetic/i, "Cosmetic Container"],
  [/canister lid/i, "Canister Lid"],
  [/container lid|tinplate lid/i, "Container Lid"],
  [/bottom/i, "Container Bottom"],
  [/round tin box|chocolate tin/i, "Tin Box"],
];

const SPECS = {
  "200 Grams Printed Biryani Tin Container": ["USAGE: FOOD STORE", "CAPACITY: 200 ML", "COLOR: BROWN"],
  "300g Printed Biryani Tin Containers": ["PATTERN: PRINTED", "MATERIAL: TIN", "SHAPE: ROUND", "CAPACITY: 300 ML"],
  "1 Kg Printed Biryani Tin Container": ["USAGE: KITCHEN FOOD STORAGE", "SHAPE: ROUND", "ORIGIN: MADE IN INDIA"],
  "5 Kg Printed Biryani Tin Container": ["USAGE: KITCHEN FOOD STORAGE", "SHAPE: ROUND", "SIZE: 9 INCH DIA x 5 INCH HEIGHT"],
  "500 Grams Printed Biryani Tin Container": ["USAGE: FOOD STORE", "CAPACITY: 500 ML", "APPLICATION: PACKAGING"],
  "750 Gms Printed Biryani Tin Containers": ["USAGE: KITCHEN FOOD STORAGE", "SHAPE: ROUND", "DIAMETER: 6 INCH"],
  "Tube Shape Printed Biryani Tin Container": ["SHAPE: TUBE", "PATTERN: PRINTED", "MATERIAL: TIN"],
  "Paint Coated Tin Container": ["CAPACITY: 100 ML", "SHAPE: CYLINDRICAL", "COLOR: MULTICOLOUR"],
  "500ml Paint Tin Container": ["CAPACITY: 500 ML", "APPLICATION: PAINT", "SHAPE: CYLINDRICAL"],
  "700ml Paint Tin Container": ["CAPACITY: 700 ML", "SHAPE: ROUND", "COLOR: SILVER"],
  "Customized Synthetic Enamel Paint Tin Container": ["CAPACITY: 250 ML", "SHAPE: ROUND", "COLOR: MULTICOLOUR"],
  "2L Paint Tin Container": ["CAPACITY: 2 LITRE", "SHAPE: ROUND", "STORING: PAINT"],
  "1L Synthetic Enamel Tin Container": ["CAPACITY: 1 LITRE", "APPLICATION: ENAMEL PAINT", "SHAPE: ROUND"],
  "Air Tight Printed Tin Container": ["CAPACITY: 100 ML", "APPLICATION: PACKAGING", "SHAPE: ROUND", "PATTERN: PRINTED"],
  "Pulses Tin Container": ["USAGE: PULSES", "SHAPE: CYLINDRICAL", "CAPACITY: 100 GM"],
  "Ink Tin Container": ["CAPACITY: 1 KG", "STORING: INK", "SHAPE: ROUND"],
  "Coffee Tea Tin Container": ["SIZE: 83 x 110 MM", "CAPACITY: 500 GRAM", "PACK: 6 PIECE"],
  "Packaging Tin Boxes": ["SHAPE: ROUND", "CAPACITY: 200 GM", "MATERIAL: TINPLATE"],
  "Organic Tea Tin Container": ["CAPACITY: 500 GM", "MATERIAL: TINPLATE", "SEAL: AIRTIGHT"],
  "500g Round Tin Box": ["CAPACITY: 500 G", "TINPLATE: 0.21 MM", "FOOD GRADE: YES"],
  "250g Round Tin Box": ["CAPACITY: 250 G", "TINPLATE: 0.28 MM", "FOOD GRADE: YES"],
  "1Kg Round Tin Box": ["CAPACITY: 1 KG", "TINPLATE: 0.21 MM", "FOOD GRADE: YES"],
  "Chocolate Tin Box": ["SHAPE: ROUND", "CAPACITY: 750 G", "FOOD GRADE: YES"],
  "20gm Kumkum Tin Container": ["USAGE: COSMETIC", "CAPACITY: 20 GRAMS", "SHAPE: CYLINDRICAL"],
  "5gm Kumkum Tin Container": ["USAGE: COSMETIC", "CAPACITY: 5 GM", "SHAPE: ROUND"],
  "500ml Ghee Tin Container": ["CAPACITY: 500 ML", "FINISH: POLISHED", "PACK: FOOD GRADE"],
  "250ml Ghee Tin Container": ["CAPACITY: 250 ML", "APPLICATION: GHEE PACKAGING", "SHAPE: CYLINDRICAL"],
  "Customize Cake Tin Container": ["CAPACITY: 1000 GM", "APPLICATION: FOOD", "SHAPE: ROUND"],
  "Gift Tin Containers": ["USAGE: RETURN GIFTS", "SHAPE: CYLINDRICAL", "PATTERN: PRINTED"],
  "Tin Food Cans": ["APPLICATION: FOOD PACKAGING", "MATERIAL: TINPLATE", "SEAL: AIRTIGHT"],
  "Tin Canister Lid": ["TYPE: CANISTER LID", "MATERIAL: TINPLATE", "FIT: ROUND CANS"],
  "Printed Paint Tin Container": ["APPLICATION: PAINT / SOLVENT", "PATTERN: PRINTED", "MATERIAL: TIN"],
  "Round Tin Container Lid": ["TYPE: CONTAINER LID", "SHAPE: ROUND", "MATERIAL: TINPLATE"],
  "5 Inches Tinplate lid": ["SIZE: 5 INCH", "TYPE: LID / BOTTOM", "MATERIAL: TINPLATE"],
  "Customized Cookies Tins": ["APPLICATION: COOKIES", "DESIGN: CUSTOM PRINTED", "MATERIAL: TIN"],
  "Protein Powder Tin Can": ["APPLICATION: PROTEIN POWDER", "MATERIAL: TINPLATE", "SEAL: AIRTIGHT"],
  "Sweets Tin Box": ["APPLICATION: SWEETS", "MATERIAL: TINPLATE", "FOOD GRADE: YES"],
  "Square Tin Boxes": ["SHAPE: SQUARE", "MATERIAL: TINPLATE", "APPLICATION: GIFT / FOOD"],
  "Lip Balm Container": ["APPLICATION: LIP BALM", "MATERIAL: TIN", "SHAPE: ROUND"],
  "Cosmetic Packaging Container": ["APPLICATION: COSMETIC", "MATERIAL: TIN", "SHAPE: ROUND"],
  "Tin Oil Can": ["APPLICATION: OIL", "MATERIAL: TINPLATE", "SHAPE: CAN"],
};

const ID_MAP = {
  "300g Printed Biryani Tin Containers": "biryani-300g",
  "1 Kg Printed Biryani Tin Container": "biryani-1kg",
  "Paint Coated Tin Container": "paint-coated",
  "20gm Kumkum Tin Container": "kumkum-20g",
  "Tin Food Cans": "food-cans",
  "Pulses Tin Container": "pulses",
  "Customize Cake Tin Container": "cake-custom",
  "500ml Ghee Tin Container": "ghee-oil",
};

function slug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function categoryOf(p) {
  if (p.name === "Printed Paint Tin Container") return "PVC Solvent Tins";
  if (p.name === "5 Inches Tinplate lid") return "Container Bottom";
  if (p.name === "300g Printed Biryani Tin Containers") return "Biryani Tin Containers";
  const slugPart = (p.link.match(/sripadmavathiindustries\/([^.#/]+)/) || [])[1] || "";
  if (SLUG_CAT[slugPart]) return SLUG_CAT[slugPart];
  if (slugPart === "proddetail" || !slugPart) {
    for (const [re, cat] of NAME_CAT) if (re.test(p.name)) return cat;
  }
  return "Tin Containers";
}

function priceOf(p) {
  return (p.price || "").replace(/\s+/g, " ").replace("₹ ", "₹").replace("/ Piece", "/Piece").trim();
}

const headers = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  referer: "https://www.indiamart.com/sripadmavathiindustries/our-products.html",
  accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
};

const products = [];
for (const p of raw.products) {
  const id = ID_MAP[p.name] || slug(p.name);
  const file = `${id}.jpg`;
  const dest = path.join(imgDir, file);
  if (p.image) {
    try {
      const res = await fetch(p.image, { headers });
      const buf = Buffer.from(await res.arrayBuffer());
      if (res.ok && buf.length > 2000) writeFileSync(dest, buf);
      console.log(file, res.status, buf.length);
    } catch (err) {
      console.log("IMG FAIL", id, err.message);
    }
  }
  const specs = SPECS[p.name] || ["MATERIAL: TINPLATE", "ORIGIN: MADE IN INDIA", "MOQ: AS PER QUOTE"];
  products.push({
    id,
    name: p.name,
    category: categoryOf(p),
    image: `/images/tins/${file}`,
    specs,
    price: priceOf(p) || "Price on request",
    bestSeller: id === "biryani-300g",
    description: `${p.name} from Sri Padmavathi Industries, Chennai. ${priceOf(p) ? `Listed at ${priceOf(p)}.` : ""} Custom printing and bulk supply available.`,
  });
}

const categories = [...new Set(products.map((p) => p.category))];
writeFileSync("scripts/im-scrape/catalog.json", JSON.stringify({ categories, products }, null, 2));
console.log("catalog", products.length, "categories", categories.length);
