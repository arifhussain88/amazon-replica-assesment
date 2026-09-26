import { extraProducts } from "@/lib/catalog-more";

export type CatalogCategory = {
  slug: string;
  name: string;
  description: string;
};

export type CatalogVariant = {
  optionName: string;
  optionValue: string;
  stock: number;
  priceCents?: number;
};

export type CatalogReview = {
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

export type CatalogProduct = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  priceCents: number;
  compareAtPriceCents?: number;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: { label: string; value: string }[];
  stock: number;
  variants?: CatalogVariant[];
  reviews: CatalogReview[];
  createdAt: string;
  imageFile?: string;
};

export const catalogCategories: CatalogCategory[] = [
  { slug: "electronics", name: "Electronics", description: "Speakers, chargers, and everyday desk gear." },
  { slug: "home-kitchen", name: "Home & Kitchen", description: "Cookware, kettles, and tableware for daily use." },
  { slug: "clothing", name: "Clothing", description: "Knits, trousers, and bags made to be worn often." },
  { slug: "beauty", name: "Beauty", description: "Simple skin and hair tools with short ingredient lists." },
  { slug: "sports", name: "Sports", description: "Mats, bottles, and compact training gear." },
  { slug: "books-stationery", name: "Books & Stationery", description: "Notebooks, pens, and one novel worth finishing." },
  { slug: "toys", name: "Toys", description: "Wooden play sets and a soft animal for quiet time." },
  { slug: "travel", name: "Travel", description: "Carry-ons, packing, and a pillow for the middle seat." },
  { slug: "tools", name: "Tools & Home Improvement", description: "A small driver and a light for the jobs you actually do." },
];

