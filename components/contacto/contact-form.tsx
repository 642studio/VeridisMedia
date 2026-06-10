"use client";

import { useState } from "react";
import { siteConfig } from "@/content/config";

const requestTypes = [
  { id: "transmitir", label: "Quiero transmitir un evento" },
  { id: "cobertura", label: "Quiero cobertura para mi evento" },
  { id: "patrocinar", label: "Quiero patrocinar" },
  { id: "programa", label: "Quiero crear un programa" },
  { id: "alianza", label: "Quiero una alianza" },
  { id: "prensa", label: "Prensa / medios" },
] as const;

type RequestId = (typeof requestTypes)[number]["id"];

const inputClass =
  "w-full rounded-[8px] border border-fern bg-carbon px-3.5 py-2.5 text-[14px] text-phosphor placeholder:text-slate focus:border-reactor focus:outline-none";

export function ContactForm() {
  const [type, setType] = useState<RequestId>("transmitir");
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    ciudad: "",
    fecha: "",
    presupuesto: "",
    mensaje: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const typeLabel = requestTypes.find((r) => r.id === type)?.label ?? "";

  const buildMessage = () =>
    [
      `Hola VERIDIS MEDIA 👋`,
      `Tipo de solicitud: ${typeLabel}`,
      form.nombre && `Nombre: ${form.nombre}`,
      form.empresa && `Empresa/Institución: ${form.empresa}`,
      form.ciudad && `Ciudad: ${form.ciudad}`,
      form.fecha && `Fecha del evento: ${form.fecha}`,
      form.presupuesto && `Presupuesto aprox.: ${form.presupuesto}`,
      form.mensaje && `Mensaje: ${form.mensaje}`,
    ]
      .filter(Boolean)
      .join("\n");

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = (siteConfig.contact.whatsapp ?? "").replace(/[^\d]/g, "");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleEmail = () => {
    const subject = `Solicitud VERIDIS: ${typeLabel}`;
    const url = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(buildMessage())}`;
    window.location.href = url;
  };

  return (
    <form onSubmit={handleWhatsApp} className="space-y-6">
      {/* Tipo de solicitud */}
      <div>
        <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
          Tipo de solicitud
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {requestTypes.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setType(r.id)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                type === r.id
                  ? "border-reactor bg-reactor/10 text-phosphor"
                  : "border-fern text-lichen hover:border-lichen hover:text-phosphor"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre *">
          <input required value={form.nombre} onChange={set("nombre")} className={inputClass} placeholder="Tu nombre" />
        </Field>
        <Field label="Empresa / Institución">
          <input value={form.empresa} onChange={set("empresa")} className={inputClass} placeholder="Opcional" />
        </Field>
        <Field label="Ciudad">
          <input value={form.ciudad} onChange={set("ciudad")} className={inputClass} placeholder="Navojoa, Sonora…" />
        </Field>
        <Field label="Fecha del evento">
          <input value={form.fecha} onChange={set("fecha")} className={inputClass} placeholder="Si aplica" />
        </Field>
        <Field label="Presupuesto aproximado">
          <input value={form.presupuesto} onChange={set("presupuesto")} className={inputClass} placeholder="Opcional" />
        </Field>
      </div>

      <Field label="Mensaje *">
        <textarea
          required
          value={form.mensaje}
          onChange={set("mensaje")}
          rows={4}
          className={inputClass}
          placeholder="Cuéntanos sobre tu evento o proyecto…"
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-[4px] bg-reactor px-5 py-2.5 text-[14px] font-medium text-void transition-colors hover:bg-soft-glow"
        >
          Enviar por WhatsApp
        </button>
        <button
          type="button"
          onClick={handleEmail}
          className="inline-flex items-center justify-center rounded-[4px] border border-fern px-5 py-2.5 text-[14px] font-medium text-phosphor transition-colors hover:border-reactor"
        >
          Enviar por correo
        </button>
      </div>
      <p className="text-[12px] text-slate">
        Tu solicitud se abrirá en WhatsApp o tu correo con los datos prellenados, lista para enviar.
      </p>
    </form>
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
