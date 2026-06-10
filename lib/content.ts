import { events } from "@/content/events";
import { mediaItems } from "@/content/media";
import { siteConfig } from "@/content/config";
import type { VeridisEvent, MediaItem } from "@/lib/types";

/* Capa de acceso a contenido (file-based). Centraliza las consultas para que
   migrar a un CMS en Fase 2 solo requiera cambiar este archivo. */

export function getAllEvents(): VeridisEvent[] {
  return [...events].sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export function getEventBySlug(slug: string): VeridisEvent | undefined {
  return events.find((e) => e.slug === slug);
}

export function getUpcomingEvents(): VeridisEvent[] {
  return getAllEvents()
    .filter((e) => e.status !== "finalizado")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getMediaByEvent(eventSlug: string): MediaItem[] {
  return mediaItems.filter((m) => m.eventId === eventSlug);
}

export function getAllMedia(): MediaItem[] {
  return [...mediaItems].sort((a, b) => b.date.localeCompare(a.date));
}

/** ¿La transmisión actual (config) pertenece a este evento? */
export function getLiveStreamForEvent(eventSlug: string) {
  const { currentStream, broadcastStatus } = siteConfig;
  if (currentStream.eventId !== eventSlug) return undefined;
  return { ...currentStream, status: broadcastStatus };
}
