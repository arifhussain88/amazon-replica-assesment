import "server-only";

import { mkdir } from "fs/promises";
import path from "path";
import { sql } from "drizzle-orm";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "@/lib/db/schema";
import { SCHEMA_VERSION, createStatements, dropStatements } from "@/lib/db/sql";
import { syncCatalog } from "@/lib/db/seed";

export type AppDb = PgliteDatabase<typeof schema>;

const connectionMode = "neon-fetch";

const globalForDb = globalThis as unknown as {
  northlineDb?: Promise<AppDb>;
  northlineSchema?: number;
  northlineConnection?: string;
};

export function getDb() {
  if (
    !globalForDb.northlineDb ||
    globalForDb.northlineSchema !== SCHEMA_VERSION ||
    globalForDb.northlineConnection !== connectionMode
  ) {
    globalForDb.northlineSchema = SCHEMA_VERSION;
    globalForDb.northlineConnection = connectionMode;
    globalForDb.northlineDb = openDatabase().catch((error: unknown) => {
      globalForDb.northlineDb = undefined;
      globalForDb.northlineSchema = undefined;
      globalForDb.northlineConnection = undefined;
      throw error;
    });
  }
  return globalForDb.northlineDb;
}

async function openDatabase(): Promise<AppDb> {
  const databaseUrl = process.env.DATABASE_URL;
  const db = databaseUrl ? await openNeon(databaseUrl) : await openLocal();
  await prepare(db, Boolean(databaseUrl));
  return db;
}

async function openNeon(databaseUrl: string): Promise<AppDb> {
  const { Pool, neonConfig } = await import("@neondatabase/serverless");
  const ws = (await import("ws")).default;
  neonConfig.webSocketConstructor = ws;
  // Ordinary queries use HTTP so a dropped Neon WebSocket does not fail the page.
  neonConfig.poolQueryViaFetch = true;
  const pool = new Pool({ connectionString: databaseUrl });
  const query = pool.query.bind(pool) as (...args: unknown[]) => Promise<unknown> | unknown;
  pool.query = ((...args: unknown[]) => {
    const result = query(...args);
    if (!result || typeof (result as Promise<unknown>).then !== "function") return result;
    return (result as Promise<unknown>).catch((error: unknown) => {
      if (!isTransientConnectionError(error)) throw error;
      return query(...args);
    });
  }) as typeof pool.query;
  const { drizzle } = await import("drizzle-orm/neon-serverless");
  return drizzle({ client: pool, schema }) as unknown as AppDb;
}

function isTransientConnectionError(error: unknown) {
  const text = errorText(error);
  return /socket hang up|ECONNRESET|ECONNREFUSED|ETIMEDOUT|fetch failed|other side closed/i.test(text);
}

function errorText(error: unknown): string {
  if (!error || typeof error !== "object") return "";
  const record = error as { message?: unknown; code?: unknown; cause?: unknown };
  return [record.code, record.message, errorText(record.cause)].filter((part) => typeof part === "string").join(" ");
}

async function openLocal(): Promise<AppDb> {
  const dataDir = process.env.NORTHLINE_DATA_DIR
    ? path.resolve(process.env.NORTHLINE_DATA_DIR)
    : path.join(process.cwd(), ".data", "northline");
  await mkdir(dataDir, { recursive: true });
  const client = new PGlite(dataDir);
  await client.waitReady;
  return drizzlePglite({ client, schema });
}

async function prepare(db: AppDb, remote: boolean) {
  if (!remote) {
    const version = await readVersion(db);
    if (version !== SCHEMA_VERSION) {
      for (const statement of dropStatements) {
        await db.execute(sql.raw(statement));
      }
    }
  }

  for (const statement of createStatements) {
    await db.execute(sql.raw(statement));
  }

  if (!remote) {
    await db.execute(
      sql.raw(
        `INSERT INTO schema_meta (id, version) VALUES (1, ${SCHEMA_VERSION}) ON CONFLICT (id) DO UPDATE SET version = ${SCHEMA_VERSION}`,
      ),
    );
  }

  await syncCatalog(db);
}

async function readVersion(db: AppDb) {
  try {
    const result = await db.execute(sql`SELECT version FROM schema_meta WHERE id = 1`);
    const rows = rowsOf(result);
    const version = rows[0]?.version;
    return typeof version === "number" ? version : Number(version ?? 0);
  } catch {
    return 0;
  }
}

function rowsOf(result: unknown): Array<{ version?: number | string }> {
  if (Array.isArray(result)) return result as Array<{ version?: number | string }>;
  if (result && typeof result === "object" && "rows" in result) {
    const rows = (result as { rows?: unknown }).rows;
    if (Array.isArray(rows)) return rows as Array<{ version?: number | string }>;
  }
  return [];
}
