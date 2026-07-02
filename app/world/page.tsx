import type { Metadata } from "next";
import { WorldSections } from "@/components/world/WorldSections";

export const metadata: Metadata = {
  title: "The World — KingShadP",
  description:
    "Doctrine and house codes — The Official Intelligence, The Creator and The Create, The Ruler Code, The Luxury of Silence.",
};

export default function WorldPage() {
  return <WorldSections />;
}
