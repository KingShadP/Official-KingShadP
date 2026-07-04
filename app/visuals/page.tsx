import type { Metadata } from "next";
import { VisualMuseum } from "@/components/visuals/VisualMuseum";
import { getVisualMedia } from "@/lib/visual-media";

export const metadata: Metadata = {
  title: "Visuals — KingShadP",
  description: "A full-screen visual museum of the KingShadP archive.",
};

export default function VisualsPage() {
  const items = getVisualMedia();
  return <VisualMuseum items={items} />;
}
