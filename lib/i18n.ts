export type Locale = "en" | "ar";

export type Dict = {
  // Meta
  siteTitle: string;
  siteTagline: string;

  // Header
  language: string;

  // Hero
  heroEyebrow: string;
  heroHeadlinePart1: string;
  heroHeadlinePart2: string;
  heroLead: string;
  heroScrollHint: string;

  // Sections
  sectionSalary: string;
  sectionTransport: string;
  sectionExemptions: string;
  sectionRates: string;
  sectionBreakdown: string;

  // Field labels
  amount: string;
  currency: string;
  period: string;
  monthly: string;
  annually: string;

  // Salary
  salaryHelp: string;

  // Transportation
  transportType: string;
  transportPercent: string;
  transportFixed: string;
  transportPercentHint: string;

  // Exemptions (fixed)
  personalExemption: string;
  personalExemptionHint: string;
  housingExemption: string;
  housingExemptionHint: string;

  // Exemptions (variable)
  parentsExemption: string;
  otherExemption: string;
  universityExemption: string;
  collegeExemption: string;
  loansExemption: string;

  // States
  enabled: string;
  disabled: string;

  // Exchange rates
  ratesHint: string;
  fetchRates: string;
  fetching: string;
  rateUsdIls: string;
  rateJodIls: string;
  ratesFetchedAt: string;
  ratesFailed: string;
  useCustomRates: string;

  // Breakdown
  viewIn: string;
  breakdownGross: string;
  breakdownExemptions: string;
  breakdownTaxable: string;
  breakdownBracket1: string;
  breakdownBracket2: string;
  breakdownBracket3: string;
  breakdownBracketLabel: string;
  breakdownTotalTax: string;
  breakdownNet: string;
  breakdownEffectiveRate: string;
  perMonth: string;
  perYear: string;

  // Bracket descriptions
  bracket1Range: string;
  bracket2Range: string;
  bracket3Range: string;

  // Footer
  footerNote: string;
  footerDisclaimer: string;

  // Navigation
  back: string;
  next: string;

  // Reset
  reset: string;
  calculate: string;
};

const en: Dict = {
  siteTitle: "Palestinian Income Tax",
  siteTagline: "A Calculator",
  language: "العربية",

  heroEyebrow: "Palestine · Income Tax",
  heroHeadlinePart1: "Your salary,",
  heroHeadlinePart2: "calculated precisely.",
  heroLead:
    "Enter your salary. Toggle the exemptions that apply. See exactly how the three Palestinian tax brackets shape your year — monthly or annually, in ILS, USD, or JOD.",
  heroScrollHint: "Begin below",

  sectionSalary: "Salary",
  sectionTransport: "Transportation",
  sectionExemptions: "Exemptions",
  sectionRates: "Exchange Rates",
  sectionBreakdown: "Results",

  amount: "Amount",
  currency: "Currency",
  period: "Period",
  monthly: "Monthly",
  annually: "Annually",

  salaryHelp:
    "Your gross earnings before any deductions. Choose the currency and period you think in.",

  transportType: "Method",
  transportPercent: "10% of salary",
  transportFixed: "Fixed amount",
  transportPercentHint: "Ten percent of the gross salary is deducted as transportation.",

  personalExemption: "Personal Exemption",
  personalExemptionHint: "Fixed at 36,000 ILS annually. Applied automatically.",
  housingExemption: "Housing Exemption",
  housingExemptionHint: "30,000 ILS for one year. Toggle to apply.",

  parentsExemption: "Parents Exemption",
  otherExemption: "Other Exemption",
  universityExemption: "University Exemption",
  collegeExemption: "College Exemption",
  loansExemption: "Loans Exemption",

  enabled: "On",
  disabled: "Off",

  ratesHint:
    "All tax math runs in Israeli Shekels. Override these, or fetch the latest.",
  fetchRates: "Fetch live rates",
  fetching: "Fetching…",
  rateUsdIls: "1 USD → ILS",
  rateJodIls: "1 JOD → ILS",
  ratesFetchedAt: "Updated",
  ratesFailed: "Could not reach the rates service. Defaults applied.",
  useCustomRates: "Use my own rates",

  viewIn: "View in",
  breakdownGross: "Gross salary",
  breakdownExemptions: "Total exemptions",
  breakdownTaxable: "Taxable base",
  breakdownBracket1: "Bracket I",
  breakdownBracket2: "Bracket II",
  breakdownBracket3: "Bracket III",
  breakdownBracketLabel: "Tax Brackets",
  breakdownTotalTax: "Total tax",
  breakdownNet: "Take-home",
  breakdownEffectiveRate: "Effective rate",
  perMonth: "/ month",
  perYear: "/ year",

  bracket1Range: "0 – 75,000 ILS · 5%",
  bracket2Range: "75,000 – 150,000 ILS · 10%",
  bracket3Range: "150,000+ ILS · 15%",

  footerNote: "A precise, minimal tool for thinking clearly about your income.",
  footerDisclaimer:
    "Educational tool. Figures are indicative. For official matters consult a certified tax professional in Palestine.",

  back: "Back",
  next: "Next",

  reset: "Reset",
  calculate: "Recalculate",
};

