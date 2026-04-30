import { ReactNode } from "react";

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
  return (
    <Tag
      id={id}
      className={`rounded-2xl border border-border bg-bg-card shadow-card ${className}`}
    >
      {children}
    </Tag>
  );
}
