"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { VisualMediaItem } from "@/lib/visual-media";
import { TransitionLink } from "@/components/system/TransitionProvider";

type Stage = "boot" | "disclaimer" | "viewing";
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
  const [stage, setStage] = useState<Stage>("boot");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<VisualCategory>("brand");
  const [sceneOffset, setSceneOffset] = useState({ x: 0, y: 0 });
  const scoreRef = useRef<ReturnType<typeof createScore> | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setStage("disclaimer"), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (stage !== "viewing") {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.location.href = "/";
      } else if (event.key === "ArrowRight") {
        setActiveIndex((current) => mod(current + 1, items.length));
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((current) => mod(current - 1, items.length));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [items.length, stage]);

  useEffect(() => {
    if (stage !== "viewing") {
      return;
    }

    const onDeviceOrientation = (event: DeviceOrientationEvent) => {
      const gamma = Math.max(-20, Math.min(20, event.gamma ?? 0));
      const beta = Math.max(-20, Math.min(20, event.beta ?? 0));
      setSceneOffset({
        x: gamma / 20,
        y: beta / 20,
      });
    };

    window.addEventListener("deviceorientation", onDeviceOrientation);
    return () => window.removeEventListener("deviceorientation", onDeviceOrientation);
  }, [stage]);

  useEffect(() => {
    return () => {
      scoreRef.current?.stop();
      scoreRef.current = null;
    };
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
  const canRenderViewer = filteredItems.length > 0 && stage === "viewing";
  const introMarkup = useMemo(
    () => (
      <AnimatePresence mode="wait">
        {stage === "boot" ? (
          <motion.div
            key="boot"
            className="absolute inset-0 flex items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className="font-serif text-4xl md:text-6xl tracking-[0.2em] uppercase text-ivory/90"
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.2em" }}
              transition={{ duration: 1.1 }}
            >
              Visuals
            </motion.span>
          </motion.div>
        ) : null}

        {stage === "disclaimer" ? (
          <motion.div
            key="disclaimer"
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/96 px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-2xl">
              <p className="mb-5 font-mono text-[10px] tracking-[0.4em] uppercase text-bronze">Viewer Notice</p>
              <h1 className="mb-6 font-serif text-4xl md:text-6xl font-light text-ivory">Choose your wing.</h1>
              <p className="mb-4 font-serif text-lg md:text-xl font-light leading-relaxed text-ivory/70">
                This museum opens one work at a time at full scale, with mandatory sound and no mute control once you enter.
              </p>
              <p className="mb-10 font-serif text-base md:text-lg font-light leading-relaxed text-ivory/55">
                Select the collection you want to enter first: symbols and marks, cinematic prophecy, or purchasable looks.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    key: "brand" as const,
                    title: "Brand",
                    body: "Logos, monograms, watermarks, insignia, and source symbols.",
                  },
                  {
                    key: "prophecy" as const,
                    title: "KingShadProphecy",
                    body: "Mythic editorial scenes: hotels, yachts, presence, and cinematic fashion.",
                  },
                  {
                    key: "lookbook" as const,
                    title: "The KingShadP Lookbook",
                    body: "Product-led imagery focused on garments and pieces available to buy.",
                  },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={async () => {
                      setActiveCategory(option.key);
                      setActiveIndex(0);
                      if (!scoreRef.current) {
                        scoreRef.current = createScore();
                        if (scoreRef.current) {
                          await scoreRef.current.ctx.resume();
                        }
                      }
                      setStage("viewing");
                    }}
                    className="border border-ivory/10 bg-white/[0.03] px-5 py-6 text-left transition hover:border-bronze/55 hover:bg-bronze/5"
                  >
                    <span className="block font-mono text-[10px] uppercase tracking-[0.35em] text-bronze mb-3">{option.title}</span>
                    <span className="block font-serif text-base leading-relaxed text-ivory/75">{option.body}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    ),
    [stage]
  );

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

      {stage !== "boot" ? (
        <div className="absolute left-4 top-4 z-20 md:left-6 md:top-6">
          <TransitionLink
            href="/"
            className="rounded-full border border-ivory/20 bg-black/35 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ivory/75 backdrop-blur-sm transition hover:border-bronze/70 hover:text-bronze"
          >
            Exit
          </TransitionLink>
        </div>
      ) : null}

      {canRenderViewer && activeItem ? (
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
        </>
      ) : null}

      {introMarkup}
    </section>
  );
}
