import { Hero } from "@/components/home/Hero";
import { SystemIndex } from "@/components/home/SystemIndex";
import { SelectedArtifacts } from "@/components/home/SelectedArtifacts";
import { Doctrine } from "@/components/home/Doctrine";
import { PagePrelude } from "@/components/system/PagePrelude";
import { SITE_MEDIA } from "@/lib/site-media";

export default function Home() {
  return (
    <PagePrelude
      pageKey="home"
      bootLabel="Welcome"
      heading="Enter the Official KingShadP site."
      body="This is the central house for the KingShadP identity: visuals, music, world-building, and the pieces that bring the mythology into physical form."
      enterLabel="Begin"
      backdropSrc={SITE_MEDIA.heroBackdrop}
    >
      <Hero />
      <SystemIndex />
      <SelectedArtifacts />
      <Doctrine />
    </PagePrelude>
  );
}
