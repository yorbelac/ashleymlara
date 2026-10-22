# Ashley M. Lara ✦

Ashley's personal site: vintage toys, vaporwave vibes. Built with Next.js 16, Tailwind CSS v4, and deployed on Vercel.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Secret keys

Copy `.env.example` to `.env` and fill in values, then run `npm run db:migrate` to set up the database. After registering on the site, run `npm run make-admin -- you@example.com` to give yourself access to the Studio. Add the same variables in Vercel under **Project → Settings → Environment Variables**. Visit `/api/health` to see which services have their keys set.

## Learning

New here? Open this folder in VS Code with Claude Code and say hi. [CLAUDE.md](CLAUDE.md) tells Claude how to teach as you build, and your progress is tracked in [docs/learning/progress.md](docs/learning/progress.md).
