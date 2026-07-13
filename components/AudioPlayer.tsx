"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Disc } from "lucide-react";

type Track = {
  id: string;
  title: string;
  subtitle: string;
  frequency: number; 
  duration: string;
};

const TRACKLIST: Track[] = [
  {
    id: "sig_01",
    title: "The Signal Code (Aura)",
    subtitle: "Warm Atmospheric Ground Drones",
    frequency: 110, // A2
    duration: "03:42",
  },
  {
    id: "sig_02",
    title: "Restraint & Trajectory",
    subtitle: "Soothing Resonant Frequencies",
    frequency: 146.83, // D3
    duration: "04:18",
  },
  {
    id: "sig_03",
    title: "Sovereign Deep Volume III",
    subtitle: "Sub-harmonic Ground Pulses",
    frequency: 82.41, // E2
    duration: "05:01",
  },
  {
    id: "sig_04",
    title: "The Geometric Horizon",
    subtitle: "Detuned Studio Meditation Pad",
    frequency: 130.81, // C3
    duration: "06:00",
  },
];

export const AudioPlayer = memo(function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [progress, setProgress] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorNodeRef = useRef<OscillatorNode | null>(null);
  const subOscillatorNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playbackSecsRef = useRef(0);

  const activeTrack = TRACKLIST[currentIdx];

  // Initialize safe low-frequency warm synth pad
  const initSynth = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      // Deep low-pass filter to make it incredibly soft, warm, and atmospheric
      filter.frequency.setValueAtTime(280, ctx.currentTime);
      filter.Q.setValueAtTime(4, ctx.currentTime);
      filterNodeRef.current = filter;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gainNodeRef.current = gain;

      // Connect standard chain
      filter.connect(gain);
      gain.connect(ctx.destination);
    } catch (e) {
      console.error("Web Audio API is not supported", e);
    }
  };

  // Start pristine warm tone synth
  const startSynth = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Warm, round triangle waves instead of harsh sawteeth
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(activeTrack.frequency, ctx.currentTime);
    oscillatorNodeRef.current = osc;

    // Pure sub-bass sine wave to add physical density
    const subOsc = ctx.createOscillator();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(activeTrack.frequency * 0.5, ctx.currentTime);
    subOscillatorNodeRef.current = subOsc;

    if (filterNodeRef.current) {
      osc.connect(filterNodeRef.current);
      subOsc.connect(filterNodeRef.current);
    }

    osc.start();
    subOsc.start();

    // Soft drifting filter sweep (like breathing)
    const sweepFilter = () => {
      if (!filterNodeRef.current || !audioCtxRef.current) return;
      const t = audioCtxRef.current.currentTime;
      const modFreq = 180 + Math.sin(t * 0.4) * 60;
      filterNodeRef.current.frequency.setValueAtTime(modFreq, t);
    };

    const fxTimer = setInterval(sweepFilter, 100);
    return fxTimer;
  };

  const stopSynth = () => {
    if (oscillatorNodeRef.current) {
      try {
        oscillatorNodeRef.current.stop();
      } catch (e) {}
      oscillatorNodeRef.current = null;
    }
    if (subOscillatorNodeRef.current) {
      try {
        subOscillatorNodeRef.current.stop();
      } catch (e) {}
      subOscillatorNodeRef.current = null;
    }
  };

  const handleTogglePlay = () => {
    if (!audioCtxRef.current) {
      initSynth();
    }

    if (isPlaying) {
      stopSynth();
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      setIsPlaying(true);
      const fxTimer = startSynth();

      const timer = setInterval(() => {
        playbackSecsRef.current += 1;
        const mins = Math.floor(playbackSecsRef.current / 60)
          .toString()
          .padStart(2, "0");
        const secs = (playbackSecsRef.current % 60).toString().padStart(2, "0");
        setCurrentTime(`${mins}:${secs}`);

        const totalSecs =
          parseInt(activeTrack.duration.split(":")[0]) * 60 +
          parseInt(activeTrack.duration.split(":")[1]);
        const calculatedProg = (playbackSecsRef.current / totalSecs) * 100;
        setProgress(Math.min(100, calculatedProg));

        if (playbackSecsRef.current >= totalSecs) {
          handleNext();
        }
      }, 1000);

      intervalRef.current = timer;
    }
  };

  const resetTrackPlayback = () => {
    playbackSecsRef.current = 0;
    setCurrentTime("00:00");
    setProgress(0);
  };

  const handleNext = () => {
    const wasPlaying = isPlaying;
    if (isPlaying) handleTogglePlay();
    setCurrentIdx((prev) => (prev + 1) % TRACKLIST.length);
    resetTrackPlayback();
    if (wasPlaying) {
      setTimeout(() => {
        handleTogglePlay();
      }, 50);
    }
  };

  const handlePrev = () => {
    const wasPlaying = isPlaying;
    if (isPlaying) handleTogglePlay();
    setCurrentIdx((prev) => (prev - 1 + TRACKLIST.length) % TRACKLIST.length);
    resetTrackPlayback();
    if (wasPlaying) {
      setTimeout(() => {
        handleTogglePlay();
      }, 50);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopSynth();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#0c0a09]/60 backdrop-blur-md text-white p-8 rounded-xl shadow-xl flex flex-col gap-6 relative overflow-hidden border border-[#dcc57b]/20">
      
      {/* Absolute subtle glowing aura inside the player */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#dcc57b]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Album cover and artist detail */}
      <div className="flex items-center gap-5 z-10">
        <div className="w-16 h-16 bg-[#2d2a25] rounded-lg flex items-center justify-center relative overflow-hidden group border border-white/5">
          <Disc className={`w-8 h-8 text-[#dcc57b]/70 ${isPlaying ? "animate-spin" : "opacity-50"}`} style={{ animationDuration: "8s" }} />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#dcc57b]">
            AMBIENT RELEASE
          </span>
          <h4 className="font-serif text-lg font-normal tracking-wide text-white truncate mt-1">
            {activeTrack.title}
          </h4>
          <span className="font-sans text-xs text-[#faf8f5]/60 truncate mt-0.5">
            {activeTrack.subtitle}
          </span>
        </div>
      </div>

      {/* Progress timeline */}
      <div className="flex flex-col gap-2 z-10 mt-2">
        <div className="h-[3px] bg-white/10 w-full relative overflow-hidden rounded-full">
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#dcc57b] to-[#93000a] transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-[9px] tracking-wider text-[#faf8f5]/40 uppercase">
          <span>{currentTime}</span>
          <span>{activeTrack.duration} / LP</span>
        </div>
      </div>

      {/* Audio Controllers Panel */}
      <div className="flex justify-between items-center z-10 pt-3 border-t border-white/5">
        <div className="flex items-center gap-5">
          <button
            onClick={handlePrev}
            className="text-white/60 hover:text-[#dcc57b] transition-colors focus:outline-none"
            aria-label="Previous Track"
          >
            <SkipBack className="w-4 h-4 cursor-pointer" />
          </button>
          
          <button
            onClick={handleTogglePlay}
            className="w-12 h-12 bg-[#dcc57b] hover:bg-[#ebd58b] text-[#090908] flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(220,197,123,0.3)] transition-all focus:outline-none transform active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-[1px]" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="text-white/60 hover:text-[#dcc57b] transition-colors focus:outline-none"
            aria-label="Next Track"
          >
            <SkipForward className="w-4 h-4 cursor-pointer" />
          </button>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-white/40" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-[3px] bg-white/15 appearance-none outline-none rounded-full cursor-pointer accent-[#dcc57b] hover:accent-[#93000a]"
            aria-label="Volume"
          />
        </div>
      </div>

      {/* Playlist Selector below */}
      <div className="flex flex-col gap-1 z-10 mt-2">
        {TRACKLIST.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => {
              const wasPlaying = isPlaying;
              if (isPlaying) handleTogglePlay();
              setCurrentIdx(idx);
              resetTrackPlayback();
              if (wasPlaying) {
                setTimeout(() => {
                  handleTogglePlay();
                }, 50);
              }
            }}
            className={`w-full flex justify-between items-center font-mono text-[9.5px] uppercase py-2.5 px-3 rounded-lg border transition-all text-left ${
              currentIdx === idx
                ? "bg-[#2d2a25] border-[#dcc57b]/30 text-[#dcc57b] font-medium"
                : "border-transparent text-white/40 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-2">
              <Music className="w-3 h-3 opacity-60" />
              {idx + 1}. {t.title}
            </span>
            <span className="text-[9px] opacity-65">[{t.duration}]</span>
          </button>
        ))}
      </div>
    </div>
  );
});
