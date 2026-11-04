'use client';

/**
 * components/treasury/TreasuryCommandCard.tsx
 *
 * Top Section: Clean, warm creamy Treasury Overview & Agent Command Card.
 *
 * Designed with large legible text, warm natural tones, human balances,
 * quick one-click actions, official crypto vector logos, and instant reassurance.
 */

import { useState } from 'react';
import { soundFx } from '@/components/AudioFeedback';
import { runIntent } from '@/lib/runIntent';
import { useVaultStore } from '@/lib/store';
import {
  BitcoinLogo,
  EthereumLogo,
  SolanaLogo,
  NearLogo,
} from '@/components/icons/CryptoLogos';

interface QuickAction {
  id: string;
  label: string;
  goal: string;
  description: string;
  icons: React.ReactNode;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'sol_eth',
    label: 'Solana → Ethereum $25',
    goal: 'Rebalance 25 USDC from Solana to Ethereum via NEAR Intents',
    description: 'Safe cross-chain inventory rebalance within policy limits.',
    icons: (
      <div className="flex items-center -space-x-1">
        <SolanaLogo size={18} />
        <EthereumLogo size={18} />
      </div>
    ),
  },
  {
    id: 'near_eth',
    label: 'NEAR → Ethereum $20',
    goal: 'Swap 20 NEAR into Ethereum USDC to capture cross-chain yield spread',
    description: 'Autonomous yield capture via NEAR MPC Chain Signatures.',
    icons: (
      <div className="flex items-center -space-x-1">
        <NearLogo size={18} />
        <EthereumLogo size={18} />
      </div>
    ),
  },
  {
    id: 'btc_rebalance',
    label: 'Bitcoin Liquidity $45',
    goal: 'Rebalance 45 USD of Bitcoin liquidity into Ethereum treasury vault',
    description: 'Treasury reserve balancing under the $50.00 single transaction cap.',
    icons: <BitcoinLogo size={18} />,
  },
  {
    id: 'arbitrage',
    label: 'Multi-Chain Rebalance $35',
    goal: 'Execute 35 USDC triangular rebalance across Solana, NEAR, and Ethereum',
    description: 'Multi-hop liquidity balancing with automated fee optimization.',
    icons: (
      <div className="flex items-center -space-x-1">
        <SolanaLogo size={18} />
        <NearLogo size={18} />
        <EthereumLogo size={18} />
      </div>
    ),
  },
];

