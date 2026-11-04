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
 *  - Vibrant neon lighting, cosmic starfield, and postprocessing Bloom
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
      {/* Central luminous laser track */}
      <mesh position={[(ORIGIN_INTENT_X + GATE_X_COORDS.nonce) / 2, 0, 0]}>
        <boxGeometry
          args={[GATE_X_COORDS.nonce - ORIGIN_INTENT_X, 0.02, 0.02]}
        />
        <meshBasicMaterial color="#C25E2E" transparent opacity={0.7} />
      </mesh>

      {/* Radiant floor grid */}
      <gridHelper
        args={[30, 30, '#C25E2E', '#3D332A']}
        position={[0, -1.8, 0]}
      />
    </group>
  );
}

export function VaultScene() {
  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#181512] overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 44 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#181512']} />

        <Suspense fallback={null}>
          <CameraRig />

          {/* Warm Architectural Lighting Rig */}
          <ambientLight intensity={0.95} color="#FDF8EE" />
          <directionalLight position={[5, 12, 6]} intensity={1.5} color="#FFF8E7" />
          <directionalLight position={[-6, -4, -3]} intensity={1.0} color="#C25E2E" />
          <pointLight position={[0, 4, 3]} intensity={1.5} color="#C25E2E" distance={15} />
          <pointLight position={[6, -2, 2]} intensity={1.4} color="#D97706" distance={14} />

          {/* Background Stars Field */}
          <Stars
            radius={45}
            depth={35}
            count={1800}
            factor={4}
            saturation={1}
            fade
            speed={0.8}
          />

          {/* Pipeline Elements */}
          <PipelineBackbone />
          <EnclaveCore />
          <PolicyGates />
          <Packet />
          <ChainNodes />

          {/* Radiant Bloom Effect */}
          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.55}
              luminanceSmoothing={0.5}
              intensity={1.2}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Subtle Corner Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(11,16,29,0.7)]" />
    </div>
  );
}
