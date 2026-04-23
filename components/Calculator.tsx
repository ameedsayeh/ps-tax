"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CalculatorInput,
  Currency,
  MoneyInput,
  OptionalExemption,
  OptionalExemptionKey,
  Period,
  Rates,
  Transportation,
} from "@/lib/tax";
import { calculate } from "@/lib/tax";
import type { Dict, Locale } from "@/lib/i18n";
import { dictionaries, isRtl } from "@/lib/i18n";
import { MoneyInputRow } from "./ui/MoneyInputRow";
import { Toggle } from "./ui/Toggle";
import { SectionHeader, FieldLabel, SectionTag } from "./ui/Field";
import { SpotlightCard } from "./ui/SpotlightCard";
import { ExemptionRow } from "./ExemptionRow";
import { ExchangeRates } from "./ExchangeRates";
import { TaxBreakdownView } from "./TaxBreakdown";

const STORAGE_KEY = "ps_tax__state_v2";

type State = {
  locale: Locale;
  salary: MoneyInput;
  transportMode: "percent" | "fixed";
  transportFixed: MoneyInput;
  housing: boolean;
  optional: Record<OptionalExemptionKey, OptionalExemption>;
  rates: Rates;
  ratesFetchedAt: number | null;
  viewCurrency: Currency;
  viewPeriod: Period;
};

const DEFAULT_STATE: State = {
  locale: "en",
  salary: { amount: 5000, currency: "USD", period: "monthly" },
  transportMode: "fixed",
  transportFixed: { amount: 1000, currency: "ILS", period: "monthly" },
  housing: false,
  optional: {
    parents: { enabled: false, value: { amount: 0, currency: "ILS", period: "annually" } },
    other: { enabled: false, value: { amount: 0, currency: "ILS", period: "annually" } },
    university: { enabled: false, value: { amount: 0, currency: "ILS", period: "annually" } },
    college: { enabled: false, value: { amount: 0, currency: "ILS", period: "annually" } },
    loans: { enabled: false, value: { amount: 0, currency: "ILS", period: "annually" } },
  },
  rates: { usdToIls: 3.0, jodToIls: 5.22 },
  ratesFetchedAt: null,
  viewCurrency: "ILS",
  viewPeriod: "annually",
};

