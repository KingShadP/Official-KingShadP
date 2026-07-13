"use client";

import React, { useRef, useEffect, useState } from "react";

type SymbolType = "GIRAGON" | "HALO_CROWN" | "SP_CREST" | "KSP_MONOGRAM";

export function Hologram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeSymbol, setActiveSymbol] = useState<SymbolType>("GIRAGON");
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#dcc57b"; // gold
      ctx.lineWidth = 1;

      angleX += 0.01;
      angleY += 0.015;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const size = 60;

      // Basic projection
      const project = (x: number, y: number, z: number) => {
        const radX = angleX;
        const radY = angleY;
        
        // Rotate Y
        let newX = x * Math.cos(radY) - z * Math.sin(radY);
        let newZ = x * Math.sin(radY) + z * Math.cos(radY);
        
        // Rotate X
        let newY = y * Math.cos(radX) - newZ * Math.sin(radX);
        newZ = y * Math.sin(radX) + newZ * Math.cos(radX);

        const scale = 200 / (200 + newZ);
        return {
          x: cx + newX * scale * size,
          y: cy + newY * scale * size
        };
      };

      const drawVertices = (vertices: number[][], edges: number[][]) => {
        ctx.beginPath();
        edges.forEach(edge => {
          const p1 = project(vertices[edge[0]][0], vertices[edge[0]][1], vertices[edge[0]][2]);
          const p2 = project(vertices[edge[1]][0], vertices[edge[1]][1], vertices[edge[1]][2]);
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        });
        ctx.stroke();
      };

      // Different shapes based on active symbol
      if (activeSymbol === "GIRAGON") {
        // Icosahedron approximation
        const phi = (1 + Math.sqrt(5)) / 2;
        const v = [
          [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
          [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
          [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
        ];
        const e = [
          [0,1], [0,11], [0,5], [0,7], [0,10],
          [1,5], [1,9], [1,8], [1,7],
          [2,3], [2,11], [2,4], [2,6], [2,10],
          [3,4], [3,9], [3,8], [3,6],
          [4,5], [4,9], [4,11],
          [5,9], [5,11],
          [6,7], [6,8], [6,10],
          [7,8], [7,10],
          [8,9], [10,11]
        ];
        drawVertices(v, e);
      } else if (activeSymbol === "HALO_CROWN") {
        // Torus-like wireframe
        ctx.beginPath();
        for (let i = 0; i < 20; i++) {
          const a = (i / 20) * Math.PI * 2;
          const p1 = project(Math.cos(a)*1.5, -0.5, Math.sin(a)*1.5);
          const p2 = project(Math.cos(a)*1.5, 0.5, Math.sin(a)*1.5);
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          const p3 = project(Math.cos(a + 0.3)*1.5, -0.5, Math.sin(a + 0.3)*1.5);
          ctx.lineTo(p3.x, p3.y);
        }
        ctx.stroke();
      } else if (activeSymbol === "SP_CREST") {
        // Octahedron
        const v = [[1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1]];
        const e = [[0,2], [0,3], [0,4], [0,5], [1,2], [1,3], [1,4], [1,5], [2,4], [2,5], [3,4], [3,5]];
        drawVertices(v, e);
      } else {
        // KSP_MONOGRAM (Cube with diagonals)
        const v = [
          [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1],
          [-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1]
        ];
        const e = [
          [0,1], [1,2], [2,3], [3,0],
          [4,5], [5,6], [6,7], [7,4],
          [0,4], [1,5], [2,6], [3,7],
          [0,6], [1,7]
        ];
        drawVertices(v, e);
      }

      // Draw subtle glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(220,197,123,0.5)";

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeSymbol]);

  return (
    <div className="flex flex-col items-center gap-4 bg-[#0c0a09]/60 backdrop-blur-md border border-[#dcc57b]/20 p-6 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#dcc57b]/5 to-transparent pointer-events-none" />
      <div className="font-mono text-[10px] uppercase tracking-widest text-white/50">Hologram Engine</div>
      <canvas ref={canvasRef} width={250} height={250} className="pointer-events-none" />
      <div className="flex flex-wrap justify-center gap-2">
        {(["GIRAGON", "HALO_CROWN", "SP_CREST", "KSP_MONOGRAM"] as SymbolType[]).map(sym => (
          <button
            key={sym}
            onClick={() => setActiveSymbol(sym)}
            className={`font-mono text-[9px] px-2 py-1 uppercase tracking-wider border transition-colors ${
              activeSymbol === sym 
                ? "border-[#dcc57b] text-[#dcc57b] bg-[#dcc57b]/10" 
                : "border-white/10 text-white/40 hover:text-[#dcc57b] hover:border-[#dcc57b]/50"
            }`}
          >
            {sym.replace("_", " ")}
          </button>
        ))}
      </div>
      <div className="text-[#dcc57b]/40 font-mono text-[8px] uppercase tracking-widest">Live Model Coordinates Logged</div>
    </div>
  );
}
