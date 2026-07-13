"use client";

import React, { useEffect, useState } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#faf8f5]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#121212]">
      {children}
    </div>
  );
}

