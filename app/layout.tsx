import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Palestinian Income Tax — A Calculator",
  description:
    "A precise, bilingual tax calculator for Palestinian income. Dark, fast, and obsessively crafted.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${sans.variable} ${arabic.variable} ${mono.variable}`}
    >
      <body className="fx-noise fx-grid">
        <AmbientBackdrop />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
