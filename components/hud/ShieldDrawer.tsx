'use client';

/**
 * components/hud/ShieldDrawer.tsx
 *
 * The Shield Sheet (Side drawer on desktop / Bottom sheet on mobile).
 * Contains the 4-step execution stepper (Sealed -> Verified in Enclave -> Policy Checks -> Settled),
 * embedded compact 3D pipeline visualizer, developer view toggle, and verifiable cryptographic proof inspector.
 */

import { useState } from 'react';
import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';
import { VaultCanvas } from '@/components/scene/VaultCanvas';
import { Terminal } from '@/components/hud/Terminal';

export function ShieldDrawer() {
  const isShieldDrawerOpen = useVaultStore((s) => s.isShieldDrawerOpen);
  const setShieldDrawerOpen = useVaultStore((s) => s.setShieldDrawerOpen);
  const stage = useVaultStore((s) => s.stage);
  const gates = useVaultStore((s) => s.gates);
  const policy = useVaultStore((s) => s.policy);
  const lastGoal = useVaultStore((s) => s.lastGoal);
  const redactedGoal = useVaultStore((s) => s.redactedGoal);
  const settlement = useVaultStore((s) => s.settlement);
  const directive = useVaultStore((s) => s.directive);
  const gateReason = useVaultStore((s) => s.gateReason);
  const setProofModalOpen = useVaultStore((s) => s.setProofModalOpen);
  const setMpcModalOpen = useVaultStore((s) => s.setMpcModalOpen);

  const [showDevView, setShowDevView] = useState(false);
  const [show3dView, setShow3dView] = useState(true);

  if (!isShieldDrawerOpen) return null;

  const isRunning =
    stage === 'sealing' || stage === 'enclave' || stage === 'evaluating' || stage === 'settling';
  const isSettled = stage === 'settled';
  const isBlocked = stage === 'blocked' || Boolean(gateReason);

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setShieldDrawerOpen(false)}
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-xl md:max-w-2xl bg-panel border-l border-line shadow-2xl z-10 flex flex-col h-full overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-line bg-panel2/60 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-base sm:text-lg font-bold text-ink">
                Shield Execution Inspector
              </h2>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border ${
                  isRunning
                    ? 'bg-enclave/10 text-enclave border-enclave/30 animate-pulse'
                    : isSettled
                    ? 'bg-pass/10 text-pass border-pass/30'
                    : isBlocked
                    ? 'bg-block/10 text-block border-block/30'
                    : 'bg-panel text-mute border-line'
                }`}
              >
                {isRunning ? 'Processing' : isSettled ? 'Verified & Settled' : isBlocked ? 'Blocked' : 'Idle'}
              </span>
            </div>
            <p className="font-mono text-xs text-mute">
              Intel TDX Hardware Enclave · MKTME Memory Encryption · Zero Server Retention
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              setShieldDrawerOpen(false);
            }}
            className="w-8 h-8 rounded-full border border-line hover:border-ink/40 flex items-center justify-center text-mute hover:text-ink transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 font-mono text-xs">
          {/* 1. Four-Step Vertical Stepper */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink uppercase tracking-wider text-xs">
                Execution Pipeline
              </span>
              <span className="text-[11px] text-mute">Deterministic Defense Chain</span>
            </div>

            <div className="p-4 rounded-2xl bg-panel2 border border-line space-y-4">
              {/* Step 1: Sealed Intent */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {stage === 'sealing' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-enclave border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-pass text-void flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">1. Intent Sealed Client-Side</span>
                    <span className="text-[10px] text-mute">Zero Retention</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-void border border-line text-[11px] text-mute font-mono break-all leading-relaxed">
                    {redactedGoal || (lastGoal ? lastGoal.slice(0, 40) + '...' : 'Intent ready')}
                  </div>
                </div>
              </div>

              {/* Step 2: Enclave Reasoning & Attestation */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {stage === 'enclave' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-enclave border-t-transparent animate-spin" />
                  ) : stage === 'sealing' ? (
                    <div className="w-5 h-5 rounded-full border border-line bg-panel flex items-center justify-center text-mute text-[10px]">
                      2
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-pass text-void flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">2. Intel TDX Hardware Enclave</span>
                    <span className="text-[10px] text-enclave font-semibold">NEAR AI Cloud</span>
                  </div>
                  <p className="text-[11px] text-mute leading-relaxed">
                    Confidential LLM inference inside isolated virtual machine (DeepSeek-V3). Fresh 32-byte client nonce matched.
                  </p>
                </div>
              </div>

              {/* Step 3: Policy Guardrails */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {stage === 'evaluating' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-enclave border-t-transparent animate-spin" />
                  ) : isBlocked ? (
                    <div className="w-5 h-5 rounded-full bg-block text-white flex items-center justify-center font-bold text-[10px]">
                      ✕
                    </div>
                  ) : isSettled ? (
                    <div className="w-5 h-5 rounded-full bg-pass text-void flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-line bg-panel flex items-center justify-center text-mute text-[10px]">
                      3
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">3. Policy Guardrail Evaluation</span>
                    <span className="text-[10px] text-mute">3 Safety Gates</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                    <div
                      className={`p-2 rounded-lg border text-center ${
                        gates.spend === 'passed'
                          ? 'bg-pass/10 text-pass border-pass/30 font-bold'
                          : gates.spend === 'failed'
                          ? 'bg-block/10 text-block border-block/30 font-bold'
                          : 'bg-panel border-line text-mute'
                      }`}
                    >
                      Gate 1: Spend
                    </div>
                    <div
                      className={`p-2 rounded-lg border text-center ${
                        gates.allowlist === 'passed'
                          ? 'bg-pass/10 text-pass border-pass/30 font-bold'
                          : gates.allowlist === 'failed'
                          ? 'bg-block/10 text-block border-block/30 font-bold'
                          : 'bg-panel border-line text-mute'
                      }`}
                    >
                      Gate 2: Allowlist
                    </div>
                    <div
                      className={`p-2 rounded-lg border text-center ${
                        gates.nonce === 'passed'
                          ? 'bg-pass/10 text-pass border-pass/30 font-bold'
                          : gates.nonce === 'failed'
                          ? 'bg-block/10 text-block border-block/30 font-bold'
                          : 'bg-panel border-line text-mute'
                      }`}
                    >
                      Gate 3: Fresh Nonce
                    </div>
                  </div>

                  {isBlocked && (
                    <div className="p-2.5 rounded-xl bg-block/10 border border-block/30 text-block font-bold text-[11px]">
                      {gateReason?.headline || 'Transaction halted by policy guardrail'}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 4: Multi-Chain Settlement */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {stage === 'settling' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-enclave border-t-transparent animate-spin" />
                  ) : isSettled ? (
                    <div className="w-5 h-5 rounded-full bg-pass text-void flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-line bg-panel flex items-center justify-center text-mute text-[10px]">
                      4
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">4. NEAR MPC Multi-Chain Settlement</span>
                    <span className="text-[10px] text-mute">Gasless Signatures</span>
                  </div>
                  {settlement ? (
                    <div className="p-2.5 rounded-xl bg-pass/10 border border-pass/30 text-pass font-bold text-[11px] flex items-center justify-between">
                      <span>Settled {directive?.amountUsd ? `$${directive.amountUsd}` : ''} on {settlement.destinationChain}</span>
                      <span className="font-normal text-[10px] truncate max-w-[140px] text-mute">
                        {settlement.intentHash}
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-mute leading-relaxed">
                      Decentralized threshold MPC signs across Bitcoin, Ethereum, and Solana without raw private keys.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Embedded 3D Enclave Viewport */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink uppercase tracking-wider text-xs">
                Live 3D Telemetry
              </span>
              <button
                type="button"
                onClick={() => setShow3dView(!show3dView)}
                className="text-[11px] text-mute hover:text-ink underline"
              >
                {show3dView ? 'Hide 3D' : 'Show 3D'}
              </button>
            </div>

            {show3dView && (
              <div className="relative w-full h-[240px] rounded-2xl bg-[#141110] border border-line overflow-hidden shadow-inner">
                <VaultCanvas />
                <div className="absolute top-2 left-2 pointer-events-none z-10 bg-[#141110]/80 px-2 py-0.5 rounded-full border border-line/30 text-[10px] text-white/80">
                  Intel TDX Enclave Visualizer
                </div>
              </div>
            )}
          </div>

          {/* 3. Developer View & Audit Terminal */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowDevView(!showDevView)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-panel2 border border-line font-bold text-ink hover:border-ink/40 transition-colors"
            >
              <span>⚙️ Developer View & Raw Logs</span>
              <span className="text-mute text-xs">{showDevView ? '▲ Hide' : '▼ Expand'}</span>
            </button>

            {showDevView && (
              <div className="space-y-3 pt-1 animate-fadeIn">
                <div className="h-[220px] rounded-2xl overflow-hidden border border-line">
                  <Terminal />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-line bg-panel2/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              setProofModalOpen(true);
            }}
            className="font-mono text-xs font-semibold px-4 py-2.5 rounded-full border border-line bg-panel hover:bg-panel2 text-ink transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>📜 Inspect Attestation Quote</span>
            <span className="text-[10px]">↗</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              setMpcModalOpen(true);
            }}
            className="font-mono text-xs font-semibold px-4 py-2.5 rounded-full border border-line bg-panel hover:bg-panel2 text-ink transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>🔑 Derived MPC Keys</span>
            <span className="text-[10px]">↗</span>
          </button>
        </div>
      </div>
    </div>
  );
}
