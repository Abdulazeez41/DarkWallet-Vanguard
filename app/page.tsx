"use client";

/**
 * app/page.tsx
 *
 * DarkWallet Vanguard - Streamlined Consumer-Grade Autonomous Treasury
 *
 * Layout Structure:
 *  1. Top Section: Clean, elegant Treasury & Agent Command Card
 *     (Simple English, quick one-click actions, human balance, official crypto logos).
 *  2. Middle Section: Agent Guardrails in simple, plain-English safety switches
 *     (Max per tx, daily budget with progress, approved networks, emergency freeze).
 *  3. Bottom Section: Sleek "Live Shield Monitor & Activity"
 *     (3D WebGL Hardware Enclave visualization & tabbed telemetry / attack simulator / receipts).
 */

import { useEffect, useRef, useState } from "react";
import { TopBar } from "@/components/hud/TopBar";
import { ConfidentialityStrip } from "@/components/hud/ConfidentialityStrip";
import { TreasuryCommandCard } from "@/components/treasury/TreasuryCommandCard";
import { AgentGuardrails } from "@/components/treasury/AgentGuardrails";
import { LiveShieldMonitor } from "@/components/treasury/LiveShieldMonitor";
import { Receipt } from "@/components/hud/Receipt";
import { ProofModal } from "@/components/hud/ProofModal";
import { CommandPalette } from "@/components/hud/CommandPalette";
import { GuideModal } from "@/components/hud/GuideModal";
import { WalletModal } from "@/components/hud/WalletModal";
import { MpcDerivationModal } from "@/components/hud/MpcDerivationModal";
import { runIntent } from "@/lib/runIntent";
import { useVaultStore } from "@/lib/store";

export default function VaultRoomPage() {
  const [mounted, setMounted] = useState(false);
  const daemonActive = useVaultStore((s) => s.daemonActive);
  const policy = useVaultStore((s) => s.policy);
  const addLog = useVaultStore((s) => s.addLog);

  const daemonTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Autonomous Daemon loop (Track 04 Autonomous Rebalance)
  useEffect(() => {
    if (daemonActive) {
      addLog({
        level: "enclave",
        source: "ENCLAVE",
        message:
          "AUTONOMOUS REBALANCE DAEMON ACTIVE: Periodic cross-chain monitoring started.",
      });

      daemonTimerRef.current = setInterval(() => {
        const currentStage = useVaultStore.getState().stage;
        const currentRevoked = useVaultStore.getState().policy.isRevoked;

        if (currentStage === "idle" && !currentRevoked) {
          const spreadPct = (0.6 + Math.random() * 0.8).toFixed(2);
          addLog({
            level: "info",
            source: "ENCLAVE",
            message: `[Daemon Pulse] Detected cross-chain spread: ${spreadPct}%. Threshold: 1.00%.`,
          });

          if (Number(spreadPct) >= 1.0) {
            addLog({
              level: "pass",
              source: "ENCLAVE",
              message: "Threshold met. Triggering autonomous rebalance cycle.",
            });
            runIntent(
              {
                goal: "Autonomous daemon: Rebalance 25 USDC from Solana to Ethereum via NEAR Intents",
                policy,
              },
              { runMode: "daemon" }
            );
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

      {/* 2. Confidentiality Guarantee Strip */}
      <ConfidentialityStrip />

      {/* 3. Main Streamlined Treasury Workspace (Wide Desktop Responsive Fit) */}
      <div className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 space-y-6">
        {/* Top Section: Clean, elegant Treasury & Agent Command Card */}
        <section>
          <TreasuryCommandCard />
        </section>

        {/* Middle Section: Agent Guardrails in simple, plain-English safety switches */}
        <section>
          <AgentGuardrails />
        </section>

        {/* Bottom Section: Sleek Live Shield Monitor & Activity */}
        <section>
          <LiveShieldMonitor />
        </section>
      </div>

      {/* 4. Footer Information Bar */}
      <footer className="border-t border-line bg-panel2/80 px-4 sm:px-6 lg:px-8 xl:px-12 py-5 select-none text-xs sm:text-sm font-mono text-mute">
        <div className="w-full max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div className="flex items-center gap-2.5 text-ink font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-pass" />
            <span>NEAR Protocol Chain Abstraction</span>
          </div>
          <div className="text-mute font-medium">
            Hardware TEE Enclaves (Intel TDX) · Policy Guardrails · NEAR Intents & Chain Signatures
          </div>
        </div>
      </footer>

      {/* 5. Modals & Notifications */}
      <Receipt />
      <ProofModal />
      <CommandPalette />
      <GuideModal />
      <WalletModal />
      <MpcDerivationModal />
    </main>
  );
}
