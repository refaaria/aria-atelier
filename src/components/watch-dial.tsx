"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { metalPalettes, type DialStyle, type WatchFace } from "@/data/watches";
import { cn } from "@/lib/utils";

type WatchDialProps = {
  style: DialStyle;
  face?: WatchFace;
  size?: number;
  live?: boolean;
  seconds?: boolean;
  delay?: number;
  className?: string;
};

const C = 200;

const defaultFace: WatchFace = {
  bezel: "smooth",
  bezelInsert: "#c9a961",
  markers: "applied",
  hands: "baton",
  finish: "sunburst",
  date: false,
  chrono: false,
  gmt: false,
  moonphase: false,
  lume: "#dfeee2",
  caseShape: "round",
  band: "steel",
  bandColor: "#2a1c12",
  metal: "steel",
};

const round = (n: number) => Math.round(n * 1000) / 1000;
function polar(angleDeg: number, radius: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: round(C + radius * Math.cos(a)), y: round(C + radius * Math.sin(a)) };
}

/**
 * Hour / minute hand — module-level so it keeps a stable identity across the
 * live-seconds re-render (otherwise React remounts it every tick and the
 * entrance opacity animation replays, making the hands flicker).
 */
export function DialHand({
  angle,
  kind,
  isMinute,
  handColor,
  gradientId,
  lume,
  dark,
  reduce,
  entranceDelay,
}: {
  angle: number;
  kind: WatchFace["hands"];
  isMinute: boolean;
  handColor: string;
  gradientId: string;
  lume: string;
  dark: boolean;
  reduce: boolean | null;
  entranceDelay: number;
}) {
  const len = isMinute ? 132 : 100;
  const tail = isMinute ? 30 : 26;
  const w = isMinute ? 5 : 7;
  let shape: React.ReactNode;
  if (kind === "dauphine") {
    shape = (
      <>
        <polygon points={`${C},${C - len} ${C - w},${C - len * 0.28} ${C},${C + tail} ${C + w},${C - len * 0.28}`} fill={`url(#${gradientId})`} />
        <polygon points={`${C},${C - len} ${C},${C + tail} ${C + w},${C - len * 0.28}`} fill="#000" opacity="0.18" />
      </>
    );
  } else if (kind === "mercedes" && !isMinute) {
    shape = (
      <>
        <rect x={C - w / 2} y={C - len + 26} width={w} height={len + tail - 26} rx={w / 2} fill={handColor} />
        <circle cx={C} cy={C - len + 30} r="15" fill="none" stroke={handColor} strokeWidth="4.5" />
        <circle cx={C} cy={C - len + 30} r="9" fill={lume} />
        <line x1={C} y1={C - len + 21} x2={C} y2={C - len + 39} stroke={handColor} strokeWidth="3" />
      </>
    );
  } else {
    shape = (
      <>
        <rect x={C - w / 2} y={C - len} width={w} height={len + tail} rx={w / 2} fill={handColor} />
        {dark && <rect x={C - w / 2 + 1.4} y={C - len + 8} width={w - 2.8} height={len - 22} rx="1" fill={lume} opacity="0.85" />}
      </>
    );
  }
  return (
    <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: entranceDelay }}>
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "200px 200px" }}
        initial={reduce ? false : { rotate: angle - 30 }}
        animate={{ rotate: angle }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 16 }}
      >
        {shape}
      </motion.g>
    </motion.g>
  );
}

