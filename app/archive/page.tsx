import type { Metadata } from "next";
import { ArchiveGrid } from "@/components/archive/ArchiveGrid";

export const metadata: Metadata = {
  title: "The Archive — KingShadP",
  description: "Artifacts and specifications from the KingShadP archive.",
};

export default function ArchivePage() {
  return <ArchiveGrid />;
}
