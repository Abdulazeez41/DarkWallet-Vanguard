"use client";

/**
 * app/page.tsx
 *
 * DarkWallet Vanguard - Private AI Treasury Agent on NEAR
 *
 * Progressive Disclosure Architecture:
 *  - Single focal VaultCard on initial load (clean, centered, calm).
 *  - Slide-over ShieldDrawer automatically reveals on execution or via top status pill.
 *  - Clean top navigation: Vault · Test · Simulate · Activity.
 *  - Instant server-rendered skeleton (no cold-start "INITIALIZING..." blank screen).
 */

import { useEffect, useRef } from "react";
import { TopBar } from "@/components/hud/TopBar";
import { ConfidentialityStrip } from "@/components/hud/ConfidentialityStrip";
import { VaultCard } from "@/components/treasury/VaultCard";
import { ShieldDrawer } from "@/components/hud/ShieldDrawer";
import { GuardrailsModal } from "@/components/hud/GuardrailsModal";
import { Gauntlet } from "@/components/hud/Gauntlet";
import { Replay } from "@/components/hud/Replay";
import { BusinessLedger } from "@/components/BusinessLedger";
import { Terminal } from "@/components/hud/Terminal";
import { VaultCanvas } from "@/components/scene/VaultCanvas";
import { Receipt } from "@/components/hud/Receipt";
import { ProofModal } from "@/components/hud/ProofModal";
import { CommandPalette } from "@/components/hud/CommandPalette";
import { GuideModal } from "@/components/hud/GuideModal";
import { WalletModal } from "@/components/hud/WalletModal";
import { MpcDerivationModal } from "@/components/hud/MpcDerivationModal";
import { runIntent } from "@/lib/runIntent";
import { useVaultStore } from "@/lib/store";
import { TreasuryLedgerEntry } from "@/lib/types";

const INITIAL_LEDGER_ENTRIES: TreasuryLedgerEntry[] = [
  {
    entryId: "tx-vanguard-01",
    directiveId: "dir-intents-741a",
    timestamp: "2026-11-06T10:15:00Z",
    grossIntentVolumeUsd: 25.0,
    inferenceCostUsd: 0.008,
    solverRelayerFeeUsd: 0.035,
    marketSlippageGainUsd: 0.042,
    netYieldUsd: 1.992,
    treasuryShareUsd: 1.594,
    contributorPayoutUsd: 0.398,
    contributorAccount: "contributors.vanguard.near",
    status: "SETTLED",
    isSlippageLoss: false,
  },
  {
    entryId: "tx-vanguard-02",
    directiveId: "dir-intents-992b",
    timestamp: "2026-11-06T11:42:00Z",
    grossIntentVolumeUsd: 35.0,
    inferenceCostUsd: 0.012,
    solverRelayerFeeUsd: 0.048,
    marketSlippageGainUsd: 0.055,
    netYieldUsd: 2.816,
    treasuryShareUsd: 2.253,
    contributorPayoutUsd: 0.563,
    contributorAccount: "contributors.vanguard.near",
    status: "SETTLED",
    isSlippageLoss: false,
  },
  {
    entryId: "tx-vanguard-03",
    directiveId: "dir-intents-114c",
    timestamp: "2026-11-06T13:20:00Z",
    grossIntentVolumeUsd: 45.0,
    inferenceCostUsd: 0.015,
    solverRelayerFeeUsd: 0.062,
    marketSlippageGainUsd: -0.018,
    netYieldUsd: 3.568,
    treasuryShareUsd: 2.854,
    contributorPayoutUsd: 0.714,
    contributorAccount: "contributors.vanguard.near",
    status: "SETTLED",
    isSlippageLoss: true,
  },
];

