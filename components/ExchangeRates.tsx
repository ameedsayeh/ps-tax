"use client";

import { useState } from "react";
import type { Rates } from "@/lib/tax";
import { fetchLiveRates } from "@/lib/exchange";
import type { Dict, Locale } from "@/lib/i18n";
import { FieldLabel, Hint } from "./ui/Field";
import { SpotlightCard } from "./ui/SpotlightCard";

type Props = {
  rates: Rates;
  onChange: (r: Rates) => void;
  fetchedAt: number | null;
  onFetched: (t: number) => void;
  locale: Locale;
  t: Dict;
};

export function ExchangeRates({
  rates,
  onChange,
  fetchedAt,
  onFetched,
  locale,
  t,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function doFetch() {
    setLoading(true);
    setError(null);
    const res = await fetchLiveRates();
    setLoading(false);
    if (res.ok) {
      onChange(res.rates);
      onFetched(res.fetchedAt);
    } else {
      setError(res.error || "unknown");
    }
  }

  const when = fetchedAt
    ? new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(fetchedAt))
    : null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
      <SpotlightCard className="p-6 md:col-span-2 md:p-7">
        <Hint>{t.ratesHint}</Hint>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={doFetch}
            disabled={loading}
            className="group inline-flex items-center justify-between gap-4 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white shadow-accent transition-all duration-200 ease-expo hover:bg-accent-bright hover:shadow-accent-hover active:scale-[0.98] disabled:opacity-60"
          >
            <span>{loading ? t.fetching : t.fetchRates}</span>
            <span className="inline-block transition-transform duration-200 ease-expo group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              →
            </span>
          </button>
          {when && (
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted">
              {t.ratesFetchedAt} · {when}
            </p>
          )}
          {error && (
            <p className="text-sm text-fg-muted">{t.ratesFailed}</p>
          )}
        </div>
      </SpotlightCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-3">
        <RateField
          label={t.rateUsdIls}
          value={rates.usdToIls}
          onChange={(v) => onChange({ ...rates, usdToIls: v })}
          suffix="ILS"
        />
        <RateField
          label={t.rateJodIls}
          value={rates.jodToIls}
          onChange={(v) => onChange({ ...rates, jodToIls: v })}
          suffix="ILS"
        />
      </div>
    </div>
  );
}

function RateField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
}) {
  return (
    <label className="block rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 shadow-inset-highlight transition-all duration-300 ease-expo focus-within:border-accent/40 focus-within:shadow-[0_0_0_4px_rgba(94,106,210,0.10),inset_0_1px_0_0_rgba(255,255,255,0.10)]">
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-3 flex items-end justify-between gap-4">
        <input
          type="number"
          step="0.0001"
          min={0}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const n = Number(e.target.value);
            onChange(Number.isNaN(n) ? 0 : n);
          }}
          className="w-full bg-transparent text-3xl font-semibold tracking-tight text-fg outline-none md:text-4xl"
        />
        <span className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-fg-muted">
          {suffix}
        </span>
      </div>
    </label>
  );
}
