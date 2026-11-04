'use client';

/**
 * components/hud/TopBar.tsx
 *
 * Primary navigation header for DarkWallet Vanguard.
 * Features:
 *  - Prominent "Run Judge Demo" CTA (triggers 60-second guided run)
 *  - "How It Works / Guide (?)" interactive tour trigger
 *  - Autonomous Daemon mode toggle
 *  - Audio mute toggle
 *  - Command Palette trigger (⌘K)
 *  - Hardware isolation status badge
 */

import { soundFx } from '@/components/AudioFeedback';
import { runIntent } from '@/lib/runIntent';
import { JUDGE_DEMO_SCENARIOS } from '@/lib/demoScript';
import { useVaultStore } from '@/lib/store';

export function TopBar() {
  const stage = useVaultStore((s) => s.stage);
  const runMode = useVaultStore((s) => s.runMode);
  const daemonActive = useVaultStore((s) => s.daemonActive);
  const setDaemonActive = useVaultStore((s) => s.setDaemonActive);
  const muted = useVaultStore((s) => s.muted);
  const toggleMute = useVaultStore((s) => s.toggleMute);
  const setCommandPaletteOpen = useVaultStore((s) => s.setCommandPaletteOpen);
  const setGuideModalOpen = useVaultStore((s) => s.setGuideModalOpen);
  const policy = useVaultStore((s) => s.policy);

  const isRunning =
    stage === 'sealing' || stage === 'enclave' || stage === 'evaluating' || stage === 'settling';

  const handleRunJudgeDemo = async () => {
    soundFx.playStepTick();
    const demo = JUDGE_DEMO_SCENARIOS[0];
    await runIntent(
      {
        goal: demo.goal,
        policy,
      },
      { isJudgeDemo: true }
    );
  };

  const handleToggleDaemon = () => {
    soundFx.playStepTick();
    setDaemonActive(!daemonActive);
  };

  const handleToggleMute = () => {
    toggleMute();
    soundFx.setMuted(!muted);
  };

  return (
    <header className="w-full bg-void/95 backdrop-blur-md border-b border-line px-4 py-2.5 flex items-center justify-between select-none z-30 sticky top-0 shadow-lg">
      {/* Brand & Hardware Status */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg border-2 border-enclave bg-enclave/20 flex items-center justify-center font-mono text-xs font-black text-enclave shadow-glow-enclave">
          DV
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-xs md:text-sm font-bold tracking-wider text-ink drop-shadow-sm">
              DARKWALLET VANGUARD
            </h1>
            <span className="hidden sm:inline-block font-mono text-[9px] px-2 py-0.5 rounded-full bg-enclave/20 text-enclave border border-enclave/50 font-bold tracking-wider shadow-glow-enclave">
              INTEL TDX TEE
            </span>
          </div>
          <p className="font-mono text-[9px] text-mute tracking-tight hidden sm:block">
            Confidential Autonomous AI Treasury & Policy Shield on NEAR
          </p>
        </div>
      </div>

      {/* Primary CTAs & Toggles */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Interactive Guide CTA */}
        <button
          onClick={() => {
            soundFx.playStepTick();
            setGuideModalOpen(true);
          }}
          className="font-mono text-[11px] font-bold px-3 py-1.5 rounded-md border border-enclave/60 bg-enclave/15 text-enclave hover:bg-enclave/25 shadow-glow-enclave transition-all flex items-center gap-1.5 active:scale-95"
          title="Open How to Navigate / Quick Tour"
        >
          <span className="w-2 h-2 rounded-full bg-enclave animate-pulse" />
          <span className="hidden sm:inline">GUIDE / TOUR (?)</span>
          <span className="sm:hidden">GUIDE</span>
        </button>

        {/* Judge Demo CTA */}
        <button
          onClick={handleRunJudgeDemo}
          disabled={isRunning}
          title="Run 60-Second Guided Judge Demo"
          className={`font-mono text-[11px] font-black tracking-wider px-3.5 py-1.5 rounded-md transition-all duration-200 flex items-center gap-2 border ${
            isRunning && runMode === 'judge-demo'
              ? 'bg-enclave/30 border-enclave text-enclave animate-pulse'
              : 'bg-enclave hover:bg-cyan-400 text-void border-enclave shadow-glow-cyan active:scale-95'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="w-2 h-2 rounded-full bg-void animate-ping" />
          <span>RUN JUDGE DEMO</span>
        </button>

        {/* Autonomous Daemon Toggle */}
        <button
          onClick={handleToggleDaemon}
          className={`font-mono text-[10px] font-semibold tracking-wider px-2.5 py-1.5 rounded-md border transition-all flex items-center gap-1.5 ${
            daemonActive
              ? 'bg-pass/20 border-pass text-pass shadow-glow-pass'
              : 'bg-panel border-line text-mute hover:text-ink hover:border-line/80'
          }`}
          title="Toggle Background Autonomous Rebalancing Daemon"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              daemonActive ? 'bg-pass animate-pulse' : 'bg-mute'
            }`}
          />
          <span className="hidden md:inline">DAEMON:</span>
          <span>{daemonActive ? 'ACTIVE' : 'IDLE'}</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={handleToggleMute}
          className="p-1.5 rounded-md border border-line bg-panel text-mute hover:text-ink hover:border-enclave/50 transition-colors"
          title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
        >
          {muted ? (
            <svg
              className="w-4 h-4 text-block/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-ink"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          )}
        </button>

        {/* Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="font-mono text-[10px] text-mute border border-line bg-panel px-2 py-1.5 rounded-md hover:text-ink hover:border-enclave/50 transition-colors hidden sm:flex items-center gap-1 font-semibold"
        >
          <span>⌘K</span>
        </button>
      </div>
    </header>
  );
}
