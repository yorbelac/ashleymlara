// Takes screenshots of a page at desktop and phone sizes, for debugging layout.
// Usage: node scripts/screenshot.mjs [path] [--full]
// Needs the dev server running (npm run dev). Images are saved to .screenshots/
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const args = process.argv.slice(2);
// Leading slash is optional ("about" or "/about")
const path = "/" + (args.find((a) => !a.startsWith("--")) ?? "").replace(/^\/+/, "");
const fullPage = args.includes("--full");
const base = process.env.BASE_URL ?? "http://localhost:3000";

const viewports = {
  desktop: { width: 1366, height: 900 },
  mobile: { width: 390, height: 844 },
};

await mkdir(".screenshots", { recursive: true });
const browser = await chromium.launch();

for (const [name, viewport] of Object.entries(viewports)) {
  const page = await browser.newPage({ viewport });
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log(`[${name} console error] ${msg.text()}`);
  });
  await page.goto(base + path, { waitUntil: "networkidle" });
  const slug = path === "/" ? "home" : path.replace(/\W+/g, "-").replace(/^-|-$/g, "");
  const file = `.screenshots/${slug}-${name}.png`;
  await page.screenshot({ path: file, fullPage });
  console.log(file);
  await page.close();
}

await browser.close();
