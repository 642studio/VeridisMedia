import type { ReactNode } from "react";

/**
 * Eyebrow label — uppercase Inter 12px, 0.1em tracking, paired with a square
 * indicator. The "instrument panel" labeling grammar of the Modal system.
 */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[12px] font-medium uppercase leading-none tracking-[0.1em] text-lichen ${className}`}
    >
      <span className="h-1.5 w-1.5 bg-reactor" aria-hidden />
      {children}
    </span>
  );
}
