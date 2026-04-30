"use client";

import type { MoneyInput } from "@/lib/tax";
import type { Dict } from "@/lib/i18n";
import { MoneyInputRow } from "./ui/MoneyInputRow";
import { Toggle } from "./ui/Toggle";

type Props = {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  value: MoneyInput;
  onChange: (v: MoneyInput) => void;
  t: Dict;
};

export function ExemptionRow({
  id,
  title,
  description,
  enabled,
  onToggle,
  value,
  onChange,
  t,
}: Props) {
  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        enabled
          ? "border-primary/30 bg-primary-light/20"
          : "border-border bg-bg-card"
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p id={`${id}-label`} className="text-sm font-semibold text-fg">
            {title}
          </p>
          {description && (
            <p className="mt-0.5 text-xs text-fg-muted">{description}</p>
          )}
        </div>
        <Toggle
          value={enabled}
          onChange={onToggle}
          t={t}
          labelId={`${id}-label`}
          showLabel={false}
        />
      </div>

      {enabled && (
        <div className="border-t border-primary/20 px-4 pb-4 pt-3">
          <MoneyInputRow
            id={id}
            value={value}
            onChange={onChange}
            t={t}
          />
        </div>
      )}
    </div>
  );
}
