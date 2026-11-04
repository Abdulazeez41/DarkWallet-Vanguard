'use client';

/**
 * components/hud/TopBar.tsx
 *
 * Primary navigation header for DarkWallet Vanguard.
 * Features:
 *  - Warm Oreo brownish ash & cream aesthetic
 *  - Friendly, calm, rounded shapes (no robotic boxes)
 *  - NEAR Wallet Connection & Account Delegation Pill
 *  - Interactive "How It Works / Guide (?)" tour launcher
 *  - Autonomous Daemon mode toggle
 *  - Audio mute toggle
 */

import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';
import { NearLogo } from '@/components/icons/CryptoLogos';

export function TopBar() {
  const daemonActive = useVaultStore((s) => s.daemonActive);
  const setDaemonActive = useVaultStore((s) => s.setDaemonActive);
  const muted = useVaultStore((s) => s.muted);
  const toggleMute = useVaultStore((s) => s.toggleMute);
  const setCommandPaletteOpen = useVaultStore((s) => s.setCommandPaletteOpen);
  const setGuideModalOpen = useVaultStore((s) => s.setGuideModalOpen);
  const walletConnected = useVaultStore((s) => s.walletConnected);
  const walletAddress = useVaultStore((s) => s.walletAddress);
  const setWalletModalOpen = useVaultStore((s) => s.setWalletModalOpen);

  const handleToggleDaemon = () => {
    soundFx.playStepTick();
    setDaemonActive(!daemonActive);
  };

  const handleToggleMute = () => {
    toggleMute();
    soundFx.setMuted(!muted);
  };

  return (
    <header className="w-full bg-panel/95 backdrop-blur-md border-b border-line px-4 sm:px-6 lg:px-8 xl:px-12 py-3.5 flex items-center justify-between select-none z-30 sticky top-0 shadow-xs">
      <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between">
        {/* Brand & Hardware Trust */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-2xl bg-ink text-white flex items-center justify-center font-mono text-sm font-black shadow-xs">
            DV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-sm sm:text-base font-bold tracking-tight text-ink">
                DARKWALLET VANGUARD
              </h1>
              <span className="hidden sm:inline-block font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-panel2 text-mute border border-line font-medium">
                Intel TDX TEE
              </span>
            </div>
            <p className="font-mono text-xs text-mute hidden sm:block">
              Confidential Autonomous AI Treasury & Policy Shield on NEAR
            </p>
          </div>
        </div>

        {/* Action Controls & Wallet Connection */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* NEAR Wallet Connection Pill */}
          <button
            onClick={() => {
              soundFx.playStepTick();
              setWalletModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-line bg-panel2 hover:border-ink/40 text-xs sm:text-sm font-mono text-ink transition-all shadow-xs active:scale-95"
            title="Inspect Connected NEAR Account & Function-Call Keys"
          >
            <NearLogo size={16} />
            <span className="font-medium hidden sm:inline">
              {walletConnected ? walletAddress : 'Connect Wallet'}
            </span>
            <span className="font-medium sm:hidden">
              {walletConnected ? 'NEAR' : 'Connect'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                walletConnected ? 'bg-pass' : 'bg-mute'
              }`}
            />
          </button>

          {/* Interactive Guide Tour Button */}
          <button
            onClick={() => {
              soundFx.playStepTick();
              setGuideModalOpen(true);
            }}
            className="font-mono text-xs sm:text-sm font-medium px-3.5 py-2 rounded-full border border-line bg-panel hover:bg-panel2 text-ink transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
            title="Open Interactive Navigation & Architectural Walkthrough"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-enclave" />
            <span className="hidden sm:inline">How It Works</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* Autonomous Daemon Toggle */}
          <button
            onClick={handleToggleDaemon}
            className={`font-mono text-xs sm:text-sm font-medium px-3.5 py-2 rounded-full border transition-all flex items-center gap-2 shadow-xs ${
              daemonActive
                ? 'bg-pass/10 border-pass/40 text-pass font-semibold'
                : 'bg-panel border-line text-mute hover:text-ink'
            }`}
            title="Toggle Background Autonomous Rebalancing Daemon"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                daemonActive ? 'bg-pass animate-pulse' : 'bg-mute'
              }`}
            />
            <span className="hidden md:inline">Daemon:</span>
            <span>{daemonActive ? 'Active' : 'Idle'}</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-full border border-line bg-panel text-mute hover:text-ink transition-colors shadow-xs"
            title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {muted ? <span className="text-xs">🔇</span> : <span className="text-xs">🔊</span>}
          </button>

          {/* Quick Command Palette Button */}
          <button
            onClick={() => {
              soundFx.playStepTick();
              setCommandPaletteOpen(true);
            }}
            className="hidden lg:flex items-center gap-1 font-mono text-xs font-medium px-3 py-2 rounded-full border border-line bg-panel text-mute hover:text-ink transition-all shadow-xs"
            title="Open Quick Command Palette (⌘K)"
          >
            <span>⌘K</span>
          </button>
        </div>
      </div>
    </header>
  );
}
