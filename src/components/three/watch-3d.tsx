"use client";

/**
 * Aria's Atelier — parametric 3D watch
 *
 * A single procedural model that reads getWatchFace(watch) and renders a real,
 * rotatable timepiece: case, bezel (dive / fluted / tachymeter / octagon /
 * smooth), a canvas-textured dial, live-ticking 3D hands, a domed sapphire
 * crystal, crown, lugs and a curved bracelet or leather strap. Every reference
 * in the catalogue is expressed through the same geometry, driven by its data.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { getWatchFace, metalPalettes, type Watch } from "@/data/watches";
import { drawDialFace } from "./dial-texture";

const RADIUS = 1; // dial radius — everything scales from this

function metalMaterial(color: string, roughness = 0.22) {
  return { color, metalness: 1, roughness, envMapIntensity: 1.4 } as const;
}

/** Builds the dial-face CanvasTexture once per watch. */
function useDialTexture(watch: Watch) {
  return useMemo(() => {
    const S = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    drawDialFace(ctx, S, watch.dialStyle, getWatchFace(watch));
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [watch]);
}

/* -------------------------------------------------------------------------- */
/*  Hands                                                                      */
/* -------------------------------------------------------------------------- */

function Hands({ handColor, accent, lume, live }: { handColor: string; accent: string; lume: string; live: boolean }) {
  const hour = useRef<THREE.Group>(null);
  const minute = useRef<THREE.Group>(null);
  const second = useRef<THREE.Group>(null);

  // a pleasing fixed pose (10:09:35) when not live
  const fixed = useRef({ h: -(10 + 9 / 60) * 30, m: -9 * 6, s: -35 * 6 });

  useFrame(() => {
    let h: number, m: number, s: number;
    if (live) {
      const now = new Date();
      const sec = now.getSeconds() + now.getMilliseconds() / 1000;
      const min = now.getMinutes() + sec / 60;
      const hr = (now.getHours() % 12) + min / 60;
      h = -hr * 30;
      m = -min * 6;
      s = -sec * 6;
    } else {
      ({ h, m, s } = fixed.current);
    }
    if (hour.current) hour.current.rotation.z = THREE.MathUtils.degToRad(h);
    if (minute.current) minute.current.rotation.z = THREE.MathUtils.degToRad(m);
    if (second.current) second.current.rotation.z = THREE.MathUtils.degToRad(s);
  });

  const handMat = metalMaterial(handColor, 0.18);

  return (
    <group position={[0, 0, RADIUS * 0.09]}>
      {/* hour */}
      <group ref={hour}>
        <mesh position={[0, RADIUS * 0.28, 0]} castShadow>
          <boxGeometry args={[RADIUS * 0.05, RADIUS * 0.56, RADIUS * 0.02]} />
          <meshStandardMaterial {...handMat} />
        </mesh>
      </group>
      {/* minute */}
      <group ref={minute}>
        <mesh position={[0, RADIUS * 0.4, RADIUS * 0.01]} castShadow>
          <boxGeometry args={[RADIUS * 0.036, RADIUS * 0.8, RADIUS * 0.02]} />
          <meshStandardMaterial {...handMat} />
        </mesh>
      </group>
      {/* seconds */}
      <group ref={second}>
        <mesh position={[0, RADIUS * 0.32, RADIUS * 0.03]}>
          <boxGeometry args={[RADIUS * 0.012, RADIUS * 0.92, RADIUS * 0.012]} />
          <meshStandardMaterial color={accent} metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, -RADIUS * 0.16, RADIUS * 0.03]}>
          <boxGeometry args={[RADIUS * 0.02, RADIUS * 0.32, RADIUS * 0.012]} />
          <meshStandardMaterial color={accent} metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
      {/* centre cap */}
      <mesh position={[0, 0, RADIUS * 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[RADIUS * 0.05, RADIUS * 0.05, RADIUS * 0.03, 32]} />
        <meshStandardMaterial {...metalMaterial(handColor, 0.2)} />
      </mesh>
      {/* faint lume tip glow on the hour/minute (baked colour) */}
      <mesh position={[0, RADIUS * 0.5, RADIUS * 0.05]} visible={false}>
        <sphereGeometry args={[0.001]} />
        <meshBasicMaterial color={lume} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bezel variants                                                             */
/* -------------------------------------------------------------------------- */

function Bezel({ watch, z }: { watch: Watch; z: number }) {
  const face = getWatchFace(watch);
  const metal = metalPalettes[face.metal] ?? metalPalettes.steel;
  const inner = RADIUS * 1.02;
  const outer = RADIUS * 1.16;

  if (face.bezel === "dive") {
    return (
      <group position={[0, 0, z]}>
        {/* coloured insert */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[outer, outer, RADIUS * 0.05, 96, 1, true]} />
          <meshStandardMaterial color={face.bezelInsert} metalness={0.5} roughness={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, RADIUS * 0.026]}>
          <ringGeometry args={[inner, outer, 96]} />
          <meshStandardMaterial color={face.bezelInsert} metalness={0.45} roughness={0.32} side={THREE.DoubleSide} />
        </mesh>
        {/* pip at 12 */}
        <mesh position={[0, outer * 0.94, RADIUS * 0.028]}>
          <circleGeometry args={[RADIUS * 0.03, 24]} />
          <meshStandardMaterial color={metal.marker} emissive={metal.marker} emissiveIntensity={0.15} />
        </mesh>
        {/* metal edge */}
        <mesh position={[0, 0, RADIUS * 0.03]}>
          <ringGeometry args={[outer * 0.985, outer, 96]} />
          <meshStandardMaterial {...metalMaterial(metal.mid, 0.16)} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  if (face.bezel === "fluted") {
    const teeth = 60;
    return (
      <group position={[0, 0, z]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[outer, outer, RADIUS * 0.06, teeth, 1, true]} />
          <meshStandardMaterial {...metalMaterial(metal.light, 0.14)} flatShading side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, RADIUS * 0.031]}>
          <ringGeometry args={[inner, outer, 96]} />
          <meshStandardMaterial {...metalMaterial(metal.mid, 0.18)} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  if (face.bezel === "octagon") {
    return (
      <group position={[0, 0, z]} rotation={[0, 0, Math.PI / 8]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[outer * 1.04, outer * 1.06, RADIUS * 0.09, 8, 1, true]} />
          <meshStandardMaterial {...metalMaterial(metal.light, 0.14)} flatShading side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, RADIUS * 0.046]}>
          <ringGeometry args={[inner, outer, 8]} />
          <meshStandardMaterial {...metalMaterial(metal.mid, 0.2)} side={THREE.DoubleSide} />
        </mesh>
        {/* exposed screws */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
          const r = outer * 0.92;
          return (
            <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, RADIUS * 0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[RADIUS * 0.03, RADIUS * 0.03, RADIUS * 0.02, 16]} />
              <meshStandardMaterial {...metalMaterial(metal.dark, 0.2)} />
            </mesh>
          );
        })}
      </group>
    );
  }

  if (face.bezel === "tachymeter") {
    return (
      <group position={[0, 0, z]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[outer, outer, RADIUS * 0.06, 96, 1, true]} />
          <meshStandardMaterial {...metalMaterial(metal.mid, 0.2)} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, RADIUS * 0.031]}>
          <ringGeometry args={[inner, outer, 96]} />
          <meshStandardMaterial color="#151310" metalness={0.4} roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  // smooth
  return (
    <group position={[0, 0, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[outer, outer, RADIUS * 0.06, 96, 1, true]} />
        <meshStandardMaterial {...metalMaterial(metal.mid, 0.16)} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, RADIUS * 0.031]}>
        <ringGeometry args={[inner, outer, 96]} />
        <meshStandardMaterial {...metalMaterial(metal.light, 0.14)} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bracelet / strap                                                           */
