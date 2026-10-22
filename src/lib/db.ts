/*
 * db.ts: the connection to our Neon Postgres database.
 *
 * A "pool" keeps a few database connections open and lends them out, so each
 * page doesn't pay the cost of connecting from scratch. attachDatabasePool
 * tells Vercel about the pool so idle connections get closed cleanly.
 *
 * Usage (server code only):
 *   const { rows } = await db().query("SELECT * FROM toys WHERE id = $1", [id]);
 * Always pass values as $1, $2… parameters, never glue them into the SQL string.
 * That prevents "SQL injection", where a visitor sneaks their own SQL in.
 */
import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";

// Reuse one pool across hot reloads in development
const globalForDb = globalThis as unknown as { pgPool?: Pool };

export function db(): Pool {
  if (!globalForDb.pgPool) {
    // The website should use Neon's pooled connection (its host contains "-pooler")
    const connectionString = process.env.DATABASE_URL_POOLED ?? process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is missing from .env");
    const pool = new Pool({ connectionString });
    attachDatabasePool(pool);
    globalForDb.pgPool = pool;
  }
  return globalForDb.pgPool;
}

/** Round-trips to the database. Used by /api/health. */
export async function pingDatabase(): Promise<boolean> {
  try {
    await db().query("SELECT 1");
    return true;
  } catch (error) {
    console.error("[db] ping failed:", error instanceof Error ? error.message : error);
    return false;
  }
}