export default function VaultRoomPage() {
  const activeNavTab = useVaultStore((s) => s.activeNavTab);
  const daemonActive = useVaultStore((s) => s.daemonActive);
  const policy = useVaultStore((s) => s.policy);
  const addLog = useVaultStore((s) => s.addLog);
  const theme = useVaultStore((s) => s.theme);
  const ledgerEntry = useVaultStore((s) => s.ledgerEntry);

  const daemonTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Live NEAR Market Price Poller (Pyth Network / Binance / Coinbase / CoinGecko)
  useEffect(() => {
    let isMounted = true;
    const fetchLivePrice = async () => {
      try {
        const res = await fetch('/api/near-price');
        const data = await res.json();
        if (isMounted && data.success && typeof data.price === 'number') {
          useVaultStore.getState().setNearPriceUsd(data.price);
        }
      } catch (err) {
        console.warn('Live price sync notice:', err);
      }
    };

    fetchLivePrice();
    const interval = setInterval(fetchLivePrice, 20_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Auto-detect Meteor Wallet extension or MyNearWallet redirect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const redirectedAccount = params.get("account_id");

    if (redirectedAccount) {
      useVaultStore.getState().connectWallet("web3", redirectedAccount, "MyNearWallet");
      fetch(`/api/near-balance?account=${encodeURIComponent(redirectedAccount)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.balanceNear !== null) {
            useVaultStore.getState().setWalletBalanceNear(d.balanceNear);
          }
        })
        .catch(() => {});
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      const wallet = (window as any).meteorWallet || (window as any).near;
      if (wallet && typeof wallet.isSignedIn === "function") {
        wallet.isSignedIn().then((signedIn: boolean) => {
          if (signedIn) {
            const acc = typeof wallet.getAccountId === "function" ? wallet.getAccountId() : null;
            if (acc) {
              useVaultStore.getState().connectWallet("web3", acc, "Meteor Wallet");
              fetch(`/api/near-balance?account=${encodeURIComponent(acc)}`)
                .then((r) => r.json())
                .then((d) => {
                  if (d.success && d.balanceNear !== null) {
                    useVaultStore.getState().setWalletBalanceNear(d.balanceNear);
                  }
                })
                .catch(() => {});
            }
          }
        }).catch(() => {});
      }
    }
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

  const activeLedgerEntries = ledgerEntry
    ? [ledgerEntry, ...INITIAL_LEDGER_ENTRIES]
    : INITIAL_LEDGER_ENTRIES;

  return (
    <main className="min-h-screen bg-void text-ink flex flex-col font-mono selection:bg-enclave/30 selection:text-enclave">
      {/* 1. Primary Header Navigation */}
      <TopBar />

      {/* 2. Confidentiality Guarantee Strip */}
      <ConfidentialityStrip />

      {/* 3. Main Workspace Container with Progressive Disclosure */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* TAB 1: VAULT (The Centered Single-Action Treasury Card) */}
        {activeNavTab === "vault" && (
          <section className="animate-fadeIn">
            <VaultCard />
          </section>
        )}

        {/* TAB 2: TEST (Security Gauntlet Threat Simulator & 3D Hardware Telemetry) */}
        {activeNavTab === "test" && (
          <section className="space-y-6 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-panel rounded-3xl border border-line space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-base sm:text-lg font-bold text-ink">
                  Test the Shield: Security Gauntlet
                </h2>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-enclave/10 text-enclave border border-enclave/30 font-bold uppercase">
                  Adversary Cyber-Range
                </span>
              </div>
              <p className="font-mono text-xs text-mute leading-relaxed">
                Fire real adversarial payloads (prompt injections, session budget exhaustion, malicious drainer addresses, replay attacks) to verify in real-time that Vanguard&apos;s 3 mathematical gates intercept and shatter each threat.
              </p>
            </div>

            <Gauntlet />

            <div className="bg-panel rounded-3xl border border-line p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-ink">
                  3D Hardware Enclave & Gate Pipeline Visualizer
                </span>
                <span className="text-mute">WebGL / Three.js</span>
              </div>
              <div className="h-[420px] rounded-2xl overflow-hidden border border-line bg-void">
                <VaultCanvas />
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: SIMULATE (7-Day Fast-Forward Operational Replay) */}
        {activeNavTab === "simulate" && (
          <section className="space-y-6 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-panel rounded-3xl border border-line space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-base sm:text-lg font-bold text-ink">
                  7-Day Fast-Forward Operational Replay
                </h2>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-pass/10 text-pass border border-pass/30 font-bold uppercase">
                  Autonomous Economics
                </span>
              </div>
              <p className="font-mono text-xs text-mute leading-relaxed">
                Observe full-week simulation under volatile market conditions: automated self-funded inference deductions to NEAR AI Cloud, realistic DEX slippage, and algorithmic 80/20 revenue distribution between treasury retention and contributor rewards.
              </p>
            </div>

            <Replay />
          </section>
        )}

        {/* TAB 4: ACTIVITY (Autonomous Business Ledger & Real-Time Terminal Log) */}
        {activeNavTab === "activity" && (
          <section className="space-y-6 animate-fadeIn">
            <div className="p-5 sm:p-6 bg-panel rounded-3xl border border-line space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-base sm:text-lg font-bold text-ink">
                  Autonomous Business Ledger & Audit Terminal
                </h2>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-panel2 text-mute border border-line font-bold uppercase">
                  Verifiable Receipts
                </span>
              </div>
              <p className="font-mono text-xs text-mute leading-relaxed">
                Complete audit trail of every autonomous rebalancing cycle, cross-chain intent settlement, cryptographic nonces, and hardware attestation logs.
              </p>
            </div>

            <BusinessLedger entries={activeLedgerEntries} />

            <div className="bg-panel rounded-3xl border border-line p-5 sm:p-6 shadow-xs space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-ink">
                  Hardware Enclave & Policy Firewall Audit Stream
                </span>
                <span className="text-mute">Real-Time Luminous Logs</span>
              </div>
              <div className="h-[360px] rounded-2xl overflow-hidden border border-line bg-void">
                <Terminal />
              </div>
            </div>
          </section>
        )}
      </div>

      {/* 4. Footer Information Bar */}
      <footer className="border-t border-line bg-panel2/80 px-4 sm:px-6 lg:px-8 xl:px-12 py-5 select-none text-xs sm:text-sm font-mono text-mute mt-auto">
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

      {/* 5. Drawers, Modals & Inspection Sheets */}
      <ShieldDrawer />
      <GuardrailsModal />
      <Receipt />
      <ProofModal />
      <CommandPalette />
      <GuideModal />
      <WalletModal />
      <MpcDerivationModal />
    </main>
  );
}
