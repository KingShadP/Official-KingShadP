import type { Metadata } from "next";
import { SonicVault } from "@/components/music/SonicVault";
import { PagePrelude } from "@/components/system/PagePrelude";
import { SITE_MEDIA } from "@/lib/site-media";

export const metadata: Metadata = {
  title: "The Sound — KingShadP",
  description: "The Sonic Vault — playback and signal telemetry.",
};

export default function MusicPage() {
  return (
    <PagePrelude
      pageKey="music"
      bootLabel="Sonic Vault"
      heading="Sound enters first."
      body="This room is built for atmosphere, fragments, and the emotional register behind the mark. Enter when you are ready to listen in full focus."
      enterLabel="Enter Sound"
      backdropSrc={SITE_MEDIA.soundMark}
    >
      <SonicVault />
    </PagePrelude>
  );
}
