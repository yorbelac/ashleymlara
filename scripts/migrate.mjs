// Applies new database migrations, in order. Usage: npm run db:migrate
// Each file in db/migrations runs once; finished ones are recorded in schema_migrations.
// Uses the direct (unpooled) connection, which is what schema changes need.
import { readdir, readFile } from "node:fs/promises";
import pg from "pg";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error("No DATABASE_URL in .env");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
await client.connect();
await client.query(
  "CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
);
const applied = new Set((await client.query("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
const files = (await readdir("db/migrations")).filter((f) => f.endsWith(".sql")).sort();

let count = 0;
for (const file of files) {
  if (applied.has(file)) continue;
  const sql = await readFile(`db/migrations/${file}`, "utf8");
  try {
    // A transaction: either the whole migration applies, or none of it does
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
    await client.query("COMMIT");
    console.log(`✓ ${file}`);
    count++;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(`✗ ${file}: ${error.message}`);
    await client.end();
    process.exit(1);
  }
}

console.log(count ? `Applied ${count} migration(s).` : "Database is up to date.");
await client.end();
