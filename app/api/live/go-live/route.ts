import { NextRequest, NextResponse } from "next/server";
import {
  buildLivePayload,
  payloadFromState,
  sendLiveWebhook,
  type LiveWebhookOverrides,
} from "@/lib/live-webhook";
import { goLive, type BroadcastState } from "@/lib/broadcast-state";

export const dynamic = "force-dynamic";

/**
 * Dispara el webhook de "EN VIVO".
 *
 *  POST /api/live/go-live          → arma el payload desde config y lo envía
 *  POST /api/live/go-live?dry=1    → solo devuelve el payload (no envía)
 *  GET  /api/live/go-live          → vista previa del payload (no envía)
 *
 * Cuerpo opcional (JSON) para sobrescribir datos puntuales:
 *  { "title", "description", "streamUrl", "platform", "eventSlug" }
 *
 * Seguridad: si LIVE_WEBHOOK_SECRET está definido, se exige el header
 *  `x-veridis-secret` (o `?secret=`) con ese valor.
 */
function authorized(req: NextRequest): boolean {
  const secret = process.env.LIVE_WEBHOOK_SECRET;
  if (!secret) return true; // conveniencia en dev — define el secreto en producción
  const provided =
    req.headers.get("x-veridis-secret") ??
    new URL(req.url).searchParams.get("secret");
  return provided === secret;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const overrides = (await req.json().catch(() => ({}))) as
    | (LiveWebhookOverrides & { dry?: boolean })
    | null;
  const isDry =
    new URL(req.url).searchParams.get("dry") === "1" || overrides?.dry === true;

  if (isDry) {
    return NextResponse.json({ ok: true, dry: true, payload: buildLivePayload(overrides ?? {}) });
  }

  // Flip del estado a LIVE (mantiene el sitio en sync) + disparo del webhook.
  const patch: Partial<BroadcastState> = {};
  if (overrides?.title !== undefined) patch.title = overrides.title;
  if (overrides?.description !== undefined) patch.description = overrides.description;
  if (overrides?.streamUrl !== undefined) patch.embedUrl = overrides.streamUrl;
  if (overrides?.platform !== undefined) patch.platform = overrides.platform;
  if (overrides?.eventSlug !== undefined) patch.eventSlug = overrides.eventSlug;
  if (overrides?.city !== undefined) patch.city = overrides.city;

  const state = await goLive(patch, "manual");
  const payload = payloadFromState(state);
  const result = await sendLiveWebhook(payload);
  return NextResponse.json(
    { ok: result.ok, result, payload, state },
    { status: result.ok ? 200 : 502 },
  );
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, dry: true, payload: buildLivePayload() });
}
