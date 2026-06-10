import type { Sponsor } from "@/lib/types";

/* Patrocinadores / aliados mostrados en el logo strip del Home.
   `logo` puede ser una ruta a /public o quedar vacío para usar el wordmark. */
export const sponsors: Sponsor[] = [
  { name: "642 Studio", logo: "", website: "https://642studio.com", packageLevel: "partner", active: true },
  { name: "MV Songs", logo: "", packageLevel: "partner", active: true },
  { name: "642 News", logo: "", packageLevel: "partner", active: true },
  { name: "Comercio Local", logo: "", packageLevel: "official", active: true },
  { name: "Marca Aliada", logo: "", packageLevel: "official", active: true },
  { name: "Comunidad Navojoa", logo: "", packageLevel: "partner", active: true },
];
