'use client';

/**
 * components/Fallback2D.tsx
 *
 * 2D SVG/HTML fallback for devices with prefers-reduced-motion or unsupported WebGL.
 * Fully synchronized with the Zustand vault store.
 */

import { useVaultStore } from '@/lib/store';
import { CryptoChainIcon } from '@/components/icons/CryptoLogos';

export function Fallback2D() {
  const stage = useVaultStore((s) => s.stage);
  const gates = useVaultStore((s) => s.gates);
  const activeGateId = useVaultStore((s) => s.activeGateId);
  const packetShattered = useVaultStore((s) => s.packetShattered);
  const directive = useVaultStore((s) => s.directive);

  const isEnclaveActive = stage === 'sealing' || stage === 'enclave';

  return (
    <div className="w-full h-full min-h-[380px] bg-void border border-line rounded-lg p-6 flex flex-col justify-between select-none">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs font-mono text-mute border-b border-line pb-3">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-enclave animate-pulse" />
          2D PIPELINE MONITOR (ACCESSIBILITY / REDUCED-MOTION MODE)
        </span>
        <span className="uppercase text-ink font-semibold">STAGE: {stage}</span>
      </div>

      {/* Pipeline Diagram */}
      <div className="py-8 flex items-center justify-between gap-3 overflow-x-auto">
        {/* Step 1: Input Intent */}
        <div className="flex flex-col items-center min-w-[110px] text-center">
          <div className="w-12 h-12 rounded border border-line bg-panel flex items-center justify-center font-mono text-xs font-bold text-ink">
            IN
          </div>
          <span className="font-mono text-[10px] text-mute mt-2">USER INTENT</span>
        </div>

        <div className="flex-1 h-[2px] bg-line min-w-[20px]" />

        {/* Step 2: Intel TDX Enclave */}
        <div className="flex flex-col items-center min-w-[130px] text-center">
          <div
            className={`w-16 h-16 rounded border flex flex-col items-center justify-center font-mono text-xs transition-colors duration-300 ${
              isEnclaveActive
                ? 'border-enclave bg-enclave/10 text-enclave shadow-glow-enclave'
                : 'border-line bg-panel text-ink'
            }`}
          >
            <span className="font-bold">TDX</span>
            <span className="text-[9px] opacity-75">ENCLAVE</span>
          </div>
          <span className="font-mono text-[10px] text-enclave mt-2">
            HARDWARE TEE
          </span>
        </div>

        <div className="flex-1 h-[2px] bg-line min-w-[20px]" />

        {/* Step 3: Gate 1 - Spend Limit */}
        <div className="flex flex-col items-center min-w-[110px] text-center">
          <div
            className={`w-12 h-12 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-colors duration-300 ${
              gates.spend === 'passed'
                ? 'border-pass bg-pass/10 text-pass shadow-glow-pass'
                : gates.spend === 'failed'
                ? 'border-block bg-block/10 text-block shadow-glow-block'
                : gates.spend === 'checking'
                ? 'border-warn bg-warn/10 text-warn animate-pulse'
                : 'border-line bg-panel text-mute'
            }`}
          >
            G1
          </div>
          <span className="font-mono text-[9px] text-mute mt-2">SPEND LIMIT</span>
          <span className="font-mono text-[8px] text-ink">$50 CAP</span>
        </div>

        <div className="flex-1 h-[2px] bg-line min-w-[20px]" />

        {/* Step 4: Gate 2 - Allowlist */}
        <div className="flex flex-col items-center min-w-[110px] text-center">
          <div
            className={`w-12 h-12 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-colors duration-300 ${
              gates.allowlist === 'passed'
                ? 'border-pass bg-pass/10 text-pass shadow-glow-pass'
                : gates.allowlist === 'failed'
                ? 'border-block bg-block/10 text-block shadow-glow-block'
                : gates.allowlist === 'checking'
                ? 'border-warn bg-warn/10 text-warn animate-pulse'
                : 'border-line bg-panel text-mute'
            }`}
          >
            G2
          </div>
          <span className="font-mono text-[9px] text-mute mt-2">ALLOWLIST</span>
          <span className="font-mono text-[8px] text-ink">REPUTATION</span>
        </div>

        <div className="flex-1 h-[2px] bg-line min-w-[20px]" />

        {/* Step 5: Gate 3 - Nonce */}
        <div className="flex flex-col items-center min-w-[110px] text-center">
          <div
            className={`w-12 h-12 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-colors duration-300 ${
              gates.nonce === 'passed'
                ? 'border-pass bg-pass/10 text-pass shadow-glow-pass'
                : gates.nonce === 'failed'
                ? 'border-block bg-block/10 text-block shadow-glow-block'
                : gates.nonce === 'checking'
                ? 'border-warn bg-warn/10 text-warn animate-pulse'
                : 'border-line bg-panel text-mute'
            }`}
          >
            G3
          </div>
          <span className="font-mono text-[9px] text-mute mt-2">FRESH NONCE</span>
          <span className="font-mono text-[8px] text-ink">REPLAY SHIELD</span>
        </div>

        <div className="flex-1 h-[2px] bg-line min-w-[20px]" />

        {/* Step 6: Settlement Rails */}
        <div className="flex flex-col items-center min-w-[120px] text-center">
          <div
            className={`w-14 h-14 rounded-lg border flex flex-col items-center justify-center font-mono text-xs transition-colors duration-300 gap-1 ${
              stage === 'settled'
                ? 'border-pass bg-pass/10 text-pass shadow-glow-pass'
                : stage === 'settling'
                ? 'border-warn bg-warn/10 text-warn animate-pulse'
                : 'border-line bg-panel text-mute'
            }`}
          >
            <CryptoChainIcon chain={directive?.destinationChain || 'NEAR'} size={20} />
            <span className="text-[8px] font-bold">{directive?.destinationChain || 'NEAR'}</span>
          </div>
          <span className="font-mono text-[9px] text-mute mt-2">NEAR INTENTS</span>
        </div>
      </div>

      {/* Status Footer Banner */}
      <div className="border-t border-line pt-3 flex items-center justify-between font-mono text-xs">
        {packetShattered ? (
          <span className="text-block font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-block" />
            ATTACK SHATTERED AT GATE [{activeGateId?.toUpperCase()}]
          </span>
        ) : stage === 'settled' ? (
          <span className="text-pass font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pass" />
            INTENT SETTLED VIA NEAR CHAIN SIGNATURES
          </span>
        ) : (
          <span className="text-mute flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-line" />
            READY FOR INTENT SUBMISSION
          </span>
        )}
      </div>
    </div>
  );
}
