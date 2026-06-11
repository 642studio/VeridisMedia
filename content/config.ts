import type { SiteConfig } from "@/lib/types";

/* ============================================================================
   VERIDIS MEDIA — Configuración global del sitio
   ----------------------------------------------------------------------------
   El estado LIVE/OFFLINE ahora se maneja en runtime (panel /admin + Cloudflare).
   Estos valores son la SEMILLA inicial + los datos fijos (redes, contacto).
   ========================================================================= */

export const siteConfig: SiteConfig = {
  broadcastStatus: "OFFLINE",

  currentStream: {
    title: "Feria MayoMusic Navojoa 2026",
    slug: "feria-mayomusic-navojoa-2026",
    eventId: "feria-mayomusic-navojoa-2026",
    status: "OFFLINE",
    streamUrl: "",
    platform: "custom",
    description:
      "Cobertura en vivo de la Feria MayoMusic Navojoa 2026: música, espectáculos y ambiente desde el recinto ferial.",
    chatEnabled: false,
  },

  nextBroadcast: {
    name: "Feria MayoMusic Navojoa 2026",
    date: "Cobertura diaria · hasta el domingo 14 de junio",
    eventSlug: "feria-mayomusic-navojoa-2026",
  },

  social: {
    facebook: "https://facebook.com/veridismedia",
    youtube: "https://youtube.com/@veridismedia",
    instagram: "https://instagram.com/veridismedia",
    handle: "@veridismedia",
  },

  contact: {
    whatsapp: "+52 642 121 5327",
    email: "contacto@veridismedia.mx",
    city: "Navojoa, Sonora",
  },
};
