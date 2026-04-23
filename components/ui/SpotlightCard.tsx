"use client";

import { ReactNode, useRef } from "react";

type Props = {
  as?: "div" | "section" | "article";
  className?: string;
  children: ReactNode;
  id?: string;
};

export function SpotlightCard({
  as: Tag = "div",
  className = "",
  children,
  id,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <Tag
      ref={ref as never}
      id={id}
      onMouseMove={handleMove}
      className={`spotlight relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-card transition-all duration-300 ease-expo hover:border-white/[0.10] hover:shadow-card-hover ${className}`}
    >
      {children}
    </Tag>
  );
}
