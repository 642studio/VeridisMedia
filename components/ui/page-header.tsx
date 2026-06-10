import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";

/** Encabezado de sección reutilizable: eyebrow + título display + intro. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-fern">
      <div className="container-page py-16 md:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-3xl font-display text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-phosphor md:text-[54px]">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-lichen">
            {intro}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
