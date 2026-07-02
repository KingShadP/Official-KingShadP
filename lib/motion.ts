// KingShadP motion tokens — one easing, one rhythm, everywhere.
export const EASE = [0.16, 1, 0.3, 1] as const;

export const DUR = {
  fast: 0.5,
  base: 0.9,
  slow: 1.4,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, delay, ease: EASE },
  }),
};
