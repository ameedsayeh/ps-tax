"use client";

import { ReactNode } from "react";

export function FieldLabel({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-mono text-[10px] uppercase tracking-[0.25em] text-fg-muted"
    >
      {children}
    </label>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-fg-muted">{children}</p>;
}

export function SectionTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
      <span className="h-1 w-1 rounded-full bg-accent" />
      {children}
    </span>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <SectionTag>
          <span className="opacity-70">{index}</span>
          <span className="h-3 w-px bg-accent/40" />
          {eyebrow}
        </SectionTag>
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
        <span className="text-gradient-fg">{title}</span>
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export function Divider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  );
}
