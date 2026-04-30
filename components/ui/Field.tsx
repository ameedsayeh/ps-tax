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
      className="block text-xs font-semibold uppercase tracking-wider text-fg-muted"
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
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
      {children}
    </span>
  );
}

export function Divider() {
  return <div className="h-px w-full bg-border" />;
}
