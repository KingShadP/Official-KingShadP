import { Hero } from "@/components/home/Hero";
import { SystemIndex } from "@/components/home/SystemIndex";
import { SelectedArtifacts } from "@/components/home/SelectedArtifacts";
import { Doctrine } from "@/components/home/Doctrine";

export default function Home() {
  return (
    <>
      <Hero />
      <SystemIndex />
      <SelectedArtifacts />
      <Doctrine />
    </>
  );
}
