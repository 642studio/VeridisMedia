import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Patrocinios",
  description:
    "No vendemos anuncios, vendemos presencia real: integración en contenido, menciones, overlays, entrevistas, recaps y alcance orgánico en red.",
};

const presencias = [
  "Presencia en transmisiones",
  "Integración en contenido",
  "Menciones del host",
  "Overlays y gráficos en vivo",
  "Entrevistas y videos comerciales",
  "Recaps y galerías",
  "Publicaciones en red de páginas aliadas",
  "Asociación con eventos culturales y comunitarios",
];

const beneficios = [
  {
    title: "Alcance orgánico real",
    body: "Tus marcas se distribuyen desde Veridis, 642 Studio, 642 News, páginas aliadas y comunidades locales — no desde una sola página aislada.",
  },
  {
    title: "Integración, no interrupción",
    body: "En vez de un banner que se ignora, tu marca vive dentro del contenido: menciones, overlays, entrevistas y recaps.",
  },
  {
    title: "Asociación con cultura",
    body: "Te vinculamos con eventos culturales, deportivos y comunitarios que la gente de la región realmente sigue.",
  },
  {
    title: "Contenido que permanece",
    body: "Las coberturas viven en el archivo del sitio: tu presencia se sigue viendo mucho después del evento.",
  },
];

const casos = [
  "Comercios locales que buscan presencia en eventos comunitarios",
  "Cámaras e instituciones que quieren asociarse a cultura y deporte",
  "Marcas regionales que buscan alcance en el sur de Sonora",
  "Empresas que quieren su propio contenido producido y difundido",
];

export default function PatrociniosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Patrocinios"
        title="No vendemos anuncios. Vendemos presencia real."
        intro="VERIDIS conecta tu marca con audiencias reales a través de cobertura, contenido y una red de difusión — con alcance orgánico que un anuncio tradicional no da."
      >
        <div className="mt-8 flex gap-3">
          <Button href="/contacto" variant="reactor">
            Quiero patrocinar una cobertura
          </Button>
        </div>
      </PageHeader>

      {/* Tipos de presencia */}
      <section className="container-page py-12 md:py-16">
        <Eyebrow>Tipos de presencia</Eyebrow>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {presencias.map((p) => (
            <div
              key={p}
              className="rounded-[16px] border border-fern bg-carbon p-4 text-[14px] text-phosphor"
            >
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* Beneficios */}
      <section className="border-t border-fern">
        <div className="container-page py-12 md:py-16">
          <Eyebrow>Beneficios</Eyebrow>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {beneficios.map((b) => (
              <article key={b.title} className="rounded-[16px] border border-fern bg-carbon p-6">
                <h3 className="text-[20px] font-medium text-phosphor">{b.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-lichen">{b.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Casos de uso */}
      <section className="border-t border-fern">
        <div className="container-page py-12 md:py-16">
          <Eyebrow>Casos de uso</Eyebrow>
          <ul className="mt-6 divide-y divide-fern border-y border-fern">
            {casos.map((c) => (
              <li key={c} className="flex items-center gap-3 py-4 text-[16px] text-phosphor">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-fern">
        <div className="container-page flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl font-display text-[28px] font-medium leading-tight text-phosphor">
            Asóciate a las coberturas que la región está viendo.
          </h2>
          <Button href="/contacto" variant="reactor">
            Solicitar propuesta de patrocinio
          </Button>
        </div>
      </section>
    </>
  );
}
