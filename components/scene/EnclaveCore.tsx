'use client';

/**
 * components/scene/EnclaveCore.tsx
 *
 * 3D representation of the Intel TDX hardware enclave.
 * Translucent frosted outer cube protecting a continuously rotating wireframe core,
 * pulsing in vivid electric blue when active.
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
      innerCoreRef.current.rotation.x += delta * 0.6;
      innerCoreRef.current.rotation.y += delta * 0.9;
    }

    if (outerBoxRef.current) {
      outerBoxRef.current.rotation.y += delta * 0.15;
    }

    if (pointLightRef.current) {
      const targetIntensity = isActive
        ? 3.5 + Math.sin(state.clock.elapsedTime * 6) * 1.5
        : 1.0 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
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
        color="#7C9CFF"
        intensity={1.2}
        distance={6}
        decay={2}
      />

      {/* Translucent Frosted Outer Box */}
      <mesh ref={outerBoxRef}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshPhysicalMaterial
          color="#141B26"
          roughness={0.2}
          transmission={0.65}
          thickness={0.8}
          transparent
          opacity={0.7}
          wireframe={false}
          emissive="#7C9CFF"
          emissiveIntensity={isActive ? 0.35 : 0.08}
        />
      </mesh>

      {/* Outer Wireframe Edge Box */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.5, 1.5, 1.5)]} />
        <lineBasicMaterial
          color={isActive ? '#7C9CFF' : '#3B82F6'}
          transparent
          opacity={isActive ? 0.9 : 0.4}
        />
      </lineSegments>

      {/* Rotating Inner Wireframe Icosahedron */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial
          color="#7C9CFF"
          wireframe
          emissive="#3B82F6"
          emissiveIntensity={isActive ? 0.8 : 0.25}
        />
      </mesh>

      {/* Ground Plane Shadow Disc */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* 3D In-Scene Badge Label */}
      <Html position={[0, -1.4, 0]} center distanceFactor={12}>
        <div className="flex flex-col items-center pointer-events-none select-none text-center">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#7C9CFF] font-semibold px-2 py-0.5 rounded bg-[#0E131B]/90 border border-[#7C9CFF]/30 whitespace-nowrap shadow-glow-enclave">
            INTEL TDX ENCLAVE
          </span>
          <span className="font-mono text-[8px] text-mute tracking-wider mt-0.5">
            {isActive ? 'MEMORY ISOLATION ACTIVE' : 'SEALED HARDWARE'}
          </span>
        </div>
      </Html>
    </group>
  );
}
