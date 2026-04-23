"use client";

import type { Currency, MoneyInput, Period } from "@/lib/tax";
import type { Dict } from "@/lib/i18n";
import { FieldLabel } from "./Field";

type Props = {
  id: string;
  value: MoneyInput;
  onChange: (v: MoneyInput) => void;
  t: Dict;
  disabled?: boolean;
  allowedCurrencies?: Currency[];
};

const ALL_CURRENCIES: Currency[] = ["ILS", "USD", "JOD"];

export function MoneyInputRow({
  id,
  value,
  onChange,
  t,
  disabled,
  allowedCurrencies = ALL_CURRENCIES,
}: Props) {
  const dimmed = disabled ? "opacity-40 pointer-events-none" : "";

  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.05] to-white/[0.01] shadow-inset-highlight transition-all duration-300 ease-expo focus-within:border-accent/40 focus-within:shadow-[0_0_0_4px_rgba(94,106,210,0.10),inset_0_1px_0_0_rgba(255,255,255,0.10)] ${dimmed}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Amount */}
        <div className="p-5 md:col-span-6 md:p-6 md:border-e md:border-white/[0.06]">
          <FieldLabel htmlFor={`${id}-amount`}>{t.amount}</FieldLabel>
          <input
            id={`${id}-amount`}
            type="number"
            inputMode="decimal"
            value={Number.isFinite(value.amount) ? value.amount : 0}
            min={0}
            step="any"
            disabled={disabled}
            onChange={(e) => {
              const raw = e.target.value;
              const n = raw === "" ? 0 : Number(raw);
              onChange({ ...value, amount: Number.isNaN(n) ? 0 : n });
            }}
            className="mt-3 w-full bg-transparent text-3xl font-semibold tracking-tight text-fg outline-none placeholder:text-fg-muted/60 md:text-4xl"
          />
        </div>

        {/* Currency */}
        <div className="p-5 md:col-span-3 md:p-6 md:border-e md:border-white/[0.06] border-t border-white/[0.06] md:border-t-0">
          <FieldLabel>{t.currency}</FieldLabel>
          <div className="mt-3 inline-flex rounded-lg border border-white/10 bg-black/30 p-0.5">
            {allowedCurrencies.map((c) => {
              const active = value.currency === c;
              return (
                <button
                  key={c}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...value, currency: c })}
                  className={`rounded-md px-3 py-1.5 font-mono text-xs transition-all duration-200 ease-expo ${
                    active
                      ? "bg-accent text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_2px_8px_rgba(94,106,210,0.35)]"
                      : "text-fg-muted hover:text-fg hover:bg-white/[0.06]"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Period */}
        <div className="p-5 md:col-span-3 md:p-6 border-t border-white/[0.06] md:border-t-0">
          <FieldLabel>{t.period}</FieldLabel>
          <div className="mt-3 inline-flex rounded-lg border border-white/10 bg-black/30 p-0.5">
            {(["monthly", "annually"] as Period[]).map((p) => {
              const active = value.period === p;
              return (
                <button
                  key={p}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...value, period: p })}
                  className={`rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-200 ease-expo ${
                    active
                      ? "bg-accent text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_2px_8px_rgba(94,106,210,0.35)]"
                      : "text-fg-muted hover:text-fg hover:bg-white/[0.06]"
                  }`}
                >
                  {p === "monthly" ? t.monthly : t.annually}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
