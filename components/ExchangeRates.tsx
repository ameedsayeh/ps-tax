"use client";

import { useState, useEffect } from "react";
import type { Rates } from "@/lib/tax";
import { fetchLiveRates } from "@/lib/exchange";
import type { Dict, Locale } from "@/lib/i18n";

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
      setError(t.ratesFailed);
    }
  }

  const when = fetchedAt
    ? new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-nu-latn" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(fetchedAt))
    : null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <RateField
          label={t.rateUsdIls}
          value={rates.usdToIls}
          onChange={(v) => onChange({ ...rates, usdToIls: v })}
        />
        <RateField
          label={t.rateJodIls}
          value={rates.jodToIls}
          onChange={(v) => onChange({ ...rates, jodToIls: v })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={doFetch}
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? t.fetching : t.fetchRates}
        </button>
        {when && (
          <p className="text-xs text-fg-muted">
            {t.ratesFetchedAt} · {when}
          </p>
        )}
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    </div>
  );
}

/** Rate input with local string state that syncs when the parent value changes (e.g. after fetch). */
function RateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [str, setStr] = useState(String(value));

  // Sync display when value changes from outside (live fetch)
  useEffect(() => {
    setStr(String(value));
  }, [value]);

  return (
    <div className="rounded-xl border border-border bg-bg p-3 transition-all focus-within:border-primary focus-within:shadow-input-focus">
      <p className="text-xs text-fg-muted">{label}</p>
      <input
        type="text"
        inputMode="decimal"
        value={str}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d.]/g, "");
          setStr(raw);
          const n = parseFloat(raw);
          if (!isNaN(n) && n > 0) onChange(n);
        }}
        className="mt-1 w-full bg-transparent text-xl font-bold text-fg outline-none"
      />
    </div>
  );
}
