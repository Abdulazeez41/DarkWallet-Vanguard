'use client';

import React, { useEffect, useState } from 'react';

interface CommandItem {
  readonly id: string;
  readonly label: string;
  readonly shortcut?: string;
  readonly category: 'QUICK RUN' | 'SECURITY' | 'SETTINGS';
  readonly onSelect: () => void;
}

interface CommandPaletteProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSelectPrompt: (prompt: string) => void;
  readonly onTriggerTamperTest: () => void;
  readonly onToggleRevoke: () => void;
  readonly isRevoked: boolean;
  readonly onToggleSound: () => void;
  readonly isMuted: boolean;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectPrompt,
  onTriggerTamperTest,
  onToggleRevoke,
  isRevoked,
  onToggleSound,
  isMuted,
}: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: readonly CommandItem[] = [
    {
      id: 'dark-arbitrage',
      label: 'Execute Dark Arbitrage (Solana to Ethereum USDC spread)',
      shortcut: 'Tag 1',
      category: 'QUICK RUN',
      onSelect: () => {
        onSelectPrompt(
          'Arbitrage stablecoins between Solana and Ethereum when the spread is above 1% and keep my balance hidden.'
        );
        onClose();
      },
    },
    {
      id: 'yield-protection',
      label: 'Execute Yield Protection (Rebalance USDC to Bitcoin treasury)',
      shortcut: 'Tag 2',
      category: 'QUICK RUN',
      onSelect: () => {
        onSelectPrompt(
          'Protect yield reserves by rebalancing 45 USD from Ethereum to Bitcoin treasury without public telemetry.'
        );
        onClose();
      },
    },
    {
      id: 'cross-chain-rebalance',
      label: 'Execute Cross-Chain Rebalance (Solana to NEAR token shift)',
      shortcut: 'Tag 3',
      category: 'QUICK RUN',
      onSelect: () => {
        onSelectPrompt(
          'Shift 20 USD equivalent between Solana and NEAR using zero-knowledge solver routing.'
        );
        onClose();
      },
    },
    {
      id: 'tamper-test',
      label: 'Trigger Tamper Test (Simulate $500 rogue oversized trade)',
      shortcut: 'Test',
      category: 'SECURITY',
      onSelect: () => {
        onTriggerTamperTest();
        onClose();
      },
    },
    {
      id: 'revoke-toggle',
      label: isRevoked ? 'Re-Authorize Autonomous Agent' : 'Revoke Agent Kill Switch (Halt All Runs)',
      shortcut: 'Kill',
      category: 'SECURITY',
      onSelect: () => {
        onToggleRevoke();
        onClose();
      },
    },
    {
      id: 'sound-toggle',
      label: isMuted ? 'Unmute Mechanical Step Audio' : 'Mute Mechanical Step Audio',
      shortcut: 'Audio',
      category: 'SETTINGS',
      onSelect: () => {
        onToggleSound();
        onClose();
      },
    },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      } else if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev <= 0 ? (filtered.length || 1) - 1 : prev - 1
          );
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filtered[selectedIndex]) {
            filtered[selectedIndex].onSelect();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#1E1E1E]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-3xl shadow-[6px_6px_0px_0px_#1E1E1E] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="p-4 border-b-2 border-[#1E1E1E] flex items-center gap-3 bg-[#FAF7F0]">
          <span className="text-xs font-mono font-bold text-[#666666] uppercase">
            &gt;_
          </span>
          <input
            type="text"
            autoFocus
            placeholder="Type a command or quick action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent font-mono text-sm text-[#1E1E1E] placeholder-[#888888] focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#EAE5DC] border border-[#1E1E1E] rounded-md text-[#1E1E1E]">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center font-mono text-xs text-[#888888]">
              No matching commands found
            </div>
          ) : (
            filtered.map((cmd, idx) => (
              <button
                key={cmd.id}
                type="button"
                onClick={cmd.onSelect}
                className={`w-full text-left p-2.5 rounded-xl font-mono text-xs flex items-center justify-between border-2 transition-all ${
                  selectedIndex === idx
                    ? 'bg-[#FEF3C7] border-[#1E1E1E] shadow-[2px_2px_0px_0px_#1E1E1E]'
                    : 'bg-transparent border-transparent hover:bg-[#F5EBE1]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF7F0] border border-[#D5D0C5] text-[#666666]">
                    {cmd.category}
                  </span>
                  <span className="font-bold text-[#1E1E1E]">{cmd.label}</span>
                </div>
                {cmd.shortcut && (
                  <span className="text-[10px] text-[#666666] font-bold">
                    {cmd.shortcut}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-[#FAF7F0] border-t border-[#E0DCD3] flex items-center justify-between text-[10px] font-mono text-[#666666]">
          <span>Use UP / DOWN arrows to navigate</span>
          <span>ENTER to select</span>
        </div>
      </div>
    </div>
  );
}
