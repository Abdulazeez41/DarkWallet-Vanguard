'use client';

/**
 * components/scene/VaultScene.tsx
 *
 * Full 3D WebGL cyber-range Canvas rendering:
 *  - EnclaveCore (Intel TDX hardware enclave)
 *  - PolicyGates (3 physical security toruses)
 *  - Packet (traveling intent packet & 60-shard shatter)
 *  - ChainNodes (multi-chain settlement targets)
 *  - CameraRig (parallax cursor + decaying camera shake)
 *  - Postprocessing Bloom & cosmic background
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { CameraRig } from './CameraRig';
import { EnclaveCore } from './EnclaveCore';
import { PolicyGates } from './PolicyGates';
import { Packet } from './Packet';
import { ChainNodes } from './ChainNodes';
import { ORIGIN_INTENT_X, GATE_X_COORDS } from '@/lib/store';

function PipelineBackbone() {
  return (
    <group>
      {/* Central horizontal laser track */}
      <mesh position={[(ORIGIN_INTENT_X + GATE_X_COORDS.nonce) / 2, 0, 0]}>
        <boxGeometry
          args={[GATE_X_COORDS.nonce - ORIGIN_INTENT_X, 0.015, 0.015]}
        />
        <meshBasicMaterial color="#1F2A37" transparent opacity={0.6} />
      </mesh>

      {/* Subtle floor grid */}
      <gridHelper
        args={[30, 30, '#141B26', '#0E131B']}
        position={[0, -1.8, 0]}
      />
    </group>
  );
}

export function VaultScene() {
  return (
    <div className="relative w-full h-full min-h-[460px] bg-void overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 44 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#07090D']} />

        <Suspense fallback={null}>
          <CameraRig />

          {/* Lighting Rig */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={0.6} color="#E6EDF3" />
          <directionalLight position={[-5, -5, -2]} intensity={0.3} color="#7C9CFF" />

          {/* Background Stars Field */}
          <Stars
            radius={40}
            depth={30}
            count={1400}
            factor={3}
            saturation={0}
            fade
            speed={0.6}
          />

          {/* Pipeline Elements */}
          <PipelineBackbone />
          <EnclaveCore />
          <PolicyGates />
          <Packet />
          <ChainNodes />

          {/* Subtle Bloom Effect */}
          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.65}
              luminanceSmoothing={0.4}
              intensity={0.8}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Subtle Corner Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(7,9,13,0.85)]" />
    </div>
  );
}
