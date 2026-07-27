/** Shared motion tokens for Auction War Room. Prefer transform/opacity only. */

export const motionTokens = {
  duration: {
    fast: 0.16,
    normal: 0.28,
    slow: 0.45,
  },
  easing: {
    smooth: [0.22, 1, 0.36, 1],
    sharp: [0.4, 0, 0.2, 1],
  },
  distance: {
    sm: 6,
    md: 12,
    lg: 20,
  },
  spring: {
    snappy: { type: "spring", stiffness: 520, damping: 32, mass: 0.8 },
    soft: { type: "spring", stiffness: 320, damping: 28, mass: 0.9 },
    tap: { type: "spring", stiffness: 600, damping: 35, mass: 0.7 },
  },
};

export const viewTransition = {
  duration: motionTokens.duration.normal,
  ease: motionTokens.easing.smooth,
};

export const fadeUp = (reduce, distance = motionTokens.distance.md) => ({
  initial: { opacity: 0, y: reduce ? 0 : distance },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: reduce ? 0 : -distance * 0.6 },
});

export const scalePop = (reduce) => ({
  initial: { opacity: 0, scale: reduce ? 1 : 0.94 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: reduce ? 1 : 0.96 },
});

/** Gesture props for pressable controls — no-ops when reduced motion is on. */
export function pressable(reduce) {
  if (reduce) return {};
  return {
    whileHover: { y: -1 },
    whileTap: { scale: 0.97 },
    transition: motionTokens.spring.tap,
  };
}
