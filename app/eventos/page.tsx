import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { EventsBrowser } from "@/components/eventos/events-browser";
import { getAllEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Archivo de eventos cubiertos por VERIDIS MEDIA: transmisiones, galerías, recaps y más, filtrables por ciudad, categoría y estado.",
};

export default function EventosPage() {
  const events = getAllEvents();
  return (
    <>
      <PageHeader
        eyebrow="Eventos"
        title="Cada cobertura, su propio archivo."
        intro="Transmisiones, galerías, recaps y patrocinadores organizados por evento. Filtra por estado, ciudad o categoría."
      />
      <EventsBrowser events={events} />
    </>
  );
}
