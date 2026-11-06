'use client';

/**
 * components/treasury/TreasuryCommandCard.tsx
 *
 * Centered Vanguard Vault & Treasury Card.
 *
 * Implements the streamlined, magnetic simplicity of leading Web3 DeFi interfaces
 * (clear single-card focus, low cognitive load, human balance, one-click presets)
 * combined with authentic NEAR Protocol design language (organic rounded geometry,
 * botanical emerald highlights, monospace security badges, and integrated hardware guardrails).
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
        <SolanaLogo size={17} />
        <EthereumLogo size={17} />
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
        <NearLogo size={17} />
        <EthereumLogo size={17} />
      </div>
    ),
  },
  {
    id: 'btc_rebalance',
    label: 'Bitcoin Liquidity $45',
    goal: 'Rebalance 45 USD of Bitcoin liquidity into Ethereum treasury vault',
    description: 'Treasury reserve balancing under the $50.00 single transaction cap.',
    icons: <BitcoinLogo size={17} />,
  },
  {
    id: 'arbitrage',
    label: 'Triangular Spread $35',
    goal: 'Execute 35 USDC triangular rebalance across Solana, NEAR, and Ethereum',
    description: 'Multi-hop liquidity balancing with automated fee optimization.',
    icons: (
      <div className="flex items-center -space-x-1">
        <SolanaLogo size={17} />
        <NearLogo size={17} />
        <EthereumLogo size={17} />
      </div>
    ),
  },
];

const SUPPORTED_CHAINS = [
  { name: 'Bitcoin', icon: <BitcoinLogo size={17} />, label: 'Bitcoin' },
  { name: 'Ethereum', icon: <EthereumLogo size={17} />, label: 'Ethereum' },
  { name: 'Solana', icon: <SolanaLogo size={17} />, label: 'Solana' },
  { name: 'NEAR', icon: <NearLogo size={17} />, label: 'NEAR' },
];

export function TreasuryCommandCard() {
  const stage = useVaultStore((s) => s.stage);
  const policy = useVaultStore((s) => s.policy);
  const setPolicy = useVaultStore((s) => s.setPolicy);
  const lastGoal = useVaultStore((s) => s.lastGoal);
  const stats = useVaultStore((s) => s.stats);
  const setProofModalOpen = useVaultStore((s) => s.setProofModalOpen);
  const walletConnected = useVaultStore((s) => s.walletConnected);
  const walletAddress = useVaultStore((s) => s.walletAddress);
  const walletProvider = useVaultStore((s) => s.walletProvider);
  const setWalletModalOpen = useVaultStore((s) => s.setWalletModalOpen);
  const isMonitorVisible = useVaultStore((s) => s.isMonitorVisible);
  const setMonitorVisible = useVaultStore((s) => s.setMonitorVisible);
  const toggleMonitorVisible = useVaultStore((s) => s.toggleMonitorVisible);

  const [inputGoal, setInputGoal] = useState(lastGoal);
  const [showGuardrails, setShowGuardrails] = useState(false);

  const isRunning =
    stage === 'sealing' || stage === 'enclave' || stage === 'evaluating' || stage === 'settling';

  const handleSelectAction = (action: QuickAction) => {
    soundFx.playStepTick();
    setInputGoal(action.goal);
  };

  const handleToggleChain = (chainName: string) => {
    soundFx.playStepTick();
    const currentList = policy.chainWhitelist;
    let updatedList: string[];

    if (currentList.includes(chainName)) {
      if (currentList.length <= 1) return;
      updatedList = currentList.filter((c) => c !== chainName);
    } else {
      updatedList = [...currentList, chainName];
    }

    setPolicy({ chainWhitelist: updatedList });
  };

  const handleToggleRevoke = () => {
    soundFx.playBlockThud();
    setPolicy({ isRevoked: !policy.isRevoked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputGoal.trim() || isRunning) return;

    soundFx.playStepTick();
    setMonitorVisible(true);

    setTimeout(() => {
      document.getElementById('live-shield-monitor')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);

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

  const spentAmount = policy.spentInSessionUsd;
  const budgetCap = policy.sessionBudgetCapUsd;
  const spentPercent = Math.min(100, Math.round((spentAmount / budgetCap) * 100));
  const remainingBudget = Math.max(0, budgetCap - spentAmount);

  return (
    <div className="w-full bg-panel rounded-3xl border border-line p-5 sm:p-7 lg:p-8 shadow-xs space-y-6">
      {/* 1. Header: Treasury Balance & Account Signer Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-line">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] sm:text-xs font-semibold text-mute uppercase tracking-wider">
              Protected Agent Treasury
            </span>
            <span className="text-line">·</span>
            <span className="font-mono text-[11px] sm:text-xs text-mute">Multi-Chain Vault</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-ink tracking-tight">
              ${currentBalance}
            </span>
            <span className="font-mono text-xs sm:text-sm text-pass font-medium flex items-center gap-1">
              <span>▲ +2.4%</span>
              <span className="text-mute text-[11px] hidden sm:inline">(24h yield)</span>
            </span>
          </div>
        </div>

        {/* Account Delegation Pill */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              setWalletModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-panel2 border border-line hover:border-ink/40 text-xs font-mono text-ink shadow-xs transition-all active:scale-95"
            title="Inspect or Switch NEAR Wallet"
          >
            <NearLogo size={15} />
            <span className="text-mute hidden md:inline">Signer:</span>
            <span className="font-bold text-ink">
              {walletConnected ? walletAddress : 'Connect Wallet'}
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-panel text-mute border border-line font-medium hidden sm:inline">
              {walletConnected ? (walletProvider || 'Cloud FastAuth') : 'Action Required'}
            </span>
            <span className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-pass' : 'bg-warn animate-pulse'}`} />
          </button>
        </div>
      </div>

      {/* 2. Chain Asset Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-mute font-medium mr-1">Protected Reserves:</span>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-panel2 border border-line text-xs font-mono text-ink">
          <BitcoinLogo size={14} />
          <span>BTC $340</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-panel2 border border-line text-xs font-mono text-ink">
          <EthereumLogo size={14} />
          <span>ETH $480</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-panel2 border border-line text-xs font-mono text-ink">
          <SolanaLogo size={14} />
          <span>SOL $310</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-panel2 border border-line text-xs font-mono text-ink">
          <NearLogo size={14} />
          <span>NEAR $290</span>
        </div>
      </div>

      {/* 3. Agent Command Input Box */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-mono text-xs sm:text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-enclave" />
              DELEGATE INTENT TO AI AGENT:
            </label>
            <span className="font-mono text-xs text-mute">
              Plain English · Auto Hardware Guardrails
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={inputGoal}
              onChange={(e) => setInputGoal(e.target.value)}
              disabled={isRunning}
              placeholder="e.g. Rebalance 25 USDC from Solana to Ethereum via NEAR Intents safely..."
              className="w-full bg-void border border-line rounded-2xl p-4 font-mono text-sm sm:text-base text-ink placeholder:text-mute/60 focus:outline-none focus:border-ink/50 transition-colors resize-none shadow-xs leading-relaxed"
            />
          </div>
        </div>

        {/* 1-Click Strategy Chips */}
        <div>
          <span className="font-mono text-xs text-mute font-medium block mb-2">
            Suggested one-click strategies:
          </span>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleSelectAction(action)}
                disabled={isRunning}
                className="font-mono text-xs font-medium px-3.5 py-1.5 rounded-full border border-line bg-panel2 hover:bg-panel hover:border-ink/40 text-ink transition-all shadow-xs disabled:opacity-50 active:scale-95 flex items-center gap-2"
                title={action.description}
              >
                {action.icons}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. The Distinct Hardware Shield Bar with Inline Guardrail Controls */}
        <div className="rounded-2xl border border-line bg-panel2/80 p-3.5 sm:p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pass" />
              <div>
                <span className="font-mono text-xs sm:text-sm font-bold text-ink flex items-center gap-2">
                  <span>Hardware Policy Shield</span>
                  <span className="text-[10px] font-normal px-2 py-0.2 rounded-full bg-panel text-mute border border-line">
                    Intel TDX Enclave
                  </span>
                </span>
                <div className="font-mono text-xs text-mute hidden sm:block">
                  Max ${policy.maxUsdPerTx}.00/tx · Session Cap ${policy.sessionBudgetCapUsd}.00 · {policy.chainWhitelist.length} Chains
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Emergency Freeze Button */}
              <button
                type="button"
                onClick={handleToggleRevoke}
                disabled={isRunning}
                className={`font-mono text-xs font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 shadow-xs ${
                  policy.isRevoked
                    ? 'bg-block/10 border-block/40 text-block font-bold'
                    : 'bg-panel border-line hover:border-block/60 text-mute hover:text-block'
                }`}
                title="Emergency Kill-Switch to pause all agent authorizations"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    policy.isRevoked ? 'bg-block animate-pulse' : 'bg-pass'
                  }`}
                />
                <span>{policy.isRevoked ? 'Agent Frozen' : 'Freeze Agent'}</span>
              </button>

              {/* Inline Guardrail Accordion Toggle */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playStepTick();
                  setShowGuardrails(!showGuardrails);
                }}
                className="font-mono text-xs font-bold px-3 py-1.5 rounded-full bg-panel border border-line hover:border-ink/40 text-ink transition-all flex items-center gap-1 active:scale-95 shadow-xs"
              >
                <span>⚙️ {showGuardrails ? 'Hide Guardrails ▲' : 'Tune Guardrails ▼'}</span>
              </button>
            </div>
          </div>

          {/* Collapsible Guardrails Drawer (Smooth Inline Safety Switches) */}
          {showGuardrails && (
            <div className="pt-3 border-t border-line space-y-4 font-mono animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Switch 1: Max Spend Per Tx */}
                <div className="p-4 rounded-xl bg-panel border border-line space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink uppercase">Max Single Trade</span>
                    <span className="text-sm font-bold text-enclave">${policy.maxUsdPerTx}.00</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={policy.maxUsdPerTx}
                    onChange={(e) => setPolicy({ maxUsdPerTx: Number(e.target.value) })}
                    disabled={isRunning}
                    className="w-full accent-enclave h-1.5 bg-line rounded-lg cursor-pointer"
                  />
                  <div className="flex gap-1.5 pt-1">
                    {[25, 50, 75, 100].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          soundFx.playStepTick();
                          setPolicy({ maxUsdPerTx: val });
                        }}
                        className={`flex-1 text-[11px] font-bold py-1 rounded-lg border transition-all ${
                          policy.maxUsdPerTx === val
                            ? 'bg-ink text-void border-ink'
                            : 'bg-panel2 border-line text-mute hover:text-ink'
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Switch 2: Daily Budget Progress */}
                <div className="p-4 rounded-xl bg-panel border border-line space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink uppercase">Session Budget</span>
                    <span className="text-sm font-bold text-pass">${policy.sessionBudgetCapUsd}.00</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-mute font-medium">
                      <span>Spent: ${spentAmount.toFixed(2)}</span>
                      <span>Left: ${remainingBudget.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-2 bg-line rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pass transition-all duration-300 rounded-full"
                        style={{ width: `${spentPercent}%` }}
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={25}
                    value={policy.sessionBudgetCapUsd}
                    onChange={(e) => setPolicy({ sessionBudgetCapUsd: Number(e.target.value) })}
                    disabled={isRunning}
                    className="w-full accent-pass h-1.5 bg-line rounded-lg cursor-pointer"
                  />
                </div>

                {/* Switch 3: Approved Chains */}
                <div className="p-4 rounded-xl bg-panel border border-line space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink uppercase">Allowed Networks</span>
                    <span className="text-[11px] text-mute">{policy.chainWhitelist.length} Active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    {SUPPORTED_CHAINS.map((chain) => {
                      const isEnabled = policy.chainWhitelist.includes(chain.name);
                      return (
                        <button
                          key={chain.name}
                          type="button"
                          onClick={() => handleToggleChain(chain.name)}
                          disabled={isRunning}
                          className={`text-xs font-medium px-2 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                            isEnabled
                              ? 'bg-panel2 border-line text-ink font-bold'
                              : 'bg-void border-line/60 text-mute/40 opacity-50'
                          }`}
                        >
                          {chain.icon}
                          <span className="truncate">{chain.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Primary Action Button & Status Bar */}
        <div className="pt-3 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Message */}
          <div className="font-mono text-xs sm:text-sm flex items-center gap-2">
            {isRunning ? (
              <span className="text-enclave font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-enclave border-t-transparent animate-spin" />
                Evaluating in Intel TDX Hardware Enclave...
              </span>
            ) : stage === 'settled' ? (
              <span className="text-pass font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pass" />
                ✓ Verified & Settled across NEAR Chain Signatures
              </span>
            ) : stage === 'blocked' ? (
              <span className="text-block font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-block" />
                ✕ Intercepted: Blocked by Policy Guardrail
              </span>
            ) : (
              <span className="text-mute flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-pass" />
                Single-trade cap: ${policy.maxUsdPerTx}.00 · Guardrails active
              </span>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isRunning || !inputGoal.trim()}
            className="font-mono text-xs sm:text-sm font-bold px-8 py-3.5 rounded-full bg-ink hover:opacity-90 text-void shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-void border-t-transparent animate-spin" />
                <span>PROCESSING...</span>
              </>
            ) : (
              <span>EXECUTE THROUGH VANGUARD SHIELD →</span>
            )}
          </button>
        </div>
      </form>

      {/* 6. Subtle Telemetry Drawer Toggle Pill */}
      <div className="pt-1 flex items-center justify-center">
        <button
          type="button"
          onClick={() => {
            soundFx.playStepTick();
            toggleMonitorVisible();
          }}
          className="font-mono text-xs text-mute hover:text-ink transition-colors flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-dashed border-line hover:border-ink/40 active:scale-95"
        >
          <span>{isMonitorVisible ? '▲ Hide Live Shield Monitor & Telemetry' : '▼ Live Shield Monitor & Telemetry (Auto-opens on execute)'}</span>
        </button>
      </div>
    </div>
  );
}
