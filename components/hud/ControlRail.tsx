'use client';

/**
 * components/hud/ControlRail.tsx
 *
 * Tab controller switching the active interactive workspace between:
 *  - 'intent': Intent Vault (Prompting, redactions, policy caps)
 *  - 'gauntlet': Break the Vault (Financial Cyber-Range threat attacks)
 *  - 'replay': 7-Day Replay (Autonomous Treasury ledger & slippage stress test)
 */

import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';

export function ControlRail() {
  const activeTab = useVaultStore((s) => s.activeTab);
  const setActiveTab = useVaultStore((s) => s.setActiveTab);
  const stats = useVaultStore((s) => s.stats);

  const tabs = [
    {
      id: 'intent' as const,
      name: '1. INTENT VAULT',
      badge: 'INTERACTIVE',
      badgeClass: 'bg-enclave/20 border-enclave/60 text-enclave font-bold shadow-glow-enclave',
      desc: 'Prompt & Policy Enforcement',
    },
    {
      id: 'gauntlet' as const,
      name: '2. BREAK THE VAULT',
      badge: `${stats.threatsDeflected}/4 HELD`,
      badgeClass: 'bg-pass/20 border-pass text-pass font-bold shadow-glow-pass',
      desc: 'Financial Cyber-Range Threat Simulator',
    },
    {
      id: 'replay' as const,
      name: '3. 7-DAY REPLAY',
      badge: `+$${stats.cumulativePnlUsd.toFixed(2)}`,
      badgeClass: 'bg-warn/20 border-warn text-warn font-bold shadow-glow-warn',
      desc: 'Autonomous Treasury Stress Test',
    },
  ];

  return (
    <div className="w-full bg-panel border-b border-line px-4 sm:px-6 lg:px-8 xl:px-12 select-none shadow-md">
      <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between overflow-x-auto gap-4">
        <nav className="flex space-x-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playStepTick();
                  setActiveTab(tab.id);
                }}
                className={`group py-3 px-3.5 sm:px-5 border-b-2 font-mono text-xs font-bold tracking-wider flex items-center gap-2.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-enclave text-white bg-panel2/90 shadow-[inset_0_-2px_8px_rgba(56,189,248,0.3)]'
                    : 'border-transparent text-mute hover:text-white hover:border-enclave/40 hover:bg-panel2/40'
                }`}
              >
                <span>{tab.name}</span>
                {tab.badge && (
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${tab.badgeClass}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Real-time Defense Rating Indicator */}
        <div className="hidden md:flex items-center gap-3 font-mono text-[11px] text-mute py-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pass shadow-glow-pass" />
            <span className="text-mute font-semibold">DEFENSE:</span>
            <span className="text-pass font-black">100% SECURE</span>
          </div>
          <span className="text-line">|</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-enclave shadow-glow-enclave" />
            <span className="text-mute font-semibold">AUTONOMOUS YIELD:</span>
            <span className="text-enclave font-black">+${stats.cumulativePnlUsd.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
