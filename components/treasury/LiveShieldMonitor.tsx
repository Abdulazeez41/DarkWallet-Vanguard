'use client';

/**
 * components/treasury/LiveShieldMonitor.tsx
 *
 * Section 3: Sleek "Live Shield Monitor & Activity".
 *
 * Features:
 *  - Warm Oreo brownish ash & cream aesthetic
 *  - Soft, friendly rounded shapes (rounded-3xl cards, rounded-full tabs)
 *  - Framed obsidian/cocoa 3D vault viewport with warm lighting
 *  - Tabbed real-time activity center (Logs, Simulator, Receipt)
 */

import { useState } from 'react';
import { VaultCanvas } from '@/components/scene/VaultCanvas';
import { Terminal } from '@/components/hud/Terminal';
import { Gauntlet } from '@/components/hud/Gauntlet';
import { DeveloperSdkTab } from '@/components/hud/DeveloperSdkTab';
import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';
import { CryptoChainIcon } from '@/components/icons/CryptoLogos';

export function LiveShieldMonitor() {
  const [activeSubTab, setActiveSubTab] = useState<'terminal' | 'simulator' | 'receipt' | 'sdk'>('terminal');

  const stage = useVaultStore((s) => s.stage);
  const gates = useVaultStore((s) => s.gates);
  const policy = useVaultStore((s) => s.policy);
  const setProofModalOpen = useVaultStore((s) => s.setProofModalOpen);
  const setMpcModalOpen = useVaultStore((s) => s.setMpcModalOpen);
  const setReceiptVisible = useVaultStore((s) => s.setReceiptVisible);
  const settlement = useVaultStore((s) => s.settlement);
  const directive = useVaultStore((s) => s.directive);
  const gateReason = useVaultStore((s) => s.gateReason);
  const cameraFocus = useVaultStore((s) => s.cameraFocus);
  const setCameraFocus = useVaultStore((s) => s.setCameraFocus);
  const isStageExpanded = useVaultStore((s) => s.isStageExpanded);
  const toggleStageExpanded = useVaultStore((s) => s.toggleStageExpanded);

  const isBlocked = stage === 'blocked' || Boolean(gateReason);

  const getGateBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-pass border-pass/40 bg-pass/10 font-bold';
      case 'block':
        return 'text-block border-block/40 bg-block/10 font-bold animate-pulse';
      case 'active':
        return 'text-warn border-warn/40 bg-warn/10 font-bold animate-pulse';
      default:
        return 'text-mute border-line bg-panel font-medium';
    }
  };

  return (
    <div className="w-full bg-panel rounded-3xl border border-line p-6 sm:p-8 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs sm:text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pass" />
              LIVE SHIELD MONITOR & ACTIVITY
            </span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-panel2 text-mute border border-line font-medium">
              Real-Time Pipeline
            </span>
          </div>
          <p className="font-mono text-xs sm:text-sm text-mute">
            Live 3D telemetry of Intel TDX enclave inference, policy gate evaluation, and multi-chain settlement.
          </p>
        </div>

        {/* Tab Switcher for Right Panel & Panoramic Expand */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              toggleStageExpanded();
            }}
            className="font-mono text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full border border-line bg-panel2 hover:border-ink/40 text-ink transition-all flex items-center gap-1.5 shadow-xs"
            title={isStageExpanded ? "Switch to Split View" : "Expand 3D Stage Full Width"}
          >
            <span>{isStageExpanded ? "⇲ Split View" : "⛶ Panoramic"}</span>
          </button>

          <div className="flex items-center gap-1.5 p-1 bg-panel2 rounded-full border border-line">
            <button
              type="button"
              onClick={() => {
                soundFx.playStepTick();
                setActiveSubTab('terminal');
              }}
              className={`font-mono text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full transition-all ${
                activeSubTab === 'terminal'
                  ? 'bg-ink text-void shadow-xs font-semibold'
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
              className={`font-mono text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full transition-all ${
                activeSubTab === 'simulator'
                  ? 'bg-block text-white shadow-xs font-semibold'
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
              className={`font-mono text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full transition-all ${
                activeSubTab === 'receipt'
                  ? 'bg-pass text-white shadow-xs font-semibold'
                  : 'text-mute hover:text-ink'
              }`}
            >
              Receipt
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playStepTick();
                setActiveSubTab('sdk');
              }}
              className={`font-mono text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeSubTab === 'sdk'
                  ? 'bg-enclave text-white shadow-xs font-semibold'
                  : 'text-mute hover:text-ink'
              }`}
            >
              <span>Developer SDK</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-enclave/20 text-enclave border border-enclave/40 font-bold uppercase">SDK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 3D Viewport / Right Tabbed Activity */}
      <div className={`grid grid-cols-1 ${isStageExpanded ? 'lg:grid-cols-12 gap-8' : 'lg:grid-cols-12 gap-6'} items-stretch`}>
        {/* 3D Live Shield Monitor Column */}
        <div className={`${isStageExpanded ? 'lg:col-span-12' : 'lg:col-span-7 xl:col-span-8'} flex flex-col space-y-3.5`}>
          <div
            className={`relative w-full rounded-3xl border border-line bg-[#141110] overflow-hidden shadow-inner transition-all duration-300 ${
              isStageExpanded
                ? 'h-[520px] sm:h-[580px] lg:h-[620px]'
                : 'h-[460px] sm:h-[500px] lg:h-[540px]'
            }`}
          >
            <VaultCanvas />

            {/* In-Scene Top Left: Enclave Status Pill */}
            <div className="absolute top-4 left-4 pointer-events-none z-10 flex items-center gap-2">
              <div className="bg-[#141110]/90 backdrop-blur-md border border-[#2E2521] rounded-full px-3.5 py-1.5 font-mono text-xs text-white font-medium flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-enclave animate-pulse" />
                <span>Intel TDX Enclave</span>
              </div>
            </div>

            {/* In-Scene Top Right: Security Pipeline Status */}
            <div className="absolute top-4 right-4 pointer-events-none z-10 flex items-center gap-2">
              <div className="bg-[#141110]/90 backdrop-blur-md border border-[#2E2521] rounded-full px-3.5 py-1.5 flex items-center gap-2 font-mono text-xs text-white font-medium shadow-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    stage === 'blocked'
                      ? 'bg-block'
                      : stage === 'settled'
                        ? 'bg-pass'
                        : stage === 'idle'
                          ? 'bg-enclave'
                          : 'bg-warn animate-pulse'
                  }`}
                />
                <span className="uppercase">{stage}</span>
              </div>
            </div>

            {/* In-Scene Bottom Left: Interactive Camera Focal Presets */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 bg-[#141110]/90 backdrop-blur-md border border-[#2E2521] rounded-full p-1 shadow-md">
              <button
                type="button"
                onClick={() => {
                  soundFx.playStepTick();
                  setCameraFocus('all');
                }}
                className={`font-mono text-[11px] px-3 py-1 rounded-full transition-all ${
                  cameraFocus === 'all'
                    ? 'bg-ink text-void font-bold shadow-xs'
                    : 'text-mute hover:text-white'
                }`}
                title="Fit full pipeline (Enclave, Gates, Multi-Chain settlement rails)"
              >
                👁️ Full View
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playStepTick();
                  setCameraFocus('enclave');
                }}
                className={`font-mono text-[11px] px-3 py-1 rounded-full transition-all ${
                  cameraFocus === 'enclave'
                    ? 'bg-enclave text-white font-bold shadow-xs'
                    : 'text-mute hover:text-white'
                }`}
                title="Zoom into Intel TDX Hardware Enclave"
              >
                🛡️ Enclave
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playStepTick();
                  setCameraFocus('gates');
                }}
                className={`font-mono text-[11px] px-3 py-1 rounded-full transition-all ${
                  cameraFocus === 'gates'
                    ? 'bg-warn text-white font-bold shadow-xs'
                    : 'text-mute hover:text-white'
                }`}
                title="Zoom into 3 Policy Evaluation Gates"
              >
                ⚡ Gates
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playStepTick();
                  setCameraFocus('chains');
                }}
                className={`font-mono text-[11px] px-3 py-1 rounded-full transition-all ${
                  cameraFocus === 'chains'
                    ? 'bg-pass text-white font-bold shadow-xs'
                    : 'text-mute hover:text-white'
                }`}
                title="Zoom into Multi-Chain Settlement Rails (BTC, ETH, SOL, NEAR)"
              >
                🌐 Chains
              </button>
            </div>

            {/* In-Scene Bottom Right: Attestation & MPC Keys Links */}
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.playStepTick();
                  setMpcModalOpen(true);
                }}
                className="bg-[#141110]/90 backdrop-blur-md border border-[#2E2521] hover:border-enclave rounded-full px-3.5 py-1.5 font-mono text-xs text-white hover:text-enclave font-medium shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                title="Inspect NEAR Chain Signatures MPC Derivation"
              >
                <span>NEAR MPC Keys</span>
                <span>↗</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playStepTick();
                  setProofModalOpen(true);
                }}
                className="bg-[#141110]/90 backdrop-blur-md border border-[#2E2521] hover:border-enclave rounded-full px-3.5 py-1.5 font-mono text-xs text-enclave font-medium shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>Inspect Attestation</span>
                <span>↗</span>
              </button>
            </div>
          </div>

          {/* Policy Gates Status Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-panel2 border border-line font-mono text-center">
              <div className="text-xs text-mute font-medium mb-1">Gate 1: Spend Cap</div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase inline-block ${getGateBadge(
                  gates.spend
                )}`}
              >
                {gates.spend.toUpperCase()} (${policy.maxUsdPerTx})
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-panel2 border border-line font-mono text-center">
              <div className="text-xs text-mute font-medium mb-1">Gate 2: Whitelist</div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase inline-block ${getGateBadge(
                  gates.allowlist
                )}`}
              >
                {gates.allowlist.toUpperCase()} ({policy.chainWhitelist.length} CHAINS)
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-panel2 border border-line font-mono text-center">
              <div className="text-xs text-mute font-medium mb-1">Gate 3: Anti-Replay</div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase inline-block ${getGateBadge(
                  gates.nonce
                )}`}
              >
                {gates.nonce.toUpperCase()} (NONCE)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Activity View */}
        <div className={`${isStageExpanded ? 'lg:col-span-12' : 'lg:col-span-5 xl:col-span-4'} flex flex-col min-h-[440px]`}>
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
            <div className="flex-1 flex flex-col bg-panel2 rounded-3xl border border-line p-6 font-mono text-sm text-ink justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                  <span className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isBlocked ? 'bg-block' : 'bg-pass'
                      }`}
                    />
                    {isBlocked ? 'Interception Receipt' : 'Settlement Receipt'}
                  </span>
                  <span className="text-xs text-mute font-mono uppercase">
                    {settlement ? 'SETTLED' : stage === 'blocked' ? 'BLOCKED' : 'READY'}
                  </span>
                </div>

                {settlement || directive ? (
                  <div className="space-y-3.5 text-mute">
                    <div className="p-4 rounded-2xl bg-panel border border-line space-y-1.5 shadow-xs">
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

                    <div className="p-4 rounded-2xl bg-panel border border-line space-y-1.5 text-xs sm:text-sm shadow-xs">
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
                  className="font-mono text-xs sm:text-sm font-semibold text-enclave hover:underline"
                >
                  Pop-out Paper Receipt ↗
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playStepTick();
                    setProofModalOpen(true);
                  }}
                  className="font-mono text-xs sm:text-sm font-medium text-ink hover:text-enclave"
                >
                  View Intel TDX Quote →
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'sdk' && <DeveloperSdkTab />}
        </div>
      </div>
    </div>
  );
}
