"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { WatchDial, DialHand } from "@/components/watch-dial";
import { getWatchFace, metalPalettes, type DialStyle, type Watch, type WatchFace } from "@/data/watches";
import { cn } from "@/lib/utils";

const C = 200;
const round = (n: number) => Math.round(n * 1000) / 1000;

function useLiveAngles(live: boolean) {
  const [a, setA] = useState({ hour: 305, minute: 60, second: 210 });
  useEffect(() => {
    if (!live) return;
    const tick = () => {
      const n = new Date();
      const s = n.getSeconds() + n.getMilliseconds() / 1000;
      const m = n.getMinutes() + s / 60;
      const h = (n.getHours() % 12) + m / 60;
      setA({ hour: h * 30, minute: m * 6, second: s * 6 });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [live]);
  return a;
}

/* ------------------------------------------------------------------ bracelet */
function metalRows(y0: number, y1: number, cx: number, halfW: number, headCy: number, half: number, links: number, gid: string) {
  const rows: React.ReactNode[] = [];
  const rowH = 15;
  for (let y = y0; y < y1; y += rowH) {
    const t = Math.min(1, Math.abs(y + rowH / 2 - headCy) / half);
    const hw = halfW * (1 - 0.2 * t);
    const gap = 2.4;
    const unit = (hw * 2) / links;
    for (let i = 0; i < links; i++) {
      const lx = cx - hw + i * unit + gap / 2;
      rows.push(
        <rect
          key={`${y}-${i}`}
          x={round(lx)}
          y={y}
          width={round(unit - gap)}
          height={rowH - 2.4}
          rx="3"
          fill={`url(#band-${gid})`}
          stroke="#5c451d"
          strokeWidth="0.5"
        />,
      );
    }
  }
  return rows;
}

function Bracelet({
  W,
  H,
  cx,
  headCy,
  caseHalfH,
  face,
  gid,
}: {
  W: number;
  H: number;
  cx: number;
  headCy: number;
  caseHalfH: number;
  face: WatchFace;
  gid: string;
}) {
  const metal = metalPalettes[face.metal] ?? metalPalettes.steel;
  const half = H / 2;
  const links = face.band === "jubilee" || face.band === "president" ? 5 : face.band === "integrated" ? 3 : 3;
  const halfW = (face.band === "integrated" ? 0.36 : face.band === "jubilee" ? 0.3 : 0.31) * W;
  const topEnd = headCy - caseHalfH * 0.55;
  const botStart = headCy + caseHalfH * 0.55;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="absolute inset-0" aria-hidden>
      <defs>
        <linearGradient id={`band-${gid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={metal.dark} />
          <stop offset="22%" stopColor={metal.light} />
          <stop offset="50%" stopColor={metal.mid} />
          <stop offset="78%" stopColor={metal.light} />
          <stop offset="100%" stopColor={metal.dark} />
        </linearGradient>
        <linearGradient id={`leather-${gid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.5" />
          <stop offset="18%" stopColor={face.bandColor} />
          <stop offset="50%" stopColor={face.bandColor} />
          <stop offset="82%" stopColor={face.bandColor} />
          <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {face.band === "leather" ? (
        <>
          {/* top strap */}
          {[
            { y0: 0, y1: topEnd + 8, wTop: W * 0.19, wBot: W * 0.27 },
          ].map((s, i) => {
            const x1t = cx - s.wTop, x2t = cx + s.wTop, x1b = cx - s.wBot, x2b = cx + s.wBot;
            return (
              <g key={i}>
                <path d={`M ${x1t} ${s.y0} L ${x2t} ${s.y0} L ${x2b} ${s.y1} L ${x1b} ${s.y1} Z`} fill={`url(#leather-${gid})`} />
                <line x1={x1t + 5} y1={s.y0} x2={x1b + 5} y2={s.y1} stroke="#e9cf94" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 3" />
                <line x1={x2t - 5} y1={s.y0} x2={x2b - 5} y2={s.y1} stroke="#e9cf94" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 3" />
              </g>
            );
          })}
          {/* bottom strap + buckle */}
          {(() => {
            const wTop = W * 0.27, wBot = W * 0.17;
            const x1t = cx - wTop, x2t = cx + wTop, x1b = cx - wBot, x2b = cx + wBot;
            const buckleY = H - 30;
            return (
              <g>
                <path d={`M ${x1t} ${botStart - 8} L ${x2t} ${botStart - 8} L ${x2b} ${buckleY} L ${x1b} ${buckleY} Z`} fill={`url(#leather-${gid})`} />
                <line x1={x1t + 5} y1={botStart - 8} x2={x1b + 5} y2={buckleY} stroke="#e9cf94" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 3" />
                <line x1={x2t - 5} y1={botStart - 8} x2={x2b - 5} y2={buckleY} stroke="#e9cf94" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 3" />
                <rect x={cx - wBot - 4} y={buckleY} width={wBot * 2 + 8} height="20" rx="3" fill="none" stroke={`url(#band-${gid})`} strokeWidth="4" />
                <line x1={cx} y1={buckleY + 2} x2={cx} y2={buckleY + 18} stroke={`url(#band-${gid})`} strokeWidth="3" />
              </g>
            );
          })()}
        </>
      ) : (
        <>
          {metalRows(0, topEnd, cx, halfW, headCy, half, links, gid)}
          {metalRows(botStart, H, cx, halfW, headCy, half, links, gid)}
        </>
      )}
    </svg>
  );
}

/* ------------------------------------------------------- rectangular head */
function RectDial({
  style,
  face,
  shape,
  size,
  live,
  seconds,
  delay,
}: {
  style: DialStyle;
  face: WatchFace;
  shape: "rect" | "square";
  size: number;
  live: boolean;
  seconds: boolean;
  delay: number;
}) {
  const gid = useId().replace(/[:]/g, "");
  const reduce = useReducedMotion();
  const angles = useLiveAngles(live);
  const dark = !style.light;
  const metal = metalPalettes[face.metal] ?? metalPalettes.steel;
  const mHand = style.light ? style.hand : metal.hand;
  const mMark = style.light ? style.marker : metal.marker;

  const cw = shape === "square" ? 300 : 224; // case width
  const ch = shape === "square" ? 300 : 320; // case height
  const cornerR = shape === "square" ? 54 : 30;
  const cx0 = C - cw / 2, cy0 = C - ch / 2;
  const dInset = 26;
  const dw = cw - dInset * 2, dh = ch - dInset * 2;
  const dx = C - dw / 2, dy = C - dh / 2;
  const rx = (dw / 2) * 0.82, ry = (dh / 2) * 0.82;

  const roman = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  const markers = Array.from({ length: 12 }).map((_, i) => {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    const x = round(C + rx * Math.cos(a));
    const y = round(C + ry * Math.sin(a));
    if (face.markers === "roman") {
      return (
        <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="19" fontFamily="Playfair Display, Georgia, serif" fill={mMark}>
          {roman[i]}
        </text>
      );
    }
    return <rect key={i} x={x - 1.6} y={y - 6} width="3.2" height="12" rx="1.6" transform={`rotate(${i * 30} ${x} ${y})`} fill={mMark} />;
  });

  return (
    <svg viewBox="0 0 400 400" width={size} height={size} className="block" role="img" aria-label="Timepiece">
      <defs>
        <linearGradient id={`case-${gid}`} x1="12%" y1="4%" x2="88%" y2="96%">
          <stop offset="0%" stopColor={metal.light} />
          <stop offset="28%" stopColor={metal.mid} />
          <stop offset="54%" stopColor={metal.dark} />
          <stop offset="76%" stopColor={metal.mid} />
          <stop offset="100%" stopColor={metal.light} />
        </linearGradient>
        <linearGradient id={`dial-${gid}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={style.dial} />
          <stop offset="100%" stopColor={style.dialEdge} />
        </linearGradient>
        <linearGradient id={`hand-${gid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={metal.light} />
          <stop offset="52%" stopColor={mHand} />
          <stop offset="100%" stopColor={metal.dark} />
        </linearGradient>
        <linearGradient id={`glare-${gid}`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="62%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`spec-${gid}`} cx="34%" cy="24%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.26" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`clip-${gid}`}>
          <rect x={dx} y={dy} width={dw} height={dh} rx={cornerR - 12} />
        </clipPath>
      </defs>

      {/* crown */}
      <g fill={`url(#case-${gid})`}>
        <rect x={C + cw / 2 - 2} y={C - 10} width="18" height="20" rx="4" />
        <circle cx={C + cw / 2 + 16} cy={C} r="7" fill="#bfd0e0" stroke={`url(#case-${gid})`} strokeWidth="3" />
      </g>

      {/* case */}
      <rect x={cx0} y={cy0} width={cw} height={ch} rx={cornerR} fill={`url(#case-${gid})`} stroke="#fff" strokeOpacity="0.25" strokeWidth="1.5" />
      <rect x={cx0 + 12} y={cy0 + 12} width={cw - 24} height={ch - 24} rx={cornerR - 10} fill={style.dialEdge} />
      {/* dial */}
      <rect x={dx} y={dy} width={dw} height={dh} rx={cornerR - 12} fill={`url(#dial-${gid})`} />

      {/* railway minute track */}
      <rect x={dx + 8} y={dy + 8} width={dw - 16} height={dh - 16} rx={cornerR - 16} fill="none" stroke={mMark} strokeOpacity="0.4" strokeWidth="1" />

      {markers}

      {/* hands (clipped to dial) */}
      <g clipPath={`url(#clip-${gid})`}>
        <DialHand angle={angles.hour} kind={face.hands} isMinute={false} handColor={mHand} gradientId={`hand-${gid}`} lume={face.lume} dark={dark} reduce={reduce} entranceDelay={delay + 0.35} />
        <DialHand angle={angles.minute} kind={face.hands} isMinute handColor={mHand} gradientId={`hand-${gid}`} lume={face.lume} dark={dark} reduce={reduce} entranceDelay={delay + 0.43} />
        {seconds && (
          <motion.g
            style={{ transformBox: "view-box", transformOrigin: "200px 200px" }}
            initial={false}
            animate={{ rotate: angles.second }}
            transition={live ? { type: "spring", stiffness: 220, damping: 18 } : { type: "spring", stiffness: 55, damping: 13, delay: delay + 0.5 }}
          >
            <rect x={C - 0.9} y={C - 120} width="1.8" height="138" rx="1" fill={style.accent} />
            <rect x={C - 1.4} y={C + 8} width="2.8" height="34" rx="1.4" fill={style.accent} />
          </motion.g>
        )}
      </g>

      <circle cx={C} cy={C} r="7" fill={`url(#case-${gid})`} />
      <circle cx={C} cy={C} r="2.6" fill={style.dialEdge} />

      {/* glare + crystal sheen */}
      <rect x={dx} y={dy} width={dw} height={dh} rx={cornerR - 12} fill={`url(#glare-${gid})`} pointerEvents="none" />
      <rect x={dx} y={dy} width={dw} height={dh} rx={cornerR - 12} fill={`url(#spec-${gid})`} pointerEvents="none" />
    </svg>
  );
}

/* -------------------------------------------------------------- watch model */
export function WatchModel({
  watch,
  size = 240,
  live = false,
  seconds = true,
  delay = 0,
  className,
}: {
  watch: Watch;
  size?: number;
  live?: boolean;
  seconds?: boolean;
  delay?: number;
  className?: string;
}) {
  const face = getWatchFace(watch);
  const shape = face.caseShape;
  const useRect = shape === "rect" || shape === "square";

  const halfMap: Record<string, number> = { round: 0.47, cushion: 0.47, octagon: 0.47, square: 0.4, rect: 0.4 };
  const W = size;
  const H = Math.round(size * 2.1);
  const cx = W / 2;
  const headCy = H / 2;
  const caseHalfH = size * halfMap[shape];
  const gid = useId().replace(/[:]/g, "");

  return (
    <div className={cn("relative inline-block", className)} style={{ width: W, height: H }}>
      <Bracelet W={W} H={H} cx={cx} headCy={headCy} caseHalfH={caseHalfH} face={face} gid={gid} />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_16px_26px_rgba(0,0,0,0.55))]"
        style={{ width: size, height: size }}
      >
        {useRect ? (
          <RectDial style={watch.dialStyle} face={face} shape={shape as "rect" | "square"} size={size} live={live} seconds={seconds} delay={delay} />
        ) : (
          <WatchDial style={watch.dialStyle} face={face} size={size} live={live} seconds={seconds} delay={delay} />
        )}
      </div>
    </div>
  );
}
