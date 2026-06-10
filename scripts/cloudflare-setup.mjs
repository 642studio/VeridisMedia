#!/usr/bin/env node
/**
 * Crea (o reutiliza) el Live Input de Cloudflare Stream y, si la URL es alcanzable,
 * configura el webhook de notificaciones. Imprime los valores para .env.local.
 *
 *   node --env-file=.env.local scripts/cloudflare-setup.mjs
 *
 * Requiere: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN.
 * Opcional: SITE_URL (default https://veridismedia.mx) para el webhook.
 *
 * Es idempotente: reutiliza el live input llamado INPUT_NAME en vez de duplicar.
 * El webhook es no-fatal: si la URL aún no responde (sitio sin desplegar), avisa y
 * sigue. Vuelve a correr `npm run stream:webhook` tras el deploy para el secreto.
 */
const API = "https://api.cloudflare.com/client/v4";
const INPUT_NAME = "VERIDIS MEDIA — Canal principal";
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const siteUrl = (process.env.SITE_URL || "https://veridismedia.mx").replace(/\/$/, "");

if (!accountId || !token) {
  console.error("✗ Falta CLOUDFLARE_ACCOUNT_ID o CLOUDFLARE_API_TOKEN en el entorno.");
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
  if (!json.success) throw new Error(`${path} → ${JSON.stringify(json.errors || json)}`);
  return json.result;
}

try {
  // 1) Reutiliza un live input existente con nuestro nombre, o crea uno.
  console.log("→ Buscando live input existente…");
  const list = await cf("/stream/live_inputs");
  const items = Array.isArray(list?.liveInputs) ? list.liveInputs : list || [];
  let uid = items.find((i) => i?.meta?.name === INPUT_NAME)?.uid;

  if (uid) {
    console.log(`✓ Reutilizando live input ${uid}`);
  } else {
    console.log("→ Creando live input…");
    const created = await cf("/stream/live_inputs", {
      method: "POST",
      body: JSON.stringify({
        meta: { name: INPUT_NAME },
        recording: { mode: "automatic", timeoutSeconds: 10, requireSignedURLs: false },
      }),
    });
    uid = created.uid;
    console.log(`✓ Creado ${uid}`);
  }

  // 2) Trae los detalles (incluye la stream key).
  const input = await cf(`/stream/live_inputs/${uid}`);
  const rtmpsUrl = input.rtmps?.url ?? "rtmps://live.cloudflare.com:443/live/";
  const streamKey = input.rtmps?.streamKey ?? "";

  // 3) Webhook (no-fatal).
  const webhookUrl = `${siteUrl}/api/webhooks/cloudflare`;
  let webhookSecret = "";
  let webhookOk = false;
  try {
    console.log(`→ Configurando webhook → ${webhookUrl}`);
    const webhook = await cf("/stream/webhook", {
      method: "PUT",
      body: JSON.stringify({ notificationUrl: webhookUrl }),
    });
    webhookSecret = webhook.secret ?? "";
    webhookOk = true;
    console.log("✓ Webhook configurado");
  } catch (e) {
    console.log(`⚠ Webhook no configurado (la URL ${webhookUrl} aún no responde).`);
    console.log("  Tras desplegar, corre: SITE_URL=https://TU-DOMINIO npm run stream:setup");
  }

  // 4) Salida.
  console.log("\n========== Pega en .env.local (y en Vercel) ==========\n");
  console.log(`CLOUDFLARE_LIVE_INPUT_UID=${uid}`);
  console.log(`CLOUDFLARE_STREAM_KEY=${streamKey}`);
  console.log(`CLOUDFLARE_RTMPS_URL=${rtmpsUrl}`);
  if (webhookOk) console.log(`CLOUDFLARE_WEBHOOK_SECRET=${webhookSecret}`);
  else console.log(`CLOUDFLARE_WEBHOOK_SECRET=   # pendiente — corre stream:webhook tras el deploy`);

  console.log("\n========== En la switcher (salida 3 → directo a live) ==========\n");
  console.log(`Servidor RTMP : ${rtmpsUrl}`);
  console.log(`Stream key    : ${streamKey}`);
} catch (e) {
  console.error(`✗ Error: ${e.message}`);
  process.exit(1);
}
