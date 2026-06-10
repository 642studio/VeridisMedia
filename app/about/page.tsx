import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "VERIDIS MEDIA es una empresa de medios digitales y producción en vivo, sociedad entre 642 Studio y MV Songs, nacida en Navojoa, Sonora.",
};

const valores = [
  { title: "Producción profesional", body: "Cámaras, switch, audio y narrativa al nivel de un medio real." },
  { title: "Alcance en red", body: "Distribución desde múltiples páginas y comunidades, no una sola." },
  { title: "Raíz regional", body: "Contamos lo que pasa en el sur de Sonora, con visión de expansión." },
  { title: "Contenido que permanece", body: "Cada cobertura alimenta un archivo que crece y suma valor." },
];

const mercados = [
  "Navojoa", "Cajeme", "Guaymas", "Hermosillo",
  "Sonora", "Norte de Sinaloa", "Guadalajara", "Arizona",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nosotros"
        title="Una nueva forma de transmitir, cubrir y amplificar."
        intro="VERIDIS MEDIA nace para crear una nueva forma de transmitir, cubrir y amplificar eventos, cultura, entretenimiento y actualidad desde el sur de Sonora hacia nuevas audiencias digitales."
      />

      {/* Qué es + sociedad */}
      <section className="container-page grid gap-10 py-12 md:grid-cols-2 md:py-16">
        <div>
          <Eyebrow>Qué es VERIDIS</Eyebrow>
          <p className="mt-5 text-[16px] leading-relaxed text-lichen">
            Somos una empresa de medios digitales, producción audiovisual y transmisiones
            en vivo. Operamos como un modelo híbrido: canal digital, plataforma de medios y
            productora en vivo a la vez. No solo transmitimos eventos — los convertimos en
            contenido y los amplificamos.
          </p>
        </div>
        <div>
          <Eyebrow>La sociedad</Eyebrow>
          <p className="mt-5 text-[16px] leading-relaxed text-lichen">
            VERIDIS es una sociedad independiente 50/50 entre{" "}
            <span className="text-phosphor">642 Studio</span> (tecnología, marketing y
            desarrollo) y <span className="text-phosphor">MV Songs</span> (música, talento
            y entretenimiento). Esa alianza combina producción, tecnología y contenido en
            una sola plataforma.
          </p>
        </div>
      </section>

      {/* Misión / Visión */}
      <section className="border-t border-fern">
        <div className="container-page grid gap-4 py-12 md:grid-cols-2 md:py-16">
          <article className="rounded-[16px] border border-fern bg-carbon p-8">
            <h2 className="font-display text-[24px] font-medium text-phosphor">Misión</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-lichen">
              Transmitir, producir y amplificar eventos, cultura y actualidad con calidad
              profesional y alcance real, dándole a la región una plataforma de medios propia.
            </p>
          </article>
          <article className="rounded-[16px] border border-fern bg-carbon p-8">
            <h2 className="font-display text-[24px] font-medium text-phosphor">Visión</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-lichen">
              Convertirnos en el medio digital de referencia del sur de Sonora y escalar
              hacia nuevos mercados, construyendo audiencia propia fuera de las redes sociales.
            </p>
          </article>
        </div>
      </section>

      {/* Valores */}
      <section className="border-t border-fern">
        <div className="container-page py-12 md:py-16">
          <Eyebrow>Valores</Eyebrow>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {valores.map((v) => (
              <article key={v.title} className="rounded-[16px] border border-fern bg-carbon p-5">
                <h3 className="text-[18px] font-medium text-phosphor">{v.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-lichen">{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cobertura regional */}
      <section className="border-t border-fern">
        <div className="container-page py-12 md:py-16">
          <Eyebrow>Cobertura regional</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-[28px] font-medium leading-tight text-phosphor">
            De Navojoa para nuevas audiencias digitales.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {mercados.map((m) => (
              <span
                key={m}
                className="rounded-full border border-fern px-3.5 py-1.5 text-[13px] text-sage-tint"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-fern">
        <div className="container-page flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl font-display text-[28px] font-medium leading-tight text-phosphor">
            ¿Tienes un evento, marca o proyecto? Hagámoslo señal.
          </h2>
          <Button href="/contacto" variant="reactor">
            Contáctanos
          </Button>
        </div>
      </section>
    </>
  );
}
