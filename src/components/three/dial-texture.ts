/**
 * Aria's Atelier — 3D dial face texture
 *
 * Draws a watch's dial face (markers, date, sub-dials, moonphase, finish and
 * printing) onto a 2D canvas so it can be mapped onto the 3D watch model.
 * Hands, case, bezel and crystal are real geometry — this texture is only the
 * flat face that lives beneath the crystal. It mirrors the parametric look of
 * <WatchDial /> so every reference reads correctly in three dimensions.
 */

import { metalPalettes, type DialStyle, type WatchFace } from "@/data/watches";

const romanNumerals = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

/** angleDeg: 0 = 12 o'clock, clockwise. Returns canvas x/y for a given radius. */
function polar(cx: number, cy: number, angleDeg: number, radius: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Render the dial face. `S` is the square canvas size in px (use 1024+).
 * Everything is expressed relative to the dial radius R so the model can map
 * it edge-to-edge.
 */
export function drawDialFace(ctx: CanvasRenderingContext2D, S: number, style: DialStyle, face: WatchFace) {
  const c = S / 2;
  const R = S * 0.5; // dial fills the whole texture; 3D bezel overlaps the rim
  const dark = !style.light;
  const metal = metalPalettes[face.metal] ?? metalPalettes.steel;
  const mHand = style.light ? style.hand : metal.hand;
  const mMark = style.light ? style.marker : metal.marker;

  ctx.clearRect(0, 0, S, S);
  ctx.save();
  ctx.beginPath();
  ctx.arc(c, c, R, 0, Math.PI * 2);
  ctx.clip();

  /* base dial — radial sheen from an off-centre light */
  const base = ctx.createRadialGradient(c - R * 0.16, c - R * 0.22, R * 0.05, c, c, R);
  base.addColorStop(0, style.dial);
  base.addColorStop(0.58, style.dial);
  base.addColorStop(1, style.dialEdge);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);

  /* finish */
  ctx.save();
  if (face.finish === "sunburst") {
    for (let i = 0; i < 180; i++) {
      const p = polar(c, c, i * 2, R);
      ctx.strokeStyle = dark ? "#ffffff" : "#000000";
      ctx.globalAlpha = i % 2 ? 0.03 : 0.06;
      ctx.lineWidth = S * 0.004;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  } else if (face.finish === "guilloche") {
    ctx.strokeStyle = dark ? "#ffffff" : "#000000";
    ctx.globalAlpha = 0.06;
    ctx.lineWidth = S * 0.006;
    const step = S / 44;
    for (let y = 0; y <= S; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(S, y);
      ctx.stroke();
    }
    for (let x = 0; x <= S; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, S);
      ctx.stroke();
    }
  } else {
    // opaline — a soft brushed sheen
    const op = ctx.createLinearGradient(0, 0, S, S);
    op.addColorStop(0, "rgba(255,255,255,0.05)");
    op.addColorStop(0.5, "rgba(255,255,255,0)");
    op.addColorStop(1, "rgba(0,0,0,0.05)");
    ctx.fillStyle = op;
    ctx.fillRect(0, 0, S, S);
  }
  ctx.restore();

  /* vignette for depth */
  const vig = ctx.createRadialGradient(c, c, R * 0.6, c, c, R);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, S, S);

  /* chapter ring */
  ctx.strokeStyle = metal.mid;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = S * 0.003;
  ctx.beginPath();
  ctx.arc(c, c, R * 0.82, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const skip = new Set<number>();
  if (face.date) skip.add(3);
  if (face.moonphase) skip.add(6);
  if (face.chrono) [3, 6, 9].forEach((i) => skip.add(i));

  const markerR = R * 0.68;

  /* ---- sub-dials (chronograph) ---- */
  if (face.chrono) {
    for (const idx of [3, 6, 9]) {
      const p = polar(c, c, idx * 30, R * 0.42);
      const sr = R * 0.16;
      const sg = ctx.createRadialGradient(p.x, p.y - sr * 0.3, sr * 0.1, p.x, p.y, sr);
      sg.addColorStop(0, style.dialEdge);
      sg.addColorStop(1, style.dial);
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(p.x, p.y, sr, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = metal.mid;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = S * 0.0015;
      ctx.stroke();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = mMark;
      for (let t = 0; t < 12; t++) {
        const q = polar(p.x, p.y, t * 30, sr * 0.82);
        ctx.beginPath();
        ctx.arc(q.x, q.y, S * 0.0016, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // little hand
      const hEnd = polar(p.x, p.y, idx * 47, sr * 0.7);
      ctx.strokeStyle = mMark;
      ctx.lineWidth = S * 0.0022;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(hEnd.x, hEnd.y);
      ctx.stroke();
    }
  }

  /* ---- moonphase ---- */
  if (face.moonphase) {
    const p = polar(c, c, 180, R * 0.5);
    const w = R * 0.16;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(p.x, p.y - w * 0.15, w, w * 0.62, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fillStyle = "#0a1428";
    ctx.fill();
    ctx.clip();
    ctx.fillStyle = "#e8e2c8";
    for (const dx of [-0.35, 0.45]) {
      ctx.beginPath();
      ctx.arc(p.x + w * dx, p.y - w * 0.1, w * 0.32, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* ---- hour markers ---- */
  for (let i = 0; i < 12; i++) {
    if (skip.has(i)) continue;
    const ang = i * 30;
    const cardinal = i % 3 === 0;
    const p = polar(c, c, ang, markerR);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((ang * Math.PI) / 180);

    if (face.markers === "roman") {
      ctx.rotate(-(ang * Math.PI) / 180); // upright text
      ctx.fillStyle = mMark;
      ctx.font = `${Math.round(S * 0.05)}px "Playfair Display", Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(romanNumerals[i], 0, 0);
    } else if (face.bezel === "dive" && dark) {
      if (i === 0) {
        ctx.fillStyle = face.lume;
        ctx.strokeStyle = mMark;
        ctx.lineWidth = S * 0.004;
        ctx.beginPath();
        ctx.moveTo(0, -R * 0.09);
        ctx.lineTo(-R * 0.035, R * 0.02);
        ctx.lineTo(R * 0.035, R * 0.02);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (cardinal) {
        ctx.fillStyle = mMark;
        roundRect(ctx, -R * 0.03, -R * 0.055, R * 0.06, R * 0.11, R * 0.012);
        ctx.fill();
        ctx.fillStyle = face.lume;
        roundRect(ctx, -R * 0.02, -R * 0.045, R * 0.04, R * 0.09, R * 0.008);
        ctx.fill();
      } else {
        ctx.fillStyle = mMark;
        ctx.beginPath();
        ctx.arc(0, 0, R * 0.028, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = face.lume;
        ctx.beginPath();
        ctx.arc(0, 0, R * 0.019, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (face.markers === "baton") {
      ctx.fillStyle = mMark;
      const h = cardinal ? R * 0.15 : R * 0.11;
      roundRect(ctx, -R * 0.008, -h / 2, R * 0.016, h, R * 0.006);
      ctx.fill();
    } else {
      // applied metal indices
      const grad = ctx.createLinearGradient(-R * 0.02, 0, R * 0.02, 0);
      grad.addColorStop(0, metal.light);
      grad.addColorStop(0.5, metal.mid);
      grad.addColorStop(1, metal.dark);
      if (i === 0) {
        ctx.fillStyle = grad;
        roundRect(ctx, -R * 0.036, -R * 0.07, R * 0.024, R * 0.14, R * 0.004);
        ctx.fill();
        roundRect(ctx, R * 0.012, -R * 0.07, R * 0.024, R * 0.14, R * 0.004);
        ctx.fill();
      } else {
        const h = cardinal ? R * 0.145 : R * 0.11;
        ctx.fillStyle = grad;
        roundRect(ctx, -R * 0.018, -h / 2, R * 0.036, h, R * 0.008);
        ctx.fill();
        if (dark) {
          ctx.fillStyle = face.lume;
          ctx.globalAlpha = 0.85;
          roundRect(ctx, -R * 0.008, -h / 2 + R * 0.016, R * 0.016, h - R * 0.032, R * 0.004);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    }
    ctx.restore();
  }

  /* ---- date window ---- */
  if (face.date) {
    const p = polar(c, c, 90, R * 0.6);
    ctx.fillStyle = dark ? "#f3f1ea" : "#15130f";
    roundRect(ctx, p.x - R * 0.055, p.y - R * 0.045, R * 0.11, R * 0.09, R * 0.008);
    ctx.fill();
    ctx.strokeStyle = metal.mid;
    ctx.lineWidth = S * 0.003;
    ctx.stroke();
    ctx.fillStyle = dark ? "#15130f" : "#f3f1ea";
    ctx.font = `600 ${Math.round(S * 0.05)}px Inter, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("28", p.x, p.y + S * 0.002);
  }

  /* ---- printing ---- */
  ctx.fillStyle = mMark;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(c, c - R * 0.46, S * 0.006, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.55;
  ctx.font = `${Math.round(S * 0.02)}px Inter, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.save();
  ctx.translate(c, c + R * 0.62);
  ctx.fillText("S W I S S   M A D E", 0, 0);
  ctx.restore();
  ctx.globalAlpha = 1;

  ctx.restore();
}
