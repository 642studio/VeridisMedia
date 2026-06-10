import Link from "next/link";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/content/config";

const nav = [
  { href: "/live", label: "En vivo" },
  { href: "/eventos", label: "Eventos" },
  { href: "/media", label: "Media" },
  { href: "/servicios", label: "Servicios" },
  { href: "/patrocinios", label: "Patrocinios" },
  { href: "/about", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Footer() {
  const { social, contact } = siteConfig;
  const year = 2025;

  return (
    <footer className="border-t border-fern bg-void">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-[14px] leading-relaxed text-lichen">
            Transmitimos, producimos y amplificamos eventos en vivo. Una plataforma
            de medios nacida en Sonora.
          </p>
          <p className="mt-4 text-[12px] uppercase tracking-[0.1em] text-slate">
            {contact.city}
          </p>
        </div>

        <div>
          <h3 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[14px] text-phosphor/80 transition-colors hover:text-reactor"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2.5 text-[14px] text-phosphor/80">
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-reactor">
                  {contact.email}
                </a>
              </li>
            )}
            {contact.whatsapp && <li>{contact.whatsapp}</li>}
          </ul>
          <div className="mt-4 flex gap-4 text-[14px]">
            {social.facebook && (
              <a href={social.facebook} className="text-lichen hover:text-reactor">
                Facebook
              </a>
            )}
            {social.youtube && (
              <a href={social.youtube} className="text-lichen hover:text-reactor">
                YouTube
              </a>
            )}
            {social.instagram && (
              <a href={social.instagram} className="text-lichen hover:text-reactor">
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-fern">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-[12px] text-slate md:flex-row">
          <p>© {year} VERIDIS MEDIA · Sociedad 642 Studio + MV Songs</p>
          <p>{social.handle}</p>
        </div>
      </div>
    </footer>
  );
}
