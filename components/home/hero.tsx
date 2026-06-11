import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/logo";
import { siteConfig } from "@/content/config";
import { getEffectiveBroadcastState } from "@/lib/live-detection";

/**
 * CRT hero — the cool "signal" exception to the dark system.
 * A broadcast/CRT scene in the brand palette: deep blue-violet ambient light,
 * an ON AIR sign, and a cyan-phosphor monitor that shows either the OFFLINE
 * "loading signal" state or the LIVE state, driven by the runtime broadcast state.
 */
export async function Hero() {
  const state = await getEffectiveBroadcastState();
  const { nextBroadcast } = siteConfig;
  const isLive = state.status === "LIVE";

  return (
    <section className="relative isolate overflow-hidden bg-void">
      {/* Cool ambient backdrop — cyan/violet glow fading to void (hero-only). */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 32%, rgba(34,211,238,0.18) 0%, rgba(124,97,255,0.28) 30%, rgba(10,12,30,0.7) 60%, #05060d 82%)",
        }}
      />
      {/* Optional reference photo overlay if the asset is added to /public. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-25 mix-blend-overlay"
        style={{ backgroundImage: "url(/hero-crt.png)" }}
      />
      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(100% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      <div className="container-page flex min-h-[88vh] flex-col items-center justify-center py-20 text-center">
        {/* ON AIR sign (broadcast red, the one warm signal) */}
        <div className="mb-10 flex items-center gap-2 rounded-[4px] border border-fern bg-carbon px-3 py-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              isLive ? "bg-onair on-air-pulse" : "bg-slate"
            }`}
            aria-hidden
          />
          <span
            className={`text-[12px] font-medium uppercase tracking-[0.2em] ${
              isLive ? "text-onair" : "text-slate"
            }`}
          >
            On Air
          </span>
        </div>

        {/* The CRT monitor */}
        <div className="w-full max-w-2xl">
          <div className="rounded-[18px] border-2 border-fern/60 bg-carbon/40 p-3 shadow-[0_30px_80px_-20px_rgba(34,211,238,0.25)] backdrop-blur-[1px]">
            <div className="crt-scanlines crt-flicker relative overflow-hidden rounded-[12px] bg-black px-6 py-12 sm:px-12 sm:py-16">
              {/* Screen content */}
              <div className="relative z-10">
                <div className="mb-5 flex justify-center [filter:drop-shadow(0_0_14px_rgba(34,211,238,0.5))]">
                  <BrandMark size={76} variant="color" />
                </div>
                {isLive ? (
                  <p className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.25em] text-cyan phosphor-glow">
                    <span className="h-2 w-2 rounded-full bg-cyan live-dot" />
                    Live Now
                  </p>
                ) : (
                  <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.25em] text-sage-tint/70">
                    Loading stream simulator
                  </p>
                )}

                <h1
                  data-text="VERIDIS MEDIA"
                  className="crt-glitch font-display text-[40px] font-bold leading-[1.0] tracking-[-0.02em] text-cyan phosphor-glow sm:text-[56px]"
                >
                  VERIDIS MEDIA
                </h1>

                {isLive ? (
                  <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-soft-glow">
                    {state.title}
                    <span className="mt-1 block text-[13px] text-sage-tint/80">
                      Señal en vivo disponible
                    </span>
                  </p>
                ) : (
                  <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-sage-tint/90">
                    No hay transmisiones activas
                    <span className="mt-2 block text-[13px] text-sage-tint/70">
                      Próxima transmisión: {nextBroadcast.name}
                      <br />
                      {nextBroadcast.date}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTAs on the warm ambient ground */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          {isLive ? (
            <>
              <Button href="/live" variant="reactor">
                Ver transmisión
              </Button>
              <Button href="/eventos" variant="ghost">
                Ver próximos eventos
              </Button>
            </>
          ) : (
            <>
              <Button href="/eventos" variant="reactor">
                Ver próximos eventos
              </Button>
              <Button href="/contacto" variant="ghost">
                Transmite tu evento
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
