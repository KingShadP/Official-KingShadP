import type { Metadata } from "next";
import { SonicVault } from "@/components/music/SonicVault";

export const metadata: Metadata = {
  title: "The Sound — KingShadP",
  description: "The Sonic Vault — playback and signal telemetry.",
};

export default function MusicPage() {
  return <SonicVault />;
}