export const catalogProducts: CatalogProduct[] = [
  {
    slug: "harbor-compact-speaker",
    imageFile: "bluetooth-speaker.jpg",
    name: "Portable Bluetooth Speaker",
    brand: "Lumen Audio",
    category: "electronics",
    priceCents: 4800,
    compareAtPriceCents: 6200,
    shortDescription: "A black portable speaker with a top handle, sized for a desk or a kitchen counter.",
    description:
      "This portable Bluetooth speaker has a fabric grille and a handle across the top. The body is sealed against splashes, and the controls are easy to find without looking. It is meant for a playlist in the kitchen, at a desk, or just outside.",
    features: [
      "About 12 hours of playback at moderate volume",
      "Splash-resistant shell for the sink and the patio",
      "Pairs with phones, tablets, and laptops",
      "USB-C charging, cable included",
    ],
    specifications: [
      { label: "Connectivity", value: "Bluetooth 5.3" },
      { label: "Playtime", value: "Up to 12 hours" },
      { label: "Weight", value: "340 g" },
      { label: "Charging", value: "USB-C" },
    ],
    stock: 0,
    variants: [
      { optionName: "Color", optionValue: "Black", stock: 18 },
      { optionName: "Color", optionValue: "Sand", stock: 11 },
      { optionName: "Color", optionValue: "Forest", stock: 7 },
    ],
    reviews: [
      {
        author: "Mina P.",
        rating: 5,
        title: "Loud enough for the kitchen",
        body: "I keep it by the stove. Voices stay clear and it has not slipped when my hands were wet. Demo review.",
        createdAt: "2026-07-02",
      },
      {
        author: "Owen C.",
        rating: 4,
        title: "Smaller than I expected",
        body: "The Sand color looks like the photo. Bass is modest, which is fair for the size. Demo review.",
        createdAt: "2026-08-14",
      },
    ],
    createdAt: "2026-05-02",
  },
  {
    slug: "usb-c-65w-charger",
    imageFile: "usb-c-charger.jpg",
    name: "65W USB-C Wall Charger",
    brand: "Northline",
    category: "electronics",
    priceCents: 2900,
    shortDescription: "A white 65W USB-C brick for a phone, tablet, or laptop.",
    description:
      "This white 65W USB-C charger is a compact wall brick for a nightstand or a bag. One port keeps the cable situation simple, and the body stays small beside a phone. A charging cable is sold separately.",
    features: [
      "65W USB-C Power Delivery",
      "Folding prongs for a laptop sleeve",
      "Works with phones, tablets, and many ultrabooks",
      "Charging cable sold separately",
    ],
    specifications: [
      { label: "Output", value: "5V–20V, up to 65W" },
      { label: "Port", value: "USB-C" },
      { label: "Prongs", value: "Folding, US" },
      { label: "Weight", value: "112 g" },
    ],
    stock: 42,
    reviews: [
      {
        author: "Priya S.",
        rating: 5,
        title: "Replaced two chargers",
        body: "It runs my work laptop and my phone. The brick stays cool on a desk. Demo review.",
        createdAt: "2026-06-18",
      },
      {
        author: "Evan L.",
        rating: 4,
        title: "No cable in the box",
        body: "Power is solid. Bring your own USB-C cable, which the page does say. Demo review.",
        createdAt: "2026-08-01",
      },
    ],
    createdAt: "2026-05-04",
  },
  {
    slug: "field-wireless-mouse",
    name: "Field Wireless Mouse",
    brand: "Northline",
    category: "electronics",
    priceCents: 2400,
    shortDescription: "A quiet ambidextrous mouse for a laptop bag.",
    description:
      "Field is a small wireless mouse with a quiet click and a USB receiver that stores under the battery door. It is meant for travel and shared desks, not for competitive games.",
    features: [
      "2.4 GHz receiver stores inside the mouse",
      "Quiet switches for open offices",
      "Works with either hand",
      "One AA battery included",
    ],
    specifications: [
      { label: "Connection", value: "USB receiver" },
      { label: "Sensor", value: "1600 DPI" },
      { label: "Hand", value: "Ambidextrous" },
      { label: "Battery", value: "AA, included" },
    ],
    stock: 0,
    variants: [
      { optionName: "Color", optionValue: "Graphite", stock: 20 },
      { optionName: "Color", optionValue: "White", stock: 14 },
    ],
    reviews: [
      {
        author: "Jules R.",
        rating: 4,
        title: "Quiet in a library",
        body: "Clicks are softer than my old mouse. The receiver fitting inside is the part I use most. Demo review.",
        createdAt: "2026-07-22",
      },
      {
        author: "Hannah K.",
        rating: 5,
        title: "Good size for a small hand",
        body: "White scuffs a little at the edges after a month, and I still reach for it first. Demo review.",
        createdAt: "2026-08-19",
      },
    ],
    createdAt: "2026-05-06",
  },
  {
    slug: "pour-over-kettle",
    name: "Pour-Over Kettle, 1 Liter",
    brand: "Hearth & Kiln",
    category: "home-kitchen",
    priceCents: 4200,
    shortDescription: "A gooseneck kettle with a steady pour and a stay-cool handle.",
    description:
      "This one-liter kettle is for pour-over coffee and for boiling just enough water for tea. The counterweighted handle stays comfortable, and the spout aims without wandering.",
    features: [
      "Gooseneck spout for a controlled pour",
      "One-liter mark on the inside",
      "Stay-cool handle",
      "Stovetop safe, including induction",
    ],
    specifications: [
      { label: "Capacity", value: "1.0 L" },
      { label: "Material", value: "Stainless steel" },
      { label: "Heat", value: "Stovetop, induction" },
      { label: "Lid", value: "Hinged" },
    ],
    stock: 0,
    variants: [
      { optionName: "Color", optionValue: "Stainless", stock: 12 },
      { optionName: "Color", optionValue: "Cream", stock: 9 },
      { optionName: "Color", optionValue: "Matte Black", stock: 6 },
    ],
    reviews: [
      {
        author: "Nora V.",
        rating: 5,
        title: "Pour stays where I aim it",
        body: "Cream looks warm on a white counter. It boils a mug's worth quickly. Demo review.",
        createdAt: "2026-06-09",
      },
      {
        author: "Chris A.",
        rating: 4,
        title: "Heavier than a glass kettle",
        body: "That weight is what keeps the pour steady. The lid click is firm. Demo review.",
        createdAt: "2026-08-11",
      },
    ],
    createdAt: "2026-05-08",
  },
  {
    slug: "everyday-ceramic-mug",
    imageFile: "ceramic-mug.jpg",
    name: "Everyday Ceramic Mug",
    brand: "Hearth & Kiln",
    category: "home-kitchen",
    priceCents: 1800,
    shortDescription: "A glazed ceramic mug that holds a full cup and sits steady on a table.",
    description:
      "This ceramic mug has a glossy glaze and a handle sized for one hand. It holds a full cup of coffee or tea and stands steady on a wood table. The foot is left unglazed so it does not slide on a coaster.",
    features: [
      "Glazed ceramic body",
      "Handle sized for one hand",
      "Unglazed foot",
      "Dishwasher safe",
    ],
    specifications: [
      { label: "Material", value: "Ceramic" },
      { label: "Capacity", value: "12 oz" },
      { label: "Finish", value: "Gloss glaze, unglazed foot" },
      { label: "Care", value: "Dishwasher safe" },
    ],
    stock: 0,
    variants: [
      { optionName: "Color", optionValue: "Ivory", stock: 8, priceCents: 1800 },
      { optionName: "Color", optionValue: "Stone", stock: 10, priceCents: 1800 },
      { optionName: "Color", optionValue: "Slate", stock: 5, priceCents: 2200 },
    ],
    reviews: [
      {
        author: "Leah M.",
        rating: 5,
        title: "The right size for coffee",
        body: "The handle fits a full grip. It holds a mug of coffee without feeling oversized. Demo review.",
        createdAt: "2026-07-28",
      },
      {
        author: "Samir D.",
        rating: 4,
        title: "True to the stone color",
        body: "Not bright white, which is what I wanted. The foot stays put on a wood table. Demo review.",
        createdAt: "2026-08-21",
      },
    ],
    createdAt: "2026-05-10",
  },
  {
    slug: "ten-inch-skillet",
    imageFile: "frying-pan.jpg",
    name: "Everyday Frying Pan",
    brand: "Hearth & Kiln",
    category: "home-kitchen",
    priceCents: 3400,
    shortDescription: "A black frying pan for eggs, greens, and one-pan dinners.",
    description:
      "This black frying pan is the one you leave on the front burner. The cooking surface releases eggs, and the handle stays short enough for a crowded stove. It is oven-safe to 400°F.",
    features: [
      "10-inch cooking surface",
      "Nonstick release for eggs",
      "Oven-safe to 400°F",
      "Pour spouts on both sides",
    ],
    specifications: [
      { label: "Diameter", value: "10 inches" },
      { label: "Oven", value: "To 400°F" },
      { label: "Handle", value: "Stay-cool" },
      { label: "Dishwasher", value: "Hand wash recommended" },
    ],
    stock: 24,
    reviews: [
      {
        author: "Elena G.",
        rating: 5,
        title: "Eggs slide off",
        body: "I use almost no oil. The helper handle on the far side is useful when the pan is full. Demo review.",
        createdAt: "2026-06-30",
      },
      {
        author: "Marcus T.",
        rating: 4,
        title: "Heats evenly on medium",
        body: "High heat discolors the center a bit. Medium is the right setting for this pan. Demo review.",
        createdAt: "2026-08-08",
      },
    ],
    createdAt: "2026-05-12",
  },
  {
    slug: "merino-crewneck",
    imageFile: "wool-sweater.jpg",
    name: "Knit Crewneck Sweater",
    brand: "Fieldwear",
    category: "clothing",
    priceCents: 6800,
    shortDescription: "A knit crewneck sweater you can hang between wears.",
    description:
      "This crewneck is a knit sweater with a ribbed collar, cuffs, and hem. It works as a layer when a room is cold and as a shirt when the weather is mild. The shoulders are set in, and the hem stays put.",
    features: [
      "Extra-fine merino wool",
      "Ribbed collar, cuffs, and hem",
      "Layerable weight",
      "Machine wash cold, dry flat",
    ],
    specifications: [
      { label: "Material", value: "100% merino wool" },
      { label: "Weight", value: "Midweight knit" },
      { label: "Fit", value: "Regular" },
      { label: "Care", value: "Cold wash, dry flat" },
    ],
    stock: 0,
    variants: [
      { optionName: "Size", optionValue: "XS", stock: 4 },
      { optionName: "Size", optionValue: "S", stock: 8 },
      { optionName: "Size", optionValue: "M", stock: 10 },
      { optionName: "Size", optionValue: "L", stock: 7 },
      { optionName: "Size", optionValue: "XL", stock: 3 },
    ],
    reviews: [
      {
        author: "Adele F.",
        rating: 5,
        title: "Wore it on a flight",
        body: "Size S matches the chart. It did not itch at the neck, which is why I bought merino. Demo review.",
        createdAt: "2026-07-11",
      },
      {
        author: "Benito H.",
        rating: 4,
        title: "Warm, not bulky",
        body: "XL has room through the chest. A pill showed up on the sleeve after a backpack strap. Demo review.",
        createdAt: "2026-08-16",
      },
    ],
    createdAt: "2026-05-14",
  },
  {
    slug: "everyday-chinos",
    name: "Everyday Chinos",
    brand: "Fieldwear",
    category: "clothing",
    priceCents: 5400,
    shortDescription: "Straight-leg cotton chinos with a bit of stretch.",
    description:
      "These chinos are cut straight, with stretch where you sit and pockets that survive a phone and a key. They are the pair you can wear to work and to dinner without changing.",
    features: [
      "Cotton twill with stretch",
      "Straight leg",
      "Zip fly and hook closure",
      "Machine washable",
    ],
    specifications: [
      { label: "Material", value: "97% cotton, 3% elastane" },
      { label: "Rise", value: "Mid" },
      { label: "Leg", value: "Straight" },
      { label: "Inseam", value: "30 inches, unhemmed note on the tag" },
    ],
    stock: 0,
    variants: [
      { optionName: "Size", optionValue: "30", stock: 6 },
      { optionName: "Size", optionValue: "32", stock: 9 },
      { optionName: "Size", optionValue: "34", stock: 8 },
      { optionName: "Size", optionValue: "36", stock: 4 },
    ],
    reviews: [
      {
        author: "Grace Y.",
        rating: 4,
        title: "Size 32 fit as expected",
        body: "Waist is true. I would hem them if you are under 5'9\". Demo review.",
        createdAt: "2026-07-19",
      },
      {
        author: "Idris N.",
        rating: 5,
        title: "Survived a commute",
        body: "The stretch is noticeable when I bike to the train. Color stayed even after three washes. Demo review.",
        createdAt: "2026-08-25",
      },
    ],
    createdAt: "2026-05-16",
  },
  {
    slug: "canvas-market-tote",
    imageFile: "canvas-tote.jpg",
    name: "Canvas Market Tote",
    brand: "Fieldwear",
    category: "clothing",
    priceCents: 2800,
    shortDescription: "A white canvas tote with a flat bottom and an inside pocket.",
    description:
      "This market tote is sewn from heavy white canvas and stands up when you set it down. The body is unlined except for a small pocket sized for a phone. The straps are long enough to sit on a shoulder.",
    features: [
      "Heavy cotton canvas",
      "Flat base so it stands",
      "Interior slip pocket",
      "Shoulder-length straps",
    ],
    specifications: [
      { label: "Material", value: "16 oz cotton canvas" },
      { label: "Size", value: "15 x 14 x 6 inches" },
      { label: "Pocket", value: "Interior slip" },
      { label: "Closure", value: "Open top" },
    ],
    stock: 0,
    variants: [
      { optionName: "Color", optionValue: "Natural", stock: 15 },
      { optionName: "Color", optionValue: "Ink", stock: 10 },
      { optionName: "Color", optionValue: "Olive", stock: 8 },
    ],
    reviews: [
      {
        author: "Ruth B.",
        rating: 5,
        title: "Holds a week's farmers market",
        body: "Olive hides dirt. The base kept cherry tomatoes from rolling into a point. Demo review.",
        createdAt: "2026-06-21",
      },
      {
        author: "Theo W.",
        rating: 4,
        title: "Straps are comfortable",
        body: "Natural canvas creases, which looks right. I wish the pocket had a zipper. Demo review.",
        createdAt: "2026-08-03",
      },
    ],
    createdAt: "2026-05-18",
  },
  {
    slug: "daily-moisturizer",
    imageFile: "face-cream.jpg",
    name: "Daily Face Cream",
    brand: "Bramble",
    category: "beauty",
    priceCents: 1800,
    shortDescription: "An unscented cream in an open jar, for morning under sunscreen.",
    description:
      "This face cream is an unscented blend of glycerin and shea, packed in a jar. The cream is white, absorbs without a film, and sits under sunscreen. Two jar sizes let you try it before the larger one.",
    features: [
      "Unscented",
      "Glycerin and shea butter",
      "Sits well under sunscreen",
      "Two sizes",
    ],
    specifications: [
      { label: "Skin", value: "All, including sensitive" },
      { label: "Scent", value: "None" },
      { label: "Use", value: "Morning and night" },
      { label: "Origin", value: "Filled for Bramble" },
    ],
    stock: 0,
    variants: [
      { optionName: "Size", optionValue: "50 ml", stock: 22, priceCents: 1800 },
      { optionName: "Size", optionValue: "100 ml", stock: 16, priceCents: 2800 },
    ],
    reviews: [
      {
        author: "Camille J.",
        rating: 5,
        title: "No scent, no sting",
        body: "The 50 ml jar lasted me six weeks of morning use. It does not pill under my sunscreen. Demo review.",
        createdAt: "2026-07-05",
      },
      {
        author: "Andre Q.",
        rating: 4,
        title: "Light, not a night cream",
        body: "In winter I still want something heavier at night. For daytime it is exactly enough. Demo review.",
        createdAt: "2026-08-18",
      },
    ],
    createdAt: "2026-05-20",
  },
  {
    slug: "ceramic-round-brush",
    name: "Ceramic Round Brush",
    brand: "Bramble",
    category: "beauty",
    priceCents: 2200,
    shortDescription: "A medium round brush for a smooth blow-dry.",
    description:
      "The barrel is ceramic so it holds heat from the dryer, and the bristles have rounded tips. A medium diameter suits hair that falls around the shoulders.",
    features: [
      "Ceramic barrel",
      "Rounded bristle tips",
      "Medium diameter",
      "Sectioning tail on the handle",
    ],
    specifications: [
      { label: "Barrel", value: "1.7 inch ceramic" },
      { label: "Bristles", value: "Nylon, rounded" },
      { label: "Handle", value: "Vented grip" },
      { label: "Use", value: "Blow-dry" },
    ],
    stock: 19,
    reviews: [
      {
        author: "Sofia L.",
        rating: 4,
        title: "Does not snag",
        body: "Tips are gentler than my old metal brush. The barrel gets hot, so I keep it moving. Demo review.",
        createdAt: "2026-06-27",
      },
      {
        author: "June P.",
        rating: 5,
        title: "Right size for a bob",
        body: "I get a curve at the ends without a round-brush struggle. The tail actually parts hair. Demo review.",
        createdAt: "2026-08-09",
      },
    ],
    createdAt: "2026-05-22",
  },
  {
    slug: "studio-yoga-mat",
    imageFile: "yoga-mat.jpg",
    name: "Studio Yoga Mat",
    brand: "Kinfield",
    category: "sports",
    priceCents: 3800,
    shortDescription: "A blue 5mm mat with a textured top that stays put on hard floors.",
    description:
      "This blue studio mat is thick enough for knees on a hard floor. The textured top stays put through a full stretch, and the closed-cell surface wipes clean. A carrying strap is included.",
    features: [
      "5mm cushion",
      "Textured non-slip top",
      "Closed-cell surface, wipes clean",
      "Strap included",
    ],
    specifications: [
      { label: "Thickness", value: "5 mm" },
      { label: "Size", value: "72 x 24 inches" },
      { label: "Material", value: "TPE" },
      { label: "Strap", value: "Included" },
    ],
    stock: 0,
    variants: [
      { optionName: "Color", optionValue: "Midnight", stock: 11 },
      { optionName: "Color", optionValue: "Sage", stock: 9 },
      { optionName: "Color", optionValue: "Clay", stock: 6 },
    ],
    reviews: [
      {
        author: "Helen S.",
        rating: 5,
        title: "Stays on a wood floor",
        body: "Sage is close to the photo. Downward dog does not walk the mat across the room. Demo review.",
        createdAt: "2026-07-08",
      },
      {
        author: "Victor M.",
        rating: 4,
        title: "Cushion is enough",
        body: "Knees are fine on this thickness. It has a rubber smell for the first day, then it fades. Demo review.",
        createdAt: "2026-08-22",
      },
    ],
    createdAt: "2026-05-24",
  },
  {
    slug: "insulated-bottle",
    imageFile: "water-bottle.jpg",
    name: "Insulated Water Bottle",
    brand: "Kinfield",
    category: "sports",
    priceCents: 2800,
    shortDescription: "A powder-coated stainless bottle that keeps water cold.",
    description:
      "This insulated bottle is stainless steel with a powder-coated finish, in the everyday colors you see lined up on a counter. Double walls keep water cold through a commute or a workout. The mouth is wide enough for ice.",
    features: [
      "20 oz double-wall stainless",
      "Cold for about 18 hours",
      "Spout lid",
      "Fits most cup holders",
    ],
    specifications: [
      { label: "Capacity", value: "20 oz" },
      { label: "Cold", value: "Up to 18 hours" },
      { label: "Material", value: "Stainless steel" },
      { label: "Lid", value: "Spout, leak resistant" },
    ],
    stock: 0,
    variants: [
      { optionName: "Color", optionValue: "Steel", stock: 16 },
      { optionName: "Color", optionValue: "Ocean", stock: 12 },
      { optionName: "Color", optionValue: "Blush", stock: 7 },
    ],
    reviews: [
      {
        author: "Kara D.",
        rating: 5,
        title: "Still cold at pickup",
        body: "Filled it at 7 and the water was cold after school pickup. Ocean color is darker than sky blue. Demo review.",
        createdAt: "2026-06-15",
      },
      {
        author: "Luis F.",
        rating: 4,
        title: "Lid seals if you click it",
        body: "I had one drip before I learned the spout has to snap. No issue in a bag since then. Demo review.",
        createdAt: "2026-08-05",
      },
    ],
    createdAt: "2026-05-26",
  },
  {
    slug: "speed-jump-rope",
    name: "Speed Jump Rope",
    brand: "Kinfield",
    category: "sports",
    priceCents: 1600,
    shortDescription: "A ball-bearing rope with cables you can shorten.",
    description:
      "A speed rope for short sessions at home. The cable is coated so it does not sting, the handles spin on bearings, and the length adjusts without a tool.",
    features: [
      "Ball-bearing handles",
      "Coated steel cable",
      "Adjustable length",
      "Carry pouch included",
    ],
    specifications: [
      { label: "Cable", value: "Coated steel" },
      { label: "Handles", value: "Aluminum, bearings" },
      { label: "Length", value: "Adjustable to about 10 feet" },
      { label: "Use", value: "Indoor or outdoor" },
    ],
    stock: 4,
    reviews: [
      {
        author: "Nina E.",
        rating: 5,
        title: "Easy to shorten",
        body: "I cut it to my height using the included screws. The spin is smooth from the first session. Demo review.",
        createdAt: "2026-07-16",
      },
      {
        author: "Paul G.",
        rating: 3,
        title: "Handles run small",
        body: "The rope is fast. My hands are large and the grips feel short after ten minutes. Demo review.",
        createdAt: "2026-08-27",
      },
    ],
    createdAt: "2026-05-28",
  },
  {
    slug: "lined-notebook-pack",
    name: "Lined Notebook, 3-Pack",
    brand: "Paper North",
    category: "books-stationery",
    priceCents: 1400,
    shortDescription: "Three A5 notebooks with lay-flat binding and pale gray lines.",
    description:
      "A pack of three sewn notebooks for lists, class notes, and a journal you are willing to finish. The paper is thick enough for a gel pen, and the covers are plain card.",
    features: [
      "Three A5 notebooks",
      "Sewn lay-flat binding",
      "Pale gray lines",
      "80 sheets each",
    ],
    specifications: [
      { label: "Size", value: "A5" },
      { label: "Paper", value: "90 gsm, lined" },
      { label: "Count", value: "3 notebooks" },
      { label: "Cover", value: "Card, unprinted" },
    ],
    stock: 30,
    reviews: [
      {
        author: "Ivy T.",
        rating: 5,
        title: "Pen does not bleed",
        body: "I use the gel pens from this shop. No show-through on the back of the page. Demo review.",
        createdAt: "2026-06-12",
      },
      {
        author: "Malik R.",
        rating: 4,
        title: "Covers scuff",
        body: "The paper is the reason to buy them. The kraft cover marks if it lives in a backpack. Demo review.",
        createdAt: "2026-08-13",
      },
    ],
    createdAt: "2026-06-01",
  },
  {
    slug: "the-salt-market",
    imageFile: "hardcover-book.jpg",
    name: "Clothbound Hardcover Novel",
    brand: "Paper North",
    category: "books-stationery",
    priceCents: 1800,
    shortDescription: "A clothbound hardcover novel, closed, with no dust jacket.",
    description:
      "This is a clothbound hardcover novel, shown closed on a wooden table. The binding is sewn, the pages are cream, and there is no dust jacket. It is the kind of book you leave on a side table between chapters.",
    features: [
      "Clothbound hardcover",
      "Sewn binding",
      "320 pages",
      "No dust jacket",
    ],
    specifications: [
      { label: "Format", value: "Hardcover" },
      { label: "Pages", value: "320" },
      { label: "Language", value: "English" },
      { label: "Cover", value: "Cloth, no jacket" },
    ],
    stock: 17,
    reviews: [
      {
        author: "Dorothy H.",
        rating: 5,
        title: "Read it in two sittings",
        body: "The cloth cover is pleasant to hold. I left it on the table and picked it up again the next night. Demo review.",
        createdAt: "2026-07-25",
      },
      {
        author: "Felix A.",
        rating: 4,
        title: "Slow first chapter",
        body: "The story starts quietly. Once it does, I kept the book in my bag. Demo review.",
        createdAt: "2026-08-20",
      },
    ],
    createdAt: "2026-06-03",
  },
  {
    slug: "gel-pen-pack",
    imageFile: "gel-pens.jpg",
    name: "Pastel Gel Pen Set",
    brand: "Paper North",
    category: "books-stationery",
    priceCents: 1200,
    shortDescription: "Four capped gel pens in soft pastel colors.",
    description:
      "A set of four pastel gel pens with capped barrels. The inks write smoothly on notebook paper, and the colors stay soft rather than neon. They live in a pencil cup or a bag pocket.",
    features: [
      "0.5 mm gel tips",
      "Four pastel colors",
      "Capped barrels",
      "Smooth first stroke",
    ],
    specifications: [
      { label: "Tip", value: "0.5 mm" },
      { label: "Ink", value: "Gel, water-based" },
      { label: "Count", value: "4" },
      { label: "Barrel", value: "Capped" },
    ],
    stock: 36,
    reviews: [
      {
        author: "Yara C.",
        rating: 5,
        title: "Navy is the one I steal back",
        body: "They start immediately. The terracotta is readable, not neon. Demo review.",
        createdAt: "2026-06-24",
      },
      {
        author: "Elliot S.",
        rating: 4,
        title: "Fine for left-handed writing",
        body: "Smear is low if I give it a second. Gray is lighter than I expected. Demo review.",
        createdAt: "2026-08-06",
      },
    ],
    createdAt: "2026-06-05",
  },
  {
    slug: "wooden-block-set",
    imageFile: "wooden-toy-robot.jpg",
    name: "Wooden Toy Robot",
    brand: "Little Yard",
    category: "toys",
    priceCents: 2400,
    shortDescription: "A small wooden robot with eased edges, for a shelf or a table.",
    description:
      "This wooden toy robot has a blocky body and rounded edges. The wood is sanded smooth, the colors are muted, and there are no electronic parts. It can sit on a shelf or come apart in quiet play.",
    features: [
      "Solid wood body",
      "Eased edges",
      "Muted finish",
      "No electronic parts",
    ],
    specifications: [
      { label: "Material", value: "Wood" },
      { label: "Finish", value: "Sanded, muted color" },
      { label: "Parts", value: "No electronics" },
      { label: "Age", value: "3 years and up" },
    ],
    stock: 13,
    reviews: [
      {
        author: "Patricia N.",
        rating: 5,
        title: "Smooth edges",
        body: "I ran a hand over the wood. Nothing snags, and it sits on a shelf between play. Demo review.",
        createdAt: "2026-07-03",
      },
      {
        author: "Jon K.",
        rating: 4,
        title: "A quiet toy",
        body: "The pieces come apart on the table and go back together without a fight. We keep it out where it can be seen. Demo review.",
        createdAt: "2026-08-15",
      },
    ],
    createdAt: "2026-06-07",
  },
  {
    slug: "plush-fox",
    name: "Plush Fox",
    brand: "Little Yard",
    category: "toys",
    priceCents: 2000,
    shortDescription: "A palm-sized fox in washed cotton with embroidered features.",
    description:
      "A small fox stuffed with recycled fill. The face is embroidered, there are no loose parts, and the cotton shell can be spot cleaned. It is meant to be carried around the house.",
    features: [
      "Embroidered eyes and nose",
      "Washed cotton shell",
      "Recycled fill",
      "Spot clean",
    ],
    specifications: [
      { label: "Height", value: "9 inches" },
      { label: "Shell", value: "Cotton" },
      { label: "Fill", value: "Recycled polyester" },
      { label: "Age", value: "1 year and up" },
    ],
    stock: 3,
    reviews: [
      {
        author: "Amelia W.",
        rating: 5,
        title: "Came on the school run",
        body: "It is small enough for a coat pocket. The rust color is soft, not cartoon-bright. Demo review.",
        createdAt: "2026-07-14",
      },
      {
        author: "Greg B.",
        rating: 4,
        title: "Stitching is tidy",
        body: "Seams are straight. I would not machine wash it, and the page does not ask you to. Demo review.",
        createdAt: "2026-08-23",
      },
    ],
    createdAt: "2026-06-09",
  },
  {
    slug: "carry-on-spinner",
    imageFile: "carry-on-suitcase.jpg",
    name: "Hard-Shell Carry-On",
    brand: "Wayline",
    category: "travel",
    priceCents: 12800,
    compareAtPriceCents: 16000,
    shortDescription: "A silver hard-shell spinner sized for an overhead bin.",
    description:
      "This hard-shell carry-on is a silver spinner sized for overhead bins on most domestic flights. Four wheels and a telescoping handle make it easy to roll across a tile floor. The shell is polycarbonate and the empty case stays under seven pounds.",
    features: [
      "21-inch overhead size",
      "Four spinner wheels",
      "Front organizer pocket",
      "Expansion zipper adds 1.5 inches",
    ],
    specifications: [
      { label: "Size", value: "21 x 14 x 9 inches" },
      { label: "Shell", value: "Polycarbonate" },
      { label: "Weight", value: "6.6 lb" },
      { label: "Warranty", value: "5 years, demo policy" },
    ],
    stock: 0,
    variants: [
      { optionName: "Color", optionValue: "Graphite", stock: 6 },
      { optionName: "Color", optionValue: "Navy", stock: 5 },
      { optionName: "Color", optionValue: "Sand", stock: 4 },
    ],
    reviews: [
      {
        author: "Helena J.",
        rating: 5,
        title: "Fit the bin wheels-first",
        body: "Navy hid scuffs from a tight connection. The front pocket took a sweater on the way home. Demo review.",
        createdAt: "2026-06-29",
      },
      {
        author: "Omar E.",
        rating: 4,
        title: "Wheels are quiet",
        body: "Handle locks at two heights. Sand shows dirt faster than graphite would. Demo review.",
        createdAt: "2026-08-17",
      },
    ],
    createdAt: "2026-06-11",
  },
  {
    slug: "packing-cube-set",
    name: "Packing Cube Set",
    brand: "Wayline",
    category: "travel",
    priceCents: 2400,
    shortDescription: "Four mesh cubes that compress a week of clothes.",
    description:
      "A set of four packing cubes in two sizes. Mesh tops let you see what you packed, and the zippers have fabric pulls you can find in a dark hotel room.",
    features: [
      "Two large and two small cubes",
      "Mesh lids",
      "Double zippers",
      "Fits the Wayline carry-on",
    ],
    specifications: [
      { label: "Pieces", value: "4" },
      { label: "Fabric", value: "Ripstop nylon" },
      { label: "Largest", value: "14 x 10 x 4 inches" },
      { label: "Smallest", value: "10 x 7 x 3 inches" },
    ],
    stock: 21,
    reviews: [
      {
        author: "Bianca F.",
        rating: 5,
        title: "Shoes got their own cube",
        body: "The small cubes are the right size for a pair of shoes and a toiletry bag. Zippers did not snag. Demo review.",
        createdAt: "2026-07-07",
      },
      {
        author: "Colin R.",
        rating: 4,
        title: "Mesh is see-through",
        body: "Helpful, and also why I put the laundry cube at the bottom. They pack flat when empty. Demo review.",
        createdAt: "2026-08-12",
      },
    ],
    createdAt: "2026-06-13",
  },
  {
    slug: "neck-pillow",
    name: "Memory Foam Neck Pillow",
    brand: "Wayline",
    category: "travel",
    priceCents: 1900,
    shortDescription: "A supportive neck pillow with a washable cover and a snap.",
    description:
      "Memory foam holds its curve in an upright seat. The cover unzips for washing, and a snap lets you wear it as a loop or leave it open.",
    features: [
      "Memory foam core",
      "Washable cover",
      "Snap closure",
      "Compresses into its stuff sack",
    ],
    specifications: [
      { label: "Fill", value: "Memory foam" },
      { label: "Cover", value: "Jersey, removable" },
      { label: "Closure", value: "Snap" },
      { label: "Sack", value: "Included" },
    ],
    stock: 0,
    variants: [
      { optionName: "Color", optionValue: "Gray", stock: 14 },
      { optionName: "Color", optionValue: "Navy", stock: 9 },
    ],
    reviews: [
      {
        author: "Simone K.",
        rating: 4,
        title: "Better than inflatable",
        body: "It holds shape on a red-eye. The sack is tight, which is the point. Demo review.",
        createdAt: "2026-07-21",
      },
      {
        author: "Walter J.",
        rating: 5,
        title: "Cover washed well",
        body: "Navy did not fade. The snap is strong enough that it stayed closed while I slept. Demo review.",
        createdAt: "2026-08-26",
      },
    ],
    createdAt: "2026-06-15",
  },
  {
    slug: "cordless-screwdriver",
    imageFile: "cordless-drill.jpg",
    name: "Cordless Drill Driver",
    brand: "Benchline",
    category: "tools",
    priceCents: 5900,
    shortDescription: "A black and red cordless drill for furniture, shelves, and household jobs.",
    description:
      "This cordless drill driver has a black and red body and a pistol grip you can hold overhead. The chuck takes standard hex bits, and the tool is light enough for furniture and shelves. It is not meant for concrete or deck framing.",
    features: [
      "Pistol grip",
      "Forward and reverse",
      "1/4 inch hex chuck",
      "Optional 32-piece bit set",
    ],
    specifications: [
      { label: "Charge", value: "USB-C, about 90 minutes" },
      { label: "Torque", value: "Household assembly" },
      { label: "Chuck", value: "1/4 inch hex" },
      { label: "Light", value: "LED" },
    ],
    stock: 0,
    variants: [
      { optionName: "Configuration", optionValue: "Tool only", stock: 12, priceCents: 5900 },
      { optionName: "Configuration", optionValue: "Tool + 32-bit set", stock: 8, priceCents: 7400 },
    ],
    reviews: [
      {
        author: "Rita D.",
        rating: 5,
        title: "Built a bookcase",
        body: "The bit set version had the hex bits the instructions asked for. Charge lasted the whole project. Demo review.",
        createdAt: "2026-06-20",
      },
      {
        author: "Steve L.",
        rating: 4,
        title: "Not for masonry",
        body: "It is honest about being a household driver. USB-C means I did not hunt for a special charger. Demo review.",
        createdAt: "2026-08-04",
      },
    ],
    createdAt: "2026-06-17",
  },
  {
    slug: "led-work-light",
    name: "LED Work Light",
    brand: "Benchline",
    category: "tools",
    priceCents: 2200,
    shortDescription: "A rechargeable light with a stand and a hook.",
    description:
      "A work light for under the sink, the back of a closet, or a fuse box. Choose the compact beam or the wider panel. Both hang from a hook and stand on their own.",
    features: [
      "Rechargeable USB-C",
      "Hook and standing base",
      "Two beam widths",
      "About 6 hours on low",
    ],
    specifications: [
      { label: "Power", value: "USB-C rechargeable" },
      { label: "Runtime", value: "Up to 6 hours on low" },
      { label: "Mount", value: "Hook and base" },
      { label: "Body", value: "Impact-resistant plastic" },
    ],
    stock: 0,
    variants: [
      { optionName: "Configuration", optionValue: "Compact", stock: 15, priceCents: 2200 },
      { optionName: "Configuration", optionValue: "Wide beam", stock: 10, priceCents: 2900 },
    ],
    reviews: [
      {
        author: "Gail P.",
        rating: 5,
        title: "Hooked it under the sink",
        body: "The compact beam is plenty for plumbing. It did not roll off the cabinet floor. Demo review.",
        createdAt: "2026-07-09",
      },
      {
        author: "Harvey C.",
        rating: 4,
        title: "Wide beam for the garage",
        body: "I can see the whole workbench. The battery meter is a little optimistic near the end. Demo review.",
        createdAt: "2026-08-28",
      },
    ],
    createdAt: "2026-06-19",
  },
  ...extraProducts,
];

export function variantLabel(optionName: string, optionValue: string) {
  return `${optionName}: ${optionValue}`;
}

export function slugifyOption(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ratingFromReviews(reviews: CatalogReview[]) {
  if (reviews.length === 0) return { ratingTimes10: 0, ratingCount: 0 };
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    ratingTimes10: Math.round((total / reviews.length) * 10),
    ratingCount: reviews.length,
  };
}

export function lowestPriceCents(product: CatalogProduct) {
  const variantPrices = (product.variants ?? [])
    .map((variant) => variant.priceCents)
    .filter((price): price is number => typeof price === "number");
  if (variantPrices.length === 0) return product.priceCents;
  return Math.min(product.priceCents, ...variantPrices);
}
