'use client';

/**
 * components/hud/TopBar.tsx
 *
 * Primary navigation header for DarkWallet Vanguard.
 * Features:
 *  - Brand: ◆ Vanguard (Private AI Treasury Agent)
 *  - Top Navigation Tabs: Vault · Test · Simulate · Activity
 *  - Dynamic Shield Status Chip: [ 🛡️ Shield: Active ● ] (Opens Shield Execution Drawer)
 *  - NEAR Cloud Wallet & Web3 Connection Pill
 *  - Theme Toggle, Daemon Mode, Sound & Guide controls
 */

import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';
import { NearLogo } from '@/components/icons/CryptoLogos';

const NAV_TABS = [
  { id: 'vault', label: 'Vault', desc: 'Protected Treasury Card' },
  { id: 'test', label: 'Test', desc: 'Security Gauntlet' },
  { id: 'simulate', label: 'Simulate', desc: '7-Day Fast-Forward' },
  { id: 'activity', label: 'Activity', desc: 'Ledger & Audit Log' },
] as const;

export function TopBar() {
  const activeNavTab = useVaultStore((s) => s.activeNavTab);
  const setActiveNavTab = useVaultStore((s) => s.setActiveNavTab);
  const setShieldDrawerOpen = useVaultStore((s) => s.setShieldDrawerOpen);
  const stage = useVaultStore((s) => s.stage);
  const policy = useVaultStore((s) => s.policy);

  const daemonActive = useVaultStore((s) => s.daemonActive);
  const setDaemonActive = useVaultStore((s) => s.setDaemonActive);
  const muted = useVaultStore((s) => s.muted);
  const toggleMute = useVaultStore((s) => s.toggleMute);
  const setCommandPaletteOpen = useVaultStore((s) => s.setCommandPaletteOpen);
  const setGuideModalOpen = useVaultStore((s) => s.setGuideModalOpen);
  const walletConnected = useVaultStore((s) => s.walletConnected);
  const walletAddress = useVaultStore((s) => s.walletAddress);
  const walletProvider = useVaultStore((s) => s.walletProvider);
  const setWalletModalOpen = useVaultStore((s) => s.setWalletModalOpen);
  const theme = useVaultStore((s) => s.theme);
  const toggleTheme = useVaultStore((s) => s.toggleTheme);

  const handleToggleDaemon = () => {
    soundFx.playStepTick();
    setDaemonActive(!daemonActive);
  };

  const handleToggleMute = () => {
    toggleMute();
    soundFx.setMuted(!muted);
  };

  // Shield status pill logic
  const isRunning =
    stage === 'sealing' || stage === 'enclave' || stage === 'evaluating' || stage === 'settling';
  const isSettled = stage === 'settled';
  const isBlocked = stage === 'blocked';
  const isFrozen = policy.isRevoked;

  return (
    <header className="w-full bg-panel/95 backdrop-blur-md border-b border-line px-3 sm:px-6 lg:px-8 py-3 select-none z-30 sticky top-0 shadow-xs">
      <div className="w-full max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Hardware Trust */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-pass text-void flex items-center justify-center font-mono text-sm font-black shadow-glow-pass">
              ◆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-bold tracking-tight text-ink">
                  Vanguard
                </span>
                <span className="hidden sm:inline-block font-mono text-[10px] px-2 py-0.5 rounded-full bg-panel2 text-mute border border-line font-medium">
                  Intel TDX
                </span>
              </div>
              <p className="font-mono text-[11px] text-mute hidden sm:block">
                Private AI Treasury Agent
              </p>
            </div>
          </div>

          {/* Mobile Shield Chip (visible only on mobile next to brand) */}
          <div className="md:hidden">
            <button
              onClick={() => {
                soundFx.playStepTick();
                setShieldDrawerOpen(true);
              }}
              className={`font-mono text-xs font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 shadow-xs ${
                isFrozen
                  ? 'bg-alert/10 border-alert text-alert animate-pulse'
                  : isRunning
                  ? 'bg-enclave/10 border-enclave text-enclave animate-pulse'
                  : isSettled
                  ? 'bg-pass/15 border-pass text-pass'
                  : isBlocked
                  ? 'bg-alert/10 border-alert text-alert'
                  : 'bg-pass/10 border-pass/40 text-ink'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-pass" />
              <span>Shield</span>
            </button>
          </div>
        </div>

        {/* Center: Navigation Tabs (Vault · Test · Simulate · Activity) */}
        <nav className="flex items-center bg-void/80 p-1 rounded-2xl border border-line shadow-inner max-w-full overflow-x-auto">
          {NAV_TABS.map((tab) => {
            const isActive = activeNavTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playStepTick();
                  setActiveNavTab(tab.id);
                }}
                className={`font-mono text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-panel text-ink border border-line shadow-xs font-bold'
                    : 'text-mute hover:text-ink hover:bg-panel/40'
                }`}
                title={tab.desc}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Shield Pill, Wallet, Theme & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Desktop Shield Status Chip: [ Shield: Active ● ] */}
          <button
            onClick={() => {
              soundFx.playStepTick();
              setShieldDrawerOpen(true);
            }}
            className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-mono text-xs font-bold transition-all shadow-xs active:scale-95 ${
              isFrozen
                ? 'bg-block/15 border-block/50 text-block animate-pulse'
                : isRunning
                ? 'bg-enclave/15 border-enclave/50 text-enclave animate-pulse'
                : isSettled
                ? 'bg-pass/15 border-pass/50 text-pass'
                : isBlocked
                ? 'bg-block/15 border-block/50 text-block'
                : 'bg-pass/10 border-pass/40 text-ink hover:bg-pass/20'
            }`}
            title="Inspect Shield Pipeline, Cryptographic Proofs & 3D Hardware Telemetry"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isFrozen
                  ? 'bg-block'
                  : isRunning
                  ? 'bg-enclave animate-ping'
                  : isSettled
                  ? 'bg-pass'
                  : isBlocked
                  ? 'bg-block'
                  : 'bg-pass animate-pulse'
              }`}
            />
            <span>
              {isFrozen
                ? '❄️ Shield: Frozen'
                : isRunning
                ? '⏳ Shield: Enforcing...'
                : isSettled
                ? '✓ Shield: Settled'
                : isBlocked
                ? '✕ Shield: Blocked'
                : '✓ Shield: Active'}
            </span>
          </button>

          {/* NEAR Cloud Wallet & Web3 Pill */}
          <button
            onClick={() => {
              soundFx.playStepTick();
              setWalletModalOpen(true);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all shadow-xs active:scale-95 font-mono text-xs font-medium ${
              walletConnected
                ? 'border-pass/40 bg-pass/10 hover:bg-pass/15 text-ink'
                : 'border-enclave/60 bg-enclave/10 hover:bg-enclave/20 text-ink font-semibold'
            }`}
            title="Connect or Inspect NEAR FastAuth / Web3 Wallet"
          >
            <NearLogo size={15} />
            {walletConnected ? (
              <span className="font-bold text-ink max-w-[100px] truncate">{walletAddress}</span>
            ) : (
              <span className="font-bold text-ink">Connect</span>
            )}
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={() => {
              soundFx.playStepTick();
              toggleTheme();
            }}
            className="p-1.5 px-2.5 rounded-full border border-line bg-panel hover:bg-panel2 text-xs font-mono text-ink transition-all shadow-xs active:scale-95"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'NEAR Dark'} Mode`}
          >
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
          </button>

          {/* Background Autonomous Daemon Toggle */}
          <button
            onClick={handleToggleDaemon}
            className={`p-1.5 px-2.5 rounded-full border font-mono text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs ${
              daemonActive
                ? 'bg-pass/15 border-pass/40 text-pass font-semibold'
                : 'bg-panel border-line text-mute hover:text-ink'
            }`}
            title="Toggle Background Autonomous Rebalancing Daemon"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                daemonActive ? 'bg-pass animate-pulse' : 'bg-mute'
              }`}
            />
            <span className="hidden lg:inline">{daemonActive ? 'Daemon' : 'Idle'}</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-full border border-line bg-panel text-mute hover:text-ink transition-colors shadow-xs"
            title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {muted ? <span className="text-xs">🔇</span> : <span className="text-xs">🔊</span>}
          </button>

          {/* Guide Tour Launcher */}
          <button
            onClick={() => {
              soundFx.playStepTick();
              setGuideModalOpen(true);
            }}
            className="p-1.5 px-2 rounded-full border border-line bg-panel hover:bg-panel2 font-mono text-xs text-mute hover:text-ink shadow-xs"
            title="Open Interactive Guide"
          >
            ?
          </button>
        </div>
      </div>
    </header>
  );
}
