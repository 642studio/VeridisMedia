import type { VeridisEvent } from "@/lib/types";

/* Eventos. Cada uno tiene su página propia en /eventos/[slug].
   Las imágenes (coverImage, gallery) son opcionales: si faltan, la UI muestra
   placeholders. Edita o agrega eventos aquí. */
export const events: VeridisEvent[] = [
  {
    title: "Festival Cultural Navojoa 2025",
    slug: "festival-cultural-navojoa-2025",
    description:
      "Tres noches de música, arte y cultura con cobertura completa en vivo desde el corazón de Navojoa. Transmisión, entrevistas, recaps y galería oficial.",
    city: "Navojoa, Sonora",
    venue: "Plaza 5 de Mayo",
    startDate: "2025-06-21",
    endDate: "2025-06-23",
    status: "proximo",
    category: "cultura",
    schedule: [
      { time: "20:00", label: "Apertura y bienvenida" },
      { time: "20:30", label: "Presentación de artistas locales" },
      { time: "22:00", label: "Concierto principal" },
      { time: "23:30", label: "Cierre y entrevistas" },
    ],
    sponsors: [
      { name: "642 Studio", logo: "", packageLevel: "presenting", active: true },
      { name: "MV Songs", logo: "", packageLevel: "official", active: true },
      { name: "Comercio Local", logo: "", packageLevel: "partner", active: true },
    ],
    gallery: [],
  },
  {
    title: "Expo Empresarial del Mayo 2025",
    slug: "expo-empresarial-del-mayo-2025",
    description:
      "Cobertura editorial del encuentro de negocios más importante de la región: transmisión, host, entrevistas a expositores y clips para redes.",
    city: "Navojoa, Sonora",
    venue: "Centro de Convenciones",
    startDate: "2025-07-12",
    status: "proximo",
    category: "empresarial",
    schedule: [
      { time: "09:00", label: "Inauguración" },
      { time: "10:00", label: "Panel de negocios regionales" },
      { time: "13:00", label: "Entrevistas a expositores" },
      { time: "17:00", label: "Networking y cierre" },
    ],
    sponsors: [
      { name: "Cámara de Comercio", logo: "", packageLevel: "presenting", active: true },
      { name: "Marca Aliada", logo: "", packageLevel: "official", active: true },
    ],
    gallery: [],
  },
  {
    title: "Clausura Liga Municipal de Futbol",
    slug: "clausura-liga-municipal-futbol",
    description:
      "Transmisión de la gran final con entrevistas, recaps y galería de fotos. Una jornada completa de deporte comunitario cubierta de principio a fin.",
    city: "Cajeme, Sonora",
    venue: "Estadio Municipal",
    startDate: "2025-05-30",
    status: "finalizado",
    category: "deportes",
    schedule: [
      { time: "16:00", label: "Previa y alineaciones" },
      { time: "17:00", label: "Gran final" },
      { time: "19:00", label: "Premiación" },
    ],
    sponsors: [
      { name: "Comunidad Navojoa", logo: "", packageLevel: "partner", active: true },
    ],
    gallery: [],
    downloads: [{ label: "Galería de prensa (ZIP)", url: "#" }],
  },
  {
    title: "Noche de Música en Vivo",
    slug: "noche-de-musica-en-vivo",
    description:
      "Una velada con los mejores talentos del sur de Sonora, transmitida en vivo con producción multicámara.",
    city: "Navojoa, Sonora",
    venue: "Foro Cultural",
    startDate: "2025-04-27",
    status: "finalizado",
    category: "musica",
    gallery: [],
  },
];
