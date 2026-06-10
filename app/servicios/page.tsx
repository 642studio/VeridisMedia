import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Streaming profesional, cobertura editorial, medio + difusión, programas recurrentes, canales de marca y retainers institucionales.",
};

export default function ServiciosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Servicios"
        title="Tu evento no solo se transmite. Se convierte en contenido."
        intro="Desde la transmisión técnica hasta la cobertura editorial completa con difusión en red. Elige la línea que se ajusta a tu evento o proyecto."
      />

      <section className="container-page py-12 md:py-16">
        <div className="space-y-4">
          {services.map((service, i) => (
            <article
              key={service.slug}
              className="grid gap-6 rounded-[16px] border border-fern bg-carbon p-6 md:grid-cols-[1fr_1.4fr] md:p-8"
            >
              <div>
                <span className="font-display text-[14px] text-stone">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-2 font-display text-[24px] font-medium leading-tight text-phosphor">
                  {service.name}
                </h2>
                <p className="mt-2 text-[14px] text-cyan">{service.tagline}</p>
              </div>
              <div>
                <p className="text-[15px] leading-relaxed text-lichen">
                  {service.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-fern px-3 py-1 text-[12px] text-sage-tint"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-fern">
        <div className="container-page flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl font-display text-[28px] font-medium leading-tight text-phosphor">
            ¿No sabes qué paquete necesitas? Te armamos una propuesta a la medida.
          </h2>
          <div className="flex gap-3">
            <Button href="/contacto" variant="reactor">
              Solicitar propuesta
            </Button>
            <Button href="/patrocinios" variant="ghost">
              Ver patrocinios
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
