"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/logo";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace(next);
        router.refresh();
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "No se pudo iniciar sesión");
      }
    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Logo />
        <h1 className="mt-8 font-display text-[28px] font-medium text-phosphor">
          Panel de transmisión
        </h1>
        <p className="mt-2 text-[14px] text-lichen">
          Ingresa la contraseña para administrar el en vivo.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoFocus
            className="w-full rounded-[8px] border border-fern bg-carbon px-3.5 py-2.5 text-[14px] text-phosphor placeholder:text-slate focus:border-reactor focus:outline-none"
          />
          {error && <p className="text-[13px] text-onair">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[4px] bg-reactor px-5 py-2.5 text-[14px] font-medium text-void transition-colors hover:bg-soft-glow disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
