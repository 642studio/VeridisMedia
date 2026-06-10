import { NextRequest, NextResponse } from "next/server";
import { goLive, type BroadcastState } from "@/lib/broadcast-state";
import { payloadFromState, sendLiveWebhook } from "@/lib/live-webhook";

export const dynamic = "force-dynamic";

/**
 * Pone la transmisión EN VIVO (modo manual) y dispara la automatización GHL.
 * Acepta un patch opcional de metadatos para ajustar justo antes de ir en vivo.
 */
export async function POST(req: NextRequest) {
  const patch = (await req.json().catch(() => ({}))) as Partial<BroadcastState>;
  const state = await goLive(patch, "manual");

  // Auto-fire del webhook de notificaciones (GoHighLevel)
  const webhook = await sendLiveWebhook(payloadFromState(state));

  return NextResponse.json({ ok: true, state, webhook });
}
