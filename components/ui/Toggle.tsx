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
      className="inline-flex shrink-0 items-center gap-2"
    >
      {/* Track — always left-to-right regardless of text direction */}
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 ${
          value
            ? "border-primary bg-primary"
            : "border-border-strong bg-fg-subtle/20"
        }`}
        style={{ direction: "ltr" }}
      >
        {/* Knob — anchored to left edge so translateX is always RTL-safe */}
        <span
          className="absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-expo"
          style={{
            left: 0,
            transform: value ? "translateX(22px)" : "translateX(3px)",
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
