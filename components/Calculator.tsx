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
import { formatMoney, formatPercent } from "@/lib/format";
import { MoneyInputRow } from "./ui/MoneyInputRow";
import { Toggle } from "./ui/Toggle";
import { ExemptionRow } from "./ExemptionRow";
import { ExchangeRates } from "./ExchangeRates";
import { TaxBreakdownView } from "./TaxBreakdown";

const STORAGE_KEY = "ps_tax__state_v3";

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
  const [step, setStep] = useState(1);
  const [showRates, setShowRates] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    if (typeof document !== "undefined") {
      document.documentElement.lang = state.locale;
      document.documentElement.dir = isRtl(state.locale) ? "rtl" : "ltr";
    }
  }, [state, hydrated]);

  const t: Dict = dictionaries[state.locale];

  const input: CalculatorInput = useMemo(() => ({
    salary: state.salary,
    transportation:
      state.transportMode === "percent"
        ? ({ mode: "percent" } as Transportation)
        : ({ mode: "fixed", value: state.transportFixed } as Transportation),
    housingEnabled: state.housing,
    optional: state.optional,
    rates: state.rates,
  }), [state]);

  const breakdown = useMemo(() => calculate(input), [input]);

  function setOptional(key: OptionalExemptionKey, patch: Partial<OptionalExemption>) {
    setState((s) => ({
      ...s,
      optional: { ...s.optional, [key]: { ...s.optional[key], ...patch } },
    }));
  }

  // Preserve locale on reset
  function reset() {
    setState((s) => ({ ...DEFAULT_STATE, locale: s.locale }));
    setStep(1);
  }

  const stepLabels = [t.sectionSalary, t.sectionExemptions, t.sectionBreakdown];

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:bg-bg hover:text-fg"
            >
              {t.reset}
            </button>
            <button
              type="button"
              onClick={() =>
                setState((s) => ({ ...s, locale: s.locale === "en" ? "ar" : "en" }))
              }
              className="rounded-lg border border-primary/30 bg-primary-light px-4 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white"
            >
              {t.language}
            </button>
          </div>
        </div>
      </header>

      {/* ── Live summary bar (steps 2 & 3) ── */}
      {step > 1 && (
        <div className="border-b border-border bg-white">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-fg-muted">{t.breakdownTotalTax}:</span>
              <span className="text-sm font-bold text-danger">
                {formatMoney(
                  breakdown.totalTaxIls / (state.viewPeriod === "monthly" ? 12 : 1),
                  "ILS",
                  state.locale,
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-fg-muted">{t.breakdownNet}:</span>
              <span className="text-sm font-bold text-success">
                {formatMoney(
                  breakdown.netAnnualIls / (state.viewPeriod === "monthly" ? 12 : 1),
                  "ILS",
                  state.locale,
                )}
              </span>
              <span className="hidden text-xs text-fg-subtle sm:inline">
                · {formatPercent(breakdown.effectiveRate, state.locale)}
              </span>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        {/* ── Step indicator ── */}
        <StepIndicator current={step} labels={stepLabels} />

        {/* ── Step card ── */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card">
          {/* Step title bar */}
          <div className="border-b border-border bg-bg px-5 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              Step {step} of 3
            </p>
            <h2 className="mt-0.5 text-lg font-bold text-fg">{stepLabels[step - 1]}</h2>
          </div>

          {/* Animated step content */}
          <div key={step} className="animate-fade-up p-5">
            {step === 1 && (
              <StepIncome state={state} setState={setState} t={t} />
            )}
            {step === 2 && (
              <StepExemptions
                state={state}
                setState={setState}
                setOptional={setOptional}
                showRates={showRates}
                setShowRates={setShowRates}
                t={t}
              />
            )}
            {step === 3 && (
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
            )}
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="mt-4 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-fg-muted transition-all hover:border-border-strong hover:text-fg"
            >
              ← {t.back}
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step === 3 && <ShareButton t={t} />}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="rounded-xl bg-primary px-7 py-2.5 text-sm font-semibold text-white shadow-btn-primary transition-all hover:bg-primary-dark active:scale-[0.98]"
              >
                {t.next} →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-fg-muted transition-all hover:border-border-strong hover:text-fg"
              >
                ← {t.calculate}
              </button>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-10 border-t border-border pt-5 text-center">
          <div className="mb-2 flex items-center justify-center gap-1.5">
            <span className="text-base">🇵🇸</span>
            <span className="text-xs font-semibold text-fg-muted">Palestine Income Tax Calculator</span>
          </div>
          <p className="text-xs leading-relaxed text-fg-subtle">{t.footerDisclaimer}</p>
        </footer>
      </main>
    </div>
  );
}

/* ── Step 1: Income ── */
function StepIncome({
  state,
  setState,
  t,
}: {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
  t: Dict;
}) {
  return (
    <div className="space-y-6">
      {/* Salary */}
      <div>
        <p className="mb-1 text-sm font-semibold text-fg">{t.sectionSalary}</p>
        <p className="mb-3 text-xs text-fg-muted">{t.salaryHelp}</p>
        <MoneyInputRow
          id="salary"
          value={state.salary}
          onChange={(v) => setState((s) => ({ ...s, salary: v }))}
          t={t}
        />
      </div>

      <div className="h-px bg-border" />

      {/* Transportation */}
      <div>
        <p className="mb-1 text-sm font-semibold text-fg">{t.sectionTransport}</p>
        {/* Dynamic hint based on selected mode */}
        <p className="mb-3 text-xs text-fg-muted">
          {state.transportMode === "percent" ? t.transportPercentHint : t.transportFixedHint}
        </p>

        {/* Mode selector */}
        <div className="mb-4 inline-flex rounded-lg border border-border bg-bg p-1">
          {(
            [
              { k: "percent" as const, label: t.transportPercent },
              { k: "fixed" as const, label: t.transportFixed },
            ] as const
          ).map((o) => {
            const active = state.transportMode === o.k;
            return (
              <button
                key={o.k}
                type="button"
                onClick={() => setState((s) => ({ ...s, transportMode: o.k }))}
                className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${
                  active
                    ? "bg-primary text-white shadow-btn-primary"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        {state.transportMode === "percent" ? (
          <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary-light/40 p-4">
            <span className="text-3xl font-extrabold text-primary">10%</span>
            <p className="text-xs text-fg-muted">{t.transportPercentHint}</p>
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
    </div>
  );
}

/* ── Step 2: Exemptions ── */
function StepExemptions({
  state,
  setState,
  setOptional,
  showRates,
  setShowRates,
  t,
}: {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
  setOptional: (key: OptionalExemptionKey, patch: Partial<OptionalExemption>) => void;
  showRates: boolean;
  setShowRates: (v: boolean) => void;
  t: Dict;
}) {
  return (
    <div className="space-y-3">
      {/* Personal (auto, always on) */}
      <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success-light/40 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-fg">{t.personalExemption}</p>
          <p className="text-xs text-fg-muted">{t.personalExemptionHint}</p>
        </div>
        <span className="shrink-0 text-sm font-bold text-success">₪ 36,000</span>
      </div>

      {/* Housing — fixed amount, toggle only */}
      <div
        className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all duration-200 ${
          state.housing
            ? "border-primary/30 bg-primary-light/20"
            : "border-border bg-bg-card"
        }`}
      >
        <div className="min-w-0">
          <p id="housing-label" className="text-sm font-semibold text-fg">
            {t.housingExemption}
          </p>
          <p className="text-xs text-fg-muted">{t.housingExemptionHint}</p>
        </div>
        <div className="ms-3 flex shrink-0 items-center gap-3">
          <span
            className={`text-sm font-bold transition-colors ${
              state.housing ? "text-primary" : "text-fg-subtle"
            }`}
          >
            ₪ 30,000
          </span>
          <Toggle
            value={state.housing}
            onChange={(v) => setState((s) => ({ ...s, housing: v }))}
            t={t}
            labelId="housing-label"
            showLabel={false}
          />
        </div>
      </div>

      {/* Variable optional exemptions */}
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

      {/* Exchange rates — collapsible */}
      <div className="rounded-xl border border-border bg-bg-card">
        <button
          type="button"
          onClick={() => setShowRates(!showRates)}
          className="flex w-full items-center justify-between px-4 py-3"
        >
          <span className="text-sm font-semibold text-fg">{t.sectionRates}</span>
          <span className="text-xs text-fg-muted">{showRates ? "▲" : "▼"}</span>
        </button>
        {showRates && (
          <div className="border-t border-border px-4 pb-4 pt-3">
            <p className="mb-3 text-xs text-fg-muted">{t.ratesHint}</p>
            <ExchangeRates
              rates={state.rates}
              onChange={(r) => setState((s) => ({ ...s, rates: r }))}
              fetchedAt={state.ratesFetchedAt}
              onFetched={(at) => setState((s) => ({ ...s, ratesFetchedAt: at }))}
              locale={state.locale}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Share button ── */
function ShareButton({ t }: { t: Dict }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = "https://ps-tax.web.app";
    const title = "Palestine Income Tax Calculator";
    const text = "Calculate your Palestinian income tax — free, bilingual, ILS/USD/JOD.";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch { /* user cancelled or not supported */ }
    }

    // Fallback: clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
        copied
          ? "border-success/40 bg-success-light text-success"
          : "border-border text-fg-muted hover:border-border-strong hover:text-fg"
      }`}
    >
      {copied ? (
        <>✓ {t.copied}</>
      ) : (
        <>↗ {t.share}</>
      )}
    </button>
  );
}

/* ── Step indicator ── */
function StepIndicator({
  current,
  labels,
}: {
  current: number;
  labels: string[];
}) {
  return (
    <div className="flex items-center justify-center">
      {labels.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  done
                    ? "bg-primary text-white"
                    : active
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "border-2 border-border-strong text-fg-muted bg-bg-card"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`max-w-[72px] text-center text-[10px] font-semibold leading-tight ${
                  active ? "text-primary" : done ? "text-fg-muted" : "text-fg-subtle"
                }`}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                className={`mx-2 mb-5 h-0.5 w-10 rounded-full transition-all duration-500 sm:w-16 ${
                  done ? "bg-primary" : "bg-border-strong"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Logo ── */
function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-2xl leading-none">🇵🇸</span>
      <div>
        <p className="text-sm font-extrabold leading-tight tracking-tight text-fg">
          Palestine Income Tax
        </p>
        <p className="text-[10px] font-medium leading-tight tracking-widest text-fg-muted uppercase">
          Calculator
        </p>
      </div>
    </div>
  );
}
