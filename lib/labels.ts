import type { EventCategory, EventStatus, MediaType } from "@/lib/types";

/* Etiquetas legibles (es-MX) para enums del modelo de contenido. */

export const categoryLabel: Record<EventCategory, string> = {
  cultura: "Cultura",
  musica: "Música",
  institucional: "Institucional",
  empresarial: "Empresarial",
  noticias: "Noticias",
  deportes: "Deportes",
  comunidad: "Comunidad",
  entretenimiento: "Entretenimiento",
};

export const statusLabel: Record<EventStatus, string> = {
  proximo: "Próximo",
  "en-vivo": "En vivo",
  finalizado: "Finalizado",
};

export const mediaTypeLabel: Record<MediaType, string> = {
  transmision: "Transmisión",
  recap: "Recap",
  entrevista: "Entrevista",
  noticia: "Noticia",
  clip: "Clip",
  programa: "Programa",
  capsula: "Cápsula",
  fotogaleria: "Fotogalería",
  "video-corto": "Video corto",
};

/** Formatea una fecha ISO (YYYY-MM-DD) a texto legible es-MX, sin dependencias. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const meses = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  return `${d} ${meses[m - 1]} ${y}`;
}
