import { NextResponse } from "next/server";
import { getEffectiveBroadcastState } from "@/lib/live-detection";

export const dynamic = "force-dynamic";

/** Estado efectivo del en vivo (reconcilia con Cloudflare). Para el poller. */
export async function GET() {
  const state = await getEffectiveBroadcastState();
  return NextResponse.json({ status: state.status, title: state.title });
}
