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
    <div className="w-full bg-panel rounded-lg border border-line p-5">
      {/* Quick Tag Pills */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] text-mute uppercase tracking-wider">
            PRE-CONFIGURED INTENT PRESETS:
          </span>
          <span className="font-mono text-[9px] text-mute">Click to autofill</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleSelectTag(tag)}
              disabled={isRunning}
              className="font-mono text-[11px] px-2.5 py-1.5 rounded border border-line bg-panel2/80 hover:bg-line/40 hover:border-enclave/50 text-ink transition-colors disabled:opacity-50"
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
          <label className="block font-mono text-[10px] text-mute uppercase tracking-wider mb-1.5">
            NATURAL LANGUAGE TRADING / REBALANCING INTENT:
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={inputGoal}
              onChange={(e) => setInputGoal(e.target.value)}
              disabled={isRunning}
              placeholder="e.g. Rebalance 25 USDC from Solana to Ethereum via NEAR Intents safely..."
              className={`w-full bg-void border border-line rounded p-3 font-mono text-xs text-ink placeholder:text-mute/60 focus:outline-none focus:border-enclave transition-colors resize-none ${
                isFlickering ? 'animate-pulse text-enclave' : ''
              }`}
            />
          </div>
        </div>

        {/* Confidential Redaction Preview Strip */}
        <div className="bg-void/80 border border-line/60 rounded p-2.5 font-mono text-[10px]">
          <div className="flex items-center justify-between text-mute mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-enclave" />
              CLIENT-SIDE SEALED PREVIEW (WHAT HYPERVISOR SEES):
            </span>
            <span className="text-[9px] text-enclave">ZERO PERSISTENCE</span>
          </div>
          <div className="text-mute/90 tracking-wider truncate select-all">
            {redactedPreview}
          </div>
        </div>

        {/* Policy Boundary Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-line/70">
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] text-mute mb-1">
              <span>SINGLE-TRADE CAP (GATE 1):</span>
              <span className="text-ink font-bold">${policy.maxUsdPerTx}.00</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={policy.maxUsdPerTx}
              onChange={(e) => setPolicy({ maxUsdPerTx: Number(e.target.value) })}
              disabled={isRunning}
              className="w-full accent-enclave h-1.5 bg-void rounded appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between font-mono text-[10px] text-mute mb-1">
              <span>SESSION BUDGET CAP:</span>
              <span className="text-ink font-bold">${policy.sessionBudgetCapUsd}.00</span>
            </div>
            <input
              type="range"
              min={50}
              max={500}
              step={25}
              value={policy.sessionBudgetCapUsd}
              onChange={(e) => setPolicy({ sessionBudgetCapUsd: Number(e.target.value) })}
              disabled={isRunning}
              className="w-full accent-enclave h-1.5 bg-void rounded appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Execution Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="font-mono text-[9px] text-mute hidden sm:block">
            Intel TDX Encrypted Inference · Stateless API Route
          </div>

          <button
            type="submit"
            disabled={isRunning || !inputGoal.trim()}
            className="w-full sm:w-auto font-mono text-xs font-bold px-6 py-2.5 rounded bg-enclave hover:bg-enclave/90 text-void border border-enclave shadow-glow-enclave transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-void border-t-transparent animate-spin" />
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
