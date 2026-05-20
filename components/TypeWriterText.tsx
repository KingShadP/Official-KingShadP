"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function TypeWriterText({ text, className = "" }: { text: string, className?: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const speed = 30; // ms per char
    setDisplayedText("");
    
    // Add a small delay before starting to type
    const startDelay = setTimeout(() => {
        const interval = setInterval(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
        if (index === text.length) {
            clearInterval(interval);
        }
        }, speed);
        
        return () => clearInterval(interval);
    }, 400);

    return () => clearTimeout(startDelay);
  }, [text]);

  return (
    <span className={className}>
      {displayedText}
      {displayedText.length < text.length && (
         <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="inline-block w-1.5 h-4 ml-1 bg-rosegold align-middle"
         />
      )}
    </span>
  );
}
