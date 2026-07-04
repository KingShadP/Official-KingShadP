import type { Metadata } from "next";
import { WorldSections } from "@/components/world/WorldSections";
import { PagePrelude } from "@/components/system/PagePrelude";
import { SITE_MEDIA } from "@/lib/site-media";

export const metadata: Metadata = {
  title: "The World — KingShadP",
  description:
    "Doctrine and house codes — The Official Intelligence, The Creator and The Create, The Ruler Code, The Luxury of Silence.",
};

export default function WorldPage() {
  return (
    <PagePrelude
      pageKey="world"
      bootLabel="World"
      heading="This is the code behind the image."
      body="The World explains the rules, symbols, and internal logic that hold the KingShadP identity together."
      enterLabel="Enter World"
      backdropSrc={SITE_MEDIA.worldMark}
    >
      <WorldSections />
    </PagePrelude>
  );
}
