import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-bronze mb-6">
        404 — Coordinate Unknown
      </p>
      <h1 className="font-serif italic font-light text-5xl md:text-7xl text-ivory mb-10">
        Not Found<span className="text-bronze">.</span>
      </h1>
      <div className="rule w-32 mb-10" />
      <Link
        href="/"
        className="px-6 py-3 border border-ivory/20 hover:border-bronze hover:text-bronze transition-colors duration-300 font-mono text-[10px] tracking-[0.3em] uppercase text-ivory/70"
      >
        Return Home
      </Link>
    </div>
  );
}
