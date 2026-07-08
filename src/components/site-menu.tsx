"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X } from "lucide-react";
import { brands, watchById } from "@/data/watches";
import { WatchVisual } from "@/components/watch-visual";
import { formatPrice } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/maisons", label: "Maisons" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

const featuredIds = [
  "rolex-submariner-date",
  "patek-nautilus-5711",
  "ap-royal-oak-selfwinding-41",
  "cartier-santos-large",
];
const featured = featuredIds.map((id) => watchById(id)).filter(Boolean);

export function SiteMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70]" initial="closed" animate="open" exit="closed">
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-xl"
            variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={onClose}
          />

          <div className="absolute inset-0 flex">
            {/* -------- left nav panel -------- */}
            <motion.nav
              className="relative flex h-full w-full flex-col justify-between overflow-y-auto border-r border-gold/15 bg-ink px-8 py-10 md:max-w-md md:px-12 md:py-14"
              variants={{ closed: { x: "-100%" }, open: { x: 0 } }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {/* ambient */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute right-[-20%] top-[6%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(194,163,95,0.14),transparent_65%)] blur-2xl"
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.12, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative">
                <div className="overline text-gold/80">Navigate</div>
                <motion.ul className="mt-8 space-y-1" variants={listVariants}>
                  {mainLinks.map((l) => {
                    const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                    return (
                      <motion.li key={l.href} variants={itemVariants}>
                        <Link
                          href={l.href}
                          onClick={onClose}
                          className="group flex items-baseline gap-4 py-2"
                        >
                          <span className="w-6 overline text-gold/50 transition-colors group-hover:text-gold">
                            0{mainLinks.indexOf(l) + 1}
                          </span>
                          <span
                            className={`font-serif text-4xl transition-colors duration-300 md:text-5xl ${active ? "text-gold" : "text-[#f6f2e9] group-hover:text-gold"}`}
                          >
                            {l.label}
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>

                <div className="my-8 h-px w-full bg-gold/15" />

                <div className="overline text-gold/80">The Maisons</div>
                <motion.ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3" variants={listVariants}>
                  {brands.map((b) => (
                    <motion.li key={b.id} variants={itemVariants}>
                      <Link
                        href={`/maisons/${b.id}`}
                        onClick={onClose}
                        className="text-sm text-[#f4f1ea]/55 transition-colors hover:text-gold"
                      >
                        {b.name}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              <motion.div
                className="relative mt-10"
                variants={{ closed: { opacity: 0 }, open: { opacity: 1, transition: { delay: 0.5 } } }}
              >
                <div className="font-display text-lg tracking-[0.2em] text-[#f6f2e9]">ARIA&apos;S ATELIER</div>
                <div className="mt-1 text-[0.55rem] uppercase tracking-[0.4em] text-gold/70">Banjarbaru</div>
              </motion.div>
            </motion.nav>

            {/* -------- right featured panel -------- */}
            <div className="relative hidden flex-1 overflow-y-auto p-10 md:block lg:p-16">
              <motion.div
                variants={{ closed: { opacity: 0 }, open: { opacity: 1, transition: { delay: 0.2 } } }}
                transition={{ duration: 0.5 }}
              >
                <div className="overline text-gold/80">Featured Timepieces</div>
                <motion.div
                  className="mt-8 grid grid-cols-2 gap-5"
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {featured.map(
                    (w) =>
                      w && (
                        <motion.div
                          key={w.id}
                          variants={{ hidden: { opacity: 0, y: 30, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } } }}
                        >
                          <Link
                            href={`/watch/${w.id}`}
                            onClick={onClose}
                            className="group relative flex flex-col items-center overflow-hidden border border-gold/12 bg-ink-2 p-6 text-center transition-colors duration-500 hover:border-gold/45"
                          >
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(194,163,95,0.10),transparent_65%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                            <div className="transition-transform duration-500 group-hover:scale-105">
                              <WatchVisual watch={w} size={150} float={false} />
                            </div>
                            <div className="relative mt-3 overline text-gold/70">{w.reference}</div>
                            <div className="relative mt-1 font-serif text-lg text-[#f6f2e9]">{w.name}</div>
                            <div className="relative mt-1 text-sm tabular-nums text-[#f4f1ea]/55">{formatPrice(w.price)}</div>
                          </Link>
                        </motion.div>
                      ),
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* close */}
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="fixed right-6 top-6 z-[80] flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-ink"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0, transition: { delay: 0.3, duration: 0.5, ease: EASE } }}
            exit={{ opacity: 0, rotate: -90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
