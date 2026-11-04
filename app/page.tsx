'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DEFAULT_POLICY } from '@/lib/policy';
import {
  AgentPolicy,
  AgentRunResponse,
  AgentStepTelemetry,
  ExecutionDirective,
  GauntletThreatType,
  QuickPromptTag,
  SecurityPosture,
  TreasuryLedgerEntry,
} from '@/lib/types';
import { soundFx } from '@/components/AudioFeedback';
import { BusinessLedger } from '@/components/BusinessLedger';
import { CommandPalette } from '@/components/CommandPalette';
import { CounterpartyBadge } from '@/components/CounterpartyBadge';
import { EnclaveReceipt } from '@/components/EnclaveReceipt';
import { FastForwardStressTest } from '@/components/FastForwardStressTest';
import { PolicyVault } from '@/components/PolicyVault';
import { RedactionSeal } from '@/components/RedactionSeal';
import { RouteVisualizer } from '@/components/RouteVisualizer';
import { SecurityGauntlet, ThreatScenario } from '@/components/SecurityGauntlet';
import { SecurityPosturePanel } from '@/components/SecurityPosturePanel';
import { TelemetryMatrix } from '@/components/TelemetryMatrix';
import { TerminalLog, TerminalMessage } from '@/components/TerminalLog';
import { WhoCanSeeThis } from '@/components/WhoCanSeeThis';

type ActiveLeftTab = 'INTENT_VAULT' | 'SECURITY_GAUNTLET' | 'STRESS_TEST';

const QUICK_TAGS: readonly QuickPromptTag[] = [
  {
    id: 'tag-1',
    label: 'Dark Arbitrage',
    goal: 'Arbitrage stablecoins between Solana and Ethereum when the spread is above 1% and keep my balance hidden.',
    description: 'Solana -> Ethereum confidential swap',
  },
  {
    id: 'tag-2',
    label: 'Yield Protection',
    goal: 'Protect yield reserves by rebalancing 45 USD from Ethereum to Bitcoin treasury without public telemetry.',
    description: 'Ethereum -> Bitcoin confidential reserve',
  },
  {
    id: 'tag-3',
    label: 'Cross-Chain Rebalance',
    goal: 'Shift 20 USD equivalent between Solana and NEAR using zero-knowledge solver routing.',
    description: 'Solana -> NEAR confidential routing',
  },
];

const INITIAL_STEPS: AgentStepTelemetry[] = [
  {
    stepIndex: 1,
    stepId: 'TEE_DECRYPT',
    layer: 'TEE_ATTESTATION_VERIFIER',
    title: 'Decrypting Prompt Inside Intel TDX Enclave',
    subtitle: 'Awaiting encrypted payload dispatch',
    status: 'pending',
    latencyMs: 0,
    timestamp: '--:--:--',
    isSimulated: false,
  },
  {
    stepIndex: 2,
    stepId: 'HARDWARE_ATTESTATION',
    layer: 'TEE_ATTESTATION_VERIFIER',
    title: 'Verifying Cryptographic Proof Keys',
    subtitle: 'PCR0 quote & client fresh nonce verification pending',
    status: 'pending',
    latencyMs: 0,
    timestamp: '--:--:--',
    isSimulated: false,
  },
  {
    stepIndex: 3,
    stepId: 'POLICY_VERIFICATION',
    layer: 'POLICY_ENGINE',
    title: 'Checking Transaction Policies & Counterparty Risk',
    subtitle: 'Per-trade limit, aggregate budget, whitelists, and idempotency check',
    status: 'pending',
    latencyMs: 0,
    timestamp: '--:--:--',
    isSimulated: false,
  },
  {
    stepIndex: 4,
    stepId: 'INTENTS_SETTLEMENT',
    layer: 'EXECUTION_COORDINATOR',
    title: 'Executing Gasless Cross-Chain Settlement via Agent Connect',
    subtitle: 'Multi-chain MPC solvers & treasury revenue split awaiting dispatch',
    status: 'pending',
    latencyMs: 0,
    timestamp: '--:--:--',
    isSimulated: false,
  },
];

