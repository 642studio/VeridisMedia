import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getEffectiveBroadcastState } from "@/lib/live-detection";
import { getAllEvents } from "@/lib/content";
import { streamConfig, iframeUrl } from "@/lib/cloudflare-stream";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const state = await getEffectiveBroadcastState();
  const events = getAllEvents().map((e) => ({ slug: e.slug, title: e.title }));
  const stream = {
    configured: streamConfig.configured,
    rtmpsUrl: streamConfig.rtmpsUrl,
    streamKey: streamConfig.streamKey,
    liveInputUid: streamConfig.liveInputUid,
    playerUrl: streamConfig.configured ? iframeUrl(streamConfig.liveInputUid) : "",
  };

  return (
    <div className="container-page py-12 md:py-16">
      <Eyebrow>Panel de transmisión</Eyebrow>
      <h1 className="mt-5 font-display text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-phosphor">
        Control en vivo
      </h1>
      <div className="mt-10 max-w-3xl">
        <AdminDashboard initialState={state} events={events} stream={stream} />
      </div>
    </div>
  );
}
