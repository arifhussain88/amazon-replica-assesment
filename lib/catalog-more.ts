import type { CatalogProduct, CatalogReview } from "@/lib/catalog";

function reviews(first: Omit<CatalogReview, "createdAt">, second: Omit<CatalogReview, "createdAt">): CatalogReview[] {
  return [
    { ...first, body: `${first.body} Demo review.`, createdAt: "2026-07-02" },
    { ...second, body: `${second.body} Demo review.`, createdAt: "2026-08-14" },
  ];
}

export const extraProducts: CatalogProduct[] = [
  {
    slug: "usb-c-hub",
    name: "USB-C 6-in-1 Hub",
    brand: "Northline",
    category: "electronics",
    priceCents: 3600,
    shortDescription: "A slim hub for a laptop that only has two ports.",
    description:
      "One HDMI, two USB-A ports, a USB-C pass-through, and a card slot. The aluminum body stays cool on a desk, and the cable is short enough to stay in a sleeve.",
    features: ["HDMI up to 4K", "Two USB-A ports", "USB-C pass-through charging", "Short attached cable"],
    specifications: [
      { label: "Ports", value: "HDMI, 2× USB-A, USB-C, SD" },
      { label: "Cable", value: "15 cm attached" },
      { label: "Body", value: "Aluminum" },
      { label: "Use", value: "Laptops and tablets" },
    ],
    stock: 18,
    reviews: reviews(
      { author: "Nadia K.", rating: 5, title: "Stays on the desk", body: "The cable is short, so the hub does not dangle off the table." },
      { author: "Owen P.", rating: 4, title: "Warm, not hot", body: "It warms during a long call and never throttled the drive I plugged in." },
    ),
    createdAt: "2026-06-20",
  },
  {
    slug: "cotton-kitchen-towels",
    name: "Cotton Kitchen Towels, 4-Pack",
    brand: "Hearth & Kiln",
    category: "home-kitchen",
    priceCents: 1600,
    shortDescription: "Absorbent towels that dry flat and do not smell musty.",
    description:
      "A four-pack of cotton terry towels with a hanging loop. They get softer after a wash and the hem stays flat in the drawer.",
    features: ["100% cotton terry", "Hanging loop", "Washer and dryer safe", "Four towels"],
    specifications: [
      { label: "Size", value: "18 × 28 in" },
      { label: "Material", value: "Cotton terry" },
      { label: "Pack", value: "4" },
      { label: "Care", value: "Machine wash" },
    ],
    stock: 0,
    variants: [
      { optionName: "Color", optionValue: "Oat", stock: 14 },
      { optionName: "Color", optionValue: "Ink", stock: 11 },
    ],
    reviews: reviews(
      { author: "Helen M.", rating: 5, title: "Actually dry", body: "They pull water off a skillet instead of smearing it." },
      { author: "Chris L.", rating: 4, title: "Loops are useful", body: "I hang them on the oven handle. Ink shows flour, which I do not mind." },
    ),
    createdAt: "2026-06-21",
  },
  {
    slug: "merino-beanie",
    name: "Merino Beanie",
    brand: "Fieldwear",
    category: "clothing",
    priceCents: 2400,
    shortDescription: "A light merino hat that fits under a coat hood.",
    description:
      "Fine merino, folded once at the brim. It is warm without the bulk of a fleece hat, and it does not itch at the forehead.",
    features: ["Fine merino", "Single fold brim", "Fits under a hood", "Hand wash"],
    specifications: [
      { label: "Material", value: "100% merino" },
      { label: "Fit", value: "One size" },
      { label: "Care", value: "Hand wash cold" },
      { label: "Season", value: "Cool weather" },
    ],
    stock: 0,
    variants: [
      { optionName: "Color", optionValue: "Charcoal", stock: 12 },
      { optionName: "Color", optionValue: "Camel", stock: 9 },
    ],
    reviews: reviews(
      { author: "Priya N.", rating: 5, title: "No itch", body: "I wore it on a windy commute and my forehead was fine." },
      { author: "Mark S.", rating: 4, title: "Light warmth", body: "Not a ski hat. Perfect for a coat that already has a hood." },
    ),
    createdAt: "2026-06-22",
  },
  {
    slug: "unscented-lip-balm",
    name: "Unscented Lip Balm",
    brand: "Bramble",
    category: "beauty",
    priceCents: 600,
    shortDescription: "A plain balm in a tin, with no flavor or shine.",
    description:
      "Beeswax and oil in a flat tin that lives in a pocket. There is no mint, no tint, and no stick that snaps in a bag.",
    features: ["No scent or flavor", "Tin, not a stick", "Beeswax and oil", "Pocket size"],
    specifications: [
      { label: "Size", value: "10 g tin" },
      { label: "Scent", value: "None" },
      { label: "Use", value: "Lips and dry patches" },
      { label: "Origin", value: "Filled for Bramble" },
    ],
    stock: 40,
    reviews: reviews(
      { author: "Lena R.", rating: 5, title: "Stays in the tin", body: "It does not melt into my coat pocket the way a stick did." },
      { author: "Jonah F.", rating: 4, title: "Plain in a good way", body: "No tingle. I use a fingertip and that is enough." },
    ),
    createdAt: "2026-06-23",
  },
  {
    slug: "shea-hand-cream",
    name: "Shea Hand Cream",
    brand: "Bramble",
    category: "beauty",
    priceCents: 1200,
    shortDescription: "A thick cream for hands that get washed all day.",
    description:
      "Shea and glycerin in a tube that does not leak in a bag. It absorbs enough to type afterward, and it is unscented.",
    features: ["Unscented", "Shea and glycerin", "Tube with a cap", "Not greasy after a minute"],
    specifications: [
      { label: "Size", value: "50 ml" },
      { label: "Scent", value: "None" },
      { label: "Skin", value: "Hands" },
      { label: "Use", value: "After washing" },
    ],
    stock: 26,
    reviews: reviews(
      { author: "Amina D.", rating: 5, title: "I can type after", body: "It feels rich for a minute, then my keyboard is fine." },
      { author: "Paul H.", rating: 4, title: "No perfume", body: "I wanted something without a scent and this is it." },
    ),
    createdAt: "2026-06-24",
  },
  {
    slug: "ankle-weights",
    name: "Soft Ankle Weights, Pair",
    brand: "Kinfield",
    category: "sports",
    priceCents: 2800,
    shortDescription: "A two-pound pair with a wide strap that stays put.",
    description:
      "Each cuff is one pound, with a wide hook-and-loop strap. The fill does not slide to one side when you walk.",
    features: ["1 lb each", "Wide strap", "Soft shell", "Sold as a pair"],
    specifications: [
      { label: "Weight", value: "1 lb per cuff" },
      { label: "Closure", value: "Hook and loop" },
      { label: "Use", value: "Walks and floor work" },
      { label: "Pack", value: "Pair" },
    ],
    stock: 15,
    reviews: reviews(
      { author: "Grace T.", rating: 4, title: "Does not slide", body: "The strap is wide enough that it stays above my shoe." },
      { author: "Eli V.", rating: 5, title: "Quiet on the floor", body: "No sand shift and no clank. I use them for slow walks." },
    ),
    createdAt: "2026-06-25",
  },
  {
    slug: "weekly-planner",
    name: "Undated Weekly Planner",
    brand: "Paper North",
    category: "books-stationery",
    priceCents: 1600,
    shortDescription: "A lay-flat weekly notebook you start on any Monday.",
    description:
      "Twelve undated weeks, a notes page beside each, and a lay-flat binding. The paper takes a gel pen without bleeding through.",
    features: ["Undated, start anytime", "Lay-flat binding", "Notes page each week", "Takes gel ink"],
    specifications: [
      { label: "Pages", value: "12 weeks" },
      { label: "Size", value: "A5" },
      { label: "Paper", value: "90 gsm" },
      { label: "Cover", value: "Soft linen" },
    ],
    stock: 22,
    reviews: reviews(
      { author: "Maya C.", rating: 5, title: "Started mid-year", body: "I did not waste pages waiting for January." },
      { author: "Dean L.", rating: 4, title: "Pen does not ghost", body: "My gel pen stays on the page. The cover scuffs, which is fine." },
    ),
    createdAt: "2026-06-26",
  },
  {
    slug: "wooden-animal-puzzle",
    name: "Wooden Animal Puzzle",
    brand: "Little Yard",
    category: "toys",
    priceCents: 1800,
    shortDescription: "Six chunky animal pieces with knobs sized for small hands.",
    description:
      "A birch board with six animals. The knobs are large, the paint is water-based, and the pieces are thick enough not to snap.",
    features: ["Six animals", "Large knobs", "Water-based paint", "Birch board"],
    specifications: [
      { label: "Pieces", value: "6" },
      { label: "Material", value: "Birch" },
      { label: "Finish", value: "Water-based paint" },
      { label: "Age", value: "18 months and up" },
    ],
    stock: 17,
    reviews: reviews(
      { author: "Rosa G.", rating: 5, title: "Knobs are easy", body: "My toddler can lift the cow without pinching a finger." },
      { author: "Ian B.", rating: 4, title: "Paint has held up", body: "A month of chewing the edges and the color is still on." },
    ),
    createdAt: "2026-06-27",
  },
  {
    slug: "soft-play-balls",
    name: "Soft Play Balls, 6-Pack",
    brand: "Little Yard",
    category: "toys",
    priceCents: 1400,
    shortDescription: "Cloth balls that are quiet on a wood floor.",
    description:
      "Six palm-sized balls in cotton covers. They roll, they do not sting, and they wash in a mesh bag.",
    features: ["Six balls", "Cotton covers", "Quiet on wood floors", "Machine washable"],
    specifications: [
      { label: "Size", value: "3 in" },
      { label: "Pack", value: "6" },
      { label: "Cover", value: "Cotton" },
      { label: "Care", value: "Mesh bag, gentle wash" },
    ],
    stock: 20,
    reviews: reviews(
      { author: "Nina S.", rating: 5, title: "No dents in the floor", body: "They bounce a little and do not mark the wood." },
      { author: "Carl J.", rating: 4, title: "Easy to wash", body: "One went outside. The mesh bag wash brought it back." },
    ),
    createdAt: "2026-06-28",
  },
  {
    slug: "toiletry-pouch",
    name: "Hanging Toiletry Pouch",
    brand: "Wayline",
    category: "travel",
    priceCents: 2200,
    shortDescription: "A hook-and-zip pouch that hangs on a hotel hook.",
    description:
      "The hook folds flat, the main compartment is clear at the front, and a zip pocket holds a toothbrush. It is sized for a carry-on, not a full cabinet.",
    features: ["Fold-flat hook", "Clear front panel", "Zip pocket", "Carry-on size"],
    specifications: [
      { label: "Size", value: "9 × 7 × 3 in" },
      { label: "Hook", value: "Folds flat" },
      { label: "Material", value: "Coated nylon" },
      { label: "Use", value: "Overnight and carry-on" },
    ],
    stock: 0,
    variants: [
      { optionName: "Color", optionValue: "Slate", stock: 10 },
      { optionName: "Color", optionValue: "Sand", stock: 8 },
    ],
    reviews: reviews(
      { author: "Eva M.", rating: 5, title: "Hook actually holds", body: "It stayed on a thin hotel hook with a full bottle inside." },
      { author: "Luis A.", rating: 4, title: "Fits a weekend", body: "Not for a week of bottles. Perfect for two nights." },
    ),
    createdAt: "2026-06-29",
  },
  {
    slug: "tape-measure",
    name: "16-Foot Tape Measure",
    brand: "Benchline",
    category: "tools",
    priceCents: 1200,
    shortDescription: "A compact tape with a lock that stays where you set it.",
    description:
      "Sixteen feet, a belt clip, and a lock that does not creep. The blade is marked in inches on both edges so you can read it from either side.",
    features: ["16 ft blade", "Lock that holds", "Belt clip", "Inch marks on both edges"],
    specifications: [
      { label: "Length", value: "16 ft" },
      { label: "Blade", value: "1 in wide" },
      { label: "Case", value: "Rubber grip" },
      { label: "Clip", value: "Belt clip" },
    ],
    stock: 24,
    reviews: reviews(
      { author: "Harvey D.", rating: 5, title: "Lock does not slip", body: "I can set it and walk to the other end of a shelf." },
      { author: "Rita K.", rating: 4, title: "Readable", body: "Marks are dark. The case is small enough for a drawer." },
    ),
    createdAt: "2026-06-30",
  },
  {
    slug: "claw-hammer",
    imageFile: "claw-hammer.jpg",
    name: "16-Ounce Claw Hammer",
    brand: "Benchline",
    category: "tools",
    priceCents: 1800,
    shortDescription: "A household hammer with a smooth face and a curved claw.",
    description:
      "This claw hammer has a steel head and a handle you can grip with one hand. The face is smooth for household nails, and the curved claw pulls a bent finish nail. It is a bench tool, not a framing hammer.",
    features: ["16 oz head", "Smooth face", "Curved claw", "Hickory handle"],
    specifications: [
      { label: "Head", value: "16 oz steel" },
      { label: "Face", value: "Smooth" },
      { label: "Handle", value: "Hickory" },
      { label: "Use", value: "Finish and household nails" },
    ],
    stock: 16,
    reviews: reviews(
      { author: "Gail P.", rating: 4, title: "Right weight", body: "Not a framing hammer. It is what I wanted for picture hooks." },
      { author: "Steve L.", rating: 5, title: "Claw works", body: "Pulled a bent nail without chewing the trim." },
    ),
    createdAt: "2026-07-01",
  },
];
