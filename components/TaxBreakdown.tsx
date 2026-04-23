"use client";

import { useMemo } from "react";
import type { Currency, Period, Rates, TaxBreakdown as TB } from "@/lib/tax";
import { convertIls } from "@/lib/tax";
import type { Dict, Locale } from "@/lib/i18n";
import { formatMoney, formatPercent } from "@/lib/format";
import { SpotlightCard } from "./ui/SpotlightCard";

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

  const bracketLabels = [
    t.breakdownBracket1,
    t.breakdownBracket2,
    t.breakdownBracket3,
  ];
  const bracketRanges = [t.bracket1Range, t.bracket2Range, t.bracket3Range];

  const optionalKeys = [
    { key: "parents" as const, label: t.parentsExemption },
    { key: "university" as const, label: t.universityExemption },
    { key: "college" as const, label: t.collegeExemption },
    { key: "loans" as const, label: t.loansExemption },
    { key: "other" as const, label: t.otherExemption },
  ];

  return (
    <div className="animate-fade-up">
      {/* View switcher */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted">
          {t.viewIn}
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <Segmented
            options={CURRENCIES.map((c) => ({ value: c, label: c }))}
            value={viewCurrency}
            onChange={(c) => onChangeView({ currency: c as Currency, period: viewPeriod })}
          />
          <div className="h-5 w-px bg-white/10" />
          <Segmented
            options={[
              { value: "monthly", label: t.monthly },
              { value: "annually", label: t.annually },
            ]}
            value={viewPeriod}
            onChange={(p) => onChangeView({ currency: viewCurrency, period: p as Period })}
          />
        </div>
      </div>

      {/* Bento: hero totals */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
        {/* Total tax — large, with accent glow */}
        <SpotlightCard className="p-7 md:col-span-3 md:p-9">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(94,106,210,0.6)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-muted">
              {t.breakdownTotalTax}
            </span>
          </div>
          <p className="mt-5 text-5xl font-semibold tracking-tight md:text-6xl">
            <span className="text-gradient-accent">{money(breakdown.totalTaxIls)}</span>
          </p>
          <p className="mt-3 text-sm text-fg-muted">
            {viewPeriod === "monthly" ? t.perMonth : t.perYear} ·{" "}
            {formatPercent(breakdown.effectiveRate, locale)} {t.breakdownEffectiveRate.toLowerCase()}
          </p>
        </SpotlightCard>

        {/* Take-home — large */}
        <SpotlightCard className="p-7 md:col-span-3 md:p-9">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-muted">
            {t.breakdownNet}
          </span>
          <p className="mt-5 text-5xl font-semibold tracking-tight md:text-6xl">
            <span className="text-gradient-fg">{money(breakdown.netAnnualIls)}</span>
          </p>
          <p className="mt-3 text-sm text-fg-muted">
            {viewPeriod === "monthly" ? t.perMonth : t.perYear}
          </p>
        </SpotlightCard>

        {/* Gross */}
        <Stat label={t.breakdownGross} value={money(breakdown.grossAnnualIls)} />
        {/* Exemptions */}
        <Stat
          label={t.breakdownExemptions}
          value={`− ${money(breakdown.totalExemptionsIls)}`}
          muted
        />
        {/* Taxable */}
        <Stat
          label={t.breakdownTaxable}
          value={money(breakdown.taxableBaseIls)}
          highlight
        />
      </div>

      {/* Brackets */}
      <div className="mt-12">
        <h3 className="mb-5 text-xl font-semibold tracking-tight md:text-2xl">
          {t.breakdownBracketLabel}
        </h3>
        <SpotlightCard className="overflow-hidden">
          {breakdown.brackets.map((b, i) => {
            const active = b.taxableInBracket > 0;
            return (
              <div
                key={i}
                className={`grid grid-cols-12 items-center gap-4 px-6 py-5 md:px-8 md:py-6 ${
                  i < 2 ? "border-b border-white/[0.06]" : ""
                } ${active ? "" : "opacity-40"}`}
              >
                <div className="col-span-12 flex items-center gap-3 md:col-span-4">
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-xs ${
                      active
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-white/10 bg-white/[0.04] text-fg-muted"
                    }`}
                  >
                    {["I", "II", "III"][i]}
                  </span>
                  <div>
                    <p className="text-base font-semibold tracking-tight md:text-lg">
                      {bracketLabels[i]}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-fg-muted">
                      {bracketRanges[i]}
                    </p>
                  </div>
                </div>
                <div className="col-span-6 md:col-span-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-fg-muted">
                    {t.breakdownTaxable}
                  </p>
                  <p className="mt-1 font-mono text-base text-fg md:text-lg">
                    {money(b.taxableInBracket)}
                  </p>
                </div>
                <div className="col-span-6 text-end md:col-span-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-fg-muted">
                    {t.breakdownTotalTax}
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
                    {money(b.tax)}
                  </p>
                </div>
              </div>
            );
          })}
        </SpotlightCard>
      </div>

      {/* Exemption ledger */}
      <div className="mt-12">
        <h3 className="mb-5 text-xl font-semibold tracking-tight md:text-2xl">
          {t.breakdownExemptions}
        </h3>
        <SpotlightCard className="overflow-hidden">
          <LedgerLine
            label={t.sectionTransport}
            value={money(breakdown.transportationExemptionIls)}
          />
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
          {optionalKeys
            .filter((k) => breakdown.optionalExemptionsIls[k.key] > 0)
            .map((k) => (
              <LedgerLine
                key={k.key}
                label={k.label}
                value={money(breakdown.optionalExemptionsIls[k.key])}
              />
            ))}
        </SpotlightCard>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
  muted,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <SpotlightCard
      className={`p-6 md:col-span-2 ${
        highlight
          ? "border-accent/30 bg-gradient-to-b from-accent/[0.08] to-accent/[0.02]"
          : ""
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted">
        {label}
      </p>
      <p
        className={`mt-3 text-2xl font-semibold tracking-tight md:text-3xl ${
          muted ? "text-fg-muted" : ""
        }`}
      >
        {value}
      </p>
    </SpotlightCard>
  );
}

function LedgerLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.05] px-6 py-4 last:border-b-0 md:px-8">
      <span className="text-sm text-fg">{label}</span>
      <span className="font-mono text-base text-fg md:text-lg">{value}</span>
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-white/10 bg-black/30 p-0.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-all duration-200 ease-expo ${
              active
                ? "bg-accent text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_2px_8px_rgba(94,106,210,0.35)]"
                : "text-fg-muted hover:text-fg hover:bg-white/[0.06]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