export function TreasuryCommandCard() {
  const stage = useVaultStore((s) => s.stage);
  const policy = useVaultStore((s) => s.policy);
  const lastGoal = useVaultStore((s) => s.lastGoal);
  const stats = useVaultStore((s) => s.stats);
  const setProofModalOpen = useVaultStore((s) => s.setProofModalOpen);

  const [inputGoal, setInputGoal] = useState(lastGoal);

  const isRunning =
    stage === 'sealing' || stage === 'enclave' || stage === 'evaluating' || stage === 'settling';

  const handleSelectAction = (action: QuickAction) => {
    soundFx.playStepTick();
    setInputGoal(action.goal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputGoal.trim() || isRunning) return;

    soundFx.playStepTick();
    await runIntent(
      {
        goal: inputGoal.trim(),
        policy,
      },
      { runMode: 'user' }
    );
  };

  // Human treasury balance calculation
  const baseBalance = 1420.5;
  const currentBalance = (baseBalance + stats.cumulativePnlUsd - policy.spentInSessionUsd).toLocaleString(
    'en-US',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );

  return (
    <div className="w-full bg-panel rounded-2xl border border-line p-6 sm:p-8 shadow-sm space-y-6">
      {/* 1. Treasury Balance & Shield Reassurance Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-enclave tracking-wider uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-enclave" />
              PROTECTED AGENT TREASURY
            </span>
            <span className="text-line">·</span>
            <span className="font-mono text-xs text-mute font-medium">Multi-Chain Yield & Reserves</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-mono font-black text-ink tracking-tight">
              ${currentBalance}
            </span>
            <span className="font-mono text-sm text-pass font-bold flex items-center gap-1.5">
              <span>▲ +2.4%</span>
              <span className="text-mute font-normal text-xs">(24h yield)</span>
            </span>
          </div>
          <p className="font-mono text-sm text-mute mt-2">
            Protected across 4 blockchains via NEAR Chain Signatures & Intel TDX hardware.
          </p>
        </div>

        {/* Protection Reassurance Badge & Proof Link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-panel2 border border-pass/30 text-sm font-mono text-ink shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-pass animate-pulse" />
            <div>
              <div className="font-bold text-pass leading-tight">VANGUARD SHIELD ACTIVE</div>
              <div className="text-xs text-mute">Hardware Policy Isolation</div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playStepTick();
              setProofModalOpen(true);
            }}
            className="font-mono text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl border border-enclave/40 bg-enclave/10 hover:bg-enclave/20 text-enclave transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            title="Inspect Cryptographic Intel TDX Attestation Quote"
          >
            <span>INSPECT PROOF</span>
            <span className="text-xs">↗</span>
          </button>
        </div>
      </div>

      {/* 2. Chain Distribution Pills */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-sm text-mute font-semibold">Protected Assets:</span>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-panel2 border border-line text-sm font-mono text-ink font-medium">
          <BitcoinLogo size={18} />
          <span>BTC: $340.00</span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-panel2 border border-line text-sm font-mono text-ink font-medium">
          <EthereumLogo size={18} />
          <span>ETH: $480.00</span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-panel2 border border-line text-sm font-mono text-ink font-medium">
          <SolanaLogo size={18} />
          <span>SOL: $310.50</span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-panel2 border border-line text-sm font-mono text-ink font-medium">
          <NearLogo size={18} />
          <span>NEAR: $290.00</span>
        </div>
      </div>

      {/* 3. Agent Command Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-mono text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-enclave" />
              TELL YOUR AI AGENT WHAT TO DO:
            </label>
            <span className="font-mono text-xs text-mute font-medium">
              Natural English · Automatic policy check
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={inputGoal}
              onChange={(e) => setInputGoal(e.target.value)}
              disabled={isRunning}
              placeholder="e.g. Rebalance 25 USDC from Solana to Ethereum via NEAR Intents safely..."
              className="w-full bg-void border border-line rounded-xl p-4 font-mono text-base text-ink placeholder:text-mute/60 focus:outline-none focus:border-enclave transition-colors resize-none shadow-inner leading-relaxed"
            />
          </div>
        </div>

        {/* Quick One-Click Action Pills */}
        <div>
          <span className="font-mono text-xs sm:text-sm text-mute font-semibold block mb-2">
            Or choose a quick 1-click action:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleSelectAction(action)}
                disabled={isRunning}
                className="font-mono text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl border border-line bg-panel2 hover:bg-enclave/10 hover:border-enclave text-ink transition-all shadow-sm disabled:opacity-50 active:scale-95 flex items-center gap-2"
                title={action.description}
              >
                {action.icons}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Status & Primary Submit Button */}
        <div className="pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Message */}
          <div className="font-mono text-sm flex items-center gap-2">
            {isRunning ? (
              <span className="text-enclave font-bold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-enclave border-t-transparent animate-spin" />
                Evaluating intent in Intel TDX Hardware Enclave...
              </span>
            ) : stage === 'settled' ? (
              <span className="text-pass font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pass" />
                ✓ Intent verified & settled successfully on-chain
              </span>
            ) : stage === 'blocked' ? (
              <span className="text-block font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-block" />
                ✕ Intercepted: Blocked by your safety guardrail
              </span>
            ) : (
              <span className="text-mute flex items-center gap-2 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-pass" />
                Single-transaction limit: ${policy.maxUsdPerTx}.00 · Guardrails active
              </span>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isRunning || !inputGoal.trim()}
            className="font-mono text-sm sm:text-base font-black px-8 py-3.5 rounded-xl bg-ink hover:bg-black text-white border border-ink shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>PROCESSING...</span>
              </>
            ) : (
              <span>EXECUTE PROTECTED INTENT →</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
