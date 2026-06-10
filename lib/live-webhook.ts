import { siteConfig } from "@/content/config";
import type { Livestream } from "@/lib/types";
import type { BroadcastState } from "@/lib/broadcast-state";

/* ============================================================================
   Webhook "EN VIVO" → LeadConnector / GoHighLevel
   ----------------------------------------------------------------------------
   Construye y envía un payload con toda la información relevante de la
   transmisión para disparar una automatización (notificaciones por WhatsApp/SMS).
   La URL y el secreto se configuran por variables de entorno (ver .env.example).
   ========================================================================= */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://veridismedia.com";

export interface LiveWebhookOverrides {
  /** Sobrescribe el título del stream (si no, usa config). */
  title?: string;
  description?: string;
  streamUrl?: string;
  platform?: Livestream["platform"];
  eventSlug?: string;
  city?: string;
}

export interface LivePayload {
  status: "LIVE";
  event_title: string;
  stream_title: string;
  description: string;
  platform: string;
  stream_url: string;
  watch_url: string;
  event_url: string;
  event_slug: string;
  city: string;
  sponsors: string;
  social_facebook: string;
  social_youtube: string;
  social_instagram: string;
  handle: string;
  /** Mensaje listo para reenviar en la automatización. */
  message: string;
  timestamp: string;
}

/** Arma el payload de "en vivo" desde la config del sitio (+ overrides opcionales). */
export function buildLivePayload(overrides: LiveWebhookOverrides = {}): LivePayload {
  const { currentStream, social, contact } = siteConfig;

  const title = overrides.title ?? currentStream.title;
  const description = overrides.description ?? currentStream.description ?? "";
  const platform = overrides.platform ?? currentStream.platform;
  const streamUrl = overrides.streamUrl ?? currentStream.streamUrl ?? "";
  const eventSlug = overrides.eventSlug ?? currentStream.eventId ?? "";

  const city = overrides.city ?? contact.city;
  const watchUrl = `${SITE_URL}/live`;
  const eventUrl = eventSlug ? `${SITE_URL}/eventos/${eventSlug}` : watchUrl;
  const sponsors = (currentStream.sponsors ?? []).map((s) => s.name).join(", ");

  return {
    status: "LIVE",
    event_title: title,
    stream_title: title,
    description,
    platform,
    stream_url: streamUrl,
    watch_url: watchUrl,
    event_url: eventUrl,
    event_slug: eventSlug,
    city,
    sponsors,
    social_facebook: social.facebook ?? "",
    social_youtube: social.youtube ?? "",
    social_instagram: social.instagram ?? "",
    handle: social.handle,
    message: `🔴 EN VIVO: ${title}. Míralo aquí: ${watchUrl}`,
    timestamp: new Date().toISOString(),
  };
}

/** Construye el payload a partir del estado de broadcast en runtime. */
export function payloadFromState(state: BroadcastState): LivePayload {
  return buildLivePayload({
    title: state.title,
    description: state.description,
    streamUrl: state.embedUrl,
    platform: state.platform,
    eventSlug: state.eventSlug,
    city: state.city,
  });
}

export interface SendResult {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  status?: number;
  response?: string;
  error?: string;
}

/** Envía el payload al webhook configurado en LIVE_WEBHOOK_URL. */
export async function sendLiveWebhook(payload: LivePayload): Promise<SendResult> {
  const url = process.env.LIVE_WEBHOOK_URL;
  if (!url) {
    return { ok: false, skipped: true, reason: "LIVE_WEBHOOK_URL no configurado" };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const response = await res.text().catch(() => "");
    return { ok: res.ok, status: res.status, response: response.slice(0, 500) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
