"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Scan, Camera } from "lucide-react";
import Image from "next/image";

interface ARViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export function ARViewer({ isOpen, onClose, imageUrl, title }: ARViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      }).then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      }).catch(err => {
        console.error("AR Error:", err);
        setError("Camera access required for AR view.");
      });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center overflow-hidden"
        >
          {error ? (
            <div className="text-rosegold font-mono text-xs uppercase tracking-widest p-8 text-center glass-panel">
              [SYSTEM_ERR] {error}
              <button 
                onClick={onClose}
                className="mt-6 block mx-auto border border-rosegold/30 hover:border-rosegold/80 px-6 py-2 rounded-full transition-all"
              >
                Return
              </button>
            </div>
          ) : (
            <>
              {/* Camera Feed */}
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
              />

              {/* Grid / Overlay Elements */}
              <div className="absolute inset-0 border-[1px] border-rosegold/10 m-4 rounded-[20px] pointer-events-none" />
              <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-rosegold/50 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-rosegold/50 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-rosegold/50 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-rosegold/50 rounded-br-lg pointer-events-none" />

              {/* Top HUD */}
              <div className="absolute top-10 left-12 font-mono text-[9px] uppercase tracking-[0.4em] text-gold/80 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-ruby animate-pulse" />
                AR_PROJECTION_ACTIVE
              </div>

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-8 right-12 z-50 text-ivory/60 hover:text-gold transition-colors p-2 bg-void/40 rounded-full backdrop-blur-md border border-rosegold/20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* The Artifact */}
              {placed ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                  drag
                  dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                  className="relative z-20 cursor-grab active:cursor-grabbing hover:drop-shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-shadow"
                >
                  <div className="relative w-64 md:w-80 aspect-[3/4] ruby-glass p-2 border border-rosegold/50 rounded-lg shadow-2xl">
                    <Image
                      src={imageUrl}
                      alt="AR Artifact"
                      fill
                      className="object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                    />
                    <div className="scanline opacity-50 pointer-events-none" />
                  </div>
                  <div className="font-mono text-[8px] text-center uppercase tracking-widest text-ivory/60 mt-4 leading-relaxed bg-void/40 backdrop-blur-md py-2 border border-rosegold/10 rounded">
                    [DRAG_TO_REPOSITION] <br/>
                    {title}
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  onClick={() => setPlaced(true)}
                  className="relative z-20 flex flex-col items-center justify-center text-ivory/60 hover:text-gold font-mono text-[9px] tracking-widest uppercase transition-all"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Scan className="w-12 h-12 mb-4 opacity-50" />
                  [TAP_TO_PLACE_MANIFESTATION]
                </motion.button>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