const ar: Dict = {
  siteTitle: "ضريبة الدخل الفلسطينية",
  siteTagline: "حاسبة",
  language: "English",

  heroEyebrow: "فلسطين · ضريبة الدخل",
  heroHeadlinePart1: "راتبك،",
  heroHeadlinePart2: "محسوب بدقة",
  heroLead:
    "أدخل راتبك. فعّل الإعفاءات التي تنطبق عليك. وانظر كيف تُشكّل شرائحُ ضريبة الدخل الفلسطينية الثلاث عامَك — شهرياً أو سنوياً، بالشيكل أو الدولار أو الدينار.",
  heroScrollHint: "ابدأ من هنا",

  sectionSalary: "الراتب",
  sectionTransport: "المواصلات",
  sectionExemptions: "الإعفاءات",
  sectionRates: "أسعار الصرف",
  sectionBreakdown: "النتائج",

  amount: "المبلغ",
  currency: "العملة",
  period: "الدورة",
  monthly: "شهرياً",
  annually: "سنوياً",

  salaryHelp:
    "راتبك الإجمالي قبل أي اقتطاعات. اختر العملة والدورة التي تفكر بها.",

  transportType: "الطريقة",
  transportPercent: "10% من الراتب",
  transportFixed: "مبلغ ثابت",
  transportPercentHint: "يخصم 10% من إجمالي الراتب كبدل مواصلات.",

  personalExemption: "الإعفاء الشخصي",
  personalExemptionHint: "ثابت 36,000 شيكل سنوياً. يُطبَّق تلقائياً.",
  housingExemption: "إعفاء السكن",
  housingExemptionHint: "30,000 شيكل لعامٍ واحد. فعّله للتطبيق.",

  parentsExemption: "إعفاء الوالدين",
  otherExemption: "إعفاءات أخرى",
  universityExemption: "إعفاء الجامعة",
  collegeExemption: "إعفاء الكلية",
  loansExemption: "إعفاء القروض",

  enabled: "مفعّل",
  disabled: "معطّل",

  ratesHint:
    "كل العمليات تحسب بالشيكل. يمكنك تعديل الأسعار أو جلب آخر القيم.",
  fetchRates: "جلب آخر الأسعار",
  fetching: "جاري الجلب…",
  rateUsdIls: "1 دولار → شيكل",
  rateJodIls: "1 دينار → شيكل",
  ratesFetchedAt: "آخر تحديث",
  ratesFailed: "تعذر الوصول إلى خدمة الأسعار. تم تطبيق القيم الافتراضية.",
  useCustomRates: "استخدم أسعاري",

  viewIn: "اعرض بـ",
  breakdownGross: "الراتب الإجمالي",
  breakdownExemptions: "إجمالي الإعفاءات",
  breakdownTaxable: "الوعاء الخاضع للضريبة",
  breakdownBracket1: "الشريحة الأولى",
  breakdownBracket2: "الشريحة الثانية",
  breakdownBracket3: "الشريحة الثالثة",
  breakdownBracketLabel: "الشرائح الضريبية",
  breakdownTotalTax: "إجمالي الضريبة",
  breakdownNet: "الصافي",
  breakdownEffectiveRate: "المعدل الفعلي",
  perMonth: "/ شهر",
  perYear: "/ سنة",

  bracket1Range: "0 – 75,000 شيكل · 5%",
  bracket2Range: "75,000 – 150,000 شيكل · 10%",
  bracket3Range: "150,000+ شيكل · 15%",

  footerNote: "أداةٌ دقيقة ومُكثَّفة للتفكير بوضوحٍ حول دخلك.",
  footerDisclaimer:
    "أداة تعليمية. الأرقام استرشادية. للأمور الرسمية يُرجى استشارة مختص ضرائب معتمد في فلسطين.",

  back: "رجوع",
  next: "التالي",

  reset: "إعادة تعيين",
  calculate: "أعد الحساب",
};

export const dictionaries: Record<Locale, Dict> = { en, ar };

export const isRtl = (locale: Locale) => locale === "ar";
