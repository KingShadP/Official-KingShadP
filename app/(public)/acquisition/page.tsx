"use client";

import React from "react";
import { motion } from "framer-motion";
import { AcquisitionGrid } from "@/components/AcquisitionGrid";

export default function AcquisitionPage() {
  const viewTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <motion.div {...viewTransition} className="w-full">
      <AcquisitionGrid />
    </motion.div>
  );
}
