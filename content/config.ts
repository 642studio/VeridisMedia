import type { SiteConfig } from "@/lib/types";

/* ============================================================================
   VERIDIS MEDIA — Configuración global del sitio
   ----------------------------------------------------------------------------
   ⚡ TOGGLE LIVE/OFFLINE (Fase 1):
   Cambia `broadcastStatus` entre "OFFLINE" y "LIVE" para alternar el estado
   del hero del Home y de la página /live. Cuando esté en "LIVE", asegúrate de
   que `currentStream.streamUrl` apunte al embed correcto (YouTube/Facebook).
   ========================================================================= */

export const siteConfig: SiteConfig = {
  broadcastStatus: "OFFLINE",

  currentStream: {
    title: "Festival Cultural Navojoa 2025 — Noche de apertura",
    slug: "festival-cultural-navojoa-2025-apertura",
    eventId: "festival-cultural-navojoa-2025",
    status: "OFFLINE",
    // Ejemplo de embed de YouTube. Reemplaza VIDEO_ID por la transmisión real.
    streamUrl: "https://www.youtube.com/embed/live_stream?channel=UC_xxxxxxxx",
    platform: "youtube",
    description:
      "Cobertura en vivo de la noche de apertura: música, cultura y entrevistas desde el corazón de Navojoa, Sonora.",
    chatEnabled: false,
  },

  nextBroadcast: {
    name: "Festival Cultural Navojoa 2025",
    date: "Sábado 21 de junio · 8:00 PM",
    eventSlug: "festival-cultural-navojoa-2025",
  },

  social: {
    facebook: "https://facebook.com/veridismedia",
    youtube: "https://youtube.com/@veridismedia",
    instagram: "https://instagram.com/veridismedia",
    handle: "@veridismedia",
  },

  contact: {
    whatsapp: "+52 642 000 0000",
    email: "hola@veridismedia.com",
    city: "Navojoa, Sonora",
  },
};
