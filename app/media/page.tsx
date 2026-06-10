import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { MediaBrowser } from "@/components/media/media-browser";
import { getAllMedia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Media",
  description:
    "La biblioteca de contenido de VERIDIS: transmisiones grabadas, recaps, entrevistas, clips, cápsulas y fotogalerías.",
};

export default function MediaPage() {
  const items = getAllMedia();
  return (
    <>
      <PageHeader
        eyebrow="Media Library"
        title="Toda la biblioteca de VERIDIS, en un lugar."
        intro="Transmisiones, recaps, entrevistas, clips y fotogalerías. Cada cobertura alimenta este archivo y lo hace más valioso."
      />
      <MediaBrowser items={items} />
    </>
  );
}
