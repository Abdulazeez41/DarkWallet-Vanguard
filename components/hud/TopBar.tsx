'use client';

/**
 * components/hud/TopBar.tsx
 *
 * Primary navigation header for DarkWallet Vanguard.
 * Features:
 *  - Warm creamy, highly legible aesthetic
 *  - Interactive "How It Works / Guide (?)" tour launcher
 *  - Autonomous Daemon mode toggle
 *  - Audio mute toggle
 *  - Command Palette trigger (⌘K)
 *  - Generous typography & wide screen layout
 */

import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';

export function TopBar() {
  const daemonActive = useVaultStore((s) => s.daemonActive);
  const setDaemonActive = useVaultStore((s) => s.setDaemonActive);
  const muted = useVaultStore((s) => s.muted);
  const toggleMute = useVaultStore((s) => s.toggleMute);
  const setCommandPaletteOpen = useVaultStore((s) => s.setCommandPaletteOpen);
  const setGuideModalOpen = useVaultStore((s) => s.setGuideModalOpen);

  const handleToggleDaemon = () => {
    soundFx.playStepTick();
    setDaemonActive(!daemonActive);
  };

  const handleToggleMute = () => {
    toggleMute();
    soundFx.setMuted(!muted);
  };

  return (
    <header className="w-full bg-panel/90 backdrop-blur-md border-b border-line px-4 sm:px-6 lg:px-8 xl:px-12 py-3.5 flex items-center justify-between select-none z-30 sticky top-0 shadow-xs">
      <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between">
        {/* Brand & Hardware Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl border border-enclave/40 bg-enclave/10 flex items-center justify-center font-mono text-sm font-black text-enclave shadow-sm">
            DV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-sm sm:text-base font-black tracking-wider text-ink">
                DARKWALLET VANGUARD
              </h1>
              <span className="hidden sm:inline-block font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-enclave/10 text-enclave border border-enclave/30 font-bold tracking-wider">
                INTEL TDX TEE
              </span>
            </div>
            <p className="font-mono text-xs text-mute tracking-tight hidden sm:block">
              Confidential Autonomous AI Treasury & Policy Shield on NEAR
            </p>
          </div>
        </div>

        {/* Action Controls & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Interactive Guide Tour Button */}
          <button
            onClick={() => {
              soundFx.playStepTick();
              setGuideModalOpen(true);
            }}
            className="font-mono text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl border border-enclave/30 bg-enclave/10 text-enclave hover:bg-enclave/20 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            title="Open Interactive Navigation & Architectural Walkthrough"
          >
            <span className="w-2 h-2 rounded-full bg-enclave animate-pulse" />
            <span className="hidden sm:inline">HOW IT WORKS (?)</span>
            <span className="sm:hidden">GUIDE</span>
          </button>

          {/* Autonomous Daemon Toggle */}
          <button
            onClick={handleToggleDaemon}
            className={`font-mono text-xs sm:text-sm font-semibold tracking-wider px-3.5 py-2 rounded-xl border transition-all flex items-center gap-2 shadow-sm ${
              daemonActive
                ? 'bg-pass/15 border-pass text-pass font-bold'
                : 'bg-panel2 border-line text-mute hover:text-ink'
            }`}
            title="Toggle Background Autonomous Rebalancing Daemon"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                daemonActive ? 'bg-pass animate-pulse' : 'bg-mute'
              }`}
            />
            <span className="hidden md:inline">DAEMON:</span>
            <span>{daemonActive ? 'ACTIVE' : 'IDLE'}</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-xl border border-line bg-panel2 text-mute hover:text-ink transition-colors shadow-sm"
            title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {muted ? (
              <span className="text-xs">🔇</span>
            ) : (
              <span className="text-xs">🔊</span>
            )}
          </button>

          {/* Quick Command Palette Button */}
          <button
            onClick={() => {
              soundFx.playStepTick();
              setCommandPaletteOpen(true);
            }}
            className="hidden sm:flex items-center gap-1.5 font-mono text-xs font-semibold px-3 py-2 rounded-xl border border-line bg-panel2 text-mute hover:text-ink transition-all shadow-sm"
            title="Open Quick Command Palette (⌘K)"
          >
            <span>⌘K</span>
          </button>
        </div>
      </div>
    </header>
  );
}
