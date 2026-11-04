'use client';

/**
 * components/hud/WalletModal.tsx
 *
 * NEAR Account & Agent Key Custody Manager.
 *
 * Implements the explicit separation required by Hackathon Track 06 (AI Security & Defense)
 * and Track 04 (Autonomous Business):
 *  - Human Controller Account (e.g. operator.near)
 *  - Sandboxed Agent Account (e.g. vanguard-agent.near)
 *  - Function-call key boundaries & OutLayer policy enforcement
 */

import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';
import { NearLogo } from '@/components/icons/CryptoLogos';

export function WalletModal() {
  const isWalletModalOpen = useVaultStore((s) => s.isWalletModalOpen);
  const setWalletModalOpen = useVaultStore((s) => s.setWalletModalOpen);
  const walletConnected = useVaultStore((s) => s.walletConnected);
  const toggleWallet = useVaultStore((s) => s.toggleWallet);
  const walletAddress = useVaultStore((s) => s.walletAddress);
  const agentAddress = useVaultStore((s) => s.agentAddress);

  if (!isWalletModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg bg-panel rounded-3xl border border-line p-6 sm:p-8 shadow-xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-panel2 border border-line flex items-center justify-center">
              <NearLogo size={22} />
            </div>
            <div>
              <h2 className="font-mono text-base font-bold text-ink">
                NEAR Account & Agent Custody
              </h2>
              <p className="font-mono text-xs text-mute">
                Dual-Key Delegation (Track 06 & Track 04)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playStepTick();
              setWalletModalOpen(false);
            }}
            className="w-8 h-8 rounded-full border border-line hover:border-ink/40 flex items-center justify-center text-mute hover:text-ink transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Account Details */}
        <div className="space-y-4 font-mono">
          {/* Human Controller */}
          <div className="p-4 rounded-2xl bg-panel2 border border-line space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-mute font-medium uppercase tracking-wider">
                Human Owner / Controller
              </span>
              <span className="text-pass font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pass" />
                {walletConnected ? 'Connected' : 'Demo Account'}
              </span>
            </div>
            <div className="text-base font-bold text-ink flex items-center gap-2">
              <NearLogo size={16} />
              <span>{walletConnected ? walletAddress : 'guest.near'}</span>
            </div>
            <p className="text-xs text-mute leading-relaxed pt-1">
              Holds master administrative authority, configures safety guardrails, and receives contributor revenue splits.
            </p>
          </div>

          {/* Autonomous Agent Treasury */}
          <div className="p-4 rounded-2xl bg-panel2 border border-line space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-mute font-medium uppercase tracking-wider">
                Autonomous Agent Treasury Account
              </span>
              <span className="text-enclave font-bold">
                Function-Call Key Only
              </span>
            </div>
            <div className="text-base font-bold text-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-enclave" />
              <span>{agentAddress}</span>
            </div>
            <p className="text-xs text-mute leading-relaxed pt-1">
              Operates exclusively inside the Intel TDX TEE with restricted function-call access. It has <strong>no full-access keys</strong> and cannot transfer funds outside pre-approved policy gates.
            </p>
          </div>

          {/* Security Safeguards Checklist */}
          <div className="p-4 rounded-2xl bg-void border border-line text-xs space-y-2 text-mute">
            <div className="text-ink font-bold uppercase tracking-wider">
              Enforced Access Key Limits:
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pass">✓</span>
              <span>Scoped to contract: <code className="text-ink font-bold">outlayer-policy.near</code></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pass">✓</span>
              <span>Direct balance drain: <strong className="text-block">Disabled</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pass">✓</span>
              <span>Gas allowance capped at 30 TGas per transaction</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              toggleWallet();
            }}
            className="font-mono text-xs font-bold px-4 py-2.5 rounded-full border border-line bg-panel2 hover:border-ink/40 text-ink transition-colors"
          >
            {walletConnected ? 'Disconnect Wallet' : 'Connect operator.near'}
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              setWalletModalOpen(false);
            }}
            className="font-mono text-xs font-bold px-6 py-2.5 rounded-full bg-ink hover:bg-black text-white shadow-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
