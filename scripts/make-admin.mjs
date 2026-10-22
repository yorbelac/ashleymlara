// Gives (or takes away) admin access. The person must register on the site first.
// Usage: npm run make-admin -- someone@example.com
//        npm run make-admin -- someone@example.com --remove
import pg from "pg";

const args = process.argv.slice(2);
const email = args.find((a) => !a.startsWith("--"))?.trim().toLowerCase();
const role = args.includes("--remove") ? "user" : "admin";
if (!email) {
  console.error("Usage: npm run make-admin -- someone@example.com [--remove]");
  process.exit(1);
}

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
const client = new pg.Client({ connectionString: url });
await client.connect();
const { rows } = await client.query("UPDATE users SET role = $1 WHERE email = $2 RETURNING email, role", [
  role,
  email,
]);
await client.end();

if (rows.length === 0) {
  console.error(`No account for ${email}. Register on the site first, then run this again.`);
  process.exit(1);
}
console.log(`${rows[0].email} is now: ${rows[0].role}`);
