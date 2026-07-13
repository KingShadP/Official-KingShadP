"use client";

import { useEffect, useRef, memo } from "react";

export const AudioVisualizer = memo(function AudioVisualizer({ analyser }: { analyser: AnalyserNode | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let animationFrameId: number;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // We only use the lower frequencies for visual effect
      const sliceCount = Math.floor(bufferLength * 0.5); 
      const barWidth = canvas.width / sliceCount;
      const spacing = 2;

      for (let i = 0; i < sliceCount; i++) {
        // scale up the value slightly
        const normalized = dataArray[i] / 255;
        const barHeight = normalized * canvas.height;
        
        // Coloring logic based on intensity
        if (normalized > 0.8) {
          ctx.fillStyle = "rgba(220, 197, 123, 0.9)"; // gold
        } else if (normalized > 0.5) {
          ctx.fillStyle = "rgba(147, 0, 10, 0.8)"; // oxblood
        } else {
          ctx.fillStyle = "rgba(244, 240, 236, 0.4)"; // ivory
        }

        ctx.fillRect(
          i * barWidth + spacing / 2,
          canvas.height - barHeight,
          barWidth - spacing,
          barHeight
        );
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyser]);

  return (
    <div className="flex items-center justify-center p-2 rounded bg-void/50 border border-ivory/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <canvas ref={canvasRef} width={80} height={20} className="w-[80px] h-[20px]" />
    </div>
  );
});
