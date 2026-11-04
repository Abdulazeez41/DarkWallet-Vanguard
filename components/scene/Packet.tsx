'use client';

/**
 * components/scene/Packet.tsx
 *
 * Dynamic traveling cryptographic intent packet.
 * Renders an octahedron traversing the pipeline from user input -> Intel TDX -> policy gates -> settlement.
 * On policy block, instantly shatters into 60 high-velocity instanced crimson shards with gravity and decay.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVaultStore } from '@/lib/store';

const SHARD_COUNT = 60;

interface ShardData {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  rotVel: THREE.Vector3;
  scale: number;
}

export function Packet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const instancedShardsRef = useRef<THREE.InstancedMesh>(null);

  const packetX = useVaultStore((s) => s.packetX);
  const packetVisible = useVaultStore((s) => s.packetVisible);
  const packetShattered = useVaultStore((s) => s.packetShattered);
  const shatterOrigin = useVaultStore((s) => s.shatterOrigin);
  const stage = useVaultStore((s) => s.stage);

  // Initialize shards state once
  const shards = useMemo<ShardData[]>(() => {
    return Array.from({ length: SHARD_COUNT }, () => {
      // Random direction in sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 2.5 + Math.random() * 4.5;

      const vx = speed * Math.sin(phi) * Math.cos(theta);
      const vy = speed * Math.sin(phi) * Math.sin(theta);
      const vz = speed * Math.cos(phi) * 0.7; // slight flattening

      return {
        pos: new THREE.Vector3(0, 0, 0),
        vel: new THREE.Vector3(vx, vy, vz),
        rot: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ),
        scale: 0.8 + Math.random() * 0.6,
      };
    });
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const shatterInitialized = useRef(false);
  const shatterElapsed = useRef(0);

  useFrame((state, delta) => {
    // 1. Normal Intact Packet Motion
    if (packetVisible && !packetShattered && meshRef.current) {
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        packetX,
        0.18
      );
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 4) * 0.08;
      meshRef.current.rotation.x += delta * 2.2;
      meshRef.current.rotation.y += delta * 3.1;

      if (pointLightRef.current) {
        pointLightRef.current.position.copy(meshRef.current.position);
      }
    }

    // 2. Shatter Animation on Block
    if (packetShattered && instancedShardsRef.current) {
      if (!shatterInitialized.current && shatterOrigin) {
        shatterInitialized.current = true;
        shatterElapsed.current = 0;
        // Seed all shards at the exact block coordinates
        shards.forEach((s) => {
          s.pos.set(shatterOrigin[0], shatterOrigin[1], shatterOrigin[2]);
        });
      }

      shatterElapsed.current += delta;
      const progress = shatterElapsed.current;

      shards.forEach((s, i) => {
        // Physics update: velocity + gravity
        s.pos.addScaledVector(s.vel, delta);
        s.vel.y -= 7.0 * delta; // Gravity pulling shards downward
        s.vel.x *= 0.98; // Air drag
        s.vel.z *= 0.98;

        s.rot.x += s.rotVel.x * delta;
        s.rot.y += s.rotVel.y * delta;
        s.rot.z += s.rotVel.z * delta;

        // Scale decay after 0.4s
        const fade = Math.max(0, 1 - progress / 1.6);
        const currentScale = s.scale * fade;

        dummy.position.copy(s.pos);
        dummy.rotation.copy(s.rot);
        dummy.scale.set(currentScale, currentScale, currentScale);
        dummy.updateMatrix();

        instancedShardsRef.current?.setMatrixAt(i, dummy.matrix);
      });

      instancedShardsRef.current.instanceMatrix.needsUpdate = true;
    } else if (!packetShattered) {
      shatterInitialized.current = false;
      shatterElapsed.current = 0;
    }
  });

  const packetColor = stage === 'settled' ? '#00F5A0' : '#00F0FF';

  return (
    <group>
      {/* Intact Glowing Packet */}
      {packetVisible && !packetShattered && (
        <>
          <pointLight
            ref={pointLightRef}
            color={packetColor}
            intensity={4.0}
            distance={5.0}
            decay={2}
          />
          <mesh ref={meshRef} position={[packetX, 0, 0]}>
            <octahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial
              color={packetColor}
              emissive={packetColor}
              emissiveIntensity={2.5}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        </>
      )}

      {/* Instanced Shatter Shards */}
      {packetShattered && (
        <instancedMesh
          ref={instancedShardsRef}
          args={[undefined, undefined, SHARD_COUNT]}
        >
          <tetrahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial
            color="#FF3366"
            emissive="#FF1744"
            emissiveIntensity={3.2}
            roughness={0.2}
          />
        </instancedMesh>
      )}
    </group>
  );
}
