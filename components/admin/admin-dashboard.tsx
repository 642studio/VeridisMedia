"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BroadcastState } from "@/lib/broadcast-state";
import type { StreamPlatform } from "@/lib/types";

const inputClass =
  "w-full rounded-[8px] border border-fern bg-void px-3.5 py-2.5 text-[14px] text-phosphor placeholder:text-slate focus:border-reactor focus:outline-none";

const platforms: StreamPlatform[] = ["youtube", "facebook", "twitch", "custom"];

interface StreamInfo {
  configured: boolean;
  rtmpsUrl: string;
  streamKey: string;
  liveInputUid: string;
  playerUrl: string;
}

export function AdminDashboard({
  initialState,
  events,
  stream,
}: {
  initialState: BroadcastState;
  events: { slug: string; title: string }[];
  stream: StreamInfo;
}) {
  const router = useRouter();
  const [state, setState] = useState<BroadcastState>(initialState);
  const [busy, setBusy] = useState<null | "save" | "live" | "end">(null);
  const [msg, setMsg] = useState<string>("");

  const isLive = state.status === "LIVE";
  const set = (k: keyof BroadcastState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setState((s) => ({ ...s, [k]: e.target.value }));

  const metadata = () => ({
    title: state.title,
    description: state.description,
    city: state.city,
    eventSlug: state.eventSlug,
    platform: state.platform,
    embedUrl: state.embedUrl,
  });

  const call = async (
    path: string,
    body: object,
    kind: "save" | "live" | "end",
    okMsg: string,
  ) => {
    setBusy(kind);
    setMsg("");
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.state) {
        setState(j.state);
        let extra = "";
        if (kind === "live") {
          extra = j.webhook?.ok
            ? " · webhook GHL enviado"
            : j.webhook?.skipped
              ? " · webhook no configurado"
              : " · webhook falló";
        }
        setMsg(okMsg + extra);
        router.refresh();
      } else {
        setMsg(j.error || "Error");
      }
    } catch {
      setMsg("Error de red");
    } finally {
      setBusy(null);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Status + logout */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.1em] ${
            isLive ? "border-onair/50 text-onair" : "border-fern text-lichen"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${isLive ? "bg-onair on-air-pulse" : "bg-slate"}`}
          />
          {isLive ? "En vivo" : "Offline"}
        </span>
        <button onClick={logout} className="text-[13px] text-lichen hover:text-reactor">
          Cerrar sesión
        </button>
      </div>

      {/* Monitor en vivo */}
      <div className="rounded-[16px] border border-fern bg-carbon p-5">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
          Monitor en vivo
        </h2>
        <div className="mt-4 overflow-hidden rounded-[12px] border border-fern bg-black">
          {isLive && stream.playerUrl ? (
            <iframe
              src={stream.playerUrl}
              title="Monitor en vivo"
              className="aspect-video w-full"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center text-[13px] uppercase tracking-[0.15em] text-slate">
              Sin señal — Offline
            </div>
          )}
        </div>
        <p className="mt-2 text-[12px] text-slate">
          Es la misma señal que ven en{" "}
          <a href="/live" target="_blank" className="text-lichen hover:text-reactor">
            /live
          </a>
          . Puede tener unos segundos de retraso.
        </p>
      </div>

      {/* Metadata form */}
      <div className="rounded-[16px] border border-fern bg-carbon p-6">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
          Datos de la transmisión
        </h2>
        <div className="mt-4 grid gap-4">
          <Field label="Título">
            <input value={state.title} onChange={set("title")} className={inputClass} placeholder="Nombre del evento o programa" />
          </Field>
          <Field label="Descripción">
            <textarea value={state.description} onChange={set("description")} rows={3} className={inputClass} placeholder="De qué trata la transmisión" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ciudad / ubicación">
              <input value={state.city} onChange={set("city")} className={inputClass} placeholder="Navojoa, Sonora" />
            </Field>
            <Field label="Evento relacionado">
              <select value={state.eventSlug} onChange={set("eventSlug")} className={inputClass}>
                <option value="">— Ninguno —</option>
                {events.map((e) => (
                  <option key={e.slug} value={e.slug}>
                    {e.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Plataforma">
              <select value={state.platform} onChange={set("platform")} className={inputClass}>
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="URL de embed (modo manual)">
              <input value={state.embedUrl} onChange={set("embedUrl")} className={inputClass} placeholder="https://…/embed/…" />
            </Field>
          </div>
        </div>
        <button
          onClick={() => call("/api/admin/broadcast", metadata(), "save", "Datos guardados")}
          disabled={busy !== null}
          className="mt-5 rounded-[4px] border border-fern px-5 py-2.5 text-[14px] font-medium text-phosphor transition-colors hover:border-reactor disabled:opacity-50"
        >
          {busy === "save" ? "Guardando…" : "Guardar datos"}
        </button>
      </div>

      {/* Go live / end */}
      <div className="rounded-[16px] border border-fern bg-carbon p-6">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
          Control de transmisión
        </h2>
        {isLive && state.source === "auto" ? (
          <p className="mt-2 rounded-[8px] border border-cyan/30 bg-cyan/5 px-3 py-2 text-[13px] text-cyan">
            ● Detección automática activa: el sitio se puso en vivo solo al recibir tu
            señal desde la switcher (Cloudflare). No necesitas darle GO LIVE. Para
            terminar, detén el encoder.
          </p>
        ) : (
          <p className="mt-2 text-[14px] text-lichen">
            Si transmites por Cloudflare, el sitio se pone en vivo <strong>solo</strong>.
            GO LIVE es para el modo manual (embed de YouTube/Facebook) y para disparar la
            notificación de GoHighLevel.
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => call("/api/admin/go-live", metadata(), "live", "EN VIVO")}
            disabled={busy !== null || isLive}
            className="rounded-[4px] bg-reactor px-6 py-3 text-[15px] font-semibold text-void transition-colors hover:bg-soft-glow disabled:opacity-40"
          >
            {busy === "live" ? "Activando…" : "● GO LIVE"}
          </button>
          <button
            onClick={() => call("/api/admin/end", {}, "end", "Transmisión terminada")}
            disabled={busy !== null || !isLive}
            className="rounded-[4px] border border-fern px-6 py-3 text-[15px] font-medium text-phosphor transition-colors hover:border-onair disabled:opacity-40"
          >
            Terminar transmisión
          </button>
        </div>
        {msg && <p className="mt-4 text-[13px] text-cyan">{msg}</p>}
      </div>

      {/* Switcher / stream key (Cloudflare) */}
      <div className="rounded-[16px] border border-fern bg-carbon p-6">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
          Clave de transmisión (switcher) · salida 3 → directo a live
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] text-lichen">
          Pega estos datos en la salida RTMP de tu switcher. Al arrancar esa salida, el sitio
          se irá a LIVE automáticamente. Salidas sugeridas: <strong>1)</strong> sala de
          monitoreo, <strong>2)</strong> Facebook, <strong>3)</strong> directo a live (Cloudflare).
        </p>
        {stream.configured ? (
          <div className="mt-4 space-y-3">
            <CopyRow label="Servidor RTMP" value={stream.rtmpsUrl} />
            <CopyRow label="Clave (stream key)" value={stream.streamKey} secret />
          </div>
        ) : (
          <p className="mt-4 rounded-[8px] border border-dashed border-fern bg-void px-3 py-3 text-[13px] text-slate">
            Cloudflare aún no está configurado. Corre{" "}
            <code className="text-sage-tint">npm run stream:setup</code> con tu API token para
            generar la clave de transmisión.
          </p>
        )}
      </div>
    </div>
  );
}

function CopyRow({
  label,
  value,
  secret = false,
}: {
  label: string;
  value: string;
  secret?: boolean;
}) {
  const [revealed, setRevealed] = useState(!secret);
  const [copied, setCopied] = useState(false);
  const display = revealed ? value : "•".repeat(Math.min(value.length, 28));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <div>
      <span className="text-[11px] uppercase tracking-[0.1em] text-slate">{label}</span>
      <div className="mt-1 flex items-stretch gap-2">
        <code className="flex-1 overflow-x-auto rounded-[8px] border border-fern bg-void px-3 py-2 text-[13px] text-phosphor">
          {display || "—"}
        </code>
        {secret && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="rounded-[8px] border border-fern px-3 text-[12px] text-lichen hover:border-reactor"
          >
            {revealed ? "Ocultar" : "Ver"}
          </button>
        )}
        <button
          type="button"
          onClick={copy}
          className="rounded-[8px] border border-fern px-3 text-[12px] text-lichen hover:border-reactor"
        >
          {copied ? "✓" : "Copiar"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
