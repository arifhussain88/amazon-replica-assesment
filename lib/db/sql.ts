export const SCHEMA_VERSION = 1;

export const dropStatements = [
  "DROP TABLE IF EXISTS order_items CASCADE",
  "DROP TABLE IF EXISTS orders CASCADE",
  "DROP TABLE IF EXISTS cart_items CASCADE",
  "DROP TABLE IF EXISTS carts CASCADE",
  "DROP TABLE IF EXISTS reviews CASCADE",
  "DROP TABLE IF EXISTS product_images CASCADE",
  "DROP TABLE IF EXISTS product_variants CASCADE",
  "DROP TABLE IF EXISTS products CASCADE",
  "DROP TABLE IF EXISTS categories CASCADE",
  "DROP TABLE IF EXISTS schema_meta CASCADE",
];

export const createStatements = [
  `CREATE TABLE IF NOT EXISTS schema_meta (
    id integer PRIMARY KEY,
    version integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    id text PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text NOT NULL,
    sort_order integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id text PRIMARY KEY,
    category_id text NOT NULL REFERENCES categories(id),
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    brand text NOT NULL,
    price_cents integer NOT NULL,
    compare_at_price_cents integer,
    short_description text NOT NULL,
    description text NOT NULL,
    features jsonb NOT NULL,
    specifications jsonb NOT NULL,
    stock integer NOT NULL,
    rating_times10 integer NOT NULL,
    rating_count integer NOT NULL,
    created_at timestamptz NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS product_variants (
    id text PRIMARY KEY,
    product_id text NOT NULL REFERENCES products(id),
    option_name text NOT NULL,
    option_value text NOT NULL,
    stock integer NOT NULL,
    price_cents integer,
    sort_order integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS product_images (
    id text PRIMARY KEY,
    product_id text NOT NULL REFERENCES products(id),
    url text NOT NULL,
    alt text NOT NULL,
    sort_order integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id text PRIMARY KEY,
    product_id text NOT NULL REFERENCES products(id),
    author text NOT NULL,
    rating integer NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    created_at timestamptz NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS carts (
    id text PRIMARY KEY,
    created_at timestamptz NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS cart_items (
    id text PRIMARY KEY,
    cart_id text NOT NULL REFERENCES carts(id),
    product_id text NOT NULL REFERENCES products(id),
    variant_id text REFERENCES product_variants(id),
    quantity integer NOT NULL,
    variant_label text
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id text PRIMARY KEY,
    order_number text NOT NULL UNIQUE,
    email text NOT NULL,
    full_name text NOT NULL,
    line1 text NOT NULL,
    city text NOT NULL,
    region text NOT NULL,
    postal_code text NOT NULL,
    country text NOT NULL,
    subtotal_cents integer NOT NULL,
    shipping_cents integer NOT NULL,
    total_cents integer NOT NULL,
    status text NOT NULL,
    created_at timestamptz NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id text PRIMARY KEY,
    order_id text NOT NULL REFERENCES orders(id),
    product_id text NOT NULL,
    variant_id text,
    name text NOT NULL,
    variant_label text,
    unit_price_cents integer NOT NULL,
    quantity integer NOT NULL
  )`,
];
