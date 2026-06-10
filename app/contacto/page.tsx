import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ContactForm } from "@/components/contacto/contact-form";
import { siteConfig } from "@/content/config";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Transmite tu evento, solicita cobertura, patrocina, crea un programa o propón una alianza. Escríbenos por WhatsApp o correo.",
};

export default function ContactoPage() {
  const { contact, social } = siteConfig;
  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title="Hagamos que tu evento sea señal."
        intro="Cuéntanos qué necesitas y te respondemos con una propuesta. Elige el tipo de solicitud y completa los datos."
      />

      <section className="container-page grid gap-12 py-12 md:grid-cols-[1.6fr_1fr] md:py-16">
        <ContactForm />

        <aside className="space-y-6">
          <div className="rounded-[16px] border border-fern bg-carbon p-6">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
              Directo
            </h2>
            <ul className="mt-4 space-y-3 text-[15px] text-phosphor">
              {contact.whatsapp && (
                <li>
                  <span className="block text-[12px] uppercase tracking-[0.1em] text-slate">
                    WhatsApp
                  </span>
                  {contact.whatsapp}
                </li>
              )}
              {contact.email && (
                <li>
                  <span className="block text-[12px] uppercase tracking-[0.1em] text-slate">
                    Correo
                  </span>
                  <a href={`mailto:${contact.email}`} className="hover:text-reactor">
                    {contact.email}
                  </a>
                </li>
              )}
              <li>
                <span className="block text-[12px] uppercase tracking-[0.1em] text-slate">
                  Ciudad
                </span>
                {contact.city}
              </li>
            </ul>
          </div>

          <div className="rounded-[16px] border border-fern bg-carbon p-6">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.1em] text-lichen">
              Redes
            </h2>
            <div className="mt-4 flex flex-col gap-2 text-[15px]">
              {social.facebook && (
                <a href={social.facebook} className="text-phosphor hover:text-reactor">
                  Facebook
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} className="text-phosphor hover:text-reactor">
                  YouTube
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} className="text-phosphor hover:text-reactor">
                  Instagram {social.handle}
                </a>
              )}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
