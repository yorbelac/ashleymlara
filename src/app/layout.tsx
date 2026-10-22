/*
 * layout.tsx: the "frame" that wraps every page on the site.
 * Anything here (fonts, <html>, <body>, site-wide metadata) applies everywhere.
 */
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Righteous } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

/*
 * next/font downloads these fonts at build time and serves them from our own
 * site. Visitors never hit Google's servers, and the text doesn't "jump"
 * when the font loads.
 */
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const righteous = Righteous({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: "400",
});

// What search engines and link previews (iMessage, Discord, etc.) see.
export const metadata: Metadata = {
  title: {
    default: "Ashley M. Lara",
    template: "%s · Ashley M. Lara",
  },
  description: "Vintage toys, cosmic vibes, and good things from Ashley M. Lara.",
};

export const viewport: Viewport = {
  themeColor: "#1a0b2e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${righteous.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
