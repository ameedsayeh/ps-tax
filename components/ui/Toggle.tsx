"use client";

import type { Dict } from "@/lib/i18n";

export function Toggle({
  value,
  onChange,
  t,
  labelId,
  showLabel = true,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  t: Dict;
  labelId?: string;
  showLabel?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-labelledby={labelId}
      onClick={() => onChange(!value)}
      className="inline-flex shrink-0 items-center gap-2 text-xs"
    >
      {/* Track */}
      <span
        className={`relative flex h-6 w-11 items-center rounded-full border transition-all duration-200 ease-expo ${
          value
            ? "border-primary bg-primary"
            : "border-border-strong bg-fg-subtle/20"
        }`}
      >
        {/* Knob */}
        <span
          className={`absolute h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all duration-200 ease-expo ${
            value
              ? "translate-x-[22px] rtl:-translate-x-[22px]"
              : "translate-x-[2px] rtl:translate-x-[2px] rtl:-translate-x-[2px]"
          }`}
          style={{
            transform: value ? "translateX(22px)" : "translateX(2px)",
          }}
        />
      </span>
      {showLabel && (
        <span
          className={`text-xs font-medium transition-colors ${
            value ? "text-primary" : "text-fg-muted"
          }`}
        >
          {value ? t.enabled : t.disabled}
        </span>
      )}
    </button>
  );
}
