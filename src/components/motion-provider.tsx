"use client";

import { MotionConfig } from "motion/react";

/** Makes every Motion animation respect the user's reduced-motion preference. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
