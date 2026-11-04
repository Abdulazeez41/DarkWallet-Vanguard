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
import * as THREE from 'three';
import { useVaultStore, ENCLAVE_CORE_X } from '@/lib/store';
import { InSceneBadge } from './SceneLabels';

export function EnclaveCore() {
  const outerBoxRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const elapsedRef = useRef(0);

  const stage = useVaultStore((s) => s.stage);
  const isActive = stage === 'sealing' || stage === 'enclave';

  useFrame((_state, delta) => {
    elapsedRef.current += delta;
    const time = elapsedRef.current;

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x += delta * 0.7;
      innerCoreRef.current.rotation.y += delta * 1.1;
    }

    if (outerBoxRef.current) {
      outerBoxRef.current.rotation.y += delta * 0.2;
    }

    if (pointLightRef.current) {
      const targetIntensity = isActive
        ? 5.0 + Math.sin(time * 6) * 2.0
        : 2.2 + Math.sin(time * 2) * 0.6;
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

      {/* High-Performance WebGL Canvas Sprite Badge (Zero DOM Roots) */}
      <InSceneBadge
        position={[0, -1.45, 0]}
        title="INTEL TDX ENCLAVE"
        subtitle={isActive ? 'MEMORY ISOLATION ACTIVE' : 'SEALED HARDWARE TEE'}
        color="#38BDF8"
        isPulsing={isActive}
        scale={[1.8, 0.48, 1]}
      />
    </group>
  );
}
