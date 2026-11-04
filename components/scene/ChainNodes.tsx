'use client';

/**
 * components/scene/ChainNodes.tsx
 *
 * Multi-chain settlement rails at x = 7.5 fanning vertically across:
 *  - Bitcoin (BTC)
 *  - Ethereum (ETH)
 *  - Solana (SOL)
 *  - NEAR (NEAR Intents Solver Mesh)
 *
 * Emits glowing settlement rail lines from Gate 3 and flashes beacon light on execution.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { GATE_X_COORDS, CHAIN_NODES_X, useVaultStore } from '@/lib/store';

interface ChainDef {
  name: string;
  symbol: string;
  y: number;
  color: string;
}

const CHAINS: ChainDef[] = [
  { name: 'Bitcoin', symbol: 'BTC', y: 1.6, color: '#F7931A' },
  { name: 'Ethereum', symbol: 'ETH', y: 0.55, color: '#627EEA' },
  { name: 'Solana', symbol: 'SOL', y: -0.55, color: '#14F195' },
  { name: 'NEAR', symbol: 'NEAR', y: -1.6, color: '#00EC97' },
];

function SingleChainNode({ chain }: { chain: ChainDef }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const directive = useVaultStore((s) => s.directive);
  const stage = useVaultStore((s) => s.stage);

  const isTarget =
    directive?.destinationChain?.toLowerCase() === chain.name.toLowerCase() ||
    directive?.sourceChain?.toLowerCase() === chain.name.toLowerCase();
  const isSettled = isTarget && stage === 'settled';
  const isSettling = isTarget && stage === 'settling';

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (isSettled ? 2.8 : 0.45);
    }

    if (lightRef.current) {
      const pulse = isSettled
        ? 3.5 + Math.sin(state.clock.elapsedTime * 8) * 1.2
        : isSettling
        ? 1.8 + Math.sin(state.clock.elapsedTime * 6) * 0.6
        : 0.4;

      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        pulse,
        0.1
      );
    }
  });

  const gate3X = GATE_X_COORDS.nonce;

  return (
    <group position={[CHAIN_NODES_X, chain.y, 0]}>
      {/* Rail Line connecting Gate 3 (x=4.0, y=0) to this node (x=7.5, y=chain.y) */}
      <Line
        points={[
          [gate3X - CHAIN_NODES_X, -chain.y, 0],
          [0, 0, 0],
        ]}
        color={isSettled ? '#00F5A0' : isSettling ? '#FBBF24' : '#253450'}
        lineWidth={isSettled ? 3.0 : 1.2}
        transparent
        opacity={isSettled ? 1.0 : 0.5}
      />

      {/* Point Light on Settlement */}
      <pointLight
        ref={lightRef}
        color={isSettled ? '#00F5A0' : chain.color}
        intensity={0.6}
        distance={6}
        decay={2}
      />

      {/* Outer Rotating Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.38, 0.44, 32]} />
        <meshBasicMaterial
          color={isSettled ? '#00F5A0' : chain.color}
          transparent
          opacity={isSettled ? 1.0 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center Node Mesh */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshStandardMaterial
          color={isSettled ? '#00F5A0' : chain.color}
          emissive={isSettled ? '#059669' : chain.color}
          emissiveIntensity={isSettled ? 2.5 : 0.6}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* HTML Metadata Label */}
      <Html position={[0.55, 0, 0]} center distanceFactor={12}>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border pointer-events-none select-none transition-all duration-300 font-mono ${
            isSettled
              ? 'bg-pass/30 border-pass text-pass shadow-glow-pass scale-110 font-bold'
              : isSettling
              ? 'bg-warn/30 border-warn text-warn animate-pulse font-bold'
              : 'bg-panel/95 border-line text-white/90'
          }`}
        >
          <span className="text-[10px] font-black tracking-wider text-white">
            {chain.symbol}
          </span>
          <span className="text-[8px] font-semibold text-mute">
            {isSettled ? 'SETTLED' : chain.name}
          </span>
        </div>
      </Html>
    </group>
  );
}

export function ChainNodes() {
  return (
    <group>
      {CHAINS.map((chain) => (
        <SingleChainNode key={chain.symbol} chain={chain} />
      ))}
    </group>
  );
}
