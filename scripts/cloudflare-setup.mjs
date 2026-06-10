#!/usr/bin/env node
/**
 * Crea el Live Input de Cloudflare Stream y configura el webhook de notificaciones.
 * Imprime los valores que debes pegar en .env.local y en la switcher.
 *
 *   node --env-file=.env.local scripts/cloudflare-setup.mjs
 *
 * Requiere en el entorno: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN.
 * Opcional: SITE_URL (default https://veridismedia.com) para la URL del webhook.
 */
const API = "https://api.cloudflare.com/client/v4";
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const siteUrl = (process.env.SITE_URL || "https://veridismedia.com").replace(/\/$/, "");

if (!accountId || !token) {
  console.error("✗ Falta CLOUDFLARE_ACCOUNT_ID o CLOUDFLARE_API_TOKEN en el entorno.");
  console.error("  Corre: node --env-file=.env.local scripts/cloudflare-setup.mjs");
  process.exit(1);
}

async function cf(path, init) {
  const res = await fetch(`${API}/accounts/${accountId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(`${path} → ${JSON.stringify(json.errors || json)}`);
  }
  return json.result;
}

try {
  console.log("→ Creando live input…");
  const input = await cf("/stream/live_inputs", {
    method: "POST",
    body: JSON.stringify({
      meta: { name: "VERIDIS MEDIA — Canal principal" },
      recording: { mode: "automatic", timeoutSeconds: 10, requireSignedURLs: false },
    }),
  });

  const webhookUrl = `${siteUrl}/api/webhooks/cloudflare`;
  console.log(`→ Configurando webhook → ${webhookUrl}`);
  const webhook = await cf("/stream/webhook", {
    method: "PUT",
    body: JSON.stringify({ notificationUrl: webhookUrl }),
  });

  console.log("\n✓ Listo. Pega esto en .env.local:\n");
  console.log(`CLOUDFLARE_LIVE_INPUT_UID=${input.uid}`);
  console.log(`CLOUDFLARE_STREAM_KEY=${input.rtmps?.streamKey ?? ""}`);
  console.log(`CLOUDFLARE_RTMPS_URL=${input.rtmps?.url ?? "rtmps://live.cloudflare.com:443/live/"}`);
  console.log(`CLOUDFLARE_WEBHOOK_SECRET=${webhook.secret ?? ""}`);

  console.log("\n🎛  En la switcher (salida 3 → directo a live):");
  console.log(`   Servidor RTMP: ${input.rtmps?.url ?? ""}`);
  console.log(`   Clave (stream key): ${input.rtmps?.streamKey ?? ""}`);
  console.log("\n▶️  Webhook configurado. Al arrancar esa salida, el sitio irá a LIVE solo.");
} catch (e) {
  console.error(`✗ Error: ${e.message}`);
  process.exit(1);
}
