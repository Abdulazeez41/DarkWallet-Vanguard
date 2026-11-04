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
      name: 'INTENT VAULT',
      badge: null,
      desc: 'Prompt & Policy Enforcement',
    },
    {
      id: 'gauntlet' as const,
      name: 'BREAK THE VAULT',
      badge: `${stats.threatsDeflected}/4 HELD`,
      badgeClass: 'bg-pass/15 border-pass/30 text-pass',
      desc: 'Financial Cyber-Range Threat Simulator',
    },
    {
      id: 'replay' as const,
      name: '7-DAY REPLAY',
      badge: `+$${stats.cumulativePnlUsd.toFixed(2)}`,
      badgeClass: 'bg-enclave/15 border-enclave/30 text-enclave',
      desc: 'Autonomous Treasury Stress Test',
    },
  ];

  return (
    <div className="w-full bg-panel border-b border-line px-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4">
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
                className={`group py-3 px-3 sm:px-4 border-b-2 font-mono text-xs font-semibold tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-enclave text-ink bg-panel2/60'
                    : 'border-transparent text-mute hover:text-ink hover:border-line'
                }`}
              >
                <span>{tab.name}</span>
                {tab.badge && (
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.5 rounded border font-normal ${tab.badgeClass}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Real-time Defense Rating Indicator */}
        <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-mute py-2">
          <span>DEFENSE INTEGRITY:</span>
          <span className="text-pass font-bold">100% SECURE</span>
          <span className="text-line">|</span>
          <span>AUTONOMOUS YIELD:</span>
          <span className="text-enclave font-bold">+${stats.cumulativePnlUsd.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
