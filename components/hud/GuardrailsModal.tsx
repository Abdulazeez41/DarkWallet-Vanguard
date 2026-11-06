'use client';

/**
 * components/hud/GuardrailsModal.tsx
 *
 * Dedicated Policy Guardrail Settings with Presets (Conservative, Balanced, Custom)
 * and verified confirmation before triggering the emergency freeze.
 */

import { useState } from 'react';
import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';
import {
  BitcoinLogo,
  EthereumLogo,
  SolanaLogo,
  NearLogo,
} from '@/components/icons/CryptoLogos';

const SUPPORTED_CHAINS = [
  { name: 'Bitcoin', icon: <BitcoinLogo size={18} />, label: 'Bitcoin' },
  { name: 'Ethereum', icon: <EthereumLogo size={18} />, label: 'Ethereum' },
  { name: 'Solana', icon: <SolanaLogo size={18} />, label: 'Solana' },
  { name: 'NEAR', icon: <NearLogo size={18} />, label: 'NEAR Protocol' },
];

export function GuardrailsModal() {
  const isGuardrailsModalOpen = useVaultStore((s) => s.isGuardrailsModalOpen);
  const setGuardrailsModalOpen = useVaultStore((s) => s.setGuardrailsModalOpen);
  const policy = useVaultStore((s) => s.policy);
  const setPolicy = useVaultStore((s) => s.setPolicy);
  const policyPreset = useVaultStore((s) => s.policyPreset);
  const setPolicyPreset = useVaultStore((s) => s.setPolicyPreset);
  const stage = useVaultStore((s) => s.stage);

  const [confirmFreeze, setConfirmFreeze] = useState(false);

  if (!isGuardrailsModalOpen) return null;

  const isRunning =
    stage === 'sealing' || stage === 'enclave' || stage === 'evaluating' || stage === 'settling';

  const handleToggleChain = (chainName: string) => {
    soundFx.playStepTick();
    setPolicyPreset('custom');
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

  const handleExecuteFreeze = () => {
    soundFx.playBlockThud();
    setPolicy({ isRevoked: !policy.isRevoked });
    setConfirmFreeze(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-ink/40 backdrop-blur-xs select-none animate-fadeIn">
      <div className="w-full max-w-xl bg-panel rounded-3xl border border-line shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-line shrink-0 bg-panel2/40">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-base sm:text-lg font-bold text-ink">
                Agent Guardrails & Safety Policy
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-panel2 text-mute border border-line font-bold uppercase">
                Hardware Enforced
              </span>
            </div>
            <p className="font-mono text-xs text-mute mt-0.5">
              Rules evaluated inside Intel TDX enclave. Mathematical limits before signing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              setGuardrailsModalOpen(false);
            }}
            className="w-8 h-8 rounded-full border border-line hover:border-ink/40 flex items-center justify-center text-mute hover:text-ink transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 font-mono text-xs">

        {/* 1. Policy Presets (Conservative, Balanced, Custom) */}
        <div className="space-y-2">
          <label className="font-mono text-xs font-bold text-ink uppercase tracking-wider block">
            Select Policy Preset
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-panel2 rounded-2xl border border-line">
            <button
              type="button"
              onClick={() => {
                soundFx.playStepTick();
                setPolicyPreset('conservative');
              }}
              className={`font-mono text-xs font-semibold py-2.5 px-2 rounded-xl transition-all text-center ${
                policyPreset === 'conservative'
                  ? 'bg-ink text-void shadow-xs font-bold'
                  : 'text-mute hover:text-ink'
              }`}
            >
              🛡️ Conservative
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playStepTick();
                setPolicyPreset('balanced');
              }}
              className={`font-mono text-xs font-semibold py-2.5 px-2 rounded-xl transition-all text-center ${
                policyPreset === 'balanced'
                  ? 'bg-ink text-void shadow-xs font-bold'
                  : 'text-mute hover:text-ink'
              }`}
            >
              ⚖️ Balanced
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playStepTick();
                setPolicyPreset('custom');
              }}
              className={`font-mono text-xs font-semibold py-2.5 px-2 rounded-xl transition-all text-center ${
                policyPreset === 'custom'
                  ? 'bg-ink text-void shadow-xs font-bold'
                  : 'text-mute hover:text-ink'
              }`}
            >
              ⚙️ Custom
            </button>
          </div>
          <p className="font-mono text-[11px] text-mute">
            {policyPreset === 'conservative'
              ? 'Conservative: Max $25/tx, $100 daily limit, restricted to NEAR & Ethereum.'
              : policyPreset === 'balanced'
              ? 'Balanced (Recommended): Max $50/tx, $200 daily limit, all 4 chains enabled.'
              : 'Custom: Fine-tune exact spending caps and chain allowlists below.'}
          </p>
        </div>

        {/* 2. Detailed Controls (Sliders & Switches) */}
        <div className="space-y-4 font-mono">
          {/* Max Single Trade */}
          <div className="p-4 rounded-2xl bg-panel2 border border-line space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink uppercase">Max Per Single Trade</span>
              <span className="text-sm font-bold text-enclave">${policy.maxUsdPerTx}.00</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={policy.maxUsdPerTx}
              onChange={(e) => {
                setPolicyPreset('custom');
                setPolicy({ maxUsdPerTx: Number(e.target.value) });
              }}
              disabled={isRunning}
              className="w-full accent-enclave h-2 bg-line rounded-lg cursor-pointer"
            />
            <div className="flex gap-2 pt-1">
              {[25, 50, 75, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    soundFx.playStepTick();
                    setPolicyPreset('custom');
                    setPolicy({ maxUsdPerTx: val });
                  }}
                  className={`flex-1 text-xs font-bold py-1 rounded-xl border transition-all ${
                    policy.maxUsdPerTx === val
                      ? 'bg-ink text-void border-ink'
                      : 'bg-panel border-line text-mute hover:text-ink'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Budget */}
          <div className="p-4 rounded-2xl bg-panel2 border border-line space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink uppercase">Daily Session Budget Cap</span>
              <span className="text-sm font-bold text-pass">${policy.sessionBudgetCapUsd}.00</span>
            </div>
            <input
              type="range"
              min={50}
              max={500}
              step={25}
              value={policy.sessionBudgetCapUsd}
              onChange={(e) => {
                setPolicyPreset('custom');
                setPolicy({ sessionBudgetCapUsd: Number(e.target.value) });
              }}
              disabled={isRunning}
              className="w-full accent-pass h-2 bg-line rounded-lg cursor-pointer"
            />
          </div>

          {/* Allowed Chains */}
          <div className="p-4 rounded-2xl bg-panel2 border border-line space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink uppercase">Allowed Settlement Chains</span>
              <span className="text-xs text-mute">{policy.chainWhitelist.length} Enabled</span>
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
                    className={`text-xs font-medium px-3 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                      isEnabled
                        ? 'bg-panel border-line text-ink font-bold shadow-xs'
                        : 'bg-void border-line/60 text-mute/40 opacity-50'
                    }`}
                  >
                    {chain.icon}
                    <span className="truncate">{chain.name}</span>
                    <span
                      className={`ml-auto w-2 h-2 rounded-full ${
                        isEnabled ? 'bg-pass' : 'bg-mute/40'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emergency Kill Switch with Confirmation */}
          <div className="p-4 rounded-2xl bg-void border border-block/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-ink uppercase flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${policy.isRevoked ? 'bg-block animate-pulse' : 'bg-pass'}`} />
                  <span>Emergency Kill Switch</span>
                </div>
                <p className="text-[11px] text-mute">
                  Instantly halts all agent spending authorizations.
                </p>
              </div>

              {!confirmFreeze ? (
                <button
                  type="button"
                  onClick={() => setConfirmFreeze(true)}
                  className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                    policy.isRevoked
                      ? 'bg-pass/10 border-pass text-pass hover:bg-pass/20'
                      : 'bg-block/10 border-block/40 text-block hover:bg-block/20'
                  }`}
                >
                  {policy.isRevoked ? 'Unfreeze Agent' : 'Freeze Agent'}
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleExecuteFreeze}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-block text-white hover:opacity-90 shadow-xs"
                  >
                    Confirm {policy.isRevoked ? 'Unfreeze' : 'Freeze'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmFreeze(false)}
                    className="text-xs text-mute hover:text-ink px-2 py-1"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-3.5 sm:p-4 border-t border-line bg-panel2/60 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              setGuardrailsModalOpen(false);
            }}
            className="font-mono text-xs font-bold px-6 py-2 rounded-full bg-ink text-void hover:opacity-90 transition-all shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
