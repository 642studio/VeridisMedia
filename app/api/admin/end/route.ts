import { NextResponse } from "next/server";
import { endBroadcast } from "@/lib/broadcast-state";

export const dynamic = "force-dynamic";

/** Termina la transmisión (OFFLINE). */
export async function POST() {
  const state = await endBroadcast("manual");
  return NextResponse.json({ ok: true, state });
}
