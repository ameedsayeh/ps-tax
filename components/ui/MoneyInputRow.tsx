"use client";

import { useState, useEffect } from "react";
import type { Currency, MoneyInput, Period } from "@/lib/tax";
import type { Dict } from "@/lib/i18n";

const ALL_CURRENCIES: Currency[] = ["ILS", "USD", "JOD"];

/** String-state input that lets users freely delete digits without fighting a controlled number. */
function AmountInput({
  id,
  value,
  onChange,
  disabled,
}: {
  id: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const [str, setStr] = useState(value === 0 ? "" : String(value));

  // Sync string when the external value changes (e.g. reset)
  useEffect(() => {
    const parsed = parseFloat(str);
    const externalIsZero = value === 0;
    const localMatchesExternal = !isNaN(parsed) && parsed === value;
    if (!localMatchesExternal && !(externalIsZero && (str === "" || str === "0"))) {
      setStr(value === 0 ? "" : String(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      value={str}
      disabled={disabled}
      placeholder="0"
      onChange={(e) => {
        let raw = e.target.value.replace(/[^\d.]/g, "");

        // Strip leading zeros (e.g. "06000" → "6000"), but keep "0" and "0.x"
        if (raw.length > 1 && raw.startsWith("0") && !raw.startsWith("0.")) {
          raw = raw.replace(/^0+/, "") || "0";
        }

        // Allow only one decimal point
        const dotIdx = raw.indexOf(".");
        if (dotIdx !== -1) {
          raw = raw.slice(0, dotIdx + 1) + raw.slice(dotIdx + 1).replace(/\./g, "");
        }

        setStr(raw);
        const n = raw === "" ? 0 : parseFloat(raw);
        onChange(isNaN(n) ? 0 : n);
      }}
      className="w-full bg-transparent text-2xl font-bold tracking-tight text-fg outline-none placeholder:text-fg-subtle"
    />
  );
}

type Props = {
  id: string;
  value: MoneyInput;
  onChange: (v: MoneyInput) => void;
  t: Dict;
  disabled?: boolean;
  allowedCurrencies?: Currency[];
};

export function MoneyInputRow({
  id,
  value,
  onChange,
  t,
  disabled,
  allowedCurrencies = ALL_CURRENCIES,
}: Props) {
  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${
        disabled ? "pointer-events-none opacity-40" : ""
      }`}
    >
      {/* Amount */}
      <div className="sm:col-span-1">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-muted">
          {t.amount}
        </p>
        <div className="rounded-xl border border-border bg-bg px-4 py-3 transition-all focus-within:border-primary focus-within:shadow-input-focus">
          <AmountInput
            id={`${id}-amount`}
            value={value.amount}
            onChange={(v) => onChange({ ...value, amount: v })}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Currency */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-muted">
          {t.currency}
        </p>
        <div className="flex h-[52px] rounded-xl border border-border bg-bg p-1">
          {allowedCurrencies.map((c) => {
            const active = value.currency === c;
            return (
              <button
                key={c}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...value, currency: c })}
                className={`flex-1 rounded-lg text-xs font-bold transition-all duration-150 ${
                  active
                    ? "bg-primary text-white shadow-btn-primary"
                    : "text-fg-muted hover:bg-fg-subtle/10 hover:text-fg"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Period */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-muted">
          {t.period}
        </p>
        <div className="flex h-[52px] rounded-xl border border-border bg-bg p-1">
          {(["monthly", "annually"] as Period[]).map((p) => {
            const active = value.period === p;
            return (
              <button
                key={p}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...value, period: p })}
                className={`flex-1 rounded-lg text-xs font-bold transition-all duration-150 ${
                  active
                    ? "bg-primary text-white shadow-btn-primary"
                    : "text-fg-muted hover:bg-fg-subtle/10 hover:text-fg"
                }`}
              >
                {p === "monthly" ? t.monthly : t.annually}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
