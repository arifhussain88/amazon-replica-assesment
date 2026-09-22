import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { catalogProducts } from "../lib/catalog";

const accents: Record<string, string> = {
  "harbor-compact-speaker": "#2c3338",
  "usb-c-65w-charger": "#f4f1ea",
  "field-wireless-mouse": "#3d4450",
  "pour-over-kettle": "#c7cdd1",
  "percale-sheet-set": "#efe8dc",
  "ten-inch-skillet": "#2f3438",
  "merino-crewneck": "#6d4c41",
  "everyday-chinos": "#c4b59a",
  "canvas-market-tote": "#d8c7a1",
  "daily-moisturizer": "#f7f3ee",
  "ceramic-round-brush": "#1f1a17",
  "studio-yoga-mat": "#2f4f4a",
  "insulated-bottle": "#8aa4b5",
  "speed-jump-rope": "#111111",
  "lined-notebook-pack": "#efe6d6",
  "the-salt-market": "#1d3557",
  "gel-pen-pack": "#f3efe8",
  "wooden-block-set": "#e6c39a",
  "plush-fox": "#c46b3a",
  "carry-on-spinner": "#3a3f45",
  "packing-cube-set": "#d9e2ea",
  "neck-pillow": "#c5ced6",
  "cordless-screwdriver": "#f0c14b",
  "led-work-light": "#f4d35e",
};

function svg(slug: string) {
  const accent = accents[slug] ?? "#dddddd";
  const shape = shapes[slug] ?? shapes["usb-c-65w-charger"];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#f4f2ee"/>
  <ellipse cx="400" cy="620" rx="180" ry="28" fill="#000" opacity="0.08"/>
  <g fill="${accent}" stroke="#1c1c1c" stroke-width="8" stroke-linejoin="round">
    ${shape}
  </g>
</svg>`;
}

const shapes: Record<string, string> = {
  "harbor-compact-speaker": `<rect x="250" y="300" width="300" height="180" rx="90"/><circle cx="340" cy="390" r="28" fill="#111"/><circle cx="460" cy="390" r="28" fill="#111"/>`,
  "usb-c-65w-charger": `<rect x="300" y="250" width="200" height="220" rx="24"/><rect x="370" y="190" width="24" height="70" fill="#111" stroke="none"/><rect x="406" y="190" width="24" height="70" fill="#111" stroke="none"/>`,
  "field-wireless-mouse": `<ellipse cx="400" cy="390" rx="110" ry="150"/><path d="M400 250 v80" stroke="#111" fill="none"/>`,
  "pour-over-kettle": `<path d="M300 280 h180 v40 h40 v70 h-40 v130 H300 z"/><path d="M480 340 h70 v50 h-70" fill="none"/>`,
  "percale-sheet-set": `<rect x="230" y="260" width="340" height="240" rx="8"/><path d="M230 340 h340 M230 420 h340" fill="none"/>`,
  "ten-inch-skillet": `<circle cx="370" cy="400" r="130"/><rect x="490" y="370" width="140" height="36" rx="8"/>`,
  "merino-crewneck": `<path d="M280 280 l60-40 h120 l60 40 v250 H280 z"/><path d="M360 240 h80 v40 h-80 z" fill="#f4f2ee"/>`,
  "everyday-chinos": `<path d="M300 240 h200 l-20 320 h-60 l-20-150 -20 150 h-60 z"/>`,
  "canvas-market-tote": `<path d="M270 300 h260 v230 H270 z"/><path d="M310 300 v-50 h40 v50 M450 300 v-50 h40 v50" fill="none"/>`,
  "daily-moisturizer": `<rect x="330" y="240" width="140" height="280" rx="40"/><rect x="350" y="200" width="100" height="50" rx="8" fill="#111"/>`,
  "ceramic-round-brush": `<rect x="370" y="180" width="60" height="420" rx="30"/><circle cx="400" cy="250" r="70" fill="none"/>`,
  "studio-yoga-mat": `<rect x="250" y="220" width="300" height="380" rx="16" transform="rotate(-8 400 400)"/>`,
  "insulated-bottle": `<rect x="330" y="210" width="140" height="340" rx="50"/><rect x="355" y="170" width="90" height="50" rx="10" fill="#111"/>`,
  "speed-jump-rope": `<circle cx="250" cy="400" r="28"/><circle cx="550" cy="400" r="28"/><path d="M278 400 C320 560 480 560 522 400" fill="none"/>`,
  "lined-notebook-pack": `<rect x="250" y="230" width="220" height="300" rx="6"/><rect x="290" y="260" width="220" height="300" rx="6"/><rect x="330" y="290" width="220" height="300" rx="6"/>`,
  "the-salt-market": `<rect x="270" y="200" width="260" height="380"/><rect x="300" y="250" width="200" height="16" fill="#f4f2ee" stroke="none"/>`,
  "gel-pen-pack": `<g fill="#1d3557">${[0, 1, 2, 3].map((index) => `<rect x="${250 + index * 40}" y="250" width="18" height="300" rx="8"/>`).join("")}</g><g fill="#6d4c41">${[0, 1, 2, 3].map((index) => `<rect x="${430 + index * 40}" y="250" width="18" height="300" rx="8"/>`).join("")}</g>`,
  "wooden-block-set": `<rect x="250" y="360" width="90" height="90"/><rect x="350" y="320" width="90" height="130"/><rect x="450" y="390" width="110" height="60"/><polygon points="300,360 345,300 390,360"/>`,
  "plush-fox": `<circle cx="400" cy="390" r="110"/><polygon points="300,300 340,220 380,310"/><polygon points="500,300 460,220 420,310"/><circle cx="370" cy="380" r="10" fill="#111"/><circle cx="430" cy="380" r="10" fill="#111"/>`,
  "carry-on-spinner": `<rect x="280" y="180" width="240" height="380" rx="16"/><rect x="360" y="140" width="80" height="50" rx="8" fill="#111"/>`,
  "packing-cube-set": `<rect x="230" y="280" width="160" height="120"/><rect x="410" y="280" width="160" height="120"/><rect x="280" y="420" width="240" height="120"/>`,
  "neck-pillow": `<path d="M250 430c0-120 80-200 150-200s150 80 150 200v40H250z"/><circle cx="400" cy="360" r="50" fill="#f4f2ee"/>`,
  "cordless-screwdriver": `<rect x="180" y="360" width="360" height="70" rx="20"/><polygon points="540,360 620,395 540,430"/>`,
  "led-work-light": `<rect x="300" y="220" width="200" height="280" rx="20"/><rect x="330" y="260" width="140" height="80" fill="#fff3bf"/><rect x="370" y="500" width="60" height="80"/>`,
};

const outDir = path.join(process.cwd(), "public", "products");
await mkdir(outDir, { recursive: true });

for (const product of catalogProducts) {
  const file = path.join(outDir, `${product.slug}.webp`);
  const buffer = await sharp(Buffer.from(svg(product.slug))).webp({ quality: 82 }).toBuffer();
  await writeFile(file, buffer);
}

console.log(`Wrote ${catalogProducts.length} images to ${outDir}`);
