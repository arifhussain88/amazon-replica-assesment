export type VariantChoice = {
  id: string;
  optionName: string;
  optionValue: string;
  stock: number;
  priceCents: number | null;
  sortOrder: number;
};

export type ProductCard = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  ratingTimes10: number;
  ratingCount: number;
  shortDescription: string;
  features: string[];
  imageUrl: string;
  imageAlt: string;
  images: { url: string; alt: string }[];
  stock: number;
  variants: VariantChoice[];
};

export type ProductDetail = ProductCard & {
  description: string;
  specifications: { label: string; value: string }[];
  images: { url: string; alt: string }[];
  reviews: {
    id: string;
    author: string;
    rating: number;
    title: string;
    body: string;
    createdAt: string;
  }[];
};

export type CartLine = {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  name: string;
  slug: string;
  brand: string;
  imageUrl: string;
  imageAlt: string;
  variantLabel: string | null;
  unitPriceCents: number;
  stock: number;
};

export type OrderLine = {
  id: string;
  name: string;
  variantLabel: string | null;
  unitPriceCents: number;
  quantity: number;
};

export type OrderRecord = {
  orderNumber: string;
  email: string;
  fullName: string;
  line1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  status: string;
  createdAt: string;
  items: OrderLine[];
};

export type SearchSort = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export type SearchFilters = {
  q: string;
  category: string;
  brands: string[];
  minDollars: number | null;
  maxDollars: number | null;
  rating: number | null;
  sort: SearchSort;
};
