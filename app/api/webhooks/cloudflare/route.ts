import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  iframeUrl,
  streamConfig,
} from "@/lib/cloudflare-stream";
import { goLive, endBroadcast } from "@/lib/broadcast-state";
import { payloadFromState, sendLiveWebhook } from "@/lib/live-webhook";

export const dynamic = "force-dynamic";

/**
 * Webhook de Cloudflare Stream → auto-detección de LIVE.
 *
 * Cuando la switcher arranca la salida 3 (RTMP a Cloudflare), Cloudflare notifica
 * aquí. Marcamos LIVE (source:"auto"), apuntamos el reproductor al live input y
 * disparamos la automatización GHL. Al desconectar, marcamos OFFLINE.
 *
 * NOTA: el shape exacto del payload de Cloudflare se confirma con el primer evento
 * real (lo registramos en consola). La detección es tolerante a varios formatos.
 */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("webhook-signature");

  // Si hay secreto configurado, exigimos firma válida.
  if (streamConfig.webhookSecret) {
    const valid = await verifyWebhookSignature(raw, sig);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Firma inválida" }, { status: 401 });
    }
  }

  let body: Record<string, unknown> = {};
  try {
    body = JSON.parse(raw);
  } catch {
    /* puede venir vacío en pings */
  }

  // Registro para confirmar el formato real del primer evento.
  console.log("[cloudflare webhook]", raw);

  const blob = JSON.stringify(body).toLowerCase();
  const isDisconnect =
    blob.includes("disconnected") ||
    blob.includes('"idle"') ||
    blob.includes("live_input.disconnected");
  const isConnect =
    !isDisconnect &&
    (blob.includes("connected") ||
      blob.includes("live-inprogress") ||
      blob.includes("live_input.connected"));

  if (isConnect) {
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

  if (isDisconnect) {
    await endBroadcast("auto");
    return NextResponse.json({ ok: true, action: "offline" });
  }

  return NextResponse.json({ ok: true, action: "ignored" });
}
