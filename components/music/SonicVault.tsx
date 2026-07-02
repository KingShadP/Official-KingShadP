"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/system/Reveal";
import { TRACKS } from "@/lib/content";

/**
 * The Sonic Vault.
 * Plays real audio when a track has a `src` (drop files in /public/audio
 * and set them in lib/content.ts). Until masters are loaded, each track
 * offers a generated ambient preview signal, routed through the same
 * analyser so the visualizer is always live.
 */

type Engine = {
  ctx: AudioContext;
  analyser: AnalyserNode;
  master: GainNode;
  stop: (() => void) | null;
  audioEl: HTMLAudioElement | null;
  mediaSrc: MediaElementAudioSourceNode | null;
};

export function SonicVault() {
  const [playing, setPlaying] = useState<string | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const startedAt = useRef(0);

  const getEngine = (): Engine => {
    if (!engineRef.current) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;
      const master = ctx.createGain();
      master.gain.value = 0.0;
      master.connect(analyser);
      analyser.connect(ctx.destination);
      engineRef.current = { ctx, analyser, master, stop: null, audioEl: null, mediaSrc: null };
    }
    return engineRef.current;
  };

  const stopAll = () => {
    const e = engineRef.current;
    if (!e) return;
    e.stop?.();
    e.stop = null;
    if (e.audioEl) e.audioEl.pause();
    setPlaying(null);
  };

  const startDrone = (e: Engine, root: number) => {
    const { ctx, master } = e;
    const nodes: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    const voices: Array<[number, number]> = [
      [root, 0.5],
      [root * 1.498, 0.22],
      [root * 2.003, 0.3],
      [root * 2.997, 0.1],
      [root * 4.01, 0.05],
    ];

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.8;
    filter.connect(master);

    // Slow breathing on the filter — the "motion" of the drone
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    voices.forEach(([freq, vol]) => {
      const osc = ctx.createOscillator();
      osc.type = freq === root ? "triangle" : "sine";
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() - 0.5) * 7;
      const g = ctx.createGain();
      g.gain.value = vol;
      osc.connect(g);
      g.connect(filter);
      osc.start();
      nodes.push(osc);
      gains.push(g);
    });

    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.11, ctx.currentTime + 2.2);

    e.stop = () => {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value || 0.0001, t);
      master.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      setTimeout(() => {
        nodes.forEach((n) => n.stop());
        lfo.stop();
      }, 700);
    };
  };

  const startFile = (e: Engine, src: string) => {
    if (!e.audioEl) {
      e.audioEl = new Audio();
      e.audioEl.crossOrigin = "anonymous";
      e.mediaSrc = e.ctx.createMediaElementSource(e.audioEl);
      e.mediaSrc.connect(e.master);
    }
    e.audioEl.src = src;
    e.audioEl.play();
    e.master.gain.setValueAtTime(1, e.ctx.currentTime);
    e.stop = () => e.audioEl?.pause();
  };

  const toggle = (id: string) => {
    const track = TRACKS.find((t) => t.id === id);
    if (!track) return;
    const e = getEngine();
    if (e.ctx.state === "suspended") e.ctx.resume();

    if (playing === id) {
      stopAll();
      return;
    }
    e.stop?.();
    if (track.src) startFile(e, track.src);
    else startDrone(e, track.root);
    startedAt.current = performance.now();
    setPlaying(id);
  };

  // Visualizer + clock — one rAF, draws to canvas, writes clock via ref.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const g = canvas.getContext("2d");
    if (!g) return;

    let raf = 0;
    let t = 0;
    const data = new Uint8Array(128);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.012;
      const { width: w, height: h } = canvas.getBoundingClientRect();
      g.clearRect(0, 0, w, h);

      const e = engineRef.current;
      const active = e && e.stop;

      // Clock
      if (clockRef.current) {
        if (active) {
          const s = Math.floor((performance.now() - startedAt.current) / 1000);
          clockRef.current.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
        } else {
          clockRef.current.textContent = "--:--";
        }
      }

      const mid = h / 2;
      const bars = 56;
      const gap = w / bars;

      if (active && e) {
        e.analyser.getByteFrequencyData(data);
        for (let i = 0; i < bars; i++) {
          const v = data[Math.floor((i / bars) * 100)] / 255;
          const amp = Math.max(2, v * mid * 0.9);
          const x = i * gap + gap / 2;
          g.fillStyle = i % 7 === 3 ? "rgba(192,141,93,0.9)" : "rgba(242,237,228,0.55)";
          g.fillRect(x, mid - amp, 1.5, amp * 2);
        }
      } else {
        // Idle: a quiet breathing line
        g.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const y = mid + Math.sin(x * 0.02 + t) * 3 + Math.sin(x * 0.005 - t * 0.6) * 2;
          x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
        }
        g.strokeStyle = "rgba(192,141,93,0.35)";
        g.lineWidth = 1;
        g.stroke();
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Teardown on unmount
  useEffect(() => {
    return () => {
      const e = engineRef.current;
      if (e) {
        e.stop?.();
        e.ctx.close();
        engineRef.current = null;
      }
    };
  }, []);

  return (
    <section className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-36 md:pt-44 pb-28">
      <Reveal>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-bronze mb-4">
          Sonic Vault / Vol. 1
        </p>
        <h1 className="font-serif font-light text-5xl md:text-7xl text-ivory mb-6">
          The Sound
        </h1>
        <p className="font-serif italic font-light text-ivory/55 max-w-md text-base md:text-lg">
          Four fragments from the central archive. Masters are being prepared —
          each entry currently carries an ambient preview signal.
        </p>
        <div className="rule mt-14" />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Track list */}
        <div className="border-t border-ivory/10">
          {TRACKS.map((track, i) => {
            const isOn = playing === track.id;
            return (
              <Reveal key={track.id} delay={i * 0.07}>
                <button
                  onClick={() => toggle(track.id)}
                  aria-pressed={isOn}
                  className={`group w-full flex items-center justify-between gap-6 py-7 border-b border-ivory/10 text-left transition-colors duration-300 ${
                    isOn ? "text-ivory" : "text-ivory/70 hover:text-ivory"
                  }`}
                >
                  <div className="flex items-baseline gap-5">
                    <span className={`font-mono text-[10px] tracking-[0.3em] ${isOn ? "text-bronze" : "text-bronze/60"}`}>
                      {track.id}
                    </span>
                    <div>
                      <span className="font-serif italic font-light text-2xl md:text-3xl block group-hover:translate-x-2 transition-transform duration-500 ease-out">
                        {track.title}
                      </span>
                      <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-ivory/30">
                        {track.note}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[9px] tracking-[0.3em] uppercase shrink-0 transition-colors duration-300 ${
                      isOn ? "text-bronze" : "text-ivory/35 group-hover:text-ivory/70"
                    }`}
                  >
                    {isOn ? "■ Stop" : "▶ Signal"}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* Telemetry panel */}
        <Reveal delay={0.15}>
          <div className="lg:sticky lg:top-28 border border-ivory/10 bg-panel p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-ivory/40">
                {playing ? "Frequency Stream — Live" : "Frequency Stream — Idle"}
              </span>
              <span
                ref={clockRef}
                className="font-mono text-[10px] tracking-[0.2em] text-bronze"
              >
                --:--
              </span>
            </div>
            <canvas ref={canvasRef} className="w-full h-[220px] md:h-[280px]" />
            <div className="rule mt-6 mb-4" />
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-ivory/30 leading-relaxed">
              {playing
                ? `Amplitude locked // Fragment ${playing}`
                : "Awaiting input — select a fragment."}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
