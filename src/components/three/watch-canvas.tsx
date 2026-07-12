"use client";

/**
 * Aria's Atelier — interactive 3D watch stage
 *
 * A self-contained R3F canvas that presents a single timepiece as a real,
 * drag-to-rotate 3D object. Studio lighting is built in-scene with drei
 * Lightformers (no external HDR — nothing is fetched at runtime), so metals
 * catch reflections while the background stays transparent over the dark site.
 *
 * The <Canvas> only mounts on the client after first paint, which keeps three
 * out of the server render entirely.
 */

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, ContactShadows, AdaptiveDpr } from "@react-three/drei";
import type { Watch } from "@/data/watches";
import { WatchModel3D } from "./watch-3d";
import { cn } from "@/lib/utils";

function Studio() {
  return (
    <Environment resolution={256}>
      <group>
        <Lightformer intensity={2.2} position={[0, 3, 4]} scale={[8, 3, 1]} color="#fff6e6" />
        <Lightformer intensity={1.1} position={[-4, 1, 2]} scale={[3, 6, 1]} color="#cfe0ff" />
        <Lightformer intensity={1.4} position={[4, 0, 2]} scale={[3, 6, 1]} color="#ffffff" />
        <Lightformer intensity={0.8} position={[0, -3, 2]} scale={[6, 3, 1]} color="#d7bd85" />
        <Lightformer intensity={2} position={[0, 0, -5]} scale={[10, 10, 1]} color="#20242c" />
      </group>
    </Environment>
  );
}

export function WatchCanvas({
  watch,
  className,
  live = true,
  autoRotate = true,
  interactive = true,
  tilt = 0.32,
  frameloop = "always",
}: {
  watch: Watch;
  className?: string;
  live?: boolean;
  autoRotate?: boolean;
  interactive?: boolean;
  tilt?: number;
  frameloop?: "always" | "demand";
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // R3F sizes its canvas from a ResizeObserver that can miss the very first
  // layout pass (notably on hard navigations). Nudge it a few times after mount
  // so the canvas always fills its container instead of falling back to 300×150.
  useEffect(() => {
    if (!mounted) return;
    const timers = [0, 80, 300].map((t) =>
      setTimeout(() => window.dispatchEvent(new Event("resize")), t),
    );
    return () => timers.forEach(clearTimeout);
  }, [mounted]);

  if (!mounted) {
    return <div className={cn("relative", className)} aria-hidden />;
  }

  return (
    <div className={cn("relative", interactive && "cursor-grab active:cursor-grabbing", className)}>
      <Canvas
        shadows
        frameloop={frameloop}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5.4], fov: 34 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 5]} intensity={2.3} color="#fff4e2" castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-5, -1, 3]} intensity={0.85} color="#9fb8d6" />
          <pointLight position={[2, 1.5, 4]} intensity={7} distance={12} decay={2} color="#fff6ea" />

          <group rotation={[tilt, -0.5, 0]}>
            <WatchModel3D watch={watch} live={live} />
          </group>

          <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={9} blur={2.6} far={4} resolution={512} color="#000000" />
          <Studio />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={interactive}
          enabled={interactive}
          autoRotate={autoRotate}
          autoRotateSpeed={0.9}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.82}
          minDistance={3.6}
          maxDistance={8}
          dampingFactor={0.08}
          rotateSpeed={0.7}
        />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}

export default WatchCanvas;
