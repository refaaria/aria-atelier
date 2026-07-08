"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SiteMenu } from "@/components/site-menu";

const rightLinks = [
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href) || (href === "/maisons" && pathname.startsWith("/watch"));
}

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const active = isActive(pathname, href);
  return (
    <Link href={href} className="group relative overline py-2">
      <span className={cn("transition-colors duration-300", active ? "text-gold" : "text-[#f4f1ea]/70 group-hover:text-[#f4f1ea]")}>
        {label}
      </span>
      <span
        className={cn(
          "absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          active ? "w-full" : "w-0 group-hover:w-full",
        )}
      />
    </Link>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-gold/15 bg-ink/85 py-3.5 backdrop-blur-md"
            : "border-b border-transparent bg-transparent py-6",
        )}
      >
        <nav className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10">
          {/* burger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="group flex items-center gap-3 justify-self-start"
          >
            <span className="flex flex-col gap-[5px]">
              <span className="h-px w-6 bg-[#f4f1ea] transition-all duration-300 group-hover:w-7 group-hover:bg-gold" />
              <span className="h-px w-4 bg-[#f4f1ea] transition-all duration-300 group-hover:w-7 group-hover:bg-gold" />
              <span className="h-px w-6 bg-[#f4f1ea] transition-all duration-300 group-hover:w-7 group-hover:bg-gold" />
            </span>
            <span className="hidden overline text-[#f4f1ea]/70 transition-colors group-hover:text-gold sm:inline">
              Menu
            </span>
          </button>

          {/* wordmark */}
          <Link href="/" className="justify-self-center text-center">
            <div className="font-display text-xl leading-none tracking-[0.22em] text-[#f6f2e9] md:text-2xl">
              ARIA&apos;S ATELIER
            </div>
            <div className="mt-1 text-center text-[0.55rem] uppercase tracking-[0.42em] text-gold/80">
              Haute Horlogerie
            </div>
          </Link>

          {/* right links (desktop) */}
          <div className="hidden items-center justify-end gap-9 md:flex">
            {rightLinks.map((l) => (
              <NavLink key={l.href} {...l} pathname={pathname} />
            ))}
          </div>
        </nav>
      </motion.header>

      <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
