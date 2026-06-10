import { Hero } from "@/components/home/hero";
import { HomeSections } from "@/components/home/sections";

// El hero refleja el estado LIVE/OFFLINE en tiempo real.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeSections />
    </>
  );
}
