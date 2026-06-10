import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Space Grotesk stands in for the paid display face "Goga" (a humanist grotesque).
// Swap this import / the @font-face if Goga is later licensed; --font-goga handles the rest.
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://veridismedia.com"),
  title: {
    default: "VERIDIS MEDIA — Streaming, cobertura y difusión en vivo",
    template: "%s · VERIDIS MEDIA",
  },
  description:
    "Transmitimos, producimos y amplificamos eventos en vivo. Una plataforma de medios nacida en Sonora. De Navojoa para nuevas audiencias digitales.",
  openGraph: {
    title: "VERIDIS MEDIA",
    description:
      "Streaming profesional con alcance real. Cultura, entretenimiento y actualidad en tiempo real.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen bg-void text-phosphor antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
