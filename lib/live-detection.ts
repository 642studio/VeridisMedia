import {
  getBroadcastState,
  goLive,
  endBroadcast,
  type BroadcastState,
} from "@/lib/broadcast-state";
import { getLiveInputState, iframeUrl, streamConfig } from "@/lib/cloudflare-stream";
import { payloadFromState, sendLiveWebhook } from "@/lib/live-webhook";

/* ============================================================================
   Detección de LIVE autoritativa
   ----------------------------------------------------------------------------
   En vez de depender del webhook de Cloudflare (poco fiable al conectar),
   consultamos el estado REAL del live input. Reconcilia el estado guardado
   (KV) con la realidad, dispara GHL en la transición OFFLINE→LIVE, y se cachea
   unos segundos para no saturar la API en cada visita.
   ========================================================================= */

const TTL_MS = 8000;
let cache: { connected: boolean | null; expires: number } | null = null;

async function cloudflareConnected(): Promise<boolean | null> {
  if (!streamConfig.configured) return null;
  const now = Date.now();
  if (cache && cache.expires > now) return cache.connected;

  let connected: boolean | null = null;
  try {
    const state = await getLiveInputState();
    if (state === "connected") connected = true;
    else if (state === "disconnected") connected = false;
  } catch {
    connected = null; // sin token o error → no forzamos nada
  }
  cache = { connected, expires: now + TTL_MS };
  return connected;
}

/**
 * Devuelve el estado efectivo del broadcast, reconciliando KV con el estado
 * real de Cloudflare. Si Cloudflare está recibiendo señal → LIVE (auto).
 */
export async function getEffectiveBroadcastState(): Promise<BroadcastState> {
  const stored = await getBroadcastState();
  const connected = await cloudflareConnected();

  // Cloudflare no configurado / no consultable → respeta el estado guardado.
  if (connected === null) return stored;

  // Cloudflare recibe señal pero el sitio no está en vivo → activar + GHL.
  if (connected && stored.status !== "LIVE") {
    const next = await goLive(
      {
        platform: "custom",
        playbackId: streamConfig.liveInputUid,
        embedUrl: iframeUrl(undefined, { autoplay: true }),
      },
      "auto",
    );
    try {
      await sendLiveWebhook(payloadFromState(next));
    } catch {
      /* el webhook GHL no debe tumbar el render */
    }
    return next;
  }

  // Cloudflare ya no recibe señal y el LIVE era automático → apagar.
  if (!connected && stored.status === "LIVE" && stored.source === "auto") {
    return endBroadcast("auto");
  }

  return stored;
}
