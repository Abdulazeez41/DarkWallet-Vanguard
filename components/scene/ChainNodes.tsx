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
      ringRef.current.rotation.z += delta * (isSettled ? 2.5 : 0.4);
    }

    if (lightRef.current) {
      const pulse = isSettled
        ? 3.0 + Math.sin(state.clock.elapsedTime * 8) * 1.0
        : isSettling
        ? 1.5 + Math.sin(state.clock.elapsedTime * 6) * 0.5
        : 0.2;

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
        color={isSettled ? '#5EEAD4' : isSettling ? '#FBBF24' : '#1F2A37'}
        lineWidth={isSettled ? 2.5 : 1}
        transparent
        opacity={isSettled ? 0.9 : 0.35}
      />

      {/* Point Light on Settlement */}
      <pointLight
        ref={lightRef}
        color={isSettled ? '#5EEAD4' : chain.color}
        intensity={0.2}
        distance={4}
        decay={2}
      />

      {/* Outer Rotating Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.38, 0.42, 32]} />
        <meshBasicMaterial
          color={isSettled ? '#5EEAD4' : chain.color}
          transparent
          opacity={isSettled ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center Node Mesh */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={isSettled ? '#5EEAD4' : chain.color}
          emissive={isSettled ? '#14B8A6' : chain.color}
          emissiveIntensity={isSettled ? 1.8 : 0.4}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* HTML Metadata Label */}
      <Html position={[0.55, 0, 0]} center distanceFactor={12}>
        <div
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded border pointer-events-none select-none transition-all duration-300 ${
            isSettled
              ? 'bg-pass/20 border-pass text-pass shadow-glow-pass scale-105'
              : isSettling
              ? 'bg-warn/20 border-warn text-warn animate-pulse'
              : 'bg-panel/90 border-line text-mute'
          }`}
        >
          <span className="font-mono text-[9px] font-bold tracking-wider">
            {chain.symbol}
          </span>
          <span className="font-mono text-[8px] opacity-75">
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
