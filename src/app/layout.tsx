import type { Metadata } from "next";
import { Inter, Newsreader, Noto_Sans_Thai } from "next/font/google";
import { Footer, Header } from "@/presentation/components/layout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Fallback for the baht sign (฿) and any Thai text — Inter has no Thai glyphs.
// Not preloaded: the browser fetches it only when such characters appear.
const notoThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai"],
  display: "swap",
  preload: false,
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wayfare — Bangkok",
  description: "A quiet guide to Bangkok's best restaurants and attractions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoThai.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans text-body-md">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
