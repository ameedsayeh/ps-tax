"use client";

import type { Dict } from "@/lib/i18n";

export function Toggle({
  value,
  onChange,
  t,
  labelId,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  t: Dict;
  labelId?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-labelledby={labelId}
      onClick={() => onChange(!value)}
      className="group inline-flex items-center gap-3 text-xs"
    >
      <span
        className={`relative flex h-6 w-11 items-center rounded-full border transition-all duration-300 ease-expo ${
          value
            ? "border-accent/50 bg-accent shadow-[0_0_20px_rgba(94,106,210,0.45)]"
            : "border-white/10 bg-white/[0.06]"
        } ${value ? "justify-end" : "justify-start"}`}
      >
        <span
          className={`mx-0.5 h-5 w-5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-all duration-300 ease-expo ${
            value ? "bg-white" : "bg-white/70"
          }`}
        />
      </span>
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
          value ? "text-fg" : "text-fg-muted"
        }`}
      >
        {value ? t.enabled : t.disabled}
      </span>
    </button>
  );
}
