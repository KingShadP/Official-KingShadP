"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

type Phase = "idle" | "cover" | "reveal";

const TransitionContext = createContext<{ navigate: (href: string) => void }>({
  navigate: () => {},
});

export function useTransitionRouter() {
  return useContext(TransitionContext);
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const pending = useRef<string | null>(null);
  const prevPath = useRef(pathname);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || phase !== "idle") return;
      pending.current = href;
      setPhase("cover");
    },
    [pathname, phase]
  );

  // Once the route actually changes, sweep the panel away.
  // (SmoothScroller owns the scroll reset.)
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setPhase("reveal");
    }
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[190] pointer-events-none bg-void flex items-center justify-center"
        initial={false}
        animate={phase}
        variants={{
          idle: { y: "100.5%", transition: { duration: 0 } },
          cover: { y: "0%", transition: { duration: 0.55, ease: EASE } },
          reveal: { y: "-100.5%", transition: { duration: 0.7, ease: EASE, delay: 0.1 } },
        }}
        onAnimationComplete={() => {
          if (phase === "cover" && pending.current) {
            const href = pending.current;
            pending.current = null;
            router.push(href);
          } else if (phase === "reveal") {
            setPhase("idle");
          }
        }}
        style={{ willChange: "transform" }}
      >
        <div className="absolute top-0 left-0 right-0 rule" />
        <span className="font-serif italic text-2xl text-ivory/70 tracking-tight select-none">
          KingShadP<span className="text-bronze">.</span>
        </span>
        <div className="absolute bottom-0 left-0 right-0 rule" />
      </motion.div>
    </TransitionContext.Provider>
  );
}

export function TransitionLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const { navigate } = useTransitionRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab etc.) behave natively.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onNavigate?.();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
