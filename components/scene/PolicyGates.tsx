'use client';

/**
 * components/scene/PolicyGates.tsx
 *
 * 3 glowing physical policy toruses positioned along the X-axis:
 *  - Gate 1: Spend Limit (x = -1.0)
 *  - Gate 2: Allowlist (x = 1.5)
 *  - Gate 3: Nonce Freshness (x = 4.0)
 *
 * Rings shift colors dynamically (luminous cyan idle -> solar gold checking -> mint pass / cyber crimson block)
 * and emit focused light on evaluation.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { GateId, GateStatus } from '@/lib/events';
import { GATE_X_COORDS, useVaultStore } from '@/lib/store';

interface GateConfig {
  id: GateId;
  x: number;
  label: string;
  sublabel: string;
}

const GATES_CONFIG: GateConfig[] = [
  {
    id: 'spend',
    x: GATE_X_COORDS.spend,
    label: 'GATE 01: SPEND LIMIT',
    sublabel: '$50.00 / TX · $200 CAP',
  },
  {
    id: 'allowlist',
    x: GATE_X_COORDS.allowlist,
    label: 'GATE 02: REPUTATION',
    sublabel: 'ALLOWLIST & HONEYPOT',
  },
  {
    id: 'nonce',
    x: GATE_X_COORDS.nonce,
    label: 'GATE 03: FRESH NONCE',
    sublabel: 'REPLAY DEFENSE',
  },
];

function SingleGate({ config }: { config: GateConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const status = useVaultStore((s) => s.gates[config.id]);
  const activeGateId = useVaultStore((s) => s.activeGateId);
  const isTarget = activeGateId === config.id;

  const colorMap: Record<GateStatus, { base: string; emissive: string; intensity: number }> = {
    idle: { base: '#38BDF8', emissive: '#0284C7', intensity: 0.45 },
    checking: { base: '#FBBF24', emissive: '#D97706', intensity: 2.8 },
    passed: { base: '#00F5A0', emissive: '#059669', intensity: 2.6 },
    failed: { base: '#FF3366', emissive: '#E11D48', intensity: 3.5 },
  };

  const currentTheme = colorMap[status];

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (status === 'checking') {
        meshRef.current.rotation.z += delta * 2.8;
      } else {
        meshRef.current.rotation.z += delta * 0.35;
      }
    }

    if (lightRef.current) {
      const pulse = status === 'checking'
        ? 2.5 + Math.sin(state.clock.elapsedTime * 10) * 1.2
        : status === 'failed'
        ? 3.8 + Math.sin(state.clock.elapsedTime * 14) * 0.8
        : status === 'passed'
        ? 2.2
        : 0.5;

      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        pulse,
        0.1
      );
    }
  });

  return (
    <group position={[config.x, 0, 0]}>
      {/* Dynamic Gate Point Light */}
      <pointLight
        ref={lightRef}
        color={currentTheme.base}
        intensity={currentTheme.intensity}
        distance={6}
        decay={2}
      />

      {/* Main Outer Ring Torus */}
      <mesh ref={meshRef} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.9, 0.05, 16, 64]} />
        <meshStandardMaterial
          color={currentTheme.base}
          emissive={currentTheme.emissive}
          emissiveIntensity={currentTheme.intensity}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Subtle Inner Glow Ring */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.78, 0.02, 16, 48]} />
        <meshBasicMaterial
          color={currentTheme.base}
          transparent
          opacity={status === 'idle' ? 0.4 : 0.9}
        />
      </mesh>

      {/* Ground Projection Ring */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.85, 32]} />
        <meshBasicMaterial
          color={currentTheme.base}
          transparent
          opacity={status === 'idle' ? 0.15 : 0.45}
        />
      </mesh>

      {/* HTML Metadata Label */}
      <Html position={[0, -1.45, 0]} center distanceFactor={12}>
        <div
          className={`flex flex-col items-center pointer-events-none select-none text-center transition-all duration-300 ${
            isTarget ? 'scale-110' : 'opacity-95'
          }`}
        >
          <div
            className={`font-mono text-[9px] uppercase tracking-wider font-black px-2.5 py-0.5 rounded-full border whitespace-nowrap transition-colors duration-300 ${
              status === 'failed'
                ? 'bg-block/30 border-block text-white shadow-glow-block'
                : status === 'passed'
                ? 'bg-pass/30 border-pass text-pass shadow-glow-pass'
                : status === 'checking'
                ? 'bg-warn/30 border-warn text-warn shadow-glow-warn animate-pulse'
                : 'bg-panel/95 border-enclave/40 text-enclave shadow-glow-enclave'
            }`}
          >
            {config.label}
          </div>
          <span className="font-mono text-[8px] text-white/90 font-bold tracking-tight mt-0.5 whitespace-nowrap drop-shadow">
            {config.sublabel}
          </span>
        </div>
      </Html>
    </group>
  );
}

export function PolicyGates() {
  return (
    <group>
      {GATES_CONFIG.map((config) => (
        <SingleGate key={config.id} config={config} />
      ))}
    </group>
  );
}
