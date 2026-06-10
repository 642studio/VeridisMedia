"use client";

import { useMemo, useState } from "react";
import type { VeridisEvent, EventStatus } from "@/lib/types";
import { categoryLabel, statusLabel } from "@/lib/labels";
import { EventCard } from "@/components/eventos/event-card";

type StatusFilter = "todos" | EventStatus;

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

export function EventsBrowser({ events }: { events: VeridisEvent[] }) {
  const [status, setStatus] = useState<StatusFilter>("todos");
  const [city, setCity] = useState<string>("todas");
  const [category, setCategory] = useState<string>("todas");

  const cities = useMemo(
    () => Array.from(new Set(events.map((e) => e.city))),
    [events],
  );
  const categories = useMemo(
    () => Array.from(new Set(events.map((e) => e.category))),
    [events],
  );

  const filtered = events.filter(
    (e) =>
      (status === "todos" || e.status === status) &&
      (city === "todas" || e.city === city) &&
      (category === "todas" || e.category === category),
  );

  return (
    <div className="container-page py-12 md:py-16">
      {/* Filtros */}
      <div className="space-y-4">
        <FilterRow label="Estado">
          <Pill active={status === "todos"} onClick={() => setStatus("todos")}>
            Todos
          </Pill>
          {(["proximo", "en-vivo", "finalizado"] as EventStatus[]).map((s) => (
            <Pill key={s} active={status === s} onClick={() => setStatus(s)}>
              {statusLabel[s]}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Ciudad">
          <Pill active={city === "todas"} onClick={() => setCity("todas")}>
            Todas
          </Pill>
          {cities.map((c) => (
            <Pill key={c} active={city === c} onClick={() => setCity(c)}>
              {c}
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

      {/* Resultados */}
      <p className="mt-8 text-[13px] uppercase tracking-[0.1em] text-lichen">
        {filtered.length} {filtered.length === 1 ? "evento" : "eventos"}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-[15px] text-lichen">
          No hay eventos con estos filtros. Prueba ajustarlos.
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
