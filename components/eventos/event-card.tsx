import Link from "next/link";
import type { VeridisEvent } from "@/lib/types";
import { categoryLabel, statusLabel, formatDate } from "@/lib/labels";

const statusStyle: Record<VeridisEvent["status"], string> = {
  proximo: "border-cyan/40 text-cyan",
  "en-vivo": "border-onair/50 text-onair",
  finalizado: "border-fern text-lichen",
};

/** Tarjeta de evento para la cuadrícula de /eventos. */
export function EventCard({ event }: { event: VeridisEvent }) {
  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-[16px] border border-fern bg-carbon transition-colors hover:border-lichen"
    >
      <div className="crt-scanlines relative flex aspect-[16/9] items-center justify-center bg-moss">
        <span className="font-display text-[20px] text-sage-tint/60">VERIDIS</span>
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border bg-void/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] ${statusStyle[event.status]}`}
        >
          {event.status === "en-vivo" && (
            <span className="h-1.5 w-1.5 rounded-full bg-onair live-dot" />
          )}
          {statusLabel[event.status]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-lichen">
          <span className="text-cyan">{categoryLabel[event.category]}</span>
          <span aria-hidden>·</span>
          <span>{event.city}</span>
        </div>
        <h3 className="mt-2 text-[20px] font-medium leading-snug text-phosphor group-hover:text-reactor">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-[14px] leading-relaxed text-lichen">
          {event.description}
        </p>
        <p className="mt-4 text-[13px] text-stone">{formatDate(event.startDate)}</p>
      </div>
    </Link>
  );
}
