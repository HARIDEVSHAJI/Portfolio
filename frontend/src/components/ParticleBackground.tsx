"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 2000 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Fixed deterministic pseudo-random for position based on index to avoid hydration mismatch if used in SSR
      // Although useMemo in client component is safe, let's keep it clean
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      if (Math.random() > 0.5) {
        colors[i3] = 0;
        colors[i3 + 1] = 0.96;
        colors[i3 + 2] = 1;
      } else {
        colors[i3] = 0.66;
        colors[i3 + 1] = 0.33;
        colors[i3 + 2] = 0.97;
      }
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.03;

    const { x, y } = state.pointer;
    mousePos.current.x += (x * 0.5 - mousePos.current.x) * 0.02;
    mousePos.current.y += (y * 0.5 - mousePos.current.y) * 0.02;
    mesh.current.rotation.x += mousePos.current.y * 0.1;
    mesh.current.rotation.y += mousePos.current.x * 0.1;
  });

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ pointerEvents: "auto" }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
