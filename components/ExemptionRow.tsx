"use client";

import type { MoneyInput } from "@/lib/tax";
import type { Dict } from "@/lib/i18n";
import { MoneyInputRow } from "./ui/MoneyInputRow";
import { Toggle } from "./ui/Toggle";
import { SpotlightCard } from "./ui/SpotlightCard";

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
    <SpotlightCard className={`p-6 md:p-7 ${enabled ? "" : "opacity-80"}`}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            id={`${id}-label`}
            className="text-lg font-semibold tracking-tight text-fg md:text-xl"
          >
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-fg-muted">{description}</p>
          )}
        </div>
        <Toggle value={enabled} onChange={onToggle} t={t} labelId={`${id}-label`} />
      </div>
      <MoneyInputRow
        id={id}
        value={value}
        onChange={onChange}
        t={t}
        disabled={!enabled}
      />
    </SpotlightCard>
  );
}
