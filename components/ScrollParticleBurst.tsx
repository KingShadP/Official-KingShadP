"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ScrollParticleBurst() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const shards = Array.from({ length: 35 });

  return (
    <div className="relative w-full h-1 flex justify-center items-center pointer-events-none z-50 my-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -30% 0px" }}
        className="relative"
      >
        {shards.map((_, i) => {
          const angle = (Math.PI * 2 * i) / shards.length + (Math.random() * 0.2);
          const distance = 80 + Math.random() * 150;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const rotation = Math.random() * 360;
          const delay = Math.random() * 0.15;
          const scale = 0.3 + Math.random() * 1.2;

          return (
            <motion.div
              key={i}
              className="absolute top-0 left-0 w-2 h-6"
              style={{
                background: "linear-gradient(135deg, #FFD700 0%, #FF4500 100%)",
                clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                boxShadow: "0 0 15px rgba(255, 69, 0, 0.6)",
              }}
              variants={{
                hidden: { x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 },
                visible: {
                  x,
                  y,
                  opacity: [0, 1, 0],
                  scale,
                  rotate: rotation + 180,
                  transition: { 
                    duration: 1.2 + Math.random(), 
                    delay, 
                    ease: [0.16, 1, 0.3, 1] 
                  }
                }
              }}
            />
          );
        })}
        {/* Core Flash */}
        <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[2px]"
            variants={{
                hidden: { scale: 0, opacity: 0 },
                visible: { scale: [0, 4, 0], opacity: [1, 1, 0], transition: { duration: 0.5, ease: "easeOut" } }
            }}
        />
      </motion.div>
    </div>
  );
}
