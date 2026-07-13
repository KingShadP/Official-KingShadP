"use client";

import React from "react";
import { motion } from "framer-motion";
import { TheVerse } from "@/components/TheVerse";

export default function CampaignsPage() {
  const viewTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <motion.div {...viewTransition} className="w-full">
      <TheVerse />
    </motion.div>
  );
}
