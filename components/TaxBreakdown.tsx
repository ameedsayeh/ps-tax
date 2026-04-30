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

// Per-bracket accent colours (light, mid, dark sky)
const BRACKET_COLORS = [
  { bar: "#38BDF8", bg: "rgba(56,189,248,0.12)", badge: "#0EA5E9" },
  { bar: "#0284C7", bg: "rgba(2,132,199,0.12)", badge: "#0284C7" },
  { bar: "#075985", bg: "rgba(7,89,133,0.12)", badge: "#075985" },
];

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

  const bracketLabels = [t.breakdownBracket1, t.breakdownBracket2, t.breakdownBracket3];
  const bracketRanges = [t.bracket1Range, t.bracket2Range, t.bracket3Range];

  const totalTax = breakdown.totalTaxIls;
  const activeBrackets = breakdown.brackets.filter((b) => b.taxableInBracket > 0);

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

      {/* ── Bracket breakdown ── */}
      <div>
        <p className="mb-3 text-sm font-semibold text-fg">{t.breakdownBracketLabel}</p>

        {/* Stacked overview bar */}
        {activeBrackets.length > 0 && (
          <div className="mb-4 rounded-xl border border-border bg-bg-card p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-fg-muted">
              <span>{t.breakdownTaxable}</span>
              <span className="font-semibold text-fg">
                {money(breakdown.taxableBaseIls)}
              </span>
            </div>
            {/* Segmented bar: each segment = bracket's taxable portion */}
            <div className="flex h-4 w-full overflow-hidden rounded-full bg-border">
              {breakdown.brackets.map((b, i) => {
                const pct =
                  breakdown.taxableBaseIls > 0
                    ? (b.taxableInBracket / breakdown.taxableBaseIls) * 100
                    : 0;
                return pct > 0 ? (
                  <div
                    key={i}
                    title={`${bracketLabels[i]}: ${pct.toFixed(1)}%`}
                    style={{
                      width: `${pct}%`,
                      background: BRACKET_COLORS[i].bar,
                    }}
                    className={`transition-all duration-500 ease-expo ${i > 0 ? "border-l border-white/30" : ""}`}
                  />
                ) : null;
              })}
            </div>
            {/* Legend */}
            <div className="mt-2 flex flex-wrap gap-3">
              {breakdown.brackets.map((b, i) => {
                const pct =
                  breakdown.taxableBaseIls > 0
                    ? (b.taxableInBracket / breakdown.taxableBaseIls) * 100
                    : 0;
                return pct > 0 ? (
                  <div key={i} className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: BRACKET_COLORS[i].bar }}
                    />
                    <span className="text-xs text-fg-muted">
                      {bracketLabels[i]} · {pct.toFixed(0)}%
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Individual bracket rows */}
        <div className="space-y-2">
          {breakdown.brackets.map((b, i) => {
            const active = b.taxableInBracket > 0;
            const pctOfTax = totalTax > 0 ? (b.tax / totalTax) * 100 : 0;
            const color = BRACKET_COLORS[i];

            return (
              <div
                key={i}
                className={`overflow-hidden rounded-xl border transition-all ${
                  active ? "border-border" : "border-border bg-bg-card opacity-40"
                }`}
                style={active ? { background: color.bg, borderColor: color.bar + "40" } : undefined}
              >
                <div className="flex items-center justify-between gap-3 p-4">
                  {/* Left: badge + info */}
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                      style={{ background: active ? color.badge : "#94A3B8" }}
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

                  {/* Right: tax amount */}
                  <div className="text-end">
                    <p
                      className="text-base font-bold"
                      style={{ color: active ? color.badge : "#94A3B8" }}
                    >
                      {money(b.tax)}
                    </p>
                    {active && (
                      <p className="text-xs text-fg-muted">
                        {pctOfTax.toFixed(0)}% {t.ofTotalTax}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress bar — shows this bracket's share of total tax */}
                {active && (
                  <div className="px-4 pb-4">
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/60">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-expo"
                        style={{
                          width: `${pctOfTax}%`,
                          background: color.bar,
                        }}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-xs text-fg-muted">
                        {t.breakdownTaxable}: {money(b.taxableInBracket)}
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: color.badge }}
                      >
                        {pctOfTax.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Exemption ledger */}
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
