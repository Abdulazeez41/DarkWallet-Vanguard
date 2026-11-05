'use client';

/**
 * components/scene/CameraRig.tsx
 *
 * Responsive Parallax Camera Rig with:
 *  - Dynamic viewport auto-fit: guarantees 100% visibility of the entire pipeline
 *    (Intel TDX enclave at x=-4.5 to multi-chain rails at x=7.5) across any aspect ratio
 *  - Focal presets: 'all' (auto-fit entire pipeline), 'enclave', 'gates', 'chains'
 *  - Smooth dampened camera tracking & interpolated lookAt target
 *  - Decaying screen-shake on security gate block events
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVaultStore } from '@/lib/store';

export function CameraRig() {
  const shake = useVaultStore((s) => s.shake);
  const decayShake = useVaultStore((s) => s.decayShake);
  const cameraFocus = useVaultStore((s) => s.cameraFocus);

  const targetVec = useRef(new THREE.Vector3(1.0, 0, 12.0));
  const lookAtVec = useRef(new THREE.Vector3(1.0, 0, 0));
  const targetLookAt = useRef(new THREE.Vector3(1.0, 0, 0));

  useFrame((state, delta) => {
    const { pointer, camera, viewport } = state;

    // Decay shake amplitude
    if (shake > 0) {
      decayShake(delta);
    }

    const shakeOffsetX = (Math.random() - 0.5) * shake * 0.6;
    const shakeOffsetY = (Math.random() - 0.5) * shake * 0.6;
    const shakeOffsetZ = (Math.random() - 0.5) * shake * 0.2;

    const aspect = viewport.aspect;
    const fov = (camera as THREE.PerspectiveCamera).fov || 44;
    const fovRad = (fov * Math.PI) / 180;
    const tanHalfFov = Math.tan(fovRad / 2);

    let destX = 1.0;
    let destY = 0;
    let destZ = 12.0;

    switch (cameraFocus) {
      case 'enclave': {
        destX = -4.5 + pointer.x * 0.3;
        destY = pointer.y * 0.25;
        destZ = 7.2;
        targetLookAt.current.set(-4.5, 0, 0);
        break;
      }
      case 'gates': {
        destX = 1.5 + pointer.x * 0.35;
        destY = pointer.y * 0.25;
        destZ = 8.5;
        targetLookAt.current.set(1.5, 0, 0);
        break;
      }
      case 'chains': {
        destX = 7.5 + pointer.x * 0.3;
        destY = pointer.y * 0.25;
        destZ = 7.2;
        targetLookAt.current.set(7.5, 0, 0);
        break;
      }
      case 'all':
      default: {
        // Full pipeline spans from x = -6.5 (Enclave) to x = +8.8 (Chain Nodes + Badges) = ~16.5 units wide
        // Pipeline center is around x = 1.1
        const REQUIRED_WIDTH = 17.0;
        const REQUIRED_HEIGHT = 5.2;

        const fitZWidth = REQUIRED_WIDTH / (2 * tanHalfFov * Math.max(aspect, 0.45));
        const fitZHeight = REQUIRED_HEIGHT / (2 * tanHalfFov);
        const autoFitZ = Math.max(fitZWidth, fitZHeight);

        // Clamp between 8.5 (panoramic desktop) and 21.0 (narrow mobile)
        destZ = THREE.MathUtils.clamp(autoFitZ, 8.5, 21.0);
        destX = 1.1 + pointer.x * 0.5;
        destY = pointer.y * 0.35;
        targetLookAt.current.set(1.1, 0, 0);
        break;
      }
    }

    targetVec.current.set(
      destX + shakeOffsetX,
      destY + shakeOffsetY,
      destZ + shakeOffsetZ
    );

    // Smooth dampening towards target camera position & look-at vector
    camera.position.lerp(targetVec.current, 0.07);
    lookAtVec.current.lerp(targetLookAt.current, 0.08);
    camera.lookAt(lookAtVec.current);
  });

  return null;
}