export function WatchDial({ style, face = defaultFace, size = 320, live = false, seconds = true, delay = 0, className }: WatchDialProps) {
  const gid = useId().replace(/[:]/g, "");
  const reduce = useReducedMotion();
  const [angles, setAngles] = useState({ hour: 305, minute: 60, second: 210 });

  useEffect(() => {
    if (!live) return;
    const tick = () => {
      const now = new Date();
      const s = now.getSeconds() + now.getMilliseconds() / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;
      setAngles({ hour: h * 30, minute: m * 6, second: s * 6 });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [live]);

  const dark = !style.light;
  const metal = metalPalettes[face.metal] ?? metalPalettes.steel;
  const mHand = style.light ? style.hand : metal.hand;
  const mMark = style.light ? style.marker : metal.marker;
  const idOf = (k: string) => `${k}-${gid}`;

  const skip = new Set<number>();
  if (face.date) skip.add(3);
  if (face.moonphase) skip.add(6);
  if (face.chrono) [3, 6, 9].forEach((i) => skip.add(i));

  /* ---------------------------------------------------------------- markers */
  const romanNumerals = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  const markers: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    if (skip.has(i)) continue;
    const ang = i * 30;
    const cardinal = i % 3 === 0;
    if (face.markers === "roman") {
      const p = polar(ang, 128);
      markers.push(
        <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="20" fontFamily="Playfair Display, Georgia, serif" fill={mMark} style={{ letterSpacing: "-0.5px" }}>
          {romanNumerals[i]}
        </text>,
      );
    } else if (face.bezel === "dive" && dark) {
      const p = polar(ang, 132);
      if (i === 0) {
        const a = polar(0, 148);
        const b = polar(0, 116);
        markers.push(<polygon key={i} points={`${a.x},${a.y} ${b.x - 11},${b.y} ${b.x + 11},${b.y}`} fill={face.lume} stroke={mMark} strokeWidth="2" />);
      } else if (cardinal) {
        markers.push(
          <g key={i} transform={`rotate(${ang} ${p.x} ${p.y})`}>
            <rect x={p.x - 8} y={p.y - 15} width="16" height="30" rx="3" fill={mMark} />
            <rect x={p.x - 5} y={p.y - 12} width="10" height="24" rx="2" fill={face.lume} />
          </g>,
        );
      } else {
        markers.push(
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="7.5" fill={mMark} />
            <circle cx={p.x} cy={p.y} r="5" fill={face.lume} />
          </g>,
        );
      }
    } else if (face.markers === "baton") {
      const p = polar(ang, 134);
      markers.push(
        <g key={i} transform={`rotate(${ang} ${p.x} ${p.y})`}>
          <rect x={p.x - 2} y={p.y - (cardinal ? 20 : 15)} width="4" height={cardinal ? 40 : 30} rx="2" fill={mMark} />
        </g>,
      );
    } else {
      const p = polar(ang, 134);
      markers.push(
        <g key={i} transform={`rotate(${ang} ${p.x} ${p.y})`}>
          {i === 0 ? (
            <>
              <rect x={p.x - 9} y={p.y - 18} width="6" height="36" rx="1.5" fill={`url(#${idOf("mk")})`} />
              <rect x={p.x + 3} y={p.y - 18} width="6" height="36" rx="1.5" fill={`url(#${idOf("mk")})`} />
            </>
          ) : (
            <>
              <rect x={p.x - 4.5} y={p.y - (cardinal ? 19 : 15)} width="9" height={cardinal ? 38 : 30} rx="2" fill={`url(#${idOf("mk")})`} />
              {dark && <rect x={p.x - 2} y={p.y - (cardinal ? 15 : 11)} width="4" height={cardinal ? 30 : 22} rx="1.5" fill={face.lume} opacity="0.8" />}
            </>
          )}
        </g>,
      );
    }
  }

  /* --------------------------------------------------------------- subdials */
  const subdials: React.ReactNode[] = [];
  if (face.chrono) {
    for (const idx of [3, 6, 9]) {
      const p = polar(idx * 30, 82);
      subdials.push(
        <g key={`sd${idx}`}>
          <circle cx={p.x} cy={p.y} r="30" fill={`url(#${idOf("sub")})`} stroke={metal.mid} strokeOpacity="0.4" strokeWidth="1" />
          {Array.from({ length: 12 }).map((_, t) => {
            const q = polar(t * 30, 26);
            return <circle key={t} cx={p.x + (q.x - C) * 0.34} cy={p.y + (q.y - C) * 0.34} r="0.9" fill={mMark} opacity="0.6" />;
          })}
          <line x1={p.x} y1={p.y} x2={p.x + (polar(idx * 47, 20).x - C) * 0.9} y2={p.y + (polar(idx * 47, 20).y - C) * 0.9} stroke={mMark} strokeWidth="1.4" />
          <circle cx={p.x} cy={p.y} r="2" fill={mMark} />
        </g>,
      );
    }
  }

  /* ------------------------------------------------------------- moonphase */
  let moon: React.ReactNode = null;
  if (face.moonphase) {
    const p = polar(180, 96);
    moon = (
      <g>
        <clipPath id={idOf("moon")}>
          <path d={`M ${p.x - 26} ${p.y} a 26 16 0 0 1 52 0 Z`} />
        </clipPath>
        <path d={`M ${p.x - 26} ${p.y} a 26 16 0 0 1 52 0 Z`} fill="#0a1428" stroke={metal.mid} strokeOpacity="0.5" strokeWidth="1" />
        <g clipPath={`url(#${idOf("moon")})`}>
          <circle cx={p.x - 9} cy={p.y - 2} r="8" fill="#e8e2c8" />
          <circle cx={p.x + 12} cy={p.y - 3} r="8" fill="#e8e2c8" />
        </g>
      </g>
    );
  }

  /* ------------------------------------------------------------ date window */
  let dateWindow: React.ReactNode = null;
  if (face.date) {
    const p = polar(90, 118);
    dateWindow = (
      <g>
        <rect x={p.x - 11} y={p.y - 9} width="22" height="18" rx="1.5" fill={dark ? "#f3f1ea" : "#15130f"} stroke={metal.mid} strokeWidth="1.2" />
        <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="central" fontSize="13" fontFamily="Inter, Arial, sans-serif" fontWeight="600" fill={dark ? "#15130f" : "#f3f1ea"}>
          28
        </text>
      </g>
    );
  }

  /* --------------------------------------------------------------- bezel */
  let bezel: React.ReactNode = null;
  if (face.bezel === "fluted") {
    bezel = (
      <g>
        {Array.from({ length: 60 }).map((_, i) => {
          const a = polar(i * 6, 190);
          return <rect key={i} x={a.x - 2} y={a.y - 8} width="4" height="16" transform={`rotate(${i * 6} ${a.x} ${a.y})`} fill={i % 2 ? metal.dark : metal.light} />;
        })}
      </g>
    );
  } else if (face.bezel === "dive") {
    bezel = (
      <g>
        <circle cx={C} cy={C} r="190" fill={face.bezelInsert} />
        <circle cx={C} cy={C} r="190" fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="1" />
        {Array.from({ length: 60 }).map((_, i) => {
          const a = polar(i * 6, 190);
          const long = i % 5 === 0;
          return <circle key={i} cx={a.x} cy={a.y} r={long ? 2 : 1} fill={metal.marker} opacity={long ? 0.95 : 0.55} />;
        })}
        {(() => {
          const t = polar(0, 190);
          const l = polar(-4, 178);
          const r = polar(4, 178);
          return <polygon points={`${t.x},${t.y - 6} ${l.x},${l.y} ${r.x},${r.y}`} fill={metal.marker} />;
        })()}
      </g>
    );
  } else if (face.bezel === "tachymeter") {
    bezel = (
      <g>
        {Array.from({ length: 60 }).map((_, i) => {
          const a = polar(i * 6, 188);
          const long = i % 5 === 0;
          return <rect key={i} x={a.x - 0.7} y={a.y - (long ? 6 : 3)} width="1.4" height={long ? 12 : 6} transform={`rotate(${i * 6} ${a.x} ${a.y})`} fill="#12100c" opacity="0.7" />;
        })}
      </g>
    );
  } else if (face.bezel === "octagon") {
    const pts = Array.from({ length: 8 }).map((_, i) => polar(i * 45 + 22.5, 196)).map((p) => `${p.x},${p.y}`).join(" ");
    const inner = Array.from({ length: 8 }).map((_, i) => polar(i * 45 + 22.5, 172)).map((p) => `${p.x},${p.y}`).join(" ");
    bezel = (
      <g>
        <polygon points={pts} fill={`url(#${idOf("case")})`} stroke={metal.dark} strokeWidth="1" />
        <polygon points={inner} fill={style.dialEdge} />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = polar(i * 45, 184);
          return (
            <g key={i}>
              <circle cx={a.x} cy={a.y} r="4.5" fill={`url(#${idOf("case")})`} stroke={metal.dark} strokeWidth="0.6" />
              <line x1={a.x - 2.6} y1={a.y} x2={a.x + 2.6} y2={a.y} stroke={metal.dark} strokeWidth="0.9" transform={`rotate(${i * 20} ${a.x} ${a.y})`} />
            </g>
          );
        })}
      </g>
    );
  }

  return (
    <svg viewBox="0 0 400 400" width={size} height={size} className={cn("block", className)} role="img" aria-label="Timepiece">
      <defs>
        <linearGradient id={idOf("case")} x1="12%" y1="4%" x2="88%" y2="96%">
          <stop offset="0%" stopColor={metal.light} />
          <stop offset="28%" stopColor={metal.mid} />
          <stop offset="54%" stopColor={metal.dark} />
          <stop offset="76%" stopColor={metal.mid} />
          <stop offset="100%" stopColor={metal.light} />
        </linearGradient>
        <radialGradient id={idOf("dial")} cx="42%" cy="34%" r="82%">
          <stop offset="0%" stopColor={style.dial} />
          <stop offset="58%" stopColor={style.dial} />
          <stop offset="100%" stopColor={style.dialEdge} />
        </radialGradient>
        <radialGradient id={idOf("vig")} cx="50%" cy="50%" r="50%">
          <stop offset="62%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
        </radialGradient>
        <radialGradient id={idOf("sub")} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor={style.dialEdge} />
          <stop offset="100%" stopColor={style.dial} />
        </radialGradient>
        <linearGradient id={idOf("mk")} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={metal.light} />
          <stop offset="50%" stopColor={metal.mid} />
          <stop offset="100%" stopColor={metal.dark} />
        </linearGradient>
        <linearGradient id={idOf("hand")} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={metal.light} />
          <stop offset="52%" stopColor={mHand} />
          <stop offset="100%" stopColor={metal.dark} />
        </linearGradient>
        <linearGradient id={idOf("glare")} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={idOf("clip")}>
          <circle cx={C} cy={C} r="166" />
        </clipPath>
        <filter id={idOf("blur")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <radialGradient id={idOf("spec")} cx="36%" cy="24%" r="54%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={idOf("recess")} cx="50%" cy="50%" r="50%">
          <stop offset="82%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
      </defs>

      {/* soft drop shadow for 3D lift */}
      <ellipse cx={C} cy={C + 18} rx="190" ry="186" fill="#000" opacity="0.55" filter={`url(#${idOf("blur")})`} />

      {/* crown + pushers */}
      <g fill={`url(#${idOf("case")})`}>
        {face.chrono && (
          <>
            <rect x={C + 184} y={C - 44} width="12" height="14" rx="3" transform={`rotate(20 ${C + 190} ${C - 37})`} />
            <rect x={C + 184} y={C + 30} width="12" height="14" rx="3" transform={`rotate(-20 ${C + 190} ${C + 37})`} />
          </>
        )}
        <rect x={C + 190} y={C - 13} width="16" height="26" rx="5" />
        <rect x={C + 186} y={C - 9} width="8" height="18" rx="2" />
      </g>

      {/* case */}
      <circle cx={C} cy={C} r="196" fill={`url(#${idOf("case")})`} />
      <circle cx={C} cy={C} r="196" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.5" />
      {bezel}
      {face.bezel !== "octagon" && <circle cx={C} cy={C} r="172" fill={style.dialEdge} />}
      <circle cx={C} cy={C} r="169" fill="#000" opacity="0.35" />

      {/* dial */}
      <circle cx={C} cy={C} r="166" fill={`url(#${idOf("dial")})`} />
      <g clipPath={`url(#${idOf("clip")})`}>
        {face.finish === "sunburst" &&
          Array.from({ length: 90 }).map((_, i) => {
            const p = polar(i * 4, 166);
            return <line key={i} x1={C} y1={C} x2={p.x} y2={p.y} stroke={dark ? "#ffffff" : "#000000"} strokeOpacity={i % 2 ? 0.03 : 0.06} strokeWidth="1.6" />;
          })}
        {face.finish === "guilloche" &&
          Array.from({ length: 40 }).map((_, i) => (
            <line key={i} x1={C - 166} y1={40 + i * 8} x2={C + 166} y2={40 + i * 8} stroke={dark ? "#ffffff" : "#000000"} strokeOpacity="0.06" strokeWidth="2.4" />
          ))}
      </g>
      <circle cx={C} cy={C} r="166" fill={`url(#${idOf("vig")})`} />
      <circle cx={C} cy={C} r="160" fill="none" stroke={metal.mid} strokeOpacity="0.28" strokeWidth="1" />

      {subdials}
      {moon}

      <circle cx={C} cy={C - 92} r="3" fill={mMark} />
      <text x={C} y={C + 128} textAnchor="middle" fontSize="7" letterSpacing="1.5" fontFamily="Inter, Arial, sans-serif" fill={mMark} opacity="0.55">
        SWISS MADE
      </text>

      {markers}
      {dateWindow}

      <DialHand angle={angles.hour} kind={face.hands} isMinute={false} handColor={mHand} gradientId={idOf("hand")} lume={face.lume} dark={dark} reduce={reduce} entranceDelay={delay + 0.35} />
      <DialHand angle={angles.minute} kind={face.hands} isMinute handColor={mHand} gradientId={idOf("hand")} lume={face.lume} dark={dark} reduce={reduce} entranceDelay={delay + 0.43} />

      {face.gmt && (
        <motion.g
          style={{ transformBox: "view-box", transformOrigin: "200px 200px" }}
          initial={reduce ? false : { rotate: angles.hour / 2 - 30, opacity: 0 }}
          animate={{ rotate: angles.hour / 2, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 16, delay: delay + 0.5 }}
        >
          <rect x={C - 1.4} y={C - 118} width="2.8" height="128" rx="1.4" fill={style.accent} />
          <polygon points={`${C},${C - 138} ${C - 8},${C - 118} ${C + 8},${C - 118}`} fill="none" stroke={style.accent} strokeWidth="2.4" />
        </motion.g>
      )}

      {seconds && (
        <motion.g
          style={{ transformBox: "view-box", transformOrigin: "200px 200px" }}
          initial={false}
          animate={{ rotate: angles.second }}
          transition={live ? { type: "spring", stiffness: 220, damping: 18 } : { type: "spring", stiffness: 55, damping: 13, delay: delay + 0.5 }}
        >
          <rect x={C - 1} y={C - 138} width="2" height="156" rx="1" fill={style.accent} />
          <circle cx={C} cy={C - 96} r="6" fill="none" stroke={style.accent} strokeWidth="2" />
          <rect x={C - 1.6} y={C + 8} width="3.2" height="40" rx="1.6" fill={style.accent} />
        </motion.g>
      )}

      <circle cx={C} cy={C} r="10" fill={`url(#${idOf("case")})`} />
      <circle cx={C} cy={C} r="3.2" fill={style.dialEdge} />

      {/* crystal: recess shadow, sheen, glare + a soft glint for 3D depth */}
      <circle cx={C} cy={C} r="166" fill={`url(#${idOf("recess")})`} clipPath={`url(#${idOf("clip")})`} pointerEvents="none" />
      <circle cx={C} cy={C} r="166" fill={`url(#${idOf("spec")})`} clipPath={`url(#${idOf("clip")})`} pointerEvents="none" />
      <path d="M 44 96 A 166 166 0 0 1 300 60 A 210 210 0 0 0 60 150 Z" fill={`url(#${idOf("glare")})`} clipPath={`url(#${idOf("clip")})`} pointerEvents="none" />
      <ellipse cx={C - 62} cy={C - 96} rx="54" ry="22" fill="#fff" opacity="0.15" transform={`rotate(-32 ${C - 62} ${C - 96})`} filter={`url(#${idOf("blur")})`} clipPath={`url(#${idOf("clip")})`} pointerEvents="none" />
      {/* bezel top highlight */}
      <path d="M 96 78 A 150 150 0 0 1 250 58" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="4" strokeLinecap="round" filter={`url(#${idOf("blur")})`} pointerEvents="none" />
    </svg>
  );
}
