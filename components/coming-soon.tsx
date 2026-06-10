import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";

/** Placeholder shell for sections planned in the next round of Fase 1. */
export function ComingSoon({
  section,
  title,
  description,
}: {
  section: string;
  title: string;
  description: string;
}) {
  return (
    <div className="container-page flex min-h-[70vh] flex-col justify-center py-20">
      <Eyebrow>{section}</Eyebrow>
      <h1 className="mt-5 max-w-3xl font-display text-[54px] font-medium leading-[1.05] tracking-[-0.02em] text-phosphor">
        {title}
      </h1>
      <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-lichen">
        {description}
      </p>
      <p className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-fern px-3 py-1 text-[12px] uppercase tracking-[0.1em] text-slate">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan live-dot" />
        En construcción
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/" variant="ghost">
          Volver al inicio
        </Button>
        <Button href="/contacto" variant="reactor">
          Contáctanos
        </Button>
      </div>
    </div>
  );
}
