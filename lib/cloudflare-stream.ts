/* ============================================================================
   Cloudflare Stream — cliente + utilidades
   ----------------------------------------------------------------------------
   - Crear "live input" (ingesta RTMP para la switcher) y configurar el webhook.
   - Verificar firma de webhooks entrantes.
   - Construir URLs de reproducción (iframe / HLS) desde el subdominio.
   ========================================================================= */

const API = "https://api.cloudflare.com/client/v4";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID ?? "";
const token = process.env.CLOUDFLARE_API_TOKEN ?? "";

export const streamConfig = {
  accountId,
  subdomain: process.env.CLOUDFLARE_STREAM_SUBDOMAIN ?? "",
  liveInputUid: process.env.CLOUDFLARE_LIVE_INPUT_UID ?? "",
  rtmpsUrl: process.env.CLOUDFLARE_RTMPS_URL ?? "rtmps://live.cloudflare.com:443/live/",
  streamKey: process.env.CLOUDFLARE_STREAM_KEY ?? "",
  webhookSecret: process.env.CLOUDFLARE_WEBHOOK_SECRET ?? "",
  get configured() {
    return Boolean(this.subdomain && this.liveInputUid);
  },
};

/** URL del reproductor iframe de Cloudflare para un video/live input. */
export function iframeUrl(
  uid: string = streamConfig.liveInputUid,
  opts: { autoplay?: boolean; muted?: boolean } = {},
): string {
  const p = new URLSearchParams();
  if (opts.autoplay) p.set("autoplay", "true");
  if (opts.muted) p.set("muted", "true");
  const q = p.toString();
  return `https://${streamConfig.subdomain}/${uid}/iframe${q ? `?${q}` : ""}`;
}

/** URL HLS (manifest) para reproductores propios (hls.js). */
export function hlsUrl(uid: string = streamConfig.liveInputUid): string {
  return `https://${streamConfig.subdomain}/${uid}/manifest/video.m3u8`;
}

interface CfResponse<T> {
  success: boolean;
  result: T;
  errors?: unknown;
}

async function cf<T>(path: string, init?: RequestInit): Promise<T> {
  if (!accountId || !token) {
    throw new Error("Faltan CLOUDFLARE_ACCOUNT_ID o CLOUDFLARE_API_TOKEN");
  }
  const res = await fetch(`${API}/accounts/${accountId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const json = (await res.json()) as CfResponse<T>;
  if (!json.success) {
    throw new Error(`Cloudflare API ${path}: ${JSON.stringify(json.errors ?? json)}`);
  }
  return json.result;
}

export interface LiveInput {
  uid: string;
  rtmps: { url: string; streamKey: string };
  rtmpsPlayback?: { url: string; streamKey: string };
  srt?: { url: string; streamId: string; passphrase: string };
  webRTC?: { url: string };
  webRTCPlayback?: { url: string };
  meta?: Record<string, unknown>;
  recording?: { mode: string };
}

/** Crea un live input con grabación automática (para el archivo VOD). */
export async function createLiveInput(
  name = "VERIDIS MEDIA — Canal principal",
): Promise<LiveInput> {
  return cf<LiveInput>("/stream/live_inputs", {
    method: "POST",
    body: JSON.stringify({
      meta: { name },
      recording: { mode: "automatic", timeoutSeconds: 10, requireSignedURLs: false },
    }),
  });
}

export async function getLiveInput(uid: string): Promise<LiveInput> {
  return cf<LiveInput>(`/stream/live_inputs/${uid}`);
}

/** Estado de conexión real del live input ("connected" | "disconnected" | ...). */
export async function getLiveInputState(
  uid: string = streamConfig.liveInputUid,
): Promise<string> {
  const input = await cf<{ status?: { current?: { state?: string } } }>(
    `/stream/live_inputs/${uid}`,
  );
  return input.status?.current?.state ?? "unknown";
}

/** Configura la URL de notificaciones de Stream; devuelve el secreto de firma. */
export async function setStreamWebhook(
  notificationUrl: string,
): Promise<{ notificationUrl: string; secret: string }> {
  return cf("/stream/webhook", {
    method: "PUT",
    body: JSON.stringify({ notificationUrl }),
  });
}

/** Verifica la firma `Webhook-Signature: time=...,sig1=...` (HMAC-SHA256). */
export async function verifyWebhookSignature(
  rawBody: string,
  header: string | null,
  secret: string = streamConfig.webhookSecret,
): Promise<boolean> {
  if (!secret || !header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=").map((s) => s.trim())),
  ) as { time?: string; sig1?: string };
  if (!parts.time || !parts.sig1) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(`${parts.time}.${rawBody}`));
  const hex = [...new Uint8Array(mac)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex === parts.sig1;
}