export function Calculator() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = state.locale;
      document.documentElement.dir = isRtl(state.locale) ? "rtl" : "ltr";
    }
  }, [state, hydrated]);

  const t: Dict = dictionaries[state.locale];

  const input: CalculatorInput = useMemo(
    () => ({
      salary: state.salary,
      transportation:
        state.transportMode === "percent"
          ? ({ mode: "percent" } as Transportation)
          : ({ mode: "fixed", value: state.transportFixed } as Transportation),
      housingEnabled: state.housing,
      optional: state.optional,
      rates: state.rates,
    }),
    [state],
  );

  const breakdown = useMemo(() => calculate(input), [input]);

  function setOptional(key: OptionalExemptionKey, patch: Partial<OptionalExemption>) {
    setState((s) => ({
      ...s,
      optional: { ...s.optional, [key]: { ...s.optional[key], ...patch } },
    }));
  }

  function reset() {
    setState(DEFAULT_STATE);
  }

  return (
    <div>
      <Header
        t={t}
        onSwitchLanguage={() =>
          setState((s) => ({ ...s, locale: s.locale === "en" ? "ar" : "en" }))
        }
        onReset={reset}
      />

      <Hero t={t} />

      <main className="relative mx-auto max-w-6xl px-6 pb-32 md:px-10">
        {/* Salary */}
        <section className="pt-16 md:pt-24">
          <SectionHeader
            index="01"
            eyebrow={t.heroEyebrow}
            title={t.sectionSalary}
            description={t.salaryHelp}
          />
          <SpotlightCard className="p-5 md:p-7">
            <MoneyInputRow
              id="salary"
              value={state.salary}
              onChange={(v) => setState((s) => ({ ...s, salary: v }))}
              t={t}
            />
          </SpotlightCard>
        </section>

        {/* Transport */}
        <section className="pt-20 md:pt-28">
          <SectionHeader
            index="02"
            eyebrow={t.heroEyebrow}
            title={t.sectionTransport}
            description={t.transportPercentHint}
          />
          <SpotlightCard className="p-5 md:p-7">
            <FieldLabel>{t.transportType}</FieldLabel>
            <div className="mt-3 inline-flex rounded-lg border border-white/10 bg-black/30 p-0.5">
              {(
                [
                  { k: "percent", label: t.transportPercent },
                  { k: "fixed", label: t.transportFixed },
                ] as const
              ).map((o) => {
                const active = state.transportMode === o.k;
                return (
                  <button
                    key={o.k}
                    type="button"
                    onClick={() => setState((s) => ({ ...s, transportMode: o.k }))}
                    className={`rounded-md px-4 py-2 text-xs font-medium transition-all duration-200 ease-expo ${
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

            <div className="mt-6">
              {state.transportMode === "percent" ? (
                <div className="flex items-center gap-6 rounded-xl border border-accent/20 bg-accent/[0.06] p-6">
                  <div className="text-5xl font-semibold tracking-tight md:text-6xl">
                    <span className="text-gradient-accent">10%</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.transportPercent}</p>
                    <p className="mt-1 text-sm text-fg-muted">
                      {t.transportPercentHint}
                    </p>
                  </div>
                </div>
              ) : (
                <MoneyInputRow
                  id="transport-fixed"
                  value={state.transportFixed}
                  onChange={(v) => setState((s) => ({ ...s, transportFixed: v }))}
                  t={t}
                />
              )}
            </div>
          </SpotlightCard>
        </section>

        {/* Exemptions */}
        <section className="pt-20 md:pt-28">
          <SectionHeader
            index="03"
            eyebrow={t.heroEyebrow}
            title={t.sectionExemptions}
          />

          {/* Two featured cards */}
          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Personal — always on */}
            <SpotlightCard className="relative overflow-hidden p-6 md:p-7">
              <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
              <SectionTag>{t.personalExemption}</SectionTag>
              <p className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                <span className="text-gradient-accent">₪ 36,000</span>
              </p>
              <p className="mt-3 text-sm text-fg-muted">{t.personalExemptionHint}</p>
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-fg-muted">
                / {t.annually}
              </div>
            </SpotlightCard>

            {/* Housing */}
            <SpotlightCard className="relative p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    id="housing-label"
                    className="text-lg font-semibold tracking-tight md:text-xl"
                  >
                    {t.housingExemption}
                  </h3>
                  <p className="mt-1 text-sm text-fg-muted">
                    {t.housingExemptionHint}
                  </p>
                </div>
                <Toggle
                  value={state.housing}
                  onChange={(v) => setState((s) => ({ ...s, housing: v }))}
                  t={t}
                  labelId="housing-label"
                />
              </div>
              <p
                className={`mt-5 text-4xl font-semibold tracking-tight md:text-5xl ${
                  state.housing ? "" : "text-fg-muted"
                }`}
              >
                {state.housing ? (
                  <span className="text-gradient-fg">₪ 30,000</span>
                ) : (
                  "₪ 30,000"
                )}
              </p>
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-fg-muted">
                / {t.annually}
              </div>
            </SpotlightCard>
          </div>

          {/* Optional exemptions */}
          <div className="grid grid-cols-1 gap-4">
            <ExemptionRow
              id="parents"
              title={t.parentsExemption}
              enabled={state.optional.parents.enabled}
              onToggle={(v) => setOptional("parents", { enabled: v })}
              value={state.optional.parents.value}
              onChange={(v) => setOptional("parents", { value: v })}
              t={t}
            />
            <ExemptionRow
              id="university"
              title={t.universityExemption}
              enabled={state.optional.university.enabled}
              onToggle={(v) => setOptional("university", { enabled: v })}
              value={state.optional.university.value}
              onChange={(v) => setOptional("university", { value: v })}
              t={t}
            />
            <ExemptionRow
              id="college"
              title={t.collegeExemption}
              enabled={state.optional.college.enabled}
              onToggle={(v) => setOptional("college", { enabled: v })}
              value={state.optional.college.value}
              onChange={(v) => setOptional("college", { value: v })}
              t={t}
            />
            <ExemptionRow
              id="loans"
              title={t.loansExemption}
              enabled={state.optional.loans.enabled}
              onToggle={(v) => setOptional("loans", { enabled: v })}
              value={state.optional.loans.value}
              onChange={(v) => setOptional("loans", { value: v })}
              t={t}
            />
            <ExemptionRow
              id="other"
              title={t.otherExemption}
              enabled={state.optional.other.enabled}
              onToggle={(v) => setOptional("other", { enabled: v })}
              value={state.optional.other.value}
              onChange={(v) => setOptional("other", { value: v })}
              t={t}
            />
          </div>
        </section>

        {/* Exchange */}
        <section className="pt-20 md:pt-28">
          <SectionHeader
            index="04"
            eyebrow={t.heroEyebrow}
            title={t.sectionRates}
            description={t.ratesHint}
          />
          <ExchangeRates
            rates={state.rates}
            onChange={(r) => setState((s) => ({ ...s, rates: r }))}
            fetchedAt={state.ratesFetchedAt}
            onFetched={(at) => setState((s) => ({ ...s, ratesFetchedAt: at }))}
            locale={state.locale}
            t={t}
          />
        </section>

        {/* Breakdown */}
        <section className="pt-24 md:pt-32" id="breakdown">
          <SectionHeader
            index="05"
            eyebrow={t.heroEyebrow}
            title={t.sectionBreakdown}
          />
          <TaxBreakdownView
            breakdown={breakdown}
            locale={state.locale}
            t={t}
            viewCurrency={state.viewCurrency}
            viewPeriod={state.viewPeriod}
            onChangeView={({ currency, period }) =>
              setState((s) => ({ ...s, viewCurrency: currency, viewPeriod: period }))
            }
            rates={state.rates}
          />
        </section>
      </main>

      <Footer t={t} />
    </div>
  );
}

function Header({
  t,
  onSwitchLanguage,
  onReset,
}: {
  t: Dict;
  onSwitchLanguage: () => void;
  onReset: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-bg-base/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5 md:px-10">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="hidden h-5 w-px bg-white/10 md:block" />
          <span className="hidden text-sm text-fg-muted md:block">
            Palestinian Income Tax
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg px-3 py-2 text-xs font-medium text-fg-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
          >
            {t.reset}
          </button>
          <button
            type="button"
            onClick={onSwitchLanguage}
            className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white shadow-accent transition-all duration-200 ease-expo hover:bg-accent-bright hover:shadow-accent-hover active:scale-[0.98]"
          >
            {t.language}
          </button>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg border border-accent/40 bg-gradient-to-br from-accent/30 to-accent/10 shadow-[0_0_20px_rgba(94,106,210,0.35)]">
        <span className="font-mono text-[11px] font-bold text-white">PS</span>
      </span>
      <span className="font-mono text-sm font-semibold tracking-tight text-fg">TAX</span>
    </div>
  );
}

function Hero({ t }: { t: Dict }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32">
        <div className="mb-8 flex justify-center md:mb-10">
          <SectionTag>{t.heroEyebrow}</SectionTag>
        </div>

        <h1 className="mx-auto max-w-4xl text-center font-semibold leading-[0.95] tracking-displayed">
          <span className="block text-5xl md:text-6xl lg:text-7xl">
            <span className="text-gradient-fg">{t.heroHeadlinePart1}</span>
          </span>
          <span className="mt-3 block text-5xl md:text-6xl lg:text-7xl">
            <span className="text-gradient-accent">{t.heroHeadlinePart2}</span>
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-fg-muted md:text-lg">
          {t.heroLead}
        </p>

        {/* Bracket glass pills */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <BracketPill label="Bracket I" rate="5%" range={t.bracket1Range} />
          <BracketPill label="Bracket II" rate="10%" range={t.bracket2Range} emphasize />
          <BracketPill label="Bracket III" rate="15%" range={t.bracket3Range} />
        </div>
      </div>
    </section>
  );
}

function BracketPill({
  label,
  rate,
  range,
  emphasize,
}: {
  label: string;
  rate: string;
  range: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 backdrop-blur-md transition-all duration-300 ease-expo hover:-translate-y-1 ${
        emphasize
          ? "border-accent/30 bg-gradient-to-b from-accent/[0.10] to-accent/[0.02] shadow-[0_0_0_1px_rgba(94,106,210,0.15),0_8px_30px_rgba(94,106,210,0.10)]"
          : "border-white/[0.06] bg-gradient-to-b from-white/[0.05] to-white/[0.01] shadow-card hover:shadow-card-hover"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        <span className={emphasize ? "text-gradient-accent" : "text-gradient-fg"}>
          {rate}
        </span>
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">
        {range}
      </p>
    </div>
  );
}

function Footer({ t }: { t: Dict }) {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3 md:px-10 md:py-24">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-6 max-w-md text-base text-fg">{t.footerNote}</p>
        </div>
        <div>
          <p className="text-sm leading-relaxed text-fg-muted">
            {t.footerDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
