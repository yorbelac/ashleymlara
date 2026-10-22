/*
 * page.tsx in the `app` folder = the home page ("/").
 *
 * This is a Server Component: it renders on the server and ships plain HTML,
 * with no JavaScript sent to the browser for it. Every sparkle, scroll, and
 * shimmer on this page is pure CSS (see globals.css), so it stays fast.
 *
 * ✏️ Want to change the words? They all live in the lists right below.
 */

// The things that scroll by in the marquee
const FINDS = [
  "Lisa Frank",
  "Polly Pocket",
  "Care Bears",
  "My Little Pony",
  "Lite-Brite",
  "Trapper Keepers",
  "Sanrio",
  "Furby",
  "Rainbow Brite",
  "Barbie",
  "Pound Puppies",
  "Antiques & oddities",
];

// The holographic trading cards. `stat` is the little label in the corner, like a card's power.
const QUALITIES = [
  {
    title: "The Eye",
    stat: "Rarity ✦✦✦✦✦",
    body: "I can spot the real deal from across a flea market. Antiques, toys, and the one perfect sticker sheet in a box of fifty.",
    color: "text-pink",
  },
  {
    title: "The Maker",
    stat: "Artist × Entrepreneur",
    body: "Pretty isn't enough. It has to work, too. I sweat the colors, the proportions, and the tiny details most people never notice.",
    color: "text-cyan",
  },
  {
    title: "The Fixer",
    stat: "Never hands it off",
    body: "Broken equipment, a stubborn website, a brand-new skill: I'd rather figure it out than wait for someone else to.",
    color: "text-mint",
  },
  {
    title: "The Seeker",
    stat: "Curiosity: maxed out",
    body: "I go from shop logistics to ancient history in one conversation, and I always want to know the why behind the what.",
    color: "text-sunshine",
  },
];

