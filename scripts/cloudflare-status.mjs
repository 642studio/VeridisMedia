#!/usr/bin/env node
/**
 * Diagnóstico de Cloudflare Stream: estado del live input + webhook configurado.
 *   node --env-file=.env.local scripts/cloudflare-status.mjs
 */
const API = "https://api.cloudflare.com/client/v4";
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const uid = process.env.CLOUDFLARE_LIVE_INPUT_UID;

async function cf(path) {
  const res = await fetch(`${API}/accounts/${accountId}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

const input = await cf(`/stream/live_inputs/${uid}`);
console.log("=== LIVE INPUT ===");
console.log("status:", JSON.stringify(input.result?.status));
console.log("connected?:", JSON.stringify(input.result?.status?.current ?? input.result?.status));

const webhook = await cf(`/stream/webhook`);
console.log("\n=== WEBHOOK ===");
console.log("notificationUrl:", webhook.result?.notificationUrl ?? "(NO CONFIGURADO)");
console.log("modified:", webhook.result?.modified ?? "-");

// Videos recientes (grabaciones del live)
const vids = await cf(`/stream?limit=3`);
console.log("\n=== VIDEOS/GRABACIONES recientes ===");
for (const v of vids.result ?? []) {
  console.log(`- ${v.uid} | live:${v.liveInput ?? "-"} | state:${v.status?.state} | ready:${v.readyToStream}`);
}
