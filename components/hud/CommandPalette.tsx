'use client';

/**
 * components/hud/CommandPalette.tsx
 *
 * Fast keyboard-navigable command overlay triggered by ⌘K or top bar button.
 * Allows instant execution of Judge Demo, threat scenarios, tab switching, and proof inspection.
 */

import { useEffect, useState } from 'react';
import { soundFx } from '@/components/AudioFeedback';
import { runIntent } from '@/lib/runIntent';
import { JUDGE_DEMO_SCENARIOS } from '@/lib/demoScript';
import { useVaultStore } from '@/lib/store';

export function CommandPalette() {
  const isCommandPaletteOpen = useVaultStore((s) => s.isCommandPaletteOpen);
  const setCommandPaletteOpen = useVaultStore((s) => s.setCommandPaletteOpen);
  const setActiveTab = useVaultStore((s) => s.setActiveTab);
  const setProofModalOpen = useVaultStore((s) => s.setProofModalOpen);
  const toggleMute = useVaultStore((s) => s.toggleMute);
  const daemonActive = useVaultStore((s) => s.daemonActive);
  const setDaemonActive = useVaultStore((s) => s.setDaemonActive);
  const policy = useVaultStore((s) => s.policy);
  const setPolicy = useVaultStore((s) => s.setPolicy);

  const [query, setQuery] = useState('');

  // Global keybinding listener for ⌘K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const commands = [
    {
      id: 'cmd_quick_swap',
      label: 'Quick Swap: 25 USDC Solana → Ethereum',
      category: 'REBALANCE',
      action: async () => {
        setCommandPaletteOpen(false);
        const demo = JUDGE_DEMO_SCENARIOS[0];
        await runIntent({ goal: demo.goal, policy });
      },
    },
    {
      id: 'cmd_threat_drainer',
      label: 'Launch Threat: Phishing Drainer (Shatters at Gate 2)',
      category: 'CYBER-RANGE',
      action: async () => {
        setCommandPaletteOpen(false);
        const demo = JUDGE_DEMO_SCENARIOS[1];
        await runIntent({ goal: demo.goal, policy, threatType: demo.threatType });
      },
    },
    {
      id: 'cmd_threat_budget',
      label: 'Launch Threat: Budget Exhaustion (Shatters at Gate 1)',
      category: 'CYBER-RANGE',
      action: async () => {
        setCommandPaletteOpen(false);
        const demo = JUDGE_DEMO_SCENARIOS[2];
        await runIntent({ goal: demo.goal, policy, threatType: demo.threatType });
      },
    },
    {
      id: 'cmd_threat_replay',
      label: 'Launch Threat: Stale Nonce Replay (Shatters at Gate 3)',
      category: 'CYBER-RANGE',
      action: async () => {
        setCommandPaletteOpen(false);
        const demo = JUDGE_DEMO_SCENARIOS[3];
        await runIntent({ goal: demo.goal, policy, threatType: demo.threatType });
      },
    },
    {
      id: 'cmd_tab_intent',
      label: 'Switch to Intent Vault',
      category: 'NAVIGATION',
      action: () => {
        setActiveTab('intent');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd_tab_gauntlet',
      label: 'Switch to Break the Vault (Cyber-Range)',
      category: 'NAVIGATION',
      action: () => {
        setActiveTab('gauntlet');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd_tab_replay',
      label: 'Switch to 7-Day Replay',
      category: 'NAVIGATION',
      action: () => {
        setActiveTab('replay');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd_proofs',
      label: 'Inspect Cryptographic Proofs & Nonces',
      category: 'SECURITY',
      action: () => {
        setCommandPaletteOpen(false);
        setProofModalOpen(true);
      },
    },
    {
      id: 'cmd_daemon',
      label: `Toggle Autonomous Daemon (${daemonActive ? 'Turn Off' : 'Turn On'})`,
      category: 'CONTROL',
      action: () => {
        setDaemonActive(!daemonActive);
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd_mute',
      label: 'Toggle Audio Feedback',
      category: 'AUDIO',
      action: () => {
        toggleMute();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd_kill_switch',
      label: policy.isRevoked ? 'Disarm Kill Switch' : 'TRIP EMERGENCY KILL SWITCH',
      category: 'EMERGENCY',
      action: () => {
        setPolicy({ isRevoked: !policy.isRevoked });
        setCommandPaletteOpen(false);
      },
    },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-void/80 backdrop-blur-sm select-none">
      <div className="bg-panel border border-line rounded-lg max-w-xl w-full shadow-2xl overflow-hidden font-mono text-xs">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-line flex items-center gap-2">
          <span className="text-mute font-bold">⌘</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or attack scenario..."
            className="w-full bg-transparent text-ink placeholder:text-mute/60 focus:outline-none"
          />
          <span className="text-[10px] text-mute border border-line px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Command List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-mute">No commands matching &quot;{query}&quot;</div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => {
                  soundFx.playStepTick();
                  cmd.action();
                }}
                className="w-full text-left p-2 rounded hover:bg-panel2 flex items-center justify-between text-ink transition-colors group"
              >
                <span className="group-hover:text-enclave transition-colors font-semibold">
                  {cmd.label}
                </span>
                <span className="text-[9px] text-mute border border-line/60 px-1.5 py-0.5 rounded uppercase">
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
