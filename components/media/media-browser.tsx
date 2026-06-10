"use client";

import { useMemo, useState } from "react";
import type { MediaItem, MediaType } from "@/lib/types";
import { categoryLabel, mediaTypeLabel } from "@/lib/labels";
import { MediaCard } from "@/components/media/media-card";

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
        active
          ? "border-reactor bg-reactor/10 text-phosphor"
          : "border-fern text-lichen hover:border-lichen hover:text-phosphor"
      }`}
    >
      {children}
    </button>
  );
}

export function MediaBrowser({ items }: { items: MediaItem[] }) {
  const [type, setType] = useState<string>("todos");
  const [category, setCategory] = useState<string>("todas");

  const types = useMemo(
    () => Array.from(new Set(items.map((m) => m.type))) as MediaType[],
    [items],
  );
  const categories = useMemo(
    () => Array.from(new Set(items.map((m) => m.category))),
    [items],
  );

  const filtered = items.filter(
    (m) =>
      (type === "todos" || m.type === type) &&
      (category === "todas" || m.category === category),
  );

  return (
    <div className="container-page py-12 md:py-16">
      <div className="space-y-4">
        <FilterRow label="Tipo">
          <Pill active={type === "todos"} onClick={() => setType("todos")}>
            Todo
          </Pill>
          {types.map((t) => (
            <Pill key={t} active={type === t} onClick={() => setType(t)}>
              {mediaTypeLabel[t]}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Categoría">
          <Pill active={category === "todas"} onClick={() => setCategory("todas")}>
            Todas
          </Pill>
          {categories.map((c) => (
            <Pill key={c} active={category === c} onClick={() => setCategory(c)}>
              {categoryLabel[c]}
            </Pill>
          ))}
        </FilterRow>
      </div>

      <p className="mt-8 text-[13px] uppercase tracking-[0.1em] text-lichen">
        {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((item) => (
            <MediaCard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-[15px] text-lichen">
          No hay contenido con estos filtros.
        </p>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-24 shrink-0 text-[12px] font-medium uppercase tracking-[0.1em] text-slate">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
