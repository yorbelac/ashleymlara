/*
 * GET /api/health: a quick check that the site is up and which services
 * have their keys set. Handy right after adding a key in Vercel.
 */
import { connection } from "next/server";
import { pingDatabase } from "@/lib/db";
import { serviceStatus } from "@/lib/services";

export async function GET() {
  // Run on every request instead of once at build time, so it reflects current keys
  await connection();
  const services = serviceStatus();
  // Keys being present isn't enough; actually talk to the database
  const database = services.neon.configured ? await pingDatabase() : false;
  return Response.json({ ok: true, services, database });
}
