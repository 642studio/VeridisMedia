import type { Metadata } from "next";
import { LivePlayer } from "@/components/live/player";
import { Eyebrow } from "@/components/ui/eyebrow";
import { siteConfig } from "@/content/config";
import { getBroadcastState } from "@/lib/broadcast-state";

export const metadata: Metadata = {
  title: "En vivo",
  description:
    "El canal en vivo de VERIDIS MEDIA. Transmisiones, eventos y coberturas en tiempo real.",
};

// Refleja el estado LIVE/OFFLINE en tiempo real.
export const dynamic = "force-dynamic";

export default async function LivePage() {
  const state = await getBroadcastState();
  const { nextBroadcast } = siteConfig;
  const isLive = state.status === "LIVE";

  return (
    <div className="container-page py-12 md:py-16">
      <Eyebrow>{isLive ? "Transmitiendo ahora" : "Canal VERIDIS"}</Eyebrow>
      <h1 className="mt-4 font-display text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-phosphor">
        {isLive ? state.title : "VERIDIS MEDIA · En vivo"}
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        {/* Player + description */}
        <div className="space-y-6">
          <LivePlayer state={state} />
          <div className="rounded-[16px] border border-fern bg-carbon p-5">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
              Sobre esta transmisión
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-phosphor/90">
              {isLive
                ? state.description
                : `Cuando estemos al aire, aquí verás la señal en vivo. Próxima transmisión: ${nextBroadcast.name} · ${nextBroadcast.date}.`}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ShareButton label="Compartir" />
            </div>
          </div>
        </div>

        {/* Sidebar: agenda / chat / sponsors placeholders */}
        <aside className="space-y-4">
          <SidebarCard title="Patrocinadores activos">
            <p className="text-[14px] text-lichen">
              Espacio para las marcas de esta cobertura.
            </p>
          </SidebarCard>
          <SidebarCard title="Agenda del evento">
            <p className="text-[14px] text-lichen">
              La agenda aparecerá aquí durante eventos en vivo.
            </p>
          </SidebarCard>
          <SidebarCard title="Chat" badge="Fase 3">
            <p className="text-[14px] text-lichen">
              El chat propio llegará en una próxima fase. Por ahora, participa desde
              nuestras redes.
            </p>
          </SidebarCard>
        </aside>
      </div>
    </div>
  );
}

function SidebarCard({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-fern bg-carbon p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
          {title}
        </h3>
        {badge && (
          <span className="rounded-full border border-fern px-2 py-0.5 text-[11px] text-slate">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ShareButton({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[4px] border border-fern px-4 py-2 text-[14px] text-phosphor">
      {label}
    </span>
  );
}
