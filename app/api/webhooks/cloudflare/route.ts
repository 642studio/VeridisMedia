import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  getLiveInputState,
  iframeUrl,
  streamConfig,
} from "@/lib/cloudflare-stream";
import { getBroadcastState, goLive, endBroadcast } from "@/lib/broadcast-state";
import { payloadFromState, sendLiveWebhook } from "@/lib/live-webhook";

export const dynamic = "force-dynamic";

/**
 * Webhook de Cloudflare Stream → auto-detección de LIVE.
 *
 * En vez de adivinar el estado a partir del texto del evento, consultamos el
 * estado REAL del live input a la API de Cloudflare (fuente de verdad) y
 * actualizamos el sitio. Solo dispara GHL en la transición OFFLINE → LIVE.
 */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("webhook-signature");

  if (streamConfig.webhookSecret) {
    const valid = await verifyWebhookSignature(raw, sig);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Firma inválida" }, { status: 401 });
    }
  }

  console.log("[cloudflare webhook]", raw);

  // Estado autoritativo del live input (con fallback al texto del evento).
  let connected: boolean | null = null;
  try {
    const state = await getLiveInputState();
    if (state === "connected") connected = true;
    else if (state === "disconnected") connected = false;
    console.log("[cloudflare webhook] live input state:", state);
  } catch (e) {
    console.error("[cloudflare webhook] no se pudo consultar el estado, uso heurística:", e);
    const blob = raw.toLowerCase();
    if (blob.includes("disconnected") || blob.includes('"idle"')) connected = false;
    else if (blob.includes("connected") || blob.includes("live-inprogress")) connected = true;
  }

  const current = await getBroadcastState();

  if (connected === true && current.status !== "LIVE") {
    const state = await goLive(
      {
        platform: "custom",
        playbackId: streamConfig.liveInputUid,
        embedUrl: iframeUrl(undefined, { autoplay: true }),
      },
      "auto",
    );
    const webhook = await sendLiveWebhook(payloadFromState(state));
    return NextResponse.json({ ok: true, action: "live", webhook });
  }

  if (connected === false && current.status !== "OFFLINE") {
    await endBroadcast("auto");
    return NextResponse.json({ ok: true, action: "offline" });
  }

  return NextResponse.json({ ok: true, action: "noop", connected, status: current.status });
}