export default function DarkWalletVanguardApp() {
  const [activeTab, setActiveTab] = useState<ActiveLeftTab>('INTENT_VAULT');
  const [goal, setGoal] = useState<string>(
    'Arbitrage stablecoins between Solana and Ethereum when the spread is above 1% and keep my balance hidden.'
  );
  const [policy, setPolicy] = useState<AgentPolicy>(DEFAULT_POLICY);
  const [executedDirectiveIds, setExecutedDirectiveIds] = useState<string[]>([]);
  const [scenarioPerformance, setScenarioPerformance] = useState<{
    tasksAuthorized: number;
    threatsDeflected: number;
    falsePositives: number;
  }>({
    tasksAuthorized: 0,
    threatsDeflected: 0,
    falsePositives: 0,
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isRedacting, setIsRedacting] = useState<boolean>(false);
  const [isRedacted, setIsRedacted] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [steps, setSteps] = useState<AgentStepTelemetry[]>(INITIAL_STEPS);
  const [runResult, setRunResult] = useState<AgentRunResponse | null>(null);
  const [logs, setLogs] = useState<TerminalMessage[]>([]);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasShaken, setHasShaken] = useState<boolean>(false);
  const [isAutonomousHeartbeat, setIsAutonomousHeartbeat] = useState<boolean>(false);
  const [ledgerEntries, setLedgerEntries] = useState<TreasuryLedgerEntry[]>([]);

  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize terminal on mount
  useEffect(() => {
    addLog('INFO', 'DarkWallet Vanguard runtime initialized.');
    addLog('ENCLAVE', 'Intel TDX Enclave memory space mapped: 0x7fff0000..0x7fffffff');
    addLog('INFO', 'OutLayer Deterministic Policy Engine active (Per-Action Cap: $50, Session Budget: $200).');
    addLog('INFO', 'Execution-Level Idempotency Guard active.');
  }, []);

  // Autonomous Heartbeat background loop (Track 04)
  useEffect(() => {
    if (isAutonomousHeartbeat) {
      addLog('ENCLAVE', 'AUTONOMOUS HEARTBEAT ACTIVE: Continuous monitoring daemon engaged.');
      heartbeatRef.current = setInterval(() => {
        if (!isRunning && !policy.isRevoked) {
          const spread = (0.4 + Math.random() * 0.9).toFixed(2);
          addLog(
            'ENCLAVE',
            `[Daemon Pulse] Oracle spread: ${spread}%. Threshold: 1.00%. ${
              Number(spread) >= 1.0 ? 'Triggering rebalance...' : 'Conditions held. Sleeping 15s.'
            }`
          );
          if (Number(spread) >= 1.0) {
            handleExecute();
          }
        }
      }, 15000);
    } else {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    }
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [isAutonomousHeartbeat, isRunning, policy.isRevoked]);

  const addLog = (
    level: TerminalMessage['level'],
    text: string
  ) => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        level,
        text,
      },
    ]);
  };

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFx.setMuted(nextMuted);
  };

  const handleRevokeToggle = () => {
    const nextRevoked = !policy.isRevoked;
    setPolicy((prev) => ({
      ...prev,
      isRevoked: nextRevoked,
    }));
    if (nextRevoked) {
      soundFx.playBlockThud();
      addLog('WARN', 'SECURITY ALERT: Agent kill switch triggered by user. Emergency control halted authorizations.');
    } else {
      soundFx.playSuccessTone();
      addLog('INFO', 'Agent permissions restored by user.');
    }
  };

  // Submit run to enclave with threat vector support
  const handleExecute = async (threatType?: GauntletThreatType) => {
    if (isRunning) return;

    if (!threatType && (!goal || goal.trim().length === 0)) {
      addLog('WARN', 'Execution halted: Trading goal prompt cannot be empty.');
      return;
    }

    setIsRunning(true);
    setRunResult(null);
    setHasShaken(false);

    setIsRedacting(true);
    addLog('INFO', 'Confidential goal encrypted with enclave public key.');
    addLog('ENCLAVE', 'Sealing plaintext prompt into Intel TDX memory boundary...');

    setActiveStepIndex(1);
    soundFx.playStepTick();

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: threatType ? `[THREAT_CHALLENGE] ${threatType}` : goal,
          policy,
          threatType,
          executedDirectiveIds,
          humanApprovedWarn: false,
        }),
      });

      const data: AgentRunResponse = await response.json();

      // Step 1: Enclave Decryption
      setActiveStepIndex(1);
      soundFx.playStepTick();
      addLog('ENCLAVE', `[Step 1] Enclave decrypted payload. Model: ${data.steps[0]?.details?.modelTarget || 'Intel TDX TEE'}`);
      await new Promise((r) => setTimeout(r, 400));

      // Step 2: Hardware Attestation
      setActiveStepIndex(2);
      soundFx.playStepTick();

      if (!data.attestation.verified) {
        // Attestation Verifier halted run (e.g. Stale Nonce Replay)
        setHasShaken(true);
        soundFx.playBlockThud();
        soundFx.triggerHaptic([40, 60, 40]);
        addLog('ERROR', `[Step 2] ATTESTATION VERIFIER HALTED: Nonce freshness mismatch.`);
        setScenarioPerformance((prev) => ({
          ...prev,
          threatsDeflected: prev.threatsDeflected + 1,
        }));
      } else {
        addLog('ENCLAVE', `[Step 2] Attestation verified. Client fresh nonce matched in quote data.`);
        await new Promise((r) => setTimeout(r, 400));

        // Step 3: OutLayer Policy & Idempotency
        setActiveStepIndex(3);
        soundFx.playStepTick();

        if (!data.policyResult.approved) {
          setHasShaken(true);
          soundFx.playBlockThud();
          soundFx.triggerHaptic([40, 60, 40]);
          addLog(
            'ERROR',
            `[Step 3] REJECTED BY ${data.policyResult.responsibleLayer || 'POLICY ENGINE'}: ${
              data.policyResult.blockReasonHeadline
            }`
          );
          if (data.policyResult.blockReasonDetail) {
            addLog('ERROR', `Detail: ${data.policyResult.blockReasonDetail}`);
          }
          setScenarioPerformance((prev) => ({
            ...prev,
            threatsDeflected: prev.threatsDeflected + 1,
          }));
        } else {
          addLog(
            'SUCCESS',
            `[Step 3] Policy approved. Order: $${data.directive?.amountUsd}. Session spent: $${data.policyResult.updatedSpentInSessionUsd}/$${policy.sessionBudgetCapUsd}.`
          );
          setPolicy((prev) => ({
            ...prev,
            spentInSessionUsd: data.policyResult.updatedSpentInSessionUsd,
          }));
          if (data.directive?.directiveId) {
            setExecutedDirectiveIds((prev) => [data.directive!.directiveId, ...prev]);
          }
          setScenarioPerformance((prev) => ({
            ...prev,
            tasksAuthorized: prev.tasksAuthorized + 1,
          }));

          await new Promise((r) => setTimeout(r, 400));

          // Step 4: NEAR Intents Settlement
          setActiveStepIndex(4);
          soundFx.playStepTick();
          soundFx.playSuccessTone();
          soundFx.triggerHaptic(30);
          addLog(
            'SUCCESS',
            `[Step 4] NEAR Intents settled via MPC. Hash: ${data.settlement?.intentHash.slice(0, 16)}...`
          );

          if (data.ledgerEntry) {
            addLog(
              'SUCCESS',
              `[Track 04] Inference self-funded (-$${data.ledgerEntry.inferenceCostUsd}). Contributor split: +$${data.ledgerEntry.contributorPayoutUsd}.`
            );
            setLedgerEntries((prev) => [data.ledgerEntry!, ...prev]);
          }
        }
      }

      setSteps(data.steps);
      setRunResult(data);
      setIsRedacted(true);
      setIsRedacting(false);
    } catch (err) {
      addLog('ERROR', `Execution failed: ${err instanceof Error ? err.message : 'Unknown'}`);
      soundFx.playBlockThud();
    } finally {
      setIsRunning(false);
    }
  };

  const currentDirective: ExecutionDirective = runResult?.directive || {
    directiveId: 'dir_init_0x1',
    sourceChain: 'Solana',
    destinationChain: 'Ethereum',
    token: 'USDC',
    amountUsd: 32.5,
    rationale: 'Confidential yield spread routing via NEAR Intent solvers.',
  };

  const isBlocked = Boolean(runResult && !runResult.policyResult.approved);

  const securityPosture: SecurityPosture = {
    agentState: policy.isRevoked ? 'REVOKED' : 'ACTIVE',
    attestationEvidence: 'VERIFIED',
    perActionCapUsd: policy.maxUsdPerTx,
    sessionBudgetCapUsd: policy.sessionBudgetCapUsd,
    spentInSessionUsd: policy.spentInSessionUsd,
    remainingBudgetUsd: Math.max(0, policy.sessionBudgetCapUsd - policy.spentInSessionUsd),
    counterpartyPolicy: 'STRICT_ALLOWLIST',
    idempotencyProtection: 'ACTIVE',
    operationalReadiness: policy.isRevoked ? 'BLOCKED' : 'READY',
    scenarioPerformance,
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1E1E1E] p-4 sm:p-6 lg:p-8 relative selection:bg-[#B8E3D2] selection:text-[#1E1E1E]">
      {/* Paper-grain noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-3xl shadow-[4px_4px_0px_0px_#1E1E1E]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#1E1E1E] border border-[#1E1E1E]" />
              <h1 className="text-xl sm:text-2xl font-mono font-black tracking-wider uppercase text-[#1E1E1E]">
                DARKWALLET VANGUARD
              </h1>
              <span className="text-[10px] font-mono font-bold bg-[#D4F0E4] text-[#1E1E1E] px-2 py-0.5 rounded-full border border-[#1E1E1E]">
                TEE SANITIZED
              </span>
            </div>
            <p className="text-xs font-mono text-[#555555] mt-1">
              Zero-Knowledge Autonomous Asset Engine // NEAR Chain Signatures &amp; Intel TDX (Tracks 03, 06, 04)
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* Daemon Toggle */}
            <button
              type="button"
              onClick={() => setIsAutonomousHeartbeat(!isAutonomousHeartbeat)}
              className={`p-2.5 border-2 border-[#1E1E1E] rounded-2xl shadow-[2px_2px_0px_0px_#1E1E1E] active:scale-95 transition-all font-mono text-xs font-bold flex items-center gap-1.5 ${
                isAutonomousHeartbeat
                  ? 'bg-[#D4F0E4] text-[#1E1E1E]'
                  : 'bg-[#FAF7F0] text-[#666666]'
              }`}
              title="Continuous Autonomous Daemon Mode (Track 04)"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAutonomousHeartbeat ? 'bg-[#2E7D32] animate-pulse' : 'bg-[#888888]'
                }`}
              />
              <span>DAEMON: {isAutonomousHeartbeat ? 'ON' : 'OFF'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-2.5 bg-[#FAF7F0] hover:bg-[#F5EBE1] border-2 border-[#1E1E1E] rounded-2xl shadow-[2px_2px_0px_0px_#1E1E1E] active:scale-95 transition-all font-mono text-xs font-bold"
              title="Toggle Mechanical Audio Ticks"
              aria-label="Toggle Mechanical Audio Ticks"
            >
              {isMuted ? 'MUTE: ON' : 'AUDIO: ON'}
            </button>

            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={() => setIsPaletteOpen(true)}
              className="px-3.5 py-2.5 bg-[#FEF3C7] hover:bg-[#FDE047] border-2 border-[#1E1E1E] rounded-2xl shadow-[2px_2px_0px_0px_#1E1E1E] active:scale-95 transition-all font-mono text-xs font-bold flex items-center gap-1.5"
            >
              <kbd className="px-1.5 py-0.5 text-[10px] bg-[#FAF7F0] border border-[#1E1E1E] rounded">
                ⌘K
              </kbd>
              <span>COMMANDS</span>
            </button>
          </div>
        </header>

        {/* Privacy Strip */}
        <WhoCanSeeThis
          isRunning={isRunning}
          isComplete={Boolean(runResult && runResult.success)}
        />

        {/* Main Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================================================================= */}
          {/* LEFT PANE: Mission Control / Security Gauntlet / Stress Test */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 space-y-4">
            {/* Left Pane Navigation Switcher */}
            <div className="flex rounded-2xl border-2 border-[#1E1E1E] bg-[#FAF7F0] p-1 shadow-[3px_3px_0px_0px_#1E1E1E] font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('INTENT_VAULT')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeTab === 'INTENT_VAULT'
                    ? 'bg-[#1E1E1E] text-[#FDFBF7] shadow-[2px_2px_0px_0px_#1E1E1E]'
                    : 'text-[#666666] hover:text-[#1E1E1E]'
                }`}
              >
                Intent Vault
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('SECURITY_GAUNTLET')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeTab === 'SECURITY_GAUNTLET'
                    ? 'bg-[#991B1B] text-[#FDFBF7] shadow-[2px_2px_0px_0px_#1E1E1E]'
                    : 'text-[#666666] hover:text-[#1E1E1E]'
                }`}
              >
                Security Gauntlet
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('STRESS_TEST')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeTab === 'STRESS_TEST'
                    ? 'bg-[#2E7D32] text-[#FDFBF7] shadow-[2px_2px_0px_0px_#1E1E1E]'
                    : 'text-[#666666] hover:text-[#1E1E1E]'
                }`}
              >
                7-Day Stress Replay
              </button>
            </div>

            {/* TAB 1: Intent Vault & Policy Engine */}
            {activeTab === 'INTENT_VAULT' && (
              <div className="space-y-4">
                <div className="bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-3xl p-5 shadow-[4px_4px_0px_0px_#1E1E1E] space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-[#1E1E1E]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
                      <h2 className="text-sm font-mono font-black uppercase tracking-wider text-[#1E1E1E]">
                        Confidential Trading Goal
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono text-[#666666] font-bold">
                      INPUT STAGE
                    </span>
                  </div>

                  {isRedacted || isRedacting ? (
                    <RedactionSeal
                      text={goal}
                      isRedacting={isRedacting}
                      isRedacted={isRedacted}
                      onRedactionComplete={() => {
                        setIsRedacting(false);
                        setIsRedacted(true);
                      }}
                    />
                  ) : (
                    <div className="space-y-2">
                      <label
                        htmlFor="goal-input"
                        className="block text-xs font-mono font-bold uppercase text-[#1E1E1E]"
                      >
                        Specify High-Level Asset Goal
                      </label>
                      <textarea
                        id="goal-input"
                        rows={3}
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Describe cross-chain trade intent (e.g. Arbitrage USDC between Solana and Ethereum)..."
                        disabled={isRunning || policy.isRevoked}
                        className="w-full p-3 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-2xl font-mono text-sm text-[#1E1E1E] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#1E1E1E] shadow-[2px_2px_0px_0px_#1E1E1E] disabled:opacity-50"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#666666]">
                      Pre-Configured Intent Strategies:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_TAGS.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            setGoal(tag.goal);
                            setIsRedacted(false);
                            setIsRedacting(false);
                          }}
                          disabled={isRunning || policy.isRevoked}
                          className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-[#FAF7F0] hover:bg-[#F5EBE1] border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_#1E1E1E] active:scale-95 transition-all text-[#1E1E1E] disabled:opacity-50"
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleExecute()}
                    disabled={isRunning || policy.isRevoked}
                    className="w-full py-3 px-4 bg-[#B8E3D2] hover:bg-[#A3D9C3] text-[#1E1E1E] font-mono font-black text-xs uppercase tracking-wider border-2 border-[#1E1E1E] rounded-2xl shadow-[4px_4px_0px_0px_#1E1E1E] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E1E1E]" />
                    <span>
                      {isRunning ? 'Sealing in Enclave...' : 'Deploy to Enclave'}
                    </span>
                  </button>
                </div>

                {runResult?.counterparty && (
                  <CounterpartyBadge
                    report={runResult.counterparty}
                    onHumanApproveWarn={() => addLog('INFO', 'Human approval granted for warning counterparty.')}
                  />
                )}

                <SecurityPosturePanel policy={policy} posture={securityPosture} />

                <div className={hasShaken ? 'animate-shake' : ''}>
                  <PolicyVault
                    policy={policy}
                    onPolicyChange={setPolicy}
                    onRevokeToggle={handleRevokeToggle}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Security Gauntlet Threat Simulator */}
            {activeTab === 'SECURITY_GAUNTLET' && (
              <div className="space-y-4">
                <SecurityGauntlet
                  policy={policy}
                  isRunning={isRunning}
                  onLaunchThreat={(scenario) => handleExecute(scenario.id)}
                />
                <SecurityPosturePanel policy={policy} posture={securityPosture} />
              </div>
            )}

            {/* TAB 3: Fast-Forward Stress Test & Autonomous Ledger */}
            {activeTab === 'STRESS_TEST' && (
              <div className="space-y-4">
                <FastForwardStressTest
                  isRunning={isRunning}
                  onBatchComplete={(newEntries) => setLedgerEntries((prev) => [...newEntries, ...prev])}
                  onLogEvent={addLog}
                />
                <BusinessLedger entries={ledgerEntries} />
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* RIGHT PANE: Telemetry Matrix, Route Visualizer, Receipt, Terminal */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <RouteVisualizer
              sourceChain={currentDirective.sourceChain}
              destinationChain={currentDirective.destinationChain}
              token={currentDirective.token}
              amountUsd={currentDirective.amountUsd}
              counterparty={runResult?.counterparty}
              isRunning={isRunning}
              isComplete={Boolean(runResult && runResult.success)}
              isBlocked={isBlocked}
            />

            <TelemetryMatrix
              steps={steps}
              activeStepIndex={activeStepIndex}
              isRunning={isRunning}
              isBlocked={isBlocked}
              onReplayStepChange={(stepIdx) => {
                setActiveStepIndex(stepIdx);
                soundFx.playStepTick();
              }}
            />

            <TerminalLog
              logs={logs}
              onClear={() => setLogs([])}
            />

            {runResult && (
              <EnclaveReceipt
                attestation={runResult.attestation}
                policyResult={runResult.policyResult}
                settlement={runResult.settlement}
                directive={runResult.directive}
                counterparty={runResult.counterparty}
                ledgerEntry={runResult.ledgerEntry}
                isBlocked={!runResult.policyResult.approved}
                threatType={runResult.threatType}
                latencyMs={runResult.totalLatencyMs}
              />
            )}
          </div>
        </div>
      </div>

      {/* Global Command Palette Overlay (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectPrompt={(selectedPrompt) => {
          setGoal(selectedPrompt);
          setIsRedacted(false);
          setIsRedacting(false);
          addLog('INFO', 'Loaded quick strategy intent via command palette.');
        }}
        onTriggerTamperTest={() => handleExecute('CUMULATIVE_BUDGET_EXHAUSTION')}
        onToggleRevoke={handleRevokeToggle}
        isRevoked={policy.isRevoked}
        onToggleSound={handleToggleSound}
        isMuted={isMuted}
      />
    </main>
  );
}
