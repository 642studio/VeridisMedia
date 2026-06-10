/* ============================================================================
   VERIDIS MEDIA — Content model
   Entities mirror the planning doc (sección 7). Used by the file-based content
   layer in /content; designed to map cleanly onto a CMS schema in Fase 2.
   ========================================================================= */

export type BroadcastStatus = "LIVE" | "OFFLINE";

export type StreamPlatform = "youtube" | "facebook" | "twitch" | "custom";

export type EventStatus = "proximo" | "en-vivo" | "finalizado";

export type EventCategory =
  | "cultura"
  | "musica"
  | "institucional"
  | "empresarial"
  | "noticias"
  | "deportes"
  | "comunidad"
  | "entretenimiento";

export type MediaType =
  | "transmision"
  | "recap"
  | "entrevista"
  | "noticia"
  | "clip"
  | "programa"
  | "capsula"
  | "fotogaleria"
  | "video-corto";

export type SponsorLevel = "title" | "presenting" | "official" | "partner";

export interface Sponsor {
  name: string;
  logo: string;
  website?: string;
  packageLevel: SponsorLevel;
  eventId?: string;
  active: boolean;
}

export interface Livestream {
  title: string;
  slug: string;
  eventId?: string;
  status: BroadcastStatus;
  /** Embed/iframe URL of the player (YouTube/Facebook/etc.) */
  streamUrl?: string;
  platform: StreamPlatform;
  startTime?: string;
  endTime?: string;
  thumbnail?: string;
  description?: string;
  sponsors?: Sponsor[];
  chatEnabled?: boolean;
  replayUrl?: string;
}

export interface MediaItem {
  title: string;
  slug: string;
  type: MediaType;
  category: EventCategory;
  eventId?: string;
  date: string;
  thumbnail?: string;
  videoUrl?: string;
  imageUrl?: string;
  description?: string;
  tags?: string[];
  city?: string;
}

export interface VeridisEvent {
  title: string;
  slug: string;
  description: string;
  city: string;
  venue?: string;
  startDate: string;
  endDate?: string;
  status: EventStatus;
  category: EventCategory;
  coverImage?: string;
  sponsors?: Sponsor[];
  schedule?: { time: string; label: string }[];
  livestreams?: Livestream[];
  gallery?: string[];
  videos?: MediaItem[];
  recaps?: MediaItem[];
  downloads?: { label: string; url: string }[];
}

export interface Program {
  title: string;
  slug: string;
  description: string;
  host?: string;
  schedule?: string;
  episodes?: MediaItem[];
  coverImage?: string;
  category: EventCategory;
  sponsors?: Sponsor[];
}

/** A line of service offered on /servicios and surfaced on the home. */
export interface Service {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  includes: string[];
}

/** Global broadcast/site configuration — the manual LIVE/OFFLINE toggle (Fase 1). */
export interface SiteConfig {
  broadcastStatus: BroadcastStatus;
  /** The stream shown on /live and surfaced in the hero when LIVE. */
  currentStream: Livestream;
  /** Next scheduled broadcast, shown while OFFLINE. */
  nextBroadcast: {
    name: string;
    date: string;
    eventSlug?: string;
  };
  social: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    handle: string;
  };
  contact: {
    whatsapp?: string;
    email?: string;
    city: string;
  };
}
