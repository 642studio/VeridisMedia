import type { Service } from "@/lib/types";

/* Líneas de servicio (sección 5.5 del doc). Placeholder editable. */
export const services: Service[] = [
  {
    slug: "streaming-profesional",
    name: "Streaming profesional",
    tagline: "Transmite tu evento con calidad técnica.",
    description:
      "Para clientes que solo quieren transmitir su evento con la mejor calidad de imagen y audio.",
    includes: ["Cámaras", "Switch", "Audio", "Transmisión en vivo", "Grabación"],
  },
  {
    slug: "cobertura-editorial",
    name: "Cobertura editorial",
    tagline: "Tu evento convertido en contenido.",
    description:
      "Para eventos que necesitan producción, narrativa, entrevistas y contenido para redes.",
    includes: [
      "Streaming",
      "Host / reportero",
      "Entrevistas",
      "Recaps",
      "Clips",
      "Fotografía",
    ],
  },
  {
    slug: "medio-difusion",
    name: "Medio + difusión",
    tagline: "Alcance y presencia en red.",
    description:
      "Para eventos que quieren amplificarse a través de páginas aliadas y comunidades locales.",
    includes: [
      "Cobertura",
      "Distribución en páginas aliadas",
      "Integración de marcas",
      "Patrocinios",
      "Publicaciones",
    ],
  },
  {
    slug: "programas-recurrentes",
    name: "Programas recurrentes",
    tagline: "Un espacio continuo para tu proyecto.",
    description:
      "Para proyectos que quieren un espacio semanal o mensual con producción y archivo propio.",
    includes: [
      "Producción semanal o mensual",
      "Transmisión",
      "Clips",
      "Archivo",
      "Patrocinadores",
    ],
  },
  {
    slug: "canal-de-marca",
    name: "Canal de marca",
    tagline: "Tu propio canal producido por VERIDIS.",
    description:
      "Para empresas o instituciones que quieren su propio programa o canal producido profesionalmente.",
    includes: ["Concepto", "Producción", "Transmisión", "Distribución", "Archivo"],
  },
  {
    slug: "retainer-institucional",
    name: "Retainer institucional",
    tagline: "Cobertura constante todo el mes.",
    description:
      "Para instituciones que requieren cobertura y producción de manera continua.",
    includes: [
      "Cobertura mensual",
      "Producción",
      "Difusión en red",
      "Reportes",
      "Archivo digital",
    ],
  },
];
