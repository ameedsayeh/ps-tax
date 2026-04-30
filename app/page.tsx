import { Calculator } from "@/components/Calculator";

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Palestinian Income Tax Calculator",
    alternateName: "حاسبة ضريبة الدخل الفلسطينية",
    description:
      "Free bilingual Palestinian income tax calculator supporting the three tax brackets (5%, 10%, 15%), personal/housing/optional exemptions, and ILS/USD/JOD output.",
    url: "https://ps-tax.web.app",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: ["en", "ar"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Ameed Sayeh",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Calculator />
    </>
  );
}
