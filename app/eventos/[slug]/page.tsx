import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { MediaCard } from "@/components/media/media-card";
import { events } from "@/content/events";
import { getEventBySlug, getMediaByEvent, getLiveStreamForEvent } from "@/lib/content";
import { categoryLabel, statusLabel, formatDate } from "@/lib/labels";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Evento no encontrado" };
  return { title: event.title, description: event.description };
}

const statusStyle: Record<string, string> = {
  proximo: "border-cyan/40 text-cyan",
  "en-vivo": "border-onair/50 text-onair",
  finalizado: "border-fern text-lichen",
};

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const media = getMediaByEvent(slug);
  const live = getLiveStreamForEvent(slug);
  const dateText = event.endDate
    ? `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`
    : formatDate(event.startDate);

  return (
    <article>
      {/* Hero del evento */}
      <header className="border-b border-fern">
        <div className="crt-scanlines relative flex aspect-[21/9] max-h-[420px] items-end overflow-hidden bg-moss">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(100% 120% at 30% 0%, rgba(124,97,255,0.35) 0%, rgba(5,6,13,0.2) 50%, rgba(5,6,13,0.95) 100%)",
            }}
          />
          <div className="container-page relative z-10 pb-8">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border bg-void/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] ${statusStyle[event.status]}`}
            >
              {event.status === "en-vivo" && (
                <span className="h-1.5 w-1.5 rounded-full bg-onair live-dot" />
              )}
              {statusLabel[event.status]}
            </span>
          </div>
        </div>

        <div className="container-page py-8">
          <Link
            href="/eventos"
            className="text-[13px] text-lichen transition-colors hover:text-reactor"
          >
            ← Todos los eventos
          </Link>
          <h1 className="mt-4 max-w-3xl font-display text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-phosphor md:text-[54px]">
            {event.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-lichen">
            <Meta label="Categoría" value={categoryLabel[event.category]} />
            <Meta label="Ciudad" value={event.city} />
            {event.venue && <Meta label="Sede" value={event.venue} />}
            <Meta label="Fecha" value={dateText} />
          </div>
        </div>
      </header>

      <div className="container-page grid gap-12 py-12 md:grid-cols-[1.7fr_1fr] md:py-16">
        {/* Columna principal */}
        <div className="space-y-12">
          <p className="text-[17px] leading-relaxed text-phosphor/90">
            {event.description}
          </p>

          {/* Transmisión */}
          {live && (
            <section>
              <Eyebrow>Transmisión</Eyebrow>
              <div className="mt-5 flex flex-col items-start gap-4 rounded-[16px] border border-fern bg-carbon p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[16px] text-phosphor">
                    {live.status === "LIVE"
                      ? "Estamos transmitiendo este evento ahora."
                      : "La transmisión de este evento está disponible en el canal."}
                  </p>
                </div>
                <Button href="/live" variant={live.status === "LIVE" ? "reactor" : "ghost"}>
                  {live.status === "LIVE" ? "Ver en vivo" : "Ir al canal"}
                </Button>
              </div>
            </section>
          )}

          {/* Galería */}
          <section>
            <Eyebrow>Galería</Eyebrow>
            {event.gallery && event.gallery.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {event.gallery.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={`${event.title} — foto ${i + 1}`}
                    className="aspect-square w-full rounded-[12px] object-cover"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="crt-scanlines relative flex aspect-square items-center justify-center rounded-[12px] border border-fern bg-moss text-[11px] uppercase tracking-[0.1em] text-slate"
                  >
                    Próximamente
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Material relacionado */}
          {media.length > 0 && (
            <section>
              <Eyebrow>Material del evento</Eyebrow>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {media.map((item) => (
                  <MediaCard key={item.slug} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Agenda */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="rounded-[16px] border border-fern bg-carbon p-6">
              <h2 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
                Agenda
              </h2>
              <ul className="mt-4 space-y-3">
                {event.schedule.map((slot, i) => (
                  <li key={i} className="flex gap-3 text-[14px]">
                    <span className="w-12 shrink-0 text-cyan">{slot.time}</span>
                    <span className="text-phosphor/90">{slot.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Patrocinadores */}
          {event.sponsors && event.sponsors.length > 0 && (
            <div className="rounded-[16px] border border-fern bg-carbon p-6">
              <h2 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
                Patrocinadores
              </h2>
              <ul className="mt-4 space-y-2">
                {event.sponsors.map((s) => (
                  <li key={s.name} className="flex items-center justify-between text-[14px]">
                    <span className="text-phosphor">{s.name}</span>
                    <span className="text-[11px] uppercase tracking-[0.1em] text-slate">
                      {s.packageLevel}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Descargas */}
          {event.downloads && event.downloads.length > 0 && (
            <div className="rounded-[16px] border border-fern bg-carbon p-6">
              <h2 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
                Material descargable
              </h2>
              <ul className="mt-4 space-y-2">
                {event.downloads.map((d) => (
                  <li key={d.label}>
                    <a href={d.url} className="text-[14px] text-phosphor hover:text-reactor">
                      {d.label} ↓
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-[16px] border border-fern bg-carbon p-6">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
              ¿Tu evento aquí?
            </h2>
            <p className="mt-3 text-[14px] text-lichen">
              Cubrimos eventos de cultura, música, deporte y negocios en toda la región.
            </p>
            <div className="mt-4">
              <Button href="/contacto" variant="reactor" className="w-full justify-center">
                Solicitar cobertura
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className="text-[11px] uppercase tracking-[0.1em] text-slate">{label}: </span>
      <span className="text-phosphor/90">{value}</span>
    </span>
  );
}
