"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/live", label: "En vivo" },
  { href: "/eventos", label: "Eventos" },
  { href: "/media", label: "Media" },
  { href: "/servicios", label: "Servicios" },
  { href: "/patrocinios", label: "Patrocinios" },
  { href: "/about", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-fern bg-carbon/95 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="VERIDIS MEDIA — Inicio">
          <Logo />
        </Link>

        {/* Desktop menu */}
        <ul className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative py-5 text-[14px] font-medium tracking-[-0.022em] transition-colors ${
                  isActive(link.href)
                    ? "text-phosphor"
                    : "text-lichen hover:text-phosphor"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-reactor" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/contacto" variant="reactor">
            Transmite tu evento
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center text-phosphor lg:hidden"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 bg-current transition-all ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-all ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 bg-current transition-all ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-fern bg-carbon lg:hidden">
          <ul className="container-page flex flex-col py-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-[15px] font-medium ${
                    isActive(link.href) ? "text-reactor" : "text-phosphor"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="py-3">
              <Button href="/contacto" variant="reactor" className="w-full">
                Transmite tu evento
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
