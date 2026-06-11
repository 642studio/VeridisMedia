"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Sondea el estado del en vivo cada `intervalMs` y refresca la página cuando
 * cambia (OFFLINE↔LIVE), para que el viewer no tenga que recargar a mano.
 */
export function LiveRefresher({
  status,
  intervalMs = 15000,
}: {
  status: string;
  intervalMs?: number;
}) {
  const router = useRouter();
  const current = useRef(status);
  current.current = status;

  useEffect(() => {
    let stop = false;
    const tick = async () => {
      try {
        const res = await fetch("/api/live/state", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!stop && data.status && data.status !== current.current) {
          router.refresh();
        }
      } catch {
        /* silencioso */
      }
    };
    const id = setInterval(tick, intervalMs);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [intervalMs, router]);

  return null;
}
