# VERIDIS MEDIA — Sitio web

Plataforma de medios / streaming de VERIDIS MEDIA (sociedad 642 Studio + MV Songs).
Sitio institucional/comercial **y** canal digital en vivo.

Stack: **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción + chequeo de tipos
```

## ⚡ Estado LIVE / OFFLINE (panel de admin)

El estado del en vivo se controla desde el **panel `/admin`** (estado en runtime, no archivo):

1. Ve a `/admin` → login con `ADMIN_PASSWORD` (ver `.env.local`).
2. Ajusta título, descripción, ciudad, evento, plataforma, URL de embed → **Guardar datos**.
3. **GO LIVE** → el sitio (`/` y `/live`) pasa a LIVE y se dispara el webhook GHL automáticamente.
4. **Terminar transmisión** → vuelve a OFFLINE.

Estado persistido en **Vercel KV** (Redis) en producción; en local sin KV usa un fallback en
memoria (`globalThis`). Lógica en [`lib/broadcast-state.ts`](lib/broadcast-state.ts). El seed
inicial (cuando KV está vacío) viene de [`content/config.ts`](content/config.ts).

> `content/config.ts` sigue conteniendo `broadcastStatus` como **valor semilla** y los datos
> de `nextBroadcast`, redes y contacto.

### Detección automática con Cloudflare Stream (Fase 2b)

La "clave de transmisión" RTMP hace que el sitio se vaya a LIVE **solo** al arrancar la salida 3
de la switcher. Código en [`lib/cloudflare-stream.ts`](lib/cloudflare-stream.ts) y el receptor
en [`app/api/webhooks/cloudflare/route.ts`](app/api/webhooks/cloudflare/route.ts).

**Puesta en marcha** (una vez):
1. Crea un **API Token** en Cloudflare con permiso **Stream:Edit** y ponlo en `.env.local`
   como `CLOUDFLARE_API_TOKEN`.
2. Corre el setup (crea el live input + configura el webhook):
   ```bash
   npm run stream:setup
   ```
   Pega en `.env.local` (y en Vercel) los valores que imprime:
   `CLOUDFLARE_LIVE_INPUT_UID`, `CLOUDFLARE_STREAM_KEY`, `CLOUDFLARE_WEBHOOK_SECRET`.
3. En la switcher, salida 3 → **Servidor RTMP** + **Stream key** (aparecen en `/admin`).
4. Al arrancar esa salida, Cloudflare notifica a `/api/webhooks/cloudflare` → el sitio va a
   LIVE solo, el reproductor apunta al live input y se dispara la automatización GHL. Al cortar,
   vuelve a OFFLINE. La grabación queda como VOD para el archivo.

> El webhook necesita una URL pública: la auto-detección funciona **una vez desplegado en
> Vercel** (Cloudflare no alcanza `localhost`). La detección de estado es tolerante a varios
> formatos de payload y se registra en logs para afinarla con el primer evento real.

## Webhook "EN VIVO" → automatización (GoHighLevel)

Al ir en vivo se dispara un webhook con toda la info de la transmisión para tu
automatización de notificaciones (WhatsApp/SMS). Configuración en `.env.local`
(ver [`.env.example`](.env.example)): `LIVE_WEBHOOK_URL`, `LIVE_WEBHOOK_SECRET` (opcional),
`NEXT_PUBLIC_SITE_URL`.

**Cómo dispararlo** (el toggle `broadcastStatus` controla el banner del sitio; esto manda la notificación):

```bash
npm run go-live:dry     # vista previa del payload, no envía
npm run go-live         # envía el webhook (local)
npm run go-live -- https://veridismedia.com   # contra producción
```

También puedes llamar el endpoint directamente (para botón, celular, Zapier, etc.):

```
POST /api/live/go-live           # envía
POST /api/live/go-live?dry=1     # vista previa
```

El payload incluye: `event_title`, `description`, `platform`, `stream_url`, `watch_url`,
`event_url`, `city`, `sponsors`, redes y un `message` listo para reenviar. Lógica en
[`lib/live-webhook.ts`](lib/live-webhook.ts).

## Contenido (file-based)

Todo el contenido editable vive en [`content/`](content/), tipado contra
[`lib/types.ts`](lib/types.ts) (modelo del doc: Event, Livestream, MediaItem, Sponsor, Program):

- `config.ts` — toggle LIVE/OFFLINE, stream actual, próxima transmisión, redes, contacto
- `services.ts` — líneas de servicio
- `events.ts` — eventos (Home + futura sección /eventos)
- `media.ts` — biblioteca de medios
- `sponsors.ts` — patrocinadores / aliados

Diseñado para migrar a un CMS (Sanity/Payload) en Fase 2 sin cambiar los componentes.

## Diseño

Sistema "phosphor terminal" (negro + verde fósforo) definido en
[`app/globals.css`](app/globals.css) como tokens `@theme` de Tailwind v4.
El **hero** es la única excepción cálida (CRT/broadcast). Tipografías: Inter (UI) +
Space Grotesk como sustituto gratuito de la fuente de pago *Goga* (variable `--font-goga`).

### Asset pendiente

`public/hero-crt.png` — la foto de referencia del CRT (opcional; el hero funciona sin ella
gracias a la recreación en CSS, pero la imagen se superpone si está presente).

## Rutas

| Ruta | Estado |
|------|--------|
| `/` | Home (hero LIVE/OFFLINE + secciones) ✅ |
| `/live` | Canal en vivo ✅ |
| `/eventos` | Listado con filtros (estado/ciudad/categoría) ✅ |
| `/eventos/[slug]` | Página por evento: agenda, galería, material, patrocinadores ✅ |
| `/media` | Biblioteca con filtros (tipo/categoría) ✅ |
| `/servicios` | Líneas de servicio + CTA ✅ |
| `/patrocinios` | Beneficios, tipos de presencia, casos ✅ |
| `/about` | Empresa, sociedad, misión/visión, cobertura ✅ |
| `/contacto` | Formulario multi-solicitud → WhatsApp / correo ✅ |
| `/admin` | Panel de transmisión (login + Go Live/End + auto-fire GHL) ✅ |

### Formularios de contacto

Sin backend (Fase 1): el formulario de `/contacto` arma un mensaje prellenado y lo abre
en **WhatsApp** (`siteConfig.contact.whatsapp`) o **correo** (`siteConfig.contact.email`).
Actualiza esos datos en [`content/config.ts`](content/config.ts).
