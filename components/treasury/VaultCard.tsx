'use client';

/**
 * components/treasury/VaultCard.tsx
 *
 * The Single Centered Action Card for DarkWallet Vanguard.
 *
 * Implements progressive disclosure:
 *  - One focal card, one primary button, plain-English intent input (>=16px to prevent iOS zoom).
 *  - Clear shield summary line with [Edit] drawer button.
 *  - "How it works" 3-step plain-English walkthrough beneath the card.
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

interface QuickChip {
  id: string;
  label: string;
  goal: string;
}

const QUICK_CHIPS: QuickChip[] = [
  {
    id: 'arbitrage',
    label: '⚡ Arbitrage ($25)',
    goal: 'Rebalance 25 USDC from Solana to Ethereum via NEAR Intents',
  },
  {
    id: 'yield',
    label: '📈 Staking Yield ($20)',
    goal: 'Swap 20 NEAR into Ethereum USDC to capture cross-chain yield spread',
  },
  {
    id: 'rebalance',
    label: '🔄 Rebalance ($35)',
    goal: 'Execute 35 USDC triangular rebalance across Solana, NEAR, and Ethereum',
  },
  {
    id: 'liquidity',
    label: '🛡️ Bitcoin Liquidity ($45)',
    goal: 'Rebalance 45 USD of Bitcoin liquidity into Ethereum treasury vault',
  },
];

export function VaultCard() {
  const stage = useVaultStore((s) => s.stage);
  const policy = useVaultStore((s) => s.policy);
  const policyPreset = useVaultStore((s) => s.policyPreset);
  const lastGoal = useVaultStore((s) => s.lastGoal);
  const stats = useVaultStore((s) => s.stats);
  const walletConnected = useVaultStore((s) => s.walletConnected);
  const walletAddress = useVaultStore((s) => s.walletAddress);
  const walletBalanceNear = useVaultStore((s) => s.walletBalanceNear);
  const nearPriceUsd = useVaultStore((s) => s.nearPriceUsd);
  const setGuardrailsModalOpen = useVaultStore((s) => s.setGuardrailsModalOpen);
  const setShieldDrawerOpen = useVaultStore((s) => s.setShieldDrawerOpen);
  const setWalletModalOpen = useVaultStore((s) => s.setWalletModalOpen);

  const [inputGoal, setInputGoal] = useState(lastGoal);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const isRunning =
    stage === 'sealing' || stage === 'enclave' || stage === 'evaluating' || stage === 'settling';

  const handleSelectChip = (chip: QuickChip) => {
    soundFx.playStepTick();
    setInputGoal(chip.goal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputGoal.trim() || isRunning) return;

    soundFx.playStepTick();
    setShieldDrawerOpen(true);

    await runIntent(
      {
        goal: inputGoal.trim(),
        policy,
      },
      { runMode: 'user' }
    );
  };

  // Live treasury balance calculation in native NEAR and estimated USD
  const estimatedUsd = walletBalanceNear * nearPriceUsd + stats.cumulativePnlUsd - policy.spentInSessionUsd;
  const formattedUsd = Math.max(0, estimatedUsd).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedNear = walletBalanceNear.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3.5">
      {/* The Centered Vanguard Vault Card */}
      <div className="w-full bg-panel rounded-3xl border border-line p-5 sm:p-7 shadow-xs space-y-4 sm:space-y-5">
        {/* Card Header: Plain English Title & Treasury Balance */}
        <div className="flex items-center justify-between pb-3.5 border-b border-line">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base sm:text-lg font-bold text-ink tracking-tight">
                Private AI Treasury Agent
              </h1>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-pass/10 text-pass border border-pass/30 font-bold uppercase">
                Intel TDX
              </span>
            </div>
            <p className="font-mono text-[11px] sm:text-xs text-mute mt-0.5">
              Confidential computation on NEAR AI Cloud & NEAR Intents
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              setWalletModalOpen(true);
            }}
            className="text-right font-mono p-1.5 -mr-2 rounded-2xl hover:bg-panel2/60 transition-all cursor-pointer group"
            title="Click to view wallet assets, inspect accounts, or sync with NEAR RPC"
          >
            <div className="text-[10px] sm:text-[11px] text-mute uppercase font-semibold flex items-center justify-end gap-1.5 group-hover:text-pass transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-pass animate-pulse" />
              <span>Protected Assets</span>
              <span className="text-[10px] opacity-70 group-hover:opacity-100">⚙️</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-ink tracking-tight tabular-nums flex items-baseline justify-end gap-1">
              <span>{formattedNear}</span>
              <span className="text-xs text-pass font-extrabold">NEAR</span>
            </div>
            <div className="text-[10px] text-mute tabular-nums flex items-center justify-end gap-1.5">
              <span>≈ ${formattedUsd} USD</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-pass/10 text-pass border border-pass/20 font-mono font-semibold">
                ${nearPriceUsd.toFixed(2)}/NEAR
              </span>
            </div>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Natural Language Intent Input */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs sm:text-sm font-bold text-ink uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-enclave" />
                What should your agent do?
              </span>
              <span className="text-[10px] sm:text-[11px] font-normal text-mute">
                Plain English · Encrypted in memory
              </span>
            </label>

            <div className="relative">
              <textarea
                rows={2}
                value={inputGoal}
                onChange={(e) => setInputGoal(e.target.value)}
                disabled={isRunning}
                placeholder="e.g. Rebalance 25 USDC from Solana to Ethereum via NEAR Intents for higher staking yield..."
                className="w-full bg-void border border-line rounded-2xl p-3.5 sm:p-4 font-mono text-base text-ink placeholder:text-mute/50 focus:outline-none focus:border-ink/50 transition-colors resize-none shadow-xs leading-relaxed"
              />
            </div>
          </div>

          {/* Quick Strategy Chips */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-mute font-medium">Quick suggestions:</div>
            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleSelectChip(chip)}
                  disabled={isRunning}
                  className="font-mono text-xs font-medium px-3.5 py-1.5 rounded-full border border-line bg-panel2 hover:bg-panel hover:border-ink/40 text-ink transition-all shadow-xs disabled:opacity-50 active:scale-95"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shield Summary Line & Edit Drawer Button */}
          <div className="p-3.5 rounded-2xl bg-panel2 border border-line flex items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="w-2.5 h-2.5 rounded-full bg-pass shrink-0" />
              <div className="text-xs text-ink font-semibold truncate">
                <span>Shield: </span>
                <span className="text-enclave font-bold">${policy.maxUsdPerTx}/trade</span>
                <span className="text-mute"> · </span>
                <span className="text-pass font-bold">${policy.sessionBudgetCapUsd}/day</span>
                <span className="text-mute"> · </span>
                <span className="text-ink">{policy.chainWhitelist.length} chains</span>
                <span className="text-mute capitalize"> ({policyPreset})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.playStepTick();
                setGuardrailsModalOpen(true);
              }}
              className="text-xs font-bold text-ink hover:text-enclave px-3 py-1 rounded-full bg-panel border border-line hover:border-ink/40 transition-all shrink-0 active:scale-95 shadow-xs"
            >
              Edit ⚙️
            </button>
          </div>

          {/* Primary Action Button (Rule 1 & 2: One bright hero button per screen, black text on mint) */}
          <div>
            <button
              type="submit"
              disabled={isRunning || !inputGoal.trim()}
              className="w-full font-mono text-sm sm:text-base font-bold py-3.5 sm:py-4 px-6 rounded-full bg-pass text-void hover:brightness-110 shadow-lg shadow-pass/20 transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 tracking-wide"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-void border-t-transparent animate-spin" />
                  <span>EXECUTING INSIDE HARDWARE ENCLAVE...</span>
                </>
              ) : (
                <span>EXECUTE THROUGH VANGUARD SHIELD →</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* How it Works Collapsible (3 Short Plain-English Steps) */}
      <div className="w-full bg-panel rounded-3xl border border-line p-4 sm:p-5 shadow-xs font-mono">
        <button
          type="button"
          onClick={() => {
            soundFx.playStepTick();
            setShowHowItWorks(!showHowItWorks);
          }}
          className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-ink"
        >
          <span className="flex items-center gap-2">
            <span>ℹ️</span>
            <span>How DarkWallet Vanguard Protects Your Capital</span>
          </span>
          <span className="text-mute text-xs">{showHowItWorks ? '▲ Hide' : '▼ View 3 Steps'}</span>
        </button>

        {showHowItWorks && (
          <div className="pt-4 border-t border-line mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-fadeIn">
            <div className="p-3.5 rounded-2xl bg-panel2 border border-line space-y-1.5">
              <div className="font-bold text-ink flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-enclave text-white flex items-center justify-center text-[10px]">1</span>
                <span>Private Reasoning</span>
              </div>
              <p className="text-mute text-[11px] leading-relaxed">
                Your prompt is encrypted client-side and sent directly to an Intel TDX hardware enclave on NEAR AI Cloud. No human or cloud provider sees your strategy.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-panel2 border border-line space-y-1.5">
              <div className="font-bold text-ink flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-pass text-white flex items-center justify-center text-[10px]">2</span>
                <span>Policy Firewall</span>
              </div>
              <p className="text-mute text-[11px] leading-relaxed">
                Before signing, 3 mathematical gates strictly verify single-trade limits, daily budget caps, and check recipient addresses against drainer blacklists.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-panel2 border border-line space-y-1.5">
              <div className="font-bold text-ink flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-ink text-void flex items-center justify-center text-[10px]">3</span>
                <span>Multi-Chain Execution</span>
              </div>
              <p className="text-mute text-[11px] leading-relaxed">
                NEAR Chain Signatures (MPC) derives keys and signs transactions across Bitcoin, Ethereum, and Solana without raw private keys on any server.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
