'use client';

/**
 * components/hud/IntentVault.tsx
 *
 * Primary intent workspace for user input, quick preset tags,
 * confidential client-side prompt redaction preview, and policy limit controls.
 */

import { useState } from 'react';
import { soundFx } from '@/components/AudioFeedback';
import { runIntent } from '@/lib/runIntent';
import { useVaultStore } from '@/lib/store';
import { QuickPromptTag } from '@/lib/types';

const QUICK_TAGS: QuickPromptTag[] = [
  {
    id: 'sol_eth',
    label: 'Solana → Eth $25',
    goal: 'Rebalance 25 USDC from Solana to Ethereum via NEAR Intents',
    description: 'Safe inventory rebalance passing all policy gates.',
  },
  {
    id: 'near_eth',
    label: 'NEAR → Eth $20',
    goal: 'Swap 20 NEAR into Ethereum USDC to capture cross-chain yield spread',
    description: 'Multi-chain routing via NEAR MPC chain signatures.',
  },
  {
    id: 'btc_rebalance',
    label: 'Bitcoin Hub $45',
    goal: 'Rebalance 45 USD of Bitcoin liquidity into Ethereum treasury vault',
    description: 'Routes near maximum single transaction cap ($50.00).',
  },
  {
    id: 'arbitrage',
    label: 'Arbitrage Spread $35',
    goal: 'Execute 35 USDC triangular arbitrage across Solana, NEAR, and Ethereum',
    description: 'Autonomous trading loop with self-funded compute fee deduction.',
  },
];

export function IntentVault() {
  const stage = useVaultStore((s) => s.stage);
  const policy = useVaultStore((s) => s.policy);
  const setPolicy = useVaultStore((s) => s.setPolicy);
  const lastGoal = useVaultStore((s) => s.lastGoal);

  const [inputGoal, setInputGoal] = useState(lastGoal);
  const [isFlickering, setIsFlickering] = useState(false);

  const isRunning =
    stage === 'sealing' || stage === 'enclave' || stage === 'evaluating' || stage === 'settling';

  const handleSelectTag = (tag: QuickPromptTag) => {
    soundFx.playStepTick();
    setInputGoal(tag.goal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputGoal.trim() || isRunning) return;

    // Trigger matrix flickering redaction effect
    setIsFlickering(true);
    setTimeout(() => setIsFlickering(false), 600);

    await runIntent({
      goal: inputGoal.trim(),
      policy,
    });
  };

  // Real-time confidential redaction preview
  const redactedPreview = inputGoal
    ? inputGoal
        .split(' ')
        .map((w) => (w.length > 2 ? '█'.repeat(w.length) : w))
        .join(' ')
    : '████████████████████████';

  return (
    <div className="w-full bg-panel rounded-xl border border-line p-6 shadow-xl space-y-5">
      {/* Quick Tag Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-enclave font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-enclave shadow-glow-enclave" />
            PRE-CONFIGURED INTENT PRESETS:
          </span>
          <span className="font-mono text-[10px] text-mute font-semibold">Click to autofill</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleSelectTag(tag)}
              disabled={isRunning}
              className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-line bg-panel2 hover:bg-enclave/20 hover:border-enclave text-ink transition-all shadow-sm disabled:opacity-50 active:scale-95"
              title={tag.description}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-mono text-xs text-white font-bold uppercase tracking-wider mb-2">
            NATURAL LANGUAGE TRADING / REBALANCING INTENT:
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={inputGoal}
              onChange={(e) => setInputGoal(e.target.value)}
              disabled={isRunning}
              placeholder="e.g. Rebalance 25 USDC from Solana to Ethereum via NEAR Intents safely..."
              className={`w-full bg-void/90 border-2 border-line rounded-lg p-3.5 font-mono text-xs text-white placeholder:text-mute focus:outline-none focus:border-enclave transition-colors resize-none shadow-inner leading-relaxed ${
                isFlickering ? 'animate-pulse text-enclave' : ''
              }`}
            />
          </div>
        </div>

        {/* Confidential Redaction Preview Strip */}
        <div className="bg-void border border-enclave/30 rounded-lg p-3 font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between text-mute mb-1.5">
            <span className="flex items-center gap-2 text-enclave font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-enclave shadow-glow-enclave" />
              CLIENT-SIDE SEALED PREVIEW (WHAT CLOUD & HYPERVISOR SEE):
            </span>
            <span className="text-[10px] font-black text-pass px-2 py-0.5 rounded bg-pass/10 border border-pass/30">
              ZERO PERSISTENCE
            </span>
          </div>
          <div className="text-white/80 font-mono tracking-wider truncate select-all text-xs bg-panel2/60 p-2 rounded border border-line">
            {redactedPreview}
          </div>
        </div>

        {/* Policy Boundary Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-line">
          <div className="bg-panel2/70 p-3.5 rounded-lg border border-line">
            <div className="flex items-center justify-between font-mono text-xs text-mute mb-1.5">
              <span className="font-bold text-white">SINGLE-TRADE CAP (GATE 1):</span>
              <span className="text-enclave font-black text-sm">${policy.maxUsdPerTx}.00</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={policy.maxUsdPerTx}
              onChange={(e) => setPolicy({ maxUsdPerTx: Number(e.target.value) })}
              disabled={isRunning}
              className="w-full accent-enclave h-2 bg-void rounded appearance-none cursor-pointer"
            />
            <span className="font-mono text-[9px] text-mute block mt-1">Rejects any single trade exceeding this value</span>
          </div>

          <div className="bg-panel2/70 p-3.5 rounded-lg border border-line">
            <div className="flex items-center justify-between font-mono text-xs text-mute mb-1.5">
              <span className="font-bold text-white">SESSION BUDGET CAP:</span>
              <span className="text-pass font-black text-sm">${policy.sessionBudgetCapUsd}.00</span>
            </div>
            <input
              type="range"
              min={50}
              max={500}
              step={25}
              value={policy.sessionBudgetCapUsd}
              onChange={(e) => setPolicy({ sessionBudgetCapUsd: Number(e.target.value) })}
              disabled={isRunning}
              className="w-full accent-pass h-2 bg-void rounded appearance-none cursor-pointer"
            />
            <span className="font-mono text-[9px] text-mute block mt-1">Stateful cumulative budget ceiling</span>
          </div>
        </div>

        {/* Submit Execution Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="font-mono text-[10px] text-mute flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pass" />
            Intel TDX Encrypted Inference · Stateless Route
          </div>

          <button
            type="submit"
            disabled={isRunning || !inputGoal.trim()}
            className="w-full sm:w-auto font-mono text-xs font-black px-7 py-3 rounded-lg bg-gradient-to-r from-enclave to-cyan-400 hover:from-cyan-400 hover:to-enclave text-void border border-enclave shadow-glow-cyan transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-void border-t-transparent animate-spin" />
                <span>PROCESSING INTENT...</span>
              </>
            ) : (
              <span>SEAL & EXECUTE INTENT →</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
