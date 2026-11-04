'use client';

/**
 * components/scene/EnclaveCore.tsx
 *
 * 3D representation of the Intel TDX hardware enclave.
 * Translucent frosted outer cube protecting a continuously rotating wireframe core,
 * pulsing in vivid electric cyan and neon sky blue when active.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useVaultStore, ENCLAVE_CORE_X } from '@/lib/store';

export function EnclaveCore() {
  const outerBoxRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  const stage = useVaultStore((s) => s.stage);
  const isActive = stage === 'sealing' || stage === 'enclave';

  useFrame((state, delta) => {
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x += delta * 0.7;
      innerCoreRef.current.rotation.y += delta * 1.1;
    }

    if (outerBoxRef.current) {
      outerBoxRef.current.rotation.y += delta * 0.2;
    }

    if (pointLightRef.current) {
      const targetIntensity = isActive
        ? 5.0 + Math.sin(state.clock.elapsedTime * 6) * 2.0
        : 2.2 + Math.sin(state.clock.elapsedTime * 2) * 0.6;
      pointLightRef.current.intensity = THREE.MathUtils.lerp(
        pointLightRef.current.intensity,
        targetIntensity,
        0.1
      );
    }
  });

  return (
    <group position={[ENCLAVE_CORE_X, 0, 0]}>
      {/* Dynamic Enclave Point Light */}
      <pointLight
        ref={pointLightRef}
        color="#38BDF8"
        intensity={2.2}
        distance={8}
        decay={2}
      />

      {/* Translucent Frosted Outer Box */}
      <mesh ref={outerBoxRef}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshPhysicalMaterial
          color="#1A243D"
          roughness={0.15}
          transmission={0.7}
          thickness={0.9}
          transparent
          opacity={0.8}
          wireframe={false}
          emissive="#38BDF8"
          emissiveIntensity={isActive ? 0.6 : 0.2}
        />
      </mesh>

      {/* Outer Wireframe Edge Box */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.5, 1.5, 1.5)]} />
        <lineBasicMaterial
          color={isActive ? '#00F0FF' : '#38BDF8'}
          transparent
          opacity={isActive ? 1.0 : 0.6}
        />
      </lineSegments>

      {/* Rotating Inner Wireframe Icosahedron */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial
          color="#00F0FF"
          wireframe
          emissive="#38BDF8"
          emissiveIntensity={isActive ? 1.5 : 0.6}
        />
      </mesh>

      {/* Ground Plane Shadow Disc */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* 3D In-Scene Badge Label */}
      <Html position={[0, -1.4, 0]} center distanceFactor={12}>
        <div className="flex flex-col items-center pointer-events-none select-none text-center">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#38BDF8] font-black px-2.5 py-0.5 rounded-full bg-[#121A2D]/95 border border-[#38BDF8] whitespace-nowrap shadow-glow-cyan">
            INTEL TDX ENCLAVE
          </span>
          <span className="font-mono text-[8px] text-white/90 font-bold tracking-wider mt-0.5 drop-shadow">
            {isActive ? 'MEMORY ISOLATION ACTIVE' : 'SEALED HARDWARE TEE'}
          </span>
        </div>
      </Html>
    </group>
  );
}
