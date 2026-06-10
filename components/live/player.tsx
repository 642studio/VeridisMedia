import { siteConfig } from "@/content/config";
import { Button } from "@/components/ui/button";
import type { BroadcastState } from "@/lib/broadcast-state";

/**
 * Live player — shows the embed when the broadcast is LIVE, or an OFFLINE
 * standby card (with next broadcast) otherwise. Driven by the runtime state.
 */
export function LivePlayer({ state }: { state: BroadcastState }) {
  const { nextBroadcast } = siteConfig;
  const isLive = state.status === "LIVE";

  return (
    <div className="overflow-hidden rounded-[16px] border border-fern bg-carbon">
      <div className="relative aspect-video w-full bg-black">
        {isLive && state.embedUrl ? (
          <iframe
            src={state.embedUrl}
            title={state.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="crt-scanlines absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-[13px] font-medium uppercase tracking-[0.25em] text-sage-tint/70">
              Señal en standby
            </p>
            <p className="mt-3 font-display text-[28px] font-medium text-cyan phosphor-glow">
              OFFLINE
            </p>
            <p className="mt-3 max-w-sm text-[14px] text-sage-tint/80">
              No hay transmisiones activas en este momento.
            </p>
            <p className="mt-1 text-[13px] text-sage-tint/60">
              Próxima: {nextBroadcast.name} · {nextBroadcast.date}
            </p>
          </div>
        )}
      </div>

      {/* Meta bar */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-medium uppercase tracking-[0.1em] ${
              isLive ? "border-cyan/40 text-cyan" : "border-fern text-lichen"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isLive ? "bg-cyan live-dot" : "bg-slate"
              }`}
            />
            {isLive ? "En vivo" : "Offline"}
          </span>
          <span className="text-[13px] uppercase tracking-[0.1em] text-lichen">
            {state.platform}
          </span>
        </div>
        <div className="flex gap-2">
          <Button href="/eventos" variant="ghost">
            Ver eventos
          </Button>
        </div>
      </div>
    </div>
  );
}
