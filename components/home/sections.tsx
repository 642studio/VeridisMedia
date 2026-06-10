import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { services } from "@/content/services";
import { events } from "@/content/events";
import { mediaItems } from "@/content/media";
import { sponsors } from "@/content/sponsors";

const statusLabel: Record<string, string> = {
  proximo: "Próximo",
  "en-vivo": "En vivo",
  finalizado: "Finalizado",
};

/* ---- Qué es Veridis Media ------------------------------------------------ */
function WhatIs() {
  return (
    <section className="border-t border-fern">
      <div className="container-page grid gap-10 py-20 md:grid-cols-[0.9fr_1.1fr] md:py-28">
        <div>
          <Eyebrow>Qué es Veridis Media</Eyebrow>
          <h2 className="mt-5 font-display text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-phosphor">
            Una plataforma de medios nacida en Sonora.
          </h2>
        </div>
        <div className="space-y-5 text-[16px] leading-relaxed text-lichen">
          <p>
            VERIDIS MEDIA es una empresa de medios digitales, producción audiovisual y
            transmisiones en vivo. No solo transmitimos eventos: los convertimos en
            contenido y los amplificamos a través de una red de páginas y comunidades.
          </p>
          <p>
            Operamos como canal digital, plataforma de medios y productora en vivo a la
            vez. Iniciamos en Navojoa con visión de expansión por todo Sonora, norte de
            Sinaloa, Guadalajara y Arizona.
          </p>
          <div className="pt-2">
            <Link
              href="/about"
              className="border-b border-stone pb-1 text-[14px] text-phosphor transition-colors hover:border-reactor hover:text-reactor"
            >
              Conoce la empresa →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Servicios destacados ------------------------------------------------ */
function FeaturedServices() {
  return (
    <section className="border-t border-fern">
      <div className="container-page py-20 md:py-28">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow>Servicios</Eyebrow>
            <h2 className="mt-5 max-w-xl font-display text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-phosphor">
              Tu evento no solo se transmite. Se convierte en contenido.
            </h2>
          </div>
          <Button href="/servicios" variant="ghost">
            Ver todos los servicios
          </Button>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.slug}
              className="flex flex-col rounded-[16px] border border-fern bg-carbon p-5 transition-colors hover:border-lichen"
            >
              <h3 className="text-[20px] font-medium leading-snug text-phosphor">
                {service.name}
              </h3>
              <p className="mt-2 text-[14px] text-reactor">{service.tagline}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-lichen">
                {service.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {service.includes.slice(0, 4).map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-fern px-2.5 py-1 text-[12px] text-lichen"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Últimas transmisiones ----------------------------------------------- */
function LatestMedia() {
  return (
    <section className="border-t border-fern">
      <div className="container-page py-20 md:py-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Eyebrow>Últimas transmisiones</Eyebrow>
            <h2 className="mt-5 font-display text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-phosphor">
              Del archivo de VERIDIS
            </h2>
          </div>
          <Link
            href="/media"
            className="hidden border-b border-stone pb-1 text-[14px] text-phosphor hover:border-reactor hover:text-reactor sm:inline-block"
          >
            Ir a Media →
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mediaItems.map((item) => (
            <article
              key={item.slug}
              className="group overflow-hidden rounded-[16px] border border-fern bg-carbon"
            >
              <div className="relative flex aspect-video items-center justify-center bg-moss">
                <span className="text-[11px] uppercase tracking-[0.15em] text-lichen">
                  {item.type}
                </span>
                <span className="absolute right-2 top-2 rounded-full bg-void/70 px-2 py-0.5 text-[11px] text-sage-tint">
                  {item.city}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-[15px] font-medium leading-snug text-phosphor group-hover:text-reactor">
                  {item.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[13px] text-lichen">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Próximos eventos ---------------------------------------------------- */
function UpcomingEvents() {
  const upcoming = events.filter((e) => e.status !== "finalizado");
  return (
    <section className="border-t border-fern">
      <div className="container-page py-20 md:py-28">
        <Eyebrow>Próximos eventos</Eyebrow>
        <h2 className="mt-5 font-display text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-phosphor">
          Agenda en vivo
        </h2>

        <div className="mt-12 divide-y divide-fern border-y border-fern">
          {upcoming.map((event) => (
            <Link
              key={event.slug}
              href={`/eventos/${event.slug}`}
              className="group flex flex-col gap-2 py-6 transition-colors hover:bg-carbon md:flex-row md:items-center md:gap-8 md:px-2"
            >
              <span className="w-28 shrink-0 text-[13px] uppercase tracking-[0.1em] text-reactor">
                {statusLabel[event.status]}
              </span>
              <span className="flex-1 text-[20px] font-medium text-phosphor group-hover:text-reactor">
                {event.title}
              </span>
              <span className="text-[14px] text-lichen">{event.city}</span>
              <span className="text-[14px] text-stone md:w-32 md:text-right">
                {event.startDate}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Patrocinadores / aliados (logo strip) ------------------------------- */
function SponsorStrip() {
  return (
    <section className="border-t border-fern">
      <div className="container-page py-16">
        <p className="text-center text-[12px] uppercase tracking-[0.1em] text-lichen">
          Patrocinadores y aliados
        </p>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-fern bg-fern sm:grid-cols-3 lg:grid-cols-6">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="flex items-center justify-center bg-void px-4 py-8 text-center text-[14px] font-medium text-stone transition-colors hover:text-phosphor"
            >
              {sponsor.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- CTA comercial de cierre --------------------------------------------- */
function ClosingCTA() {
  return (
    <section className="border-t border-fern bg-void">
      <div className="container-page grid items-center gap-10 py-24 md:grid-cols-[1.2fr_0.8fr] md:py-32">
        <div>
          <Eyebrow>Trabaja con nosotros</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-[54px] font-medium leading-[1.05] tracking-[-0.02em] text-phosphor">
            Streaming profesional con alcance real.
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-lichen">
            Transmite tu evento, patrocina una cobertura o crea tu propio programa.
            Cobertura, contenido y difusión desde una sola plataforma.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button href="/contacto" variant="reactor" className="justify-center">
            Transmite tu evento
          </Button>
          <Button href="/patrocinios" variant="ghost" className="justify-center">
            Patrocina una cobertura
          </Button>
          <Button href="/servicios" variant="ghost" className="justify-center">
            Crea tu programa
          </Button>
        </div>
      </div>
    </section>
  );
}

export function HomeSections() {
  return (
    <>
      <WhatIs />
      <FeaturedServices />
      <LatestMedia />
      <UpcomingEvents />
      <SponsorStrip />
      <ClosingCTA />
    </>
  );
}
