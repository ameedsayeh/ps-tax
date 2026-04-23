export type Currency = "ILS" | "USD" | "JOD";
export type Period = "monthly" | "annually";

export type MoneyInput = {
  amount: number;
  currency: Currency;
  period: Period;
};

export type Rates = {
  /** 1 USD = N ILS */
  usdToIls: number;
  /** 1 JOD = N ILS */
  jodToIls: number;
};

export type TransportationMode = "percent" | "fixed";

export type Transportation =
  | { mode: "percent" }
  | { mode: "fixed"; value: MoneyInput };

export type OptionalExemptionKey =
  | "parents"
  | "other"
  | "university"
  | "college"
  | "loans";

export type OptionalExemption = {
  enabled: boolean;
  value: MoneyInput;
};

export type CalculatorInput = {
  salary: MoneyInput;
  transportation: Transportation;
  housingEnabled: boolean;
  optional: Record<OptionalExemptionKey, OptionalExemption>;
  rates: Rates;
};

export const BRACKETS = [
  { limit: 75_000, rate: 0.05 },
  { limit: 150_000, rate: 0.1 },
  { limit: Infinity, rate: 0.15 },
] as const;

export const PERSONAL_EXEMPTION_ANNUAL_ILS = 36_000;
export const HOUSING_EXEMPTION_ANNUAL_ILS = 30_000;

export function convertToIls(input: MoneyInput, rates: Rates): number {
  const amt = input.amount;
  switch (input.currency) {
    case "ILS":
      return amt;
    case "USD":
      return amt * rates.usdToIls;
    case "JOD":
      return amt * rates.jodToIls;
  }
}

export function toAnnualIls(input: MoneyInput, rates: Rates): number {
  const ils = convertToIls(input, rates);
  return input.period === "monthly" ? ils * 12 : ils;
}

export function convertIls(
  amountIls: number,
  target: Currency,
  rates: Rates,
): number {
  switch (target) {
    case "ILS":
      return amountIls;
    case "USD":
      return rates.usdToIls === 0 ? 0 : amountIls / rates.usdToIls;
    case "JOD":
      return rates.jodToIls === 0 ? 0 : amountIls / rates.jodToIls;
  }
}

export type BracketBreakdown = {
  index: 0 | 1 | 2;
  rate: number;
  range: [number, number];
  taxableInBracket: number;
  tax: number;
};

export type TaxBreakdown = {
  grossAnnualIls: number;
  transportationExemptionIls: number;
  personalExemptionIls: number;
  housingExemptionIls: number;
  optionalExemptionsIls: Record<OptionalExemptionKey, number>;
  totalExemptionsIls: number;
  taxableBaseIls: number;
  brackets: [BracketBreakdown, BracketBreakdown, BracketBreakdown];
  totalTaxIls: number;
  netAnnualIls: number;
  effectiveRate: number;
};

export function calculate(input: CalculatorInput): TaxBreakdown {
  const gross = toAnnualIls(input.salary, input.rates);

  const transport =
    input.transportation.mode === "percent"
      ? gross * 0.1
      : toAnnualIls(input.transportation.value, input.rates);

  const housing = input.housingEnabled ? HOUSING_EXEMPTION_ANNUAL_ILS : 0;

  const optionalIls: Record<OptionalExemptionKey, number> = {
    parents: 0,
    other: 0,
    university: 0,
    college: 0,
    loans: 0,
  };
  (Object.keys(input.optional) as OptionalExemptionKey[]).forEach((k) => {
    const ex = input.optional[k];
    optionalIls[k] = ex.enabled ? toAnnualIls(ex.value, input.rates) : 0;
  });

  const totalOptional = Object.values(optionalIls).reduce((s, v) => s + v, 0);

  const totalExemptions =
    transport + PERSONAL_EXEMPTION_ANNUAL_ILS + housing + totalOptional;

  const taxableBase = Math.max(0, gross - totalExemptions);

  const brackets: BracketBreakdown[] = [];
  let remaining = taxableBase;
  let lowerBound = 0;
  BRACKETS.forEach((b, i) => {
    const width = b.limit - lowerBound;
    const inBracket = Math.max(0, Math.min(remaining, width));
    const tax = inBracket * b.rate;
    brackets.push({
      index: i as 0 | 1 | 2,
      rate: b.rate,
      range: [lowerBound, b.limit],
      taxableInBracket: inBracket,
      tax,
    });
    remaining -= inBracket;
    lowerBound = b.limit;
  });

  const totalTax = brackets.reduce((s, b) => s + b.tax, 0);
  const net = gross - totalTax;
  const effective = gross > 0 ? totalTax / gross : 0;

  return {
    grossAnnualIls: gross,
    transportationExemptionIls: transport,
    personalExemptionIls: PERSONAL_EXEMPTION_ANNUAL_ILS,
    housingExemptionIls: housing,
    optionalExemptionsIls: optionalIls,
    totalExemptionsIls: totalExemptions,
    taxableBaseIls: taxableBase,
    brackets: brackets as [BracketBreakdown, BracketBreakdown, BracketBreakdown],
    totalTaxIls: totalTax,
    netAnnualIls: net,
    effectiveRate: effective,
  };
}

export const DEFAULT_RATES: Rates = {
  usdToIls: 3.7,
  jodToIls: 5.22,
};
