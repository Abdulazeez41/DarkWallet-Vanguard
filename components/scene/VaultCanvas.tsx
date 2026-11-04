'use client';

/**
 * components/scene/VaultCanvas.tsx
 *
 * SSR-safe dynamic wrapper for the 3D Vault scene.
 * Automatically checks prefers-reduced-motion and WebGL capability,
 * gracefully falling back to Fallback2D when required.
 */

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Fallback2D } from '../Fallback2D';

const VaultScene = dynamic(
  () => import('./VaultScene').then((mod) => mod.VaultScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[460px] bg-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-line border-t-enclave animate-spin" />
          <span className="font-mono text-xs text-mute tracking-widest uppercase">
            INITIALIZING INTEL TDX 3D VAULT...
          </span>
        </div>
      </div>
    ),
  }
);

export function VaultCanvas() {
  const [useFallback, setUseFallback] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setUseFallback(true);
        return;
      }

      // Check WebGL availability
      try {
        const canvas = document.createElement('canvas');
        const gl =
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          setUseFallback(true);
        }
      } catch {
        setUseFallback(true);
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[460px] bg-void flex items-center justify-center">
        <span className="font-mono text-xs text-mute tracking-widest">
          LOADING VAULT...
        </span>
      </div>
    );
  }

  if (useFallback) {
    return <Fallback2D />;
  }

  return <VaultScene />;
}
