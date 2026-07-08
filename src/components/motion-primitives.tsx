"use client";

import { motion, type Variants } from "motion/react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Expo.out — the premium easing recommended by the design engine.
const EASE = [0.16, 1, 0.3, 1] as const;
// Natural spring for interactive elements (engine: damping 20 / stiffness 90).
export const SPRING = { type: "spring" as const, stiffness: 90, damping: 20 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.08, ease: EASE },
  }),
};

/** Fade + rise into view on scroll. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 34,
  once = true,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "span" | "h2" | "p";
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/** Container that staggers its <StaggerItem> children into view. */
export function Stagger({
  children,
  className,
  amount = 0.25,
  gap = 0.07,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  gap?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Elegant gold-fill / outline button with hover sweep. */
export function GoldButton({
  children,
  href,
  variant = "solid",
  className,
  ...rest
}: {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "outline";
  className?: string;
} & Partial<ComponentProps<typeof Link>>) {
  const base = cn(
    "group relative inline-flex cursor-pointer items-center justify-center overflow-hidden",
    "px-8 py-3.5 overline transition-colors duration-500",
    variant === "solid"
      ? "bg-gold text-ink hover:text-ink"
      : "border border-gold/50 text-gold hover:text-ink",
    className,
  );

  const inner = (
    <>
      {variant === "outline" && (
        <span className="absolute inset-0 -z-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      )}
      {variant === "solid" && (
        <span className="absolute inset-0 -z-0 origin-left scale-x-0 bg-gold-soft transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.span className="inline-flex" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} transition={SPRING}>
        <Link href={href} className={base} {...rest}>
          {inner}
        </Link>
      </motion.span>
    );
  }
  return (
    <motion.button className={base} type="button" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} transition={SPRING}>
      {inner}
    </motion.button>
  );
}

/** Small letter-spaced eyebrow label. */
export function Overline({
  children,
  className,
  gold = true,
  style,
}: {
  children: ReactNode;
  className?: string;
  gold?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span className={cn("overline block", gold ? "text-gold" : "text-current/60", className)} style={style}>
      {children}
    </span>
  );
}

export { EASE };
