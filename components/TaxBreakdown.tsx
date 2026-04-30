"use client";

import { useMemo } from "react";
import type { Currency, Period, Rates, TaxBreakdown as TB } from "@/lib/tax";
import { convertIls } from "@/lib/tax";
import type { Dict, Locale } from "@/lib/i18n";
import { formatMoney, formatPercent } from "@/lib/format";

type Props = {
  breakdown: TB;
  locale: Locale;
  t: Dict;
  viewCurrency: Currency;
  viewPeriod: Period;
  onChangeView: (v: { currency: Currency; period: Period }) => void;
  rates: Rates;
};

const CURRENCIES: Currency[] = ["ILS", "USD", "JOD"];

export function TaxBreakdownView({
  breakdown,
  locale,
  t,
  viewCurrency,
  viewPeriod,
  onChangeView,
  rates,
}: Props) {
  const factor = viewPeriod === "monthly" ? 1 / 12 : 1;

  const money = useMemo(() => {
    return (ilsAnnual: number) => {
      const ils = ilsAnnual * factor;
      const converted = convertIls(ils, viewCurrency, rates);
      return formatMoney(converted, viewCurrency, locale);
    };
  }, [factor, viewCurrency, rates, locale]);

  const maxBracketTax = Math.max(...breakdown.brackets.map((b) => b.tax), 1);

  const bracketLabels = [t.breakdownBracket1, t.breakdownBracket2, t.breakdownBracket3];
  const bracketRanges = [t.bracket1Range, t.bracket2Range, t.bracket3Range];

  return (
    <div className="animate-fade-up space-y-5">
      {/* View switcher */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-fg-muted">{t.viewIn}:</span>
        <div className="flex rounded-lg border border-border bg-bg p-0.5">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChangeView({ currency: c, period: viewPeriod })}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                viewCurrency === c
                  ? "bg-primary text-white shadow-btn-primary"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg border border-border bg-bg p-0.5">
          {(["monthly", "annually"] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChangeView({ currency: viewCurrency, period: p })}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                viewPeriod === p
                  ? "bg-primary text-white shadow-btn-primary"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {p === "monthly" ? t.monthly : t.annually}
            </button>
          ))}
        </div>
      </div>

      {/* Hero: Tax + Net */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-danger-light p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-danger">
            {t.breakdownTotalTax}
          </p>
          <p className="mt-2 text-2xl font-bold text-danger">
            {money(breakdown.totalTaxIls)}
          </p>
          <p className="mt-1 text-xs text-danger/70">
            {viewPeriod === "monthly" ? t.perMonth : t.perYear} ·{" "}
            {formatPercent(breakdown.effectiveRate, locale)}
          </p>
        </div>
        <div className="rounded-2xl bg-success-light p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-success">
            {t.breakdownNet}
          </p>
          <p className="mt-2 text-2xl font-bold text-success">
            {money(breakdown.netAnnualIls)}
          </p>
          <p className="mt-1 text-xs text-success/70">
            {viewPeriod === "monthly" ? t.perMonth : t.perYear}
          </p>
        </div>
      </div>

      {/* Summary table */}
      <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
        <Line label={t.breakdownGross} value={money(breakdown.grossAnnualIls)} />
        <Line
          label={t.breakdownExemptions}
          value={`− ${money(breakdown.totalExemptionsIls)}`}
          muted
        />
        <Line
          label={t.breakdownTaxable}
          value={money(breakdown.taxableBaseIls)}
          bold
        />
        <Line
          label={t.breakdownEffectiveRate}
          value={formatPercent(breakdown.effectiveRate, locale)}
        />
      </div>

      {/* Bracket breakdown */}
      <div>
        <p className="mb-3 text-sm font-semibold text-fg">{t.breakdownBracketLabel}</p>
        <div className="space-y-2">
          {breakdown.brackets.map((b, i) => {
            const active = b.taxableInBracket > 0;
            const barPct = (b.tax / maxBracketTax) * 100;
            return (
              <div
                key={i}
                className={`rounded-xl border p-4 transition-all ${
                  active
                    ? "border-primary/20 bg-primary-light/20"
                    : "border-border bg-bg-card opacity-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        active
                          ? "bg-primary text-white"
                          : "bg-fg-subtle/20 text-fg-muted"
                      }`}
                    >
                      {["I", "II", "III"][i]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-fg">
                        {bracketLabels[i]}
                      </p>
                      <p className="text-xs text-fg-muted">{bracketRanges[i]}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-sm font-bold text-fg">{money(b.tax)}</p>
                    <p className="text-xs text-fg-muted">
                      {money(b.taxableInBracket)} {t.breakdownTaxable.toLowerCase()}
                    </p>
                  </div>
                </div>
                {active && (
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500 ease-expo"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Exemption ledger (only non-zero entries) */}
      {breakdown.totalExemptionsIls > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold text-fg">{t.breakdownExemptions}</p>
          <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
            {breakdown.transportationExemptionIls > 0 && (
              <LedgerLine
                label={t.sectionTransport}
                value={money(breakdown.transportationExemptionIls)}
              />
            )}
            <LedgerLine
              label={t.personalExemption}
              value={money(breakdown.personalExemptionIls)}
            />
            {breakdown.housingExemptionIls > 0 && (
              <LedgerLine
                label={t.housingExemption}
                value={money(breakdown.housingExemptionIls)}
              />
            )}
            {Object.entries(breakdown.optionalExemptionsIls)
              .filter(([, v]) => v > 0)
              .map(([key, val]) => {
                const labelMap: Record<string, string> = {
                  parents: t.parentsExemption,
                  university: t.universityExemption,
                  college: t.collegeExemption,
                  loans: t.loansExemption,
                  other: t.otherExemption,
                };
                return (
                  <LedgerLine
                    key={key}
                    label={labelMap[key] ?? key}
                    value={money(val)}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

function Line({
  label,
  value,
  muted,
  bold,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0">
      <span className={`text-sm ${muted ? "text-fg-muted" : "text-fg"}`}>
        {label}
      </span>
      <span
        className={`text-sm font-bold ${
          muted ? "text-fg-muted" : bold ? "text-primary" : "text-fg"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function LedgerLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5 last:border-b-0">
      <span className="text-xs text-fg-muted">{label}</span>
      <span className="text-xs font-semibold text-fg">{value}</span>
    </div>
  );
}
