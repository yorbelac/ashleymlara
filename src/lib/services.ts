/*
 * The outside services this site will talk to, and the secret keys
 * ("environment variables") each one needs.
 *
 * Keys live in `.env.local` on your computer and in the Vercel dashboard
 * for the live site. They are NEVER written into the code or committed to git.
 */
export const services = {
  login: { label: "Accounts & login", env: ["SESSION_SECRET"] },
  neon: { label: "Neon (database)", env: ["DATABASE_URL"] },
  r2: {
    label: "Cloudflare R2 (images & files)",
    env: ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_ACCESS_KEY", "CLOUDFLARE_SECRET_ACCESS_KEY", "CLOUDFLARE_PUBLIC_URL"],
  },
  resend: { label: "Resend (email)", env: ["RESEND_API_KEY"] },
  google: { label: "Google sign-in", env: ["AUTH_SECRET", "AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET"] },
} as const;

/** Which services have all their keys filled in. Reports true/false only, never the values. */
export function serviceStatus() {
  return Object.fromEntries(
    Object.entries(services).map(([id, s]) => [
      id,
      { label: s.label, configured: s.env.every((name) => Boolean(process.env[name])) },
    ]),
  );
}
