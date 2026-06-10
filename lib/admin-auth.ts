/* ============================================================================
   Auth de admin — contraseña simple + cookie de sesión stateless (HMAC).
   Compatible con el runtime edge (middleware) y node. Sin base de datos.
   ========================================================================= */

export const SESSION_COOKIE = "veridis_admin";
const SESSION_MESSAGE = "veridis-admin-session-v1";
const SECRET = process.env.ADMIN_SESSION_SECRET || "dev-insecure-secret-change-me";

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toBase64Url(new Uint8Array(sig));
}

/** Token de sesión firmado (mismo valor mientras el secreto no cambie). */
export async function createSessionToken(): Promise<string> {
  return hmac(SESSION_MESSAGE);
}

/** Verifica que la cookie corresponda a una sesión válida. */
export async function verifySessionToken(token?: string | null): Promise<boolean> {
  if (!token) return false;
  const expected = await createSessionToken();
  // comparación de longitud constante simple
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

/** Compara la contraseña enviada contra ADMIN_PASSWORD. */
export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && password === expected;
}
