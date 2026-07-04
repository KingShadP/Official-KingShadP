"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { VisualMediaItem } from "@/lib/visual-media";
import { TransitionLink } from "@/components/system/TransitionProvider";

type VisualCategory = "brand" | "prophecy" | "lookbook";

function mod(index: number, length: number) {
  return (index + length) % length;
}

function createScore() {
  const Ctx = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) {
    return null;
  }

  const ctx = new Ctx();
  const master = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const voices = [
    [55, 0.16],
    [65.41, 0.09],
    [82.41, 0.06],
    [110, 0.035],
  ] as const;
  const oscillators = voices.map(([frequency, volume], index) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = index === 0 ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(filter);
    oscillator.start();
    return oscillator;
  });

  filter.type = "lowpass";
  filter.frequency.value = 380;
  filter.Q.value = 0.6;
  filter.connect(master);
  master.connect(ctx.destination);
  master.gain.value = 0.0001;
  master.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2.4);

  lfo.frequency.value = 0.06;
  lfoGain.gain.value = 180;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  return {
    ctx,
    stop() {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value || 0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      window.setTimeout(() => {
        oscillators.forEach((oscillator) => oscillator.stop());
        lfo.stop();
        void ctx.close();
      }, 1000);
    },
  };
}

export function VisualMuseum({ items }: { items: VisualMediaItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<VisualCategory>("brand");
  const [sceneOffset, setSceneOffset] = useState({ x: 0, y: 0 });
  const scoreRef = useRef<ReturnType<typeof createScore> | null>(null);

  // Start ambient score on first interaction
  useEffect(() => {
    const startScore = async () => {
      if (!scoreRef.current) {
        scoreRef.current = createScore();
        if (scoreRef.current) {
          await scoreRef.current.ctx.resume();
        }
      }
      window.removeEventListener("pointerdown", startScore as unknown as EventListener);
    };
    window.addEventListener("pointerdown", startScore as unknown as EventListener, { once: true });
    return () => window.removeEventListener("pointerdown", startScore as unknown as EventListener);
  }, []);

  useEffect(() => {
    return () => {
      scoreRef.current?.stop();
      scoreRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.location.href = "/";
      } else if (event.key === "ArrowRight") {
        setActiveIndex((current) => mod(current + 1, filteredItems.length));
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((current) => mod(current - 1, filteredItems.length));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, items.length]);

  useEffect(() => {
    const onDeviceOrientation = (event: DeviceOrientationEvent) => {
      const gamma = Math.max(-20, Math.min(20, event.gamma ?? 0));
      const beta = Math.max(-20, Math.min(20, event.beta ?? 0));
      setSceneOffset({ x: gamma / 20, y: beta / 20 });
    };
    window.addEventListener("deviceorientation", onDeviceOrientation);
    return () => window.removeEventListener("deviceorientation", onDeviceOrientation);
  }, []);

  const groupedItems = useMemo(() => {
    const buckets: Record<VisualCategory, VisualMediaItem[]> = {
      brand: [],
      prophecy: [],
      lookbook: [],
    };

    items.forEach((item) => {
      const normalized = decodeURIComponent(item.src).toLowerCase();
      const name = item.fileName.toLowerCase();

      if (
        normalized.includes("giragon") ||
        normalized.includes("wordmark") ||
        normalized.includes("signature") ||
        normalized.includes("crest") ||
        normalized.includes("source_sp") ||
        name.includes("transparent")
      ) {
        buckets.brand.push(item);
      } else if (
        normalized.includes("image-gen") ||
        normalized.includes("product") ||
        normalized.includes("unisex") ||
        normalized.includes("jacket") ||
        normalized.includes("shirt") ||
        normalized.includes("hoodie")
      ) {
        buckets.lookbook.push(item);
      } else {
        buckets.prophecy.push(item);
      }
    });

    return buckets;
  }, [items]);

  const filteredItems = groupedItems[activeCategory];
  const activeItem = filteredItems[activeIndex];

  const categories: { key: VisualCategory; label: string }[] = [
    { key: "brand", label: "Brand" },
    { key: "prophecy", label: "KingShadProphecy" },
    { key: "lookbook", label: "Lookbook" },
  ];

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-black"
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        setSceneOffset({ x, y });
      }}
      onMouseLeave={() => setSceneOffset({ x: 0, y: 0 })}
    >
      <div className="absolute inset-0 bg-black" />

      {/* Exit button */}
      <div className="absolute left-4 top-4 z-20 md:left-6 md:top-6">
        <TransitionLink
          href="/"
          className="rounded-full border border-ivory/20 bg-black/35 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ivory/75 backdrop-blur-sm transition hover:border-bronze/70 hover:text-bronze"
        >
          Exit
        </TransitionLink>
      </div>

      {/* Media viewer */}
      {filteredItems.length > 0 && activeItem ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeItem.kind === "video" ? (
                <video
                  src={activeItem.src}
                  className="h-full w-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <>
                  {/* Blurred spatial background layer */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeItem.src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-40 blur-2xl scale-110"
                    draggable={false}
                    style={{
                      transform: `translate3d(${sceneOffset.x * -18}px, ${sceneOffset.y * -18}px, 0) scale(1.14)`,
                    }}
                  />
                  {/* Foreground subject with parallax */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeItem.src}
                    alt=""
                    className="relative h-full w-full object-contain will-change-transform"
                    draggable={false}
                    style={{
                      transform: `translate3d(${sceneOffset.x * 10}px, ${sceneOffset.y * 10}px, 0) scale(1.02)`,
                      transition: "transform 220ms ease-out",
                    }}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Prev/Next */}
          <button
            type="button"
            aria-label="Previous visual"
            onClick={() => setActiveIndex((current) => mod(current - 1, filteredItems.length))}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-ivory/25 bg-black/25 px-4 py-4 text-xl text-ivory/80 backdrop-blur-sm transition hover:border-bronze/70 hover:text-bronze md:left-8"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next visual"
            onClick={() => setActiveIndex((current) => mod(current + 1, filteredItems.length))}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-ivory/25 bg-black/25 px-4 py-4 text-xl text-ivory/80 backdrop-blur-sm transition hover:border-bronze/70 hover:text-bronze md:right-8"
          >
            →
          </button>

          {/* Counter */}
          <div className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 font-mono text-[9px] tracking-[0.35em] text-ivory/35 uppercase">
            {activeIndex + 1} / {filteredItems.length}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-serif text-ivory/35 text-lg">No media in this collection.</p>
        </div>
      )}

      {/* Category tab bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-0 border-t border-ivory/10 bg-black/60 backdrop-blur-sm">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => {
              setActiveCategory(cat.key);
              setActiveIndex(0);
            }}
            className={`flex-1 py-4 font-mono text-[9px] uppercase tracking-[0.35em] transition-colors ${
              activeCategory === cat.key
                ? "text-bronze border-t-2 border-bronze -mt-px"
                : "text-ivory/45 hover:text-ivory"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
}
