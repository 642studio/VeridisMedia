import { NextRequest, NextResponse } from "next/server";
import { getBroadcastState, setBroadcastState, type BroadcastState } from "@/lib/broadcast-state";

export const dynamic = "force-dynamic";

/** GET → estado actual. POST → actualiza metadatos (no cambia status). */
export async function GET() {
  return NextResponse.json({ ok: true, state: await getBroadcastState() });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Partial<BroadcastState>;

  const patch: Partial<BroadcastState> = {};
  if (typeof body.title === "string") patch.title = body.title;
  if (typeof body.description === "string") patch.description = body.description;
  if (typeof body.city === "string") patch.city = body.city;
  if (typeof body.eventSlug === "string") patch.eventSlug = body.eventSlug;
  if (typeof body.platform === "string") patch.platform = body.platform;
  if (typeof body.embedUrl === "string") patch.embedUrl = body.embedUrl;

  const state = await setBroadcastState(patch);
  return NextResponse.json({ ok: true, state });
}