// Where little stars sit in the hero sky: [left %, top %, size class, delay in seconds]
const STARS: [number, number, string, number][] = [
  [8, 12, "text-lg", 0],
  [18, 38, "text-xs", 1.2],
  [27, 8, "text-sm", 2.1],
  [72, 10, "text-base", 0.6],
  [84, 30, "text-xs", 1.8],
  [92, 14, "text-lg", 2.6],
  [62, 42, "text-xs", 0.9],
  [38, 46, "text-xs", 2.3],
  [5, 55, "text-sm", 1.5],
  [95, 52, "text-sm", 0.3],
];

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden">
      {/* ---------- Hero: sunset, stars, and her name ---------- */}
      <section className="relative flex w-full flex-col items-center px-6 pt-20 text-center sm:pt-28">
        {/* Decorative stars. aria-hidden so screen readers skip them */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {STARS.map(([left, top, size, delay]) => (
            <span
              key={`${left}-${top}`}
              className={`twinkle absolute text-lemon ${size}`}
              style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }}
            >
              ✦
            </span>
          ))}
        </div>

        <p className="mb-6 rounded-full border border-cyan/60 px-4 py-1 font-mono text-[10px] tracking-[0.2em] whitespace-nowrap text-cyan uppercase sm:text-xs sm:tracking-[0.3em]">
          Collector ✦ Curator ✦ Rainbow keeper
        </p>

        <h1 className="neon-text font-display text-5xl leading-tight text-pink sm:text-7xl">Ashley M. Lara</h1>

        <p className="mt-5 max-w-xl text-lg text-cream/85 sm:text-xl">
          Vintage toy hunter with a sharp eye for antiques and an unapologetic love of{" "}
          <span className="rainbow-text font-semibold">all things rainbow</span>. I find the treasures you
          forgot you were missing.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="https://cosmicsundae.com"
            className="rounded-full bg-pink px-6 py-2.5 font-display text-night transition hover:bg-lemon"
          >
            Shop Cosmic Sundae ↗
          </a>
          <a
            href="#about"
            className="rounded-full border border-lilac/60 px-6 py-2.5 font-display text-cream transition hover:border-cyan hover:text-cyan"
          >
            Meet Ashley
          </a>
        </div>

        {/* The sunset sits below the text (not behind it) so it never covers words */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative -mx-6 mt-12 flex h-72 w-[calc(100%+3rem)] justify-center overflow-hidden sm:h-88"
        >
          <div className="retro-sun absolute bottom-16 size-56 rounded-full sm:size-72" />
          <div className="absolute bottom-0 h-24 w-[200%] bg-night">
            <div className="retro-grid h-full w-full" />
          </div>
        </div>
      </section>

      {/* ---------- Marquee: what she collects ---------- */}
      <section aria-label="Things Ashley collects" className="w-full overflow-hidden border-y border-lilac/30 bg-grape/40 py-3">
        {/* Screen readers get the list once, plainly */}
        <p className="sr-only">I collect: {FINDS.join(", ")}.</p>
        <div aria-hidden="true" className="marquee-track flex w-max">
          {[...FINDS, ...FINDS].map((find, i) => (
            <span key={i} className="flex items-center font-display text-lg whitespace-nowrap text-cream/90">
              <span className="px-6">{find}</span>
              <span className={i % 2 ? "text-cyan" : "text-sunshine"}>✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ---------- Community: the big number ---------- */}
      <section id="about" className="w-full max-w-5xl scroll-mt-24 px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-lilac/30 bg-dusk/60 p-8 sm:p-12">
          {/* A soft rainbow glow in the corner */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gradient-to-br from-pink via-lilac to-cyan opacity-30 blur-3xl"
          />
          <p className="font-mono text-xs tracking-[0.3em] text-cyan uppercase">Keeper of the rainbow</p>
          <div className="mt-4 grid items-center gap-8 sm:grid-cols-[auto_1fr]">
            <p className="rainbow-text font-display text-7xl leading-none sm:text-8xl">250K+</p>
            <div>
              <h2 className="font-display text-2xl text-cream sm:text-3xl">Lisa Frank fans, one happy place</h2>
              <p className="mt-3 text-cream/75">
                I help moderate the largest Lisa Frank fan group on Facebook. That&apos;s over a quarter of a
                million people sharing finds, swapping stories, and keeping the rainbow leopards alive. Keeping
                it kind, colorful, and scam-free is a labor of love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Trading cards: what she's made of ---------- */}
      <section className="w-full max-w-5xl px-6 pb-20">
        <h2 className="text-center font-display text-3xl text-cream sm:text-4xl">
          Pull a card <span className="text-pink">✦</span> meet the collector
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-cream/60">
          Every good collection has its holo rares. Hover for the shine.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {QUALITIES.map((card) => (
            <article
              key={card.title}
              className="holo flex flex-col rounded-2xl p-6 transition duration-300 hover:-translate-y-2 hover:rotate-[-1deg]"
            >
              <p className="font-mono text-[10px] tracking-widest text-cream/50 uppercase">{card.stat}</p>
              <h3 className={`mt-3 font-display text-2xl ${card.color}`}>{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/75">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Cosmic Sundae: her shop, in its own colors ---------- */}
      <section className="w-full max-w-5xl px-6 pb-20">
        <div className="grid overflow-hidden rounded-3xl bg-sundae sm:grid-cols-[1.2fr_1fr]">
          <div className="p-8 sm:p-12">
            <p className="font-mono text-xs tracking-[0.3em] text-night/70 uppercase">The shop</p>
            <h2 className="mt-3 font-display text-4xl text-night sm:text-5xl">Cosmic Sundae</h2>
            <p className="mt-4 max-w-md text-night/85">
              My vintage shop for colorful, nostalgic Americana: toys, collectibles, and little time machines,
              hand-picked and ready for a second life with you.
            </p>
            <a
              href="https://cosmicsundae.com"
              className="mt-8 inline-block rounded-full bg-night px-6 py-2.5 font-display text-sunshine transition hover:bg-grape hover:text-cream"
            >
              Find your childhood ↗
            </a>
          </div>
          {/* A CSS-only sundae: scoops, a cherry, and sprinkles. No image download needed */}
          <div aria-hidden="true" className="relative flex min-h-56 items-end justify-center bg-sunshine/90 pb-6">
            <div className="relative flex flex-col items-center">
              <div className="mb-[-10px] size-6 rounded-full bg-[#d7263d] shadow-[inset_-3px_-3px_0_rgba(0,0,0,0.2)]" />
              <div className="mb-[-18px] h-20 w-28 rounded-t-full bg-cream" />
              <div className="relative mb-[-18px] flex">
                <div className="h-20 w-24 rounded-t-full bg-teal" />
                <div className="-ml-4 h-20 w-24 rounded-t-full bg-pink" />
              </div>
              <div className="relative z-10 h-24 w-44 rounded-b-[45%] border-t-4 border-cream/60 bg-grape" />
              {["left-6 top-24 bg-sunshine", "left-20 top-12 bg-cyan", "right-6 top-28 bg-mint", "right-14 top-16 bg-cream"].map(
                (pos) => (
                  <span key={pos} className={`absolute h-1.5 w-4 rotate-45 rounded-full ${pos}`} />
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Coming soon ---------- */}
      <section className="grid w-full max-w-5xl gap-4 px-6 pb-20 sm:grid-cols-3">
        {[
          { title: "The Collection", body: "Toys, treasures, and the stories behind them.", color: "text-pink" },
          { title: "Journal", body: "Finds, thoughts, and little updates.", color: "text-cyan" },
          { title: "Say Hi", body: "A way to reach me. Coming soon!", color: "text-mint" },
        ].map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-lilac/30 bg-dusk/60 p-6 transition hover:-translate-y-1 hover:border-lilac"
          >
            <p className="font-mono text-[10px] tracking-widest text-cream/40 uppercase">Coming soon</p>
            <h2 className={`mt-2 font-display text-xl ${card.color}`}>{card.title}</h2>
            <p className="mt-2 text-sm text-cream/70">{card.body}</p>
          </article>
        ))}
      </section>

      <footer className="mt-auto w-full border-t border-lilac/20 py-8 text-center font-mono text-xs text-cream/50">
        © Ashley M. Lara ✦ made with 💖 and a lot of curiosity
      </footer>
    </main>
  );
}
