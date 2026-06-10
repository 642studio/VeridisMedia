import { siteConfig } from "@/content/config";
import type { BroadcastStatus, StreamPlatform } from "@/lib/types";

/* ============================================================================
   Estado del broadcast en runtime
   ----------------------------------------------------------------------------
   Fuente de verdad del LIVE/OFFLINE (reemplaza el toggle en archivo).
   - Producción: Vercel KV (Redis) si KV_REST_API_URL/TOKEN están definidos.
   - Local sin KV: fallback en memoria (se reinicia con el server) para poder
     desarrollar sin infraestructura.
   La lectura se cachea con tag "broadcast" y se invalida en cada escritura.
   ========================================================================= */

export interface BroadcastState {
  status: BroadcastStatus;
  title: string;
  description: string;
  city: string;
  eventSlug: string;
  platform: StreamPlatform;
  /** URL de embed/iframe (modo manual) — en Fase 2b se usa playbackId. */
  embedUrl: string;
  /** ID de reproducción del proveedor (Cloudflare) — Fase 2b. */
  playbackId?: string;
  /** Origen del último cambio. */
  source: "manual" | "auto";
  startedAt?: string;
  updatedAt: string;
}

const KEY = "veridis:broadcast";
const KV_ENABLED = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
);

// Fallback en memoria para dev sin KV. Se guarda en globalThis para compartir
// el estado entre módulos (route handlers y RSC corren en grafos separados).
const globalStore = globalThis as unknown as {
  __veridisBroadcast?: BroadcastState | null;
};

function seedState(): BroadcastState {
  const { broadcastStatus, currentStream, contact } = siteConfig;
  return {
    status: broadcastStatus,
    title: currentStream.title,
    description: currentStream.description ?? "",
    city: contact.city,
    eventSlug: currentStream.eventId ?? "",
    platform: currentStream.platform,
    embedUrl: currentStream.streamUrl ?? "",
    source: "manual",
    updatedAt: new Date(0).toISOString(),
  };
}

async function readStore(): Promise<BroadcastState | null> {
  if (KV_ENABLED) {
    const { kv } = await import("@vercel/kv");
    return (await kv.get<BroadcastState>(KEY)) ?? null;
  }
  return globalStore.__veridisBroadcast ?? null;
}

async function writeStore(state: BroadcastState): Promise<void> {
  if (KV_ENABLED) {
    const { kv } = await import("@vercel/kv");
    await kv.set(KEY, state);
  } else {
    globalStore.__veridisBroadcast = state;
  }
}

/** Lee el estado actual. Lectura barata (KV get o memoria); las páginas que lo
    usan se renderizan dinámicamente para reflejar el LIVE en tiempo real. */
export async function getBroadcastState(): Promise<BroadcastState> {
  return (await readStore()) ?? seedState();
}

/** Aplica un patch al estado y lo persiste. */
export async function setBroadcastState(
  patch: Partial<BroadcastState>,
): Promise<BroadcastState> {
  const current = (await readStore()) ?? seedState();
  const next: BroadcastState = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(next);
  return next;
}

/** Marca LIVE (registra startedAt). */
export async function goLive(
  patch: Partial<BroadcastState> = {},
  source: BroadcastState["source"] = "manual",
): Promise<BroadcastState> {
  return setBroadcastState({
    ...patch,
    status: "LIVE",
    source,
    startedAt: new Date().toISOString(),
  });
}

/** Marca OFFLINE. */
export async function endBroadcast(
  source: BroadcastState["source"] = "manual",
): Promise<BroadcastState> {
  return setBroadcastState({ status: "OFFLINE", source });
}

export const isKvEnabled = KV_ENABLED;
