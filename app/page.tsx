'use client';

/**
 * app/page.tsx
 *
 * DarkWallet Vanguard - Vault Room Experience
 *
 * A vibrant, 3D, gamified, judge-ready cyber-range:
 *  - 3D Interactive WebGL Vault (Intel TDX Enclave core, 3 Policy Gates, Chain Settlement Rails)
 *  - Streaming NDJSON pipeline synchronization
 *  - 60-Second Guided Judge Demo
 *  - Interactive 4-step Onboarding & Navigation Guide Modal
 *  - 3-Step Quick-Start Ribbon
 *  - Financial Cyber-Range Threat Simulator ("Break the Vault")
 *  - 7-Day Autonomous Treasury Stress Test (Track 04 Business)
 *  - Physical torn-edge cream paper receipt emerging as classified evidence
 */

import { useEffect, useRef, useState } from 'react';
import { TopBar } from '@/components/hud/TopBar';
import { ConfidentialityStrip } from '@/components/hud/ConfidentialityStrip';
import { QuickStartBanner } from '@/components/hud/QuickStartBanner';
import { ControlRail } from '@/components/hud/ControlRail';
import { IntentVault } from '@/components/hud/IntentVault';
import { Gauntlet } from '@/components/hud/Gauntlet';
import { Replay } from '@/components/hud/Replay';
import { PipelineTimeline } from '@/components/hud/PipelineTimeline';
import { Terminal } from '@/components/hud/Terminal';
import { Receipt } from '@/components/hud/Receipt';
import { ProofModal } from '@/components/hud/ProofModal';
import { CommandPalette } from '@/components/hud/CommandPalette';
import { GuideModal } from '@/components/hud/GuideModal';
import { VaultCanvas } from '@/components/scene/VaultCanvas';
import { runIntent } from '@/lib/runIntent';
import { useVaultStore } from '@/lib/store';

export default function VaultRoomPage() {
  const [mounted, setMounted] = useState(false);
  const activeTab = useVaultStore((s) => s.activeTab);
  const stage = useVaultStore((s) => s.stage);
  const daemonActive = useVaultStore((s) => s.daemonActive);
  const policy = useVaultStore((s) => s.policy);
  const addLog = useVaultStore((s) => s.addLog);

  const daemonTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Autonomous Daemon loop (Track 04)
  useEffect(() => {
    if (daemonActive) {
      addLog({
        level: 'enclave',
        source: 'ENCLAVE',
        message: 'AUTONOMOUS REBALANCE DAEMON ACTIVE: Periodic cross-chain monitoring started.',
      });

      daemonTimerRef.current = setInterval(() => {
        const currentStage = useVaultStore.getState().stage;
        const currentRevoked = useVaultStore.getState().policy.isRevoked;

        if (currentStage === 'idle' && !currentRevoked) {
          const spreadPct = (0.6 + Math.random() * 0.8).toFixed(2);
          addLog({
            level: 'info',
            source: 'ENCLAVE',
            message: `[Daemon Pulse] Detected cross-chain spread: ${spreadPct}%. Threshold: 1.00%.`,
          });

          if (Number(spreadPct) >= 1.0) {
            addLog({
              level: 'pass',
              source: 'ENCLAVE',
              message: 'Threshold met. Triggering autonomous rebalance cycle.',
            });
            runIntent({
              goal: 'Autonomous daemon: Rebalance 25 USDC from Solana to Ethereum via NEAR Intents',
              policy,
            });
          }
        }
      }, 16000);
    } else {
      if (daemonTimerRef.current) {
        clearInterval(daemonTimerRef.current);
        daemonTimerRef.current = null;
      }
    }

    return () => {
      if (daemonTimerRef.current) clearInterval(daemonTimerRef.current);
    };
  }, [daemonActive, policy, addLog]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center font-mono text-xs text-mute">
        INITIALIZING DARKWALLET VANGUARD...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-void text-ink flex flex-col font-mono selection:bg-enclave/30 selection:text-enclave">
      {/* 1. Top Navigation Bar */}
      <TopBar />

      {/* 2. Confidentiality Architecture Guarantee Strip */}
      <ConfidentialityStrip />

      {/* 3. 3D WebGL Vault Canvas Stage */}
      <section className="relative w-full h-[430px] md:h-[490px] bg-void border-b border-line overflow-hidden">
        <VaultCanvas />

        {/* Floating In-Scene Telemetry Pill */}
        <div className="absolute top-4 right-4 pointer-events-none z-10 flex items-center gap-2">
          <div className="bg-panel/95 backdrop-blur-md border border-enclave/40 rounded-full px-3 py-1 flex items-center gap-2 font-mono text-[11px] text-mute shadow-glow-enclave">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                stage === 'blocked'
                  ? 'bg-block animate-pulse shadow-glow-block'
                  : stage === 'settled'
                  ? 'bg-pass shadow-glow-pass'
                  : stage === 'idle'
                  ? 'bg-enclave shadow-glow-enclave'
                  : 'bg-warn animate-pulse shadow-glow-warn'
              }`}
            />
            <span className="uppercase text-white font-black tracking-wider">
              STATUS: {stage}
            </span>
            <span className="text-line">|</span>
            <span className="hidden sm:inline text-white/90 font-bold">PARALLAX RIG ACTIVE</span>
          </div>
        </div>

        {/* Floating Axis Labels */}
        <div className="absolute bottom-3 left-4 pointer-events-none z-10 hidden sm:flex items-center gap-4 font-mono text-[10px] text-white/80 font-bold drop-shadow">
          <span className="text-enclave">ORIGIN [X: -8.0]</span>
          <span>→</span>
          <span className="text-enclave">INTEL TDX [X: -4.5]</span>
          <span>→</span>
          <span className="text-enclave">POLICY GATES [X: -1.0 .. 4.0]</span>
          <span>→</span>
          <span className="text-enclave">MULTI-CHAIN RAILS [X: 7.5]</span>
        </div>
      </section>

      {/* 4. Quick-Start 3-Step Navigation Ribbon */}
      <QuickStartBanner />

      {/* 5. Tab Navigation Rail */}
      <ControlRail />

      {/* 6. Main Workspace Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Active Tab Workspace Panel */}
        <section>
          {activeTab === 'intent' && <IntentVault />}
          {activeTab === 'gauntlet' && <Gauntlet />}
          {activeTab === 'replay' && <Replay />}
        </section>

        {/* Real-Time Dual Monitoring Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: 4-Step Pipeline Stepper */}
          <PipelineTimeline />

          {/* Right Column: Real-Time Dark Terminal Stream */}
          <Terminal />
        </section>
      </div>

      {/* 7. Footer Information Bar */}
      <footer className="border-t border-line bg-panel/70 px-4 py-3 select-none text-[11px] font-mono text-mute">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-white/90 font-medium">
            <span className="w-2 h-2 rounded-full bg-pass shadow-glow-pass" />
            <span>NEAR HACKATHON 2026 // TRACK 03 (PRIVACY) · TRACK 06 (SECURITY) · TRACK 04 (BUSINESS)</span>
          </div>
          <div className="text-mute font-medium">
            Intel TDX Enclaves · OutLayer Policies · NEAR Intents & Chain Signatures
          </div>
        </div>
      </footer>

      {/* 8. Overlays & Modals */}
      <Receipt />
      <ProofModal />
      <CommandPalette />
      <GuideModal />
    </main>
  );
}
