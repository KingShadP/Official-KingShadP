"use client";

export function GoldLightSweep() {
  return (
    <div className="absolute inset-0 z-[-4] pointer-events-none overflow-hidden select-none">
      {/* Cinematic gold/rose-gold light sweep */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-500"
        style={{
          opacity: `calc(0.18 + (var(--scroll-progress, 0) * 0.22))`,
          background: `
            linear-gradient(
              115deg,
              transparent 0%,
              transparent 38%,
              rgba(214, 160, 110, 0.12) 48%,
              rgba(214, 160, 110, 0.18) 50%,
              rgba(214, 160, 110, 0.12) 52%,
              transparent 62%,
              transparent 100%
            )
          `,
          transform: `translateX(calc(-25% + (var(--scroll-progress, 0) * 50%)))`,
          willChange: "transform, opacity"
        }}
      />
      {/* Shimmer particles / dust trails */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,160,110,0.06),transparent_75%)]"
        style={{
          transform: `scale(calc(1 + (var(--scroll-progress, 0) * 0.08)))`,
        }}
      />
    </div>
  );
}
