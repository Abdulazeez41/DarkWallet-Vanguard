'use client';

/**
 * components/treasury/LiveShieldMonitor.tsx
 *
 * Section 3: Sleek "Live Shield Monitor & Activity".
 *
 * Combines the 3D WebGL Vault Canvas with a tabbed real-time activity center:
 *  - 3D WebGL Hardware Enclave & Gate Visualizer
 *  - Live Telemetry Stream (Terminal)
 *  - Cryptographic Settlement Receipt & Proofs
 *  - Interactive Attack Simulator (Financial Cyber-Range)
 *  - Large, highly legible typography and warm creamy card styling
 */

import { useState } from 'react';
import { VaultCanvas } from '@/components/scene/VaultCanvas';
import { Terminal } from '@/components/hud/Terminal';
import { Gauntlet } from '@/components/hud/Gauntlet';
import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';
import { CryptoChainIcon } from '@/components/icons/CryptoLogos';

export function LiveShieldMonitor() {
  const [activeSubTab, setActiveSubTab] = useState<'terminal' | 'simulator' | 'receipt'>('terminal');

  const stage = useVaultStore((s) => s.stage);
  const gates = useVaultStore((s) => s.gates);
  const policy = useVaultStore((s) => s.policy);
  const setProofModalOpen = useVaultStore((s) => s.setProofModalOpen);
  const setReceiptVisible = useVaultStore((s) => s.setReceiptVisible);
  const settlement = useVaultStore((s) => s.settlement);
  const directive = useVaultStore((s) => s.directive);
  const gateReason = useVaultStore((s) => s.gateReason);

  const isBlocked = stage === 'blocked' || Boolean(gateReason);

  const getGateBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-pass border-pass/60 bg-pass/10 font-bold';
      case 'block':
        return 'text-block border-block/60 bg-block/10 font-bold animate-pulse';
      case 'active':
        return 'text-warn border-warn/60 bg-warn/10 font-bold animate-pulse';
      default:
        return 'text-mute border-line bg-panel2 font-semibold';
    }
  };

  return (
    <div className="w-full bg-panel rounded-2xl border border-line p-6 sm:p-8 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-sm sm:text-base font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pass animate-pulse" />
              LIVE SHIELD MONITOR & ACTIVITY
            </span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-pass/10 text-pass border border-pass/30 font-bold uppercase">
              REAL-TIME PIPELINE
            </span>
          </div>
          <p className="font-mono text-xs sm:text-sm text-mute">
            Live 3D telemetry of Intel TDX enclave inference, policy gate evaluation, and multi-chain settlement.
          </p>
        </div>

        {/* Tab Switcher for Right Panel */}
        <div className="flex items-center gap-1.5 p-1.5 bg-panel2 rounded-xl border border-line">
          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              setActiveSubTab('terminal');
            }}
            className={`font-mono text-xs sm:text-sm font-bold px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'terminal'
                ? 'bg-ink text-white shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            Live Logs
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              setActiveSubTab('simulator');
            }}
            className={`font-mono text-xs sm:text-sm font-bold px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'simulator'
                ? 'bg-block text-white shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            Attack Simulator
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              setActiveSubTab('receipt');
            }}
            className={`font-mono text-xs sm:text-sm font-bold px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'receipt'
                ? 'bg-pass text-white shadow-sm'
                : 'text-mute hover:text-ink'
            }`}
          >
            Receipt
          </button>
        </div>
      </div>

      {/* Main Grid: Left 3D Viewport / Right Tabbed Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: 3D Live Shield Monitor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3.5">
          <div className="relative w-full h-[400px] sm:h-[440px] rounded-2xl border border-line bg-[#181512] overflow-hidden shadow-inner">
            <VaultCanvas />

            {/* In-Scene Top Overlay */}
            <div className="absolute top-4 left-4 pointer-events-none z-10 flex items-center gap-2">
              <div className="bg-[#181512]/90 backdrop-blur-md border border-[#3D332A] rounded-xl px-3 py-1.5 font-mono text-xs text-white font-bold flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-enclave" />
                <span>INTEL TDX ENCLAVE CORE</span>
              </div>
            </div>

            {/* In-Scene Status Pill */}
            <div className="absolute top-4 right-4 pointer-events-none z-10 flex items-center gap-2">
              <div className="bg-[#181512]/90 backdrop-blur-md border border-[#3D332A] rounded-full px-3.5 py-1.5 flex items-center gap-2 font-mono text-xs text-white font-bold shadow-sm">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    stage === 'blocked'
                      ? 'bg-block animate-pulse'
                      : stage === 'settled'
                        ? 'bg-pass'
                        : stage === 'idle'
                          ? 'bg-enclave'
                          : 'bg-warn animate-pulse'
                  }`}
                />
                <span className="uppercase">STATUS: {stage}</span>
              </div>
            </div>

            {/* In-Scene Bottom Attestation Link */}
            <div className="absolute bottom-4 right-4 z-10">
              <button
                type="button"
                onClick={() => {
                  soundFx.playStepTick();
                  setProofModalOpen(true);
                }}
                className="bg-[#181512]/90 backdrop-blur-md border border-[#3D332A] hover:border-enclave rounded-xl px-3.5 py-2 font-mono text-xs text-enclave font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>INSPECT TDX ATTESTATION</span>
                <span>↗</span>
              </button>
            </div>
          </div>

          {/* Policy Gates Status Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-panel2 border border-line font-mono text-center">
              <div className="text-xs text-mute font-medium mb-1">GATE 1: SPEND CAP</div>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded border uppercase inline-block ${getGateBadge(
                  gates.spend
                )}`}
              >
                {gates.spend.toUpperCase()} (${policy.maxUsdPerTx})
              </span>
            </div>

            <div className="p-3 rounded-xl bg-panel2 border border-line font-mono text-center">
              <div className="text-xs text-mute font-medium mb-1">GATE 2: WHITELIST</div>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded border uppercase inline-block ${getGateBadge(
                  gates.allowlist
                )}`}
              >
                {gates.allowlist.toUpperCase()} ({policy.chainWhitelist.length} CHAINS)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-panel2 border border-line font-mono text-center">
              <div className="text-xs text-mute font-medium mb-1">GATE 3: REPLAY NONCE</div>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded border uppercase inline-block ${getGateBadge(
                  gates.nonce
                )}`}
              >
                {gates.nonce.toUpperCase()} (ANTI-REPLAY)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Activity View (5 cols) */}
        <div className="lg:col-span-5 flex flex-col min-h-[440px]">
          {activeSubTab === 'terminal' && (
            <div className="flex-1 flex flex-col">
              <Terminal />
            </div>
          )}

          {activeSubTab === 'simulator' && (
            <div className="flex-1 flex flex-col">
              <Gauntlet />
            </div>
          )}

          {activeSubTab === 'receipt' && (
            <div className="flex-1 flex flex-col bg-void rounded-2xl border border-line p-6 font-mono text-sm text-ink justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                  <span className="font-bold text-base flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isBlocked ? 'bg-block' : 'bg-pass'
                      }`}
                    />
                    {isBlocked ? 'SECURITY INTERCEPTION RECEIPT' : 'VERIFIED SETTLEMENT RECEIPT'}
                  </span>
                  <span className="text-xs text-mute font-mono uppercase">
                    {settlement ? 'SETTLED' : stage === 'blocked' ? 'BLOCKED' : 'READY'}
                  </span>
                </div>

                {settlement || directive ? (
                  <div className="space-y-3.5 text-mute">
                    <div className="p-4 rounded-xl bg-panel border border-line space-y-1.5 shadow-sm">
                      <div className="text-ink font-bold flex items-center gap-2 text-sm">
                        <CryptoChainIcon chain={settlement?.destinationChain || directive?.destinationChain || 'NEAR'} size={18} />
                        <span>Route: {directive?.sourceChain || 'Multi-Chain'} → {directive?.destinationChain || 'NEAR'}</span>
                      </div>
                      <div className="text-xs sm:text-sm">
                        Amount: <span className="text-ink font-bold">${directive?.amountUsd || settlement?.amountUsd || 25}.00</span>
                      </div>
                      <div className="text-xs truncate">
                        Recipient: <span className="text-ink font-mono">{directive?.destinationAddress || '0x4a12...9f3b'}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-panel border border-line space-y-1.5 text-xs sm:text-sm shadow-sm">
                      <div className="flex items-center justify-between">
                        <span>Attestation:</span>
                        <span className="text-pass font-bold">Intel TDX Verified</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Intent Hash:</span>
                        <span className="text-ink font-mono truncate max-w-[200px]">
                          {settlement?.intentHash || '0x7e4b9c1d...'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <span className={isBlocked ? 'text-block font-bold' : 'text-pass font-bold'}>
                          {isBlocked ? 'BLOCKED AT POLICY GATE' : 'SETTLED ON NEAR'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-56 flex flex-col items-center justify-center text-center text-mute space-y-2.5">
                    <div className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-sm bg-panel">
                      📋
                    </div>
                    <p className="text-sm font-bold text-ink">No active receipt yet.</p>
                    <p className="text-xs text-mute max-w-xs">
                      Execute an intent or launch an attack in the simulator to generate a verified proof receipt.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-line flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playStepTick();
                    setReceiptVisible(true);
                  }}
                  className="font-mono text-xs sm:text-sm font-bold text-enclave hover:underline"
                >
                  Pop-out Paper Receipt ↗
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playStepTick();
                    setProofModalOpen(true);
                  }}
                  className="font-mono text-xs sm:text-sm font-bold text-ink hover:text-enclave"
                >
                  View Intel TDX Quote →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
