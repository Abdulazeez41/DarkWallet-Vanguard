'use client';

/**
 * components/scene/CameraRig.tsx
 *
 * Smooth parallax camera tracking cursor movements with decaying screen shake
 * on security gate block events.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVaultStore } from '@/lib/store';

export function CameraRig() {
  const shake = useVaultStore((s) => s.shake);
  const decayShake = useVaultStore((s) => s.decayShake);

  const targetVec = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const { pointer, camera } = state;

    // Base target: subtle parallax tracking pointer (-1 to +1)
    const targetX = pointer.x * 0.8;
    const targetY = pointer.y * 0.5;
    const targetZ = 8.5;

    // Decay shake amplitude
    if (shake > 0) {
      decayShake(delta);
    }

    // Apply shake offsets
    const shakeOffsetX = (Math.random() - 0.5) * shake * 0.6;
    const shakeOffsetY = (Math.random() - 0.5) * shake * 0.6;
    const shakeOffsetZ = (Math.random() - 0.5) * shake * 0.2;

    targetVec.current.set(
      targetX + shakeOffsetX,
      targetY + shakeOffsetY,
      targetZ + shakeOffsetZ
    );

    // Smooth dampening towards target camera position
    camera.position.lerp(targetVec.current, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
