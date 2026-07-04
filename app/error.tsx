"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-bronze mb-6">
        System Interruption
      </p>
      <h1 className="font-serif italic font-light text-5xl md:text-7xl text-ivory mb-10">
        Something broke<span className="text-bronze">.</span>
      </h1>
      <p className="max-w-md mb-10 font-serif font-light text-lg text-ivory/65 leading-relaxed">
        The experience hit an unexpected interruption. Retry this view or return home to continue exploring.
      </p>
      <div className="rule w-32 mb-10" />
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 border border-bronze/40 hover:border-bronze hover:bg-bronze/10 transition-all duration-300 font-mono text-[10px] tracking-[0.3em] uppercase text-bronze"
        >
          Retry
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-ivory/20 hover:border-ivory/60 transition-colors duration-300 font-mono text-[10px] tracking-[0.3em] uppercase text-ivory/70"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
