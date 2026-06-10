#!/usr/bin/env node
/**
 * Dispara el webhook de "EN VIVO" llamando a la API del sitio.
 *
 *   npm run go-live                 → envía (usa http://localhost:3000)
 *   npm run go-live -- --dry        → solo muestra el payload, no envía
 *   npm run go-live -- https://veridismedia.com   → contra producción
 *
 * Variables: SITE_URL (base), LIVE_WEBHOOK_SECRET (si la API lo exige).
 */
const args = process.argv.slice(2);
const dry = args.includes("--dry");
const baseArg = args.find((a) => a.startsWith("http"));
const base = (baseArg || process.env.SITE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);
const secret = process.env.LIVE_WEBHOOK_SECRET || "";
const url = `${base}/api/live/go-live${dry ? "?dry=1" : ""}`;

console.log(`→ ${dry ? "[DRY] " : ""}POST ${url}`);

try {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "x-veridis-secret": secret } : {}),
    },
    body: JSON.stringify({}),
  });
  const json = await res.json().catch(() => null);
  console.log(JSON.stringify(json, null, 2));
  if (!res.ok) {
    console.error(`✗ Falló (HTTP ${res.status})`);
    process.exit(1);
  }
  console.log(dry ? "✓ Vista previa OK (no se envió)" : "✓ Webhook enviado");
} catch (e) {
  console.error(`✗ Error: ${e.message}`);
  console.error("¿Está corriendo el sitio? (npm run dev / deploy)");
  process.exit(1);
}
