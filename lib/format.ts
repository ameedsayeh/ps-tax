import type { Currency } from "./tax";

// Always use Western Arabic digits (0-9) regardless of locale
const FORMAT_LOCALE = "en-US";

const CURRENCY_SYMBOL: Record<Currency, string> = {
  ILS: "₪",
  USD: "$",
  JOD: "JD",
};

export function formatMoney(
  amount: number,
  currency: Currency,
  _locale: "en" | "ar" = "en",
  maximumFractionDigits = 0,
): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const digits = Math.abs(safe) < 100 ? 2 : maximumFractionDigits;
  const formatted = new Intl.NumberFormat(FORMAT_LOCALE, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(safe);
  return `${CURRENCY_SYMBOL[currency]} ${formatted}`;
}

export function formatNumber(
  amount: number,
  _locale: "en" | "ar" = "en",
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat(FORMAT_LOCALE, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatPercent(value: number, _locale: "en" | "ar" = "en") {
  return new Intl.NumberFormat(FORMAT_LOCALE, {
    style: "percent",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}
