'use client';

/**
 * components/treasury/AgentGuardrails.tsx
 *
 * Middle Section: Agent Guardrails in simple, plain-English safety switches.
 *
 * Features:
 *  - Max spend per transaction stepper & slider
 *  - Daily/session budget ceiling with real-time spend progress bar
 *  - Trusted settlement networks with official crypto vector logos
 *  - One-click emergency killswitch to freeze/unfreeze agent spending
 */

import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';
import {
  BitcoinLogo,
  EthereumLogo,
  SolanaLogo,
  NearLogo,
} from '@/components/icons/CryptoLogos';

interface ChainOption {
  name: string;
  icon: React.ReactNode;
  label: string;
}

const SUPPORTED_CHAINS: ChainOption[] = [
  { name: 'Bitcoin', icon: <BitcoinLogo size={18} />, label: 'Bitcoin (BTC)' },
  { name: 'Ethereum', icon: <EthereumLogo size={18} />, label: 'Ethereum (ETH)' },
  { name: 'Solana', icon: <SolanaLogo size={18} />, label: 'Solana (SOL)' },
  { name: 'NEAR', icon: <NearLogo size={18} />, label: 'NEAR Protocol' },
];

export function AgentGuardrails() {
  const policy = useVaultStore((s) => s.policy);
  const setPolicy = useVaultStore((s) => s.setPolicy);
  const stage = useVaultStore((s) => s.stage);

  const isRunning =
    stage === 'sealing' || stage === 'enclave' || stage === 'evaluating' || stage === 'settling';

  const handleToggleChain = (chainName: string) => {
    soundFx.playStepTick();
    const currentList = policy.chainWhitelist;
    let updatedList: string[];

    if (currentList.includes(chainName)) {
      // Keep at least one chain enabled
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

  const spentAmount = policy.spentInSessionUsd;
  const budgetCap = policy.sessionBudgetCapUsd;
  const spentPercent = Math.min(100, Math.round((spentAmount / budgetCap) * 100));
  const remainingBudget = Math.max(0, budgetCap - spentAmount);

  return (
    <div className="w-full bg-panel rounded-2xl border border-line p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-enclave shadow-glow-enclave" />
              AGENT GUARDRAILS (SAFETY SWITCHES)
            </span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-enclave/15 text-enclave border border-enclave/40 font-bold uppercase">
              HARDWARE ENFORCED
            </span>
          </div>
          <p className="font-mono text-xs text-mute">
            Rules enforced directly inside the hardware enclave. Your agent physically cannot violate these rules.
          </p>
        </div>

        {/* Emergency Killswitch Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleRevoke}
            disabled={isRunning}
            className={`font-mono text-xs font-bold px-4 py-2 rounded-xl border transition-all flex items-center gap-2 shadow-sm ${
              policy.isRevoked
                ? 'bg-block/20 border-block text-block shadow-glow-block'
                : 'bg-panel2 border-line hover:border-block/60 text-white hover:text-block'
            }`}
            title="Instantly revoke agent spending authority"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                policy.isRevoked ? 'bg-block animate-pulse' : 'bg-pass'
              }`}
            />
            <span>{policy.isRevoked ? 'AGENT FROZEN (REVOKED)' : 'FREEZE AGENT'}</span>
          </button>
        </div>
      </div>

      {/* Safety Switches 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Switch 1: Max Spend Per Transaction */}
        <div className="bg-panel2/70 p-5 rounded-xl border border-line space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-white">
                MAX PER TRANSACTION
              </span>
              <span className="font-mono text-base font-black text-enclave">
                ${policy.maxUsdPerTx}.00
              </span>
            </div>
            <p className="font-mono text-[11px] text-mute leading-relaxed">
              Any single trade that requests more than this amount will be immediately rejected.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={policy.maxUsdPerTx}
              onChange={(e) => setPolicy({ maxUsdPerTx: Number(e.target.value) })}
              disabled={isRunning}
              className="w-full accent-enclave h-2 bg-void rounded-lg appearance-none cursor-pointer"
            />
            {/* Quick Preset Buttons */}
            <div className="flex items-center justify-between gap-1.5">
              {[25, 50, 75, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    soundFx.playStepTick();
                    setPolicy({ maxUsdPerTx: val });
                  }}
                  disabled={isRunning}
                  className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all ${
                    policy.maxUsdPerTx === val
                      ? 'bg-enclave/20 border-enclave text-enclave'
                      : 'bg-void border-line text-mute hover:text-white'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Switch 2: Daily Budget Ceiling */}
        <div className="bg-panel2/70 p-5 rounded-xl border border-line space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-white">
                DAILY BUDGET CEILING
              </span>
              <span className="font-mono text-base font-black text-pass">
                ${policy.sessionBudgetCapUsd}.00
              </span>
            </div>
            <p className="font-mono text-[11px] text-mute leading-relaxed">
              Hard cumulative limit. Once the agent spends this total, all further actions pause.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {/* Real-time Spend Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between font-mono text-[10px] text-mute">
                <span>Spent: ${spentAmount.toFixed(2)}</span>
                <span>Remaining: ${remainingBudget.toFixed(2)}</span>
              </div>
              <div className="w-full h-2 bg-void rounded-full overflow-hidden border border-line">
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
              className="w-full accent-pass h-2 bg-void rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Switch 3: Trusted Settlement Networks */}
        <div className="bg-panel2/70 p-5 rounded-xl border border-line space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-white">
                APPROVED NETWORKS
              </span>
              <span className="font-mono text-[10px] text-mute font-bold">
                {policy.chainWhitelist.length} ENABLED
              </span>
            </div>
            <p className="font-mono text-[11px] text-mute leading-relaxed">
              The agent is physically locked out from sending or swapping assets on unchecked chains.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {SUPPORTED_CHAINS.map((chain) => {
              const isEnabled = policy.chainWhitelist.includes(chain.name);
              return (
                <button
                  key={chain.name}
                  type="button"
                  onClick={() => handleToggleChain(chain.name)}
                  disabled={isRunning}
                  className={`font-mono text-xs font-bold px-3 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                    isEnabled
                      ? 'bg-enclave/15 border-enclave/60 text-white shadow-sm'
                      : 'bg-void/60 border-line text-mute/50 hover:text-mute opacity-60'
                  }`}
                  title={isEnabled ? `Enabled: ${chain.name}` : `Disabled: ${chain.name}`}
                >
                  {chain.icon}
                  <span className="truncate">{chain.name}</span>
                  <span
                    className={`ml-auto w-1.5 h-1.5 rounded-full ${
                      isEnabled ? 'bg-pass shadow-glow-pass' : 'bg-mute/40'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
