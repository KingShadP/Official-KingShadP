"use client";

import React, { useEffect, useState, useRef } from "react";

export function HUD() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      {/* Aesthetic Flashlight Underlay Mask */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(220,197,123,0.07), transparent 40%)`
        }}
      >
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(220,197,123,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(220,197,123,0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            WebkitMaskImage: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`
          }}
        />
        <svg 
          className="absolute inset-0 w-full h-full opacity-30 mix-blend-screen"
          style={{
            WebkitMaskImage: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`
          }}
        >
          <circle cx={mousePos.x} cy={mousePos.y} r="150" stroke="#dcc57b" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
          <circle cx={mousePos.x} cy={mousePos.y} r="250" stroke="#dcc57b" strokeWidth="0.5" fill="none" opacity="0.5" />
          <line x1={mousePos.x} y1="0" x2={mousePos.x} y2="100%" stroke="#dcc57b" strokeWidth="0.2" opacity="0.5" />
          <line x1="0" y1={mousePos.y} x2="100%" y2={mousePos.y} stroke="#dcc57b" strokeWidth="0.2" opacity="0.5" />
        </svg>
      </div>

      {/* 2085 Interactive Tracking Crosshair */}
      <div 
        className="fixed pointer-events-none z-50 flex items-center justify-center mix-blend-screen"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px'
        }}
      >
        <div className="absolute w-[2px] h-[10px] bg-[#dcc57b] top-0" />
        <div className="absolute w-[2px] h-[10px] bg-[#dcc57b] bottom-0" />
        <div className="absolute w-[10px] h-[2px] bg-[#dcc57b] left-0" />
        <div className="absolute w-[10px] h-[2px] bg-[#dcc57b] right-0" />
        <div className="absolute w-[4px] h-[4px] bg-white rounded-full" />
      </div>

      {/* HUD Logs */}
      <div className="fixed bottom-4 right-4 pointer-events-none z-50 font-mono text-[9px] uppercase tracking-widest text-[#dcc57b] text-right opacity-70">
        <div>X: {mousePos.x.toFixed(2)}</div>
        <div>Y: {mousePos.y.toFixed(2)}</div>
        <div>SYS: ONLINE</div>
        <div>TGT: ACQUIRED</div>
      </div>
    </>
  );
}
