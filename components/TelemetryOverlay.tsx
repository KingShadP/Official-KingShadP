"use client";

import React, { useEffect, useState } from "react";

export function TelemetryOverlay() {
  const [telemetry, setTelemetry] = useState({
    systemFreq: 98.42,
    packetDecrypted: 142,
    declination: "+42.18°",
    rightAscension: "18h 36m 56s",
    signalStrength: 94.6,
    frameTicks: 0,
    entropy: 0.1824,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const freqDelta = (Math.random() - 0.5) * 0.15;
        const sigDelta = (Math.random() - 0.5) * 0.8;
        const packetAdd = Math.random() > 0.82 ? 1 : 0;
        const entropyDelta = (Math.random() - 0.5) * 0.004;

        return {
          systemFreq: Math.min(99.98, Math.max(95.02, prev.systemFreq + freqDelta)),
          packetDecrypted: prev.packetDecrypted >= 200 ? 120 : prev.packetDecrypted + packetAdd,
          declination: prev.declination, // Stays relatively stable but keeps space style
          rightAscension: prev.rightAscension,
          signalStrength: Math.min(100, Math.max(85, prev.signalStrength + sigDelta)),
          frameTicks: prev.frameTicks + 1,
          entropy: Math.min(0.9999, Math.max(0.0100, prev.entropy + entropyDelta)),
        };
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="telemetry-viewport-overlay" className="pointer-events-none fixed inset-0 z-40 font-mono text-[10px] text-ivory/40 select-none">
      
      {/* Top Left Corner: System Core Signal Log */}
      <div 
        id="tel-top-left" 
        className="absolute top-6 left-6 flex flex-col gap-1.5 border-l border-t border-ivory/10 pl-3 pt-3 bg-void/10 backdrop-blur-[2px] rounded-tl-sm transition-opacity duration-300 md:opacity-100 opacity-60"
      >
        <p className="text-gold/60 font-semibold uppercase tracking-[0.2em] mb-0.5 text-[8px]">
          [ COLD SIGNAL CHANNEL ]
        </p>
        <div className="flex gap-4">
          <span className="text-ivory/30">SYS_FREQ:</span>
          <span className="text-ivory/75 font-semibold text-right min-w-[55px]">
            {telemetry.systemFreq.toFixed(2)} GHz
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-ivory/30">INTEG_RT:</span>
          <span className="text-ivory/75 font-semibold text-right min-w-[55px]">
            {telemetry.signalStrength.toFixed(1)}%
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-ivory/30">FLUC_ENT:</span>
          <span className="text-ivory/75 font-semibold text-right min-w-[55px]">
            λ_{telemetry.entropy.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Top Right Corner: Celestial Position Indices */}
      <div 
        id="tel-top-right" 
        className="absolute top-6 right-6 flex flex-col gap-1.5 border-r border-t border-ivory/10 pr-3 pt-3 bg-void/10 backdrop-blur-[2px] rounded-tr-sm text-right transition-opacity duration-300 md:opacity-100 opacity-60"
      >
        <p className="text-gold/60 font-semibold uppercase tracking-[0.2em] mb-0.5 text-[8px]">
          [ CELESTIAL_COORDS // SEC ]
        </p>
        <div className="flex gap-4 justify-end">
          <span className="text-ivory/30">DEC:</span>
          <span className="text-ivory/75 font-semibold">
            {telemetry.declination}
          </span>
        </div>
        <div className="flex gap-4 justify-end">
          <span className="text-ivory/30">ASC:</span>
          <span className="text-ivory/75 font-semibold">
            {telemetry.rightAscension}
          </span>
        </div>
        <div className="flex gap-4 justify-end">
          <span className="text-ivory/30">DEC_INDEX:</span>
          <span className="text-gold font-semibold">
            SYS_SEC_V3
          </span>
        </div>
      </div>

      {/* Bottom Left Corner: Active Sector Decryptions */}
      <div 
        id="tel-bottom-left" 
        className="absolute bottom-6 left-6 flex flex-col gap-1.5 border-l border-b border-ivory/10 pl-3 pb-3 bg-void/10 backdrop-blur-[2px] rounded-bl-sm transition-opacity duration-300 md:opacity-100 opacity-60"
      >
        <p className="text-gold/60 font-semibold uppercase tracking-[0.2em] mb-0.5 text-[8px]">
          [ DECRYPT_FRAME // SOVEREIGN ]
        </p>
        <div className="flex gap-4">
          <span className="text-ivory/30">PACKETS:</span>
          <span className="text-ivory/75 font-semibold text-right min-w-[40px]">
            {telemetry.packetDecrypted} / 200
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-ivory/30">TICK_CL:</span>
          <span className="text-ivory/75 font-semibold text-right min-w-[40px]">
            #{(telemetry.frameTicks % 10000).toString().padStart(4, "0")}
          </span>
        </div>
        <div className="flex gap-3 items-center mt-1">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
          <span className="text-[8px] text-ivory/20 tracking-[0.1em] uppercase">
            ARCHIVE INTEGRITY OPTIMAL
          </span>
        </div>
      </div>

      {/* Bottom Right Corner: System Terminal Pulse */}
      <div 
        id="tel-bottom-right" 
        className="absolute bottom-6 right-6 flex flex-col gap-1.5 border-r border-b border-ivory/10 pr-3 pb-3 bg-void/10 backdrop-blur-[2px] rounded-br-sm text-right transition-opacity duration-300 md:opacity-100 opacity-60"
      >
        <p className="text-gold/60 font-semibold uppercase tracking-[0.2em] mb-0.5 text-[8px]">
          [ PORT_GATEWAY_UPTIME ]
        </p>
        <div className="flex gap-4 justify-end">
          <span className="text-ivory/30">ZONE:</span>
          <span className="text-ivory/75 font-semibold">
            UTC_00
          </span>
        </div>
        <div className="flex gap-4 justify-end">
          <span className="text-ivory/30">INTEG_STAT:</span>
          <span className="text-emerald-500 font-semibold animate-pulse">
            ONLINE
          </span>
        </div>
      </div>

    </div>
  );
}
