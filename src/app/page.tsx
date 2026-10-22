/*
 * page.tsx in the `app` folder = the home page ("/").
 *
 * This is a Server Component: it renders on the server and ships plain HTML,
 * with no JavaScript sent to the browser for it. That's a big reason the
 * site stays fast.
 */
export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden">
      {/* ---------- Hero: sunset + name ---------- */}
      <section className="flex w-full flex-col items-center px-6 pt-20 text-center sm:pt-28">
        <p className="mb-6 rounded-full border border-cyan/60 px-4 py-1 font-mono text-[10px] tracking-[0.2em] whitespace-nowrap text-cyan uppercase sm:text-xs sm:tracking-[0.3em]">
          Under construction ✦ Est. 2026
        </p>

        <h1 className="neon-text font-display text-5xl leading-tight text-pink sm:text-7xl">
          Ashley M. Lara
        </h1>

        <p className="mt-4 max-w-md text-lg text-cream/80">
          Vintage toys, cosmic vibes, and a little corner of the internet
          that&apos;s all mine.
        </p>

        {/* Decorative only, so aria-hidden hides it from screen readers.
            It sits below the text (not behind it) so it never covers words. */}
        <div aria-hidden="true" className="pointer-events-none relative -mx-6 mt-10 flex h-72 w-[calc(100%+3rem)] justify-center overflow-hidden sm:h-88">
          <div className="retro-sun absolute bottom-16 size-56 rounded-full sm:size-72" />
          <div className="absolute bottom-0 h-24 w-[200%] bg-night">
            <div className="retro-grid h-full w-full" />
          </div>
        </div>
      </section>

      {/* ---------- Coming soon cards ---------- */}
      <section className="grid w-full max-w-4xl gap-4 px-6 py-16 sm:grid-cols-3">
        {[
          { title: "The Collection", body: "Toys, treasures, and the stories behind them.", color: "text-pink" },
          { title: "Journal", body: "Finds, thoughts, and little updates.", color: "text-cyan" },
          { title: "Say Hi", body: "A way to reach me. Coming soon!", color: "text-mint" },
        ].map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-lilac/30 bg-dusk/60 p-6 transition hover:-translate-y-1 hover:border-lilac"
          >
            <h2 className={`font-display text-xl ${card.color}`}>{card.title}</h2>
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