/* -------------------------------------------------------------------------- */

function Band({ watch, topY = RADIUS * 1.16 }: { watch: Watch; topY?: number }) {
  const face = getWatchFace(watch);
  const metal = metalPalettes[face.metal] ?? metalPalettes.steel;
  const leather = face.band === "leather";
  const caseR = topY;

  // a gentle curve of links (or strap segments) sweeping away from each lug
  const links = useMemo(() => {
    const out: { pos: [number, number, number]; rot: [number, number, number]; scale: [number, number, number] }[] = [];
    const count = leather ? 7 : 9;
    for (const dir of [1, -1]) {
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const along = caseR * 0.92 + t * RADIUS * 1.7;
        // curve back and down as it goes away — wraps toward the wrist
        const drop = Math.sin(t * Math.PI * 0.5) * RADIUS * 1.5;
        const z = -Math.sin(t * Math.PI * 0.42) * RADIUS * 1.15 - RADIUS * 0.02;
        const y = dir * (along - drop);
        const tilt = dir * t * 0.8;
        const w = leather ? RADIUS * 0.44 - t * RADIUS * 0.12 : RADIUS * 0.5 - t * RADIUS * 0.06;
        out.push({
          pos: [0, y, z],
          rot: [tilt * dir, 0, 0],
          scale: [w, leather ? RADIUS * 0.24 : RADIUS * 0.16, leather ? RADIUS * 0.05 : RADIUS * 0.08],
        });
      }
    }
    return out;
  }, [leather, caseR]);

  const mat = leather
    ? { color: face.bandColor, metalness: 0.05, roughness: 0.8 }
    : metalMaterial(metal.mid, 0.2);

  return (
    <group>
      {links.map((l, i) => (
        <mesh key={i} position={l.pos} rotation={l.rot} castShadow>
          <boxGeometry args={[l.scale[0], l.scale[1], l.scale[2]]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Full watch                                                                 */
/* -------------------------------------------------------------------------- */

export function WatchModel3D({ watch, live = true }: { watch: Watch; live?: boolean }) {
  const face = getWatchFace(watch);
  const metal = metalPalettes[face.metal] ?? metalPalettes.steel;
  const dialTex = useDialTexture(watch);
  const mHand = watch.dialStyle.light ? watch.dialStyle.hand : metal.hand;

  const caseDepth = RADIUS * 0.42;
  const caseFront = caseDepth / 2;
  const octagon = face.caseShape === "octagon";
  const boxy = face.caseShape === "rect" || face.caseShape === "square";
  const segs = octagon ? 8 : 96;
  const caseR = RADIUS * 1.16;

  // rectangular / square cases (Tank, Santos, Reverso, Panthère)
  const bw = face.caseShape === "square" ? RADIUS * 2.5 : RADIUS * 2.15;
  const bh = face.caseShape === "square" ? RADIUS * 2.5 : RADIUS * 2.95;

  // the dial plane, and the case extents used to place crown / lugs / band
  const faceZ = boxy ? caseFront + RADIUS * 0.01 : caseFront - RADIUS * 0.04;
  const bezelZ = faceZ + RADIUS * 0.01;
  const rightX = boxy ? bw / 2 : caseR;
  const topY = boxy ? bh / 2 : caseR;

  return (
    <group rotation={[octagon ? Math.PI / 8 : 0, 0, 0]}>
      {boxy ? (
        /* rounded box case */
        <RoundedBox args={[bw, bh, caseDepth]} radius={RADIUS * 0.13} smoothness={5} castShadow receiveShadow>
          <meshStandardMaterial {...metalMaterial(metal.mid, 0.2)} />
        </RoundedBox>
      ) : (
        <>
          {/* case body — open-ended tube so the dial is visible through the front */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[caseR, caseR * 0.96, caseDepth, segs, 1, true]} />
            <meshStandardMaterial {...metalMaterial(metal.mid, 0.2)} flatShading={octagon} side={THREE.DoubleSide} />
          </mesh>
          {/* inner case wall ring, framing the dial */}
          <mesh position={[0, 0, caseFront - RADIUS * 0.06]}>
            <ringGeometry args={[RADIUS * 1.04, caseR, segs]} />
            <meshStandardMaterial {...metalMaterial(metal.dark, 0.3)} side={THREE.DoubleSide} />
          </mesh>
          {/* case back */}
          <mesh position={[0, 0, -caseFront]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[caseR, segs]} />
            <meshStandardMaterial {...metalMaterial(metal.dark, 0.28)} />
          </mesh>
          {/* dial recess ring */}
          <mesh position={[0, 0, caseFront - RADIUS * 0.02]}>
            <ringGeometry args={[RADIUS, RADIUS * 1.05, segs]} />
            <meshStandardMaterial color={watch.dialStyle.dialEdge} metalness={0.5} roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}

      {/* dial face — matte so the printing stays legible under studio light */}
      <mesh position={[0, 0, faceZ]}>
        <circleGeometry args={[RADIUS, 96]} />
        <meshStandardMaterial map={dialTex} roughness={0.82} metalness={0} envMapIntensity={0.35} />
      </mesh>

      {/* hands */}
      <group position={[0, 0, faceZ]}>
        <Hands handColor={mHand} accent={watch.dialStyle.accent} lume={face.lume} live={live} />
      </group>

      {/* bezel sits just above the dial */}
      <Bezel watch={watch} z={bezelZ} />

      {/* shallow sapphire crystal — a faint glassy sheen over the dial */}
      <mesh position={[0, 0, faceZ + RADIUS * 0.008]} scale={[RADIUS * 1.0, RADIUS * 1.0, RADIUS * 0.05]}>
        <sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.1}
          roughness={0.06}
          metalness={0}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.12}
          color="#eef4ff"
        />
      </mesh>

      {/* crown */}
      <mesh position={[rightX + RADIUS * 0.02, boxy ? 0 : 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[RADIUS * 0.09, RADIUS * 0.09, RADIUS * 0.14, 24]} />
        <meshStandardMaterial {...metalMaterial(metal.mid, 0.2)} />
      </mesh>
      {face.chrono &&
        [1, -1].map((s) => (
          <mesh key={s} position={[rightX * 0.98, s * RADIUS * 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[RADIUS * 0.06, RADIUS * 0.06, RADIUS * 0.1, 20]} />
            <meshStandardMaterial {...metalMaterial(metal.mid, 0.22)} />
          </mesh>
        ))}

      {/* lugs — round cases only; boxy cases meet the band directly */}
      {!boxy &&
        [
          [1, 1],
          [-1, 1],
          [1, -1],
          [-1, -1],
        ].map(([sx, sy], i) => (
          <mesh key={i} position={[sx * caseR * 0.6, sy * caseR * 0.9, -RADIUS * 0.02]} castShadow>
            <boxGeometry args={[RADIUS * 0.28, RADIUS * 0.36, caseDepth * 0.9]} />
            <meshStandardMaterial {...metalMaterial(metal.mid, 0.22)} />
          </mesh>
        ))}

      <Band watch={watch} topY={topY} />
    </group>
  );
}
