import type { MediaItem } from "@/lib/types";
import { mediaTypeLabel, formatDate } from "@/lib/labels";

/** Tarjeta de un elemento de la biblioteca de medios. */
export function MediaCard({ item }: { item: MediaItem }) {
  return (
    <article className="group overflow-hidden rounded-[16px] border border-fern bg-carbon transition-colors hover:border-lichen">
      <div className="crt-scanlines relative flex aspect-video items-center justify-center bg-moss">
        <span className="text-[11px] uppercase tracking-[0.15em] text-sage-tint">
          {mediaTypeLabel[item.type]}
        </span>
        {item.city && (
          <span className="absolute right-2 top-2 rounded-full bg-void/70 px-2 py-0.5 text-[11px] text-sage-tint">
            {item.city}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-lichen">
          <span className="text-cyan">{mediaTypeLabel[item.type]}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(item.date)}</span>
        </div>
        <h3 className="mt-2 text-[15px] font-medium leading-snug text-phosphor group-hover:text-reactor">
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-[13px] text-lichen">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
}
