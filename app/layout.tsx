import type { Metadata } from "next";
import { Inter, Cairo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const arabic = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Palestinian Income Tax Calculator | حاسبة ضريبة الدخل الفلسطينية",
  description:
    "Free bilingual Palestinian income tax calculator. Compute your income tax across the three brackets (5%, 10%, 15%), apply personal and housing exemptions, and view results in ILS, USD, or JOD — monthly or annually.",
  keywords: [
    "Palestinian income tax calculator",
    "Palestine tax 2025",
    "حاسبة ضريبة الدخل الفلسطينية",
    "ضريبة الدخل فلسطين",
    "tax brackets Palestine",
    "Palestinian salary tax",
    "ILS tax calculator",
    "شريحة الضريبة فلسطين",
  ],
  openGraph: {
    title: "Palestinian Income Tax Calculator",
    description:
      "Free bilingual Palestinian income tax calculator — results in ILS, USD, and JOD.",
    url: "https://ps-tax.web.app",
    siteName: "PS Tax",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Palestinian Income Tax Calculator",
    description:
      "Free bilingual Palestinian income tax calculator — results in ILS, USD, and JOD.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://ps-tax.web.app" },
  verification: {
    google: "VRWdjBxWAVyVE4aJ62ndV5RuHM74x6KRPvNu3UzLBQ8",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${sans.variable} ${arabic.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
