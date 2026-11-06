/**
 * lib/store.ts
 *
 * Single Zustand state store driving both the 3D Vault scene and 2D HUD panels.
 * Synchronously updated as NDJSON events stream from /api/agent or the Judge Demo script.
 */

import { create } from 'zustand';
import {
  GateId,
  GateReason,
  GateStatus,
  RunEvent,
  Stage,
  TerminalLogEntry,
} from './events';
import {
  AgentPolicy,
  CounterpartyReport,
  EnclaveAttestation,
  ExecutionDirective,
  PolicyEvaluationResult,
  SettlementResult,
  TreasuryLedgerEntry,
} from './types';

export const GATE_X_COORDS: Record<GateId, number> = {
  spend: -1.0,
  allowlist: 1.5,
  nonce: 4.0,
};

export const ENCLAVE_CORE_X = -4.5;
export const ORIGIN_INTENT_X = -8.0;
export const CHAIN_NODES_X = 7.5;

export interface VaultState {
  // Pipeline Stage
  stage: Stage;
  runMode: 'idle' | 'user' | 'gauntlet' | 'daemon';
  activeTab: 'intent' | 'gauntlet' | 'replay';
  daemonActive: boolean;
  muted: boolean;

  // Packet & 3D Visual Coordinates
  packetX: number;
  packetVisible: boolean;
  packetShattered: boolean;
  shatterOrigin: [number, number, number] | null;
  shake: number;

  // Gates State
  gates: Record<GateId, GateStatus>;
  gateReason: GateReason | null;
  activeGateId: GateId | null;

  // Real Data Payloads
  lastGoal: string;
  redactedGoal: string;
  directive: ExecutionDirective | null;
  counterparty: CounterpartyReport | null;
  attestation: EnclaveAttestation | null;
  policyResult: PolicyEvaluationResult | null;
  settlement: SettlementResult | null;
  ledgerEntry: TreasuryLedgerEntry | null;

  // Policy Settings
  policy: AgentPolicy;

  // Terminal & Logs
  logs: TerminalLogEntry[];

  // Defense Cyber-Range Stats
  stats: {
    threatsDeflected: number;
    tasksAuthorized: number;
    cumulativePnlUsd: number;
    totalRuns: number;
  };

  // Theme & 3D Stage Settings
  theme: 'dark' | 'cream';
  cameraFocus: 'all' | 'enclave' | 'gates' | 'chains';
  isStageExpanded: boolean;
  isMonitorVisible: boolean;

  // UI Overlays & Wallet State
  walletConnected: boolean;
  walletAddress: string;
  agentAddress: string;
  walletType: 'cloud' | 'web3' | 'demo' | null;
  walletProvider: string;
  isWalletModalOpen: boolean;
  isMpcModalOpen: boolean;
  isProofModalOpen: boolean;
  isCommandPaletteOpen: boolean;
  isGuideModalOpen: boolean;
  receiptVisible: boolean;

  // Actions
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'cream') => void;
  setCameraFocus: (focus: 'all' | 'enclave' | 'gates' | 'chains') => void;
  toggleStageExpanded: () => void;
  connectWallet: (type: 'cloud' | 'web3' | 'demo', address?: string, provider?: string) => void;
  disconnectWallet: () => void;
  toggleWallet: () => void;
  setWalletModalOpen: (open: boolean) => void;
  setMpcModalOpen: (open: boolean) => void;
  setStage: (stage: Stage) => void;
  setRunMode: (mode: 'idle' | 'user' | 'gauntlet' | 'daemon') => void;
  setActiveTab: (tab: 'intent' | 'gauntlet' | 'replay') => void;
  setDaemonActive: (active: boolean) => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  setShake: (amplitude: number) => void;
  decayShake: (delta: number) => void;
  setPacketX: (x: number) => void;
  setPacketVisible: (visible: boolean) => void;
  triggerShatter: (origin: [number, number, number], gateId?: GateId) => void;
  setGateStatus: (gateId: GateId, status: GateStatus) => void;
  resetGates: () => void;
  setGateReason: (reason: GateReason | null) => void;
  setPolicy: (policy: Partial<AgentPolicy>) => void;
  addLog: (entry: Omit<TerminalLogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  setProofModalOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setGuideModalOpen: (open: boolean) => void;
  setReceiptVisible: (visible: boolean) => void;
  setMonitorVisible: (visible: boolean) => void;
  toggleMonitorVisible: () => void;
  applyRunEvent: (event: RunEvent) => void;
  resetRun: (keepGoal?: boolean) => void;
}

export const DEFAULT_POLICY: AgentPolicy = {
  maxUsdPerTx: 50,
  sessionBudgetCapUsd: 200,
  spentInSessionUsd: 0,
  tokenWhitelist: ['USDC', 'USDT', 'NEAR', 'SOL', 'ETH', 'BTC'],
  chainWhitelist: ['Ethereum', 'Solana', 'Bitcoin', 'NEAR'],
  sessionExpiryMs: Date.now() + 24 * 60 * 60 * 1000,
  isRevoked: false,
  requireHumanApprovalOnWarn: true,
};

export const useVaultStore = create<VaultState>((set, get) => ({
  stage: 'idle',
  runMode: 'idle',
  activeTab: 'intent',
  daemonActive: false,
  muted: false,

  packetX: ORIGIN_INTENT_X,
  packetVisible: false,
  packetShattered: false,
  shatterOrigin: null,
  shake: 0,

  gates: {
    spend: 'idle',
    allowlist: 'idle',
    nonce: 'idle',
  },
  gateReason: null,
  activeGateId: null,

  lastGoal: 'Rebalance 25 USDC from Solana to Ethereum via NEAR Intents',
  redactedGoal: '████████ 25 ████ from ██████ to ████████ via ████ ███████',
  directive: null,
  counterparty: null,
  attestation: null,
  policyResult: null,
  settlement: null,
  ledgerEntry: null,

  policy: DEFAULT_POLICY,

  logs: [
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'enclave',
      source: 'ENCLAVE',
      message: 'DarkWallet Vanguard Intel TDX hardware enclave initialized.',
      detail: 'MKTME memory encryption active. Zero server-side persistence verified.',
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'pass',
      source: 'POLICY',
      message: 'Policy engine online: Per-action cap $50.00 | Session budget $200.00.',
    },
  ],

  stats: {
    threatsDeflected: 4,
    tasksAuthorized: 12,
    cumulativePnlUsd: 184.2,
    totalRuns: 16,
  },

  // Theme & 3D Camera Focus (Default to signature Oreo Cream filling palette)
  theme: 'cream',
  cameraFocus: 'all',
  isStageExpanded: false,
  isMonitorVisible: false,

  // Account & Custody State
  walletConnected: true,
  walletAddress: 'operator.near',
  agentAddress: 'vanguard-agent.near',
  walletType: 'cloud',
  walletProvider: 'NEAR FastAuth Cloud',
  isWalletModalOpen: false,
  isMpcModalOpen: false,
  isProofModalOpen: false,
  isCommandPaletteOpen: false,
  isGuideModalOpen: false,
  receiptVisible: false,

  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'cream' : 'dark';
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', nextTheme);
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      }
      return { theme: nextTheme };
    }),

  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    set({ theme });
  },

  setCameraFocus: (cameraFocus) => set({ cameraFocus }),

  toggleStageExpanded: () => set((state) => ({ isStageExpanded: !state.isStageExpanded })),

  setMonitorVisible: (isMonitorVisible) => set({ isMonitorVisible }),

  toggleMonitorVisible: () =>
    set((state) => ({ isMonitorVisible: !state.isMonitorVisible })),

  connectWallet: (type, address = 'operator.near', provider = 'NEAR FastAuth Cloud') =>
    set({
      walletConnected: true,
      walletType: type,
      walletAddress: address,
      walletProvider: provider,
    }),

  disconnectWallet: () =>
    set({
      walletConnected: false,
      walletType: null,
      walletAddress: 'disconnected.near',
      walletProvider: 'None',
    }),

  toggleWallet: () =>
    set((state) => ({
      walletConnected: !state.walletConnected,
      walletAddress: state.walletConnected ? 'disconnected.near' : 'operator.near',
      walletType: state.walletConnected ? null : 'cloud',
      walletProvider: state.walletConnected ? 'None' : 'NEAR FastAuth Cloud',
    })),
  setWalletModalOpen: (isWalletModalOpen) => set({ isWalletModalOpen }),
  setMpcModalOpen: (isMpcModalOpen) => set({ isMpcModalOpen }),
  setStage: (stage) => set({ stage }),
  setRunMode: (runMode) => set({ runMode }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setDaemonActive: (daemonActive) => set({ daemonActive }),
  toggleMute: () => set((state) => ({ muted: !state.muted })),
  setMuted: (muted) => set({ muted }),
  setShake: (shake) => set({ shake }),
  decayShake: (delta) =>
    set((state) => ({
      shake: Math.max(0, state.shake - delta * 4),
    })),
  setPacketX: (packetX) => set({ packetX }),
  setPacketVisible: (packetVisible) => set({ packetVisible }),
  triggerShatter: (origin, gateId) => {
    set({
      packetShattered: true,
      packetVisible: false,
      shatterOrigin: origin,
      shake: 0.8,
      stage: 'blocked',
      ...(gateId ? { activeGateId: gateId } : {}),
    });
  },
  setGateStatus: (gateId, status) =>
    set((state) => ({
      gates: { ...state.gates, [gateId]: status },
      activeGateId: gateId,
    })),
  resetGates: () =>
    set({
      gates: { spend: 'idle', allowlist: 'idle', nonce: 'idle' },
      gateReason: null,
      activeGateId: null,
      packetShattered: false,
      shatterOrigin: null,
    }),
  setGateReason: (gateReason) => set({ gateReason }),
  setPolicy: (newPolicy) =>
    set((state) => ({
      policy: { ...state.policy, ...newPolicy },
    })),
  addLog: (entry) =>
    set((state) => ({
      logs: [
        ...state.logs.slice(-99),
        {
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toLocaleTimeString(),
          ...entry,
        },
      ],
    })),
  clearLogs: () => set({ logs: [] }),
  setProofModalOpen: (isProofModalOpen) => set({ isProofModalOpen }),
  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),
  setGuideModalOpen: (isGuideModalOpen) => set({ isGuideModalOpen }),
  setReceiptVisible: (receiptVisible) => set({ receiptVisible }),

  resetRun: (keepGoal = true) => {
    const prevGoal = get().lastGoal;
    set({
      stage: 'idle',
      runMode: 'idle',
      packetX: ORIGIN_INTENT_X,
      packetVisible: false,
      packetShattered: false,
      shatterOrigin: null,
      shake: 0,
      gates: { spend: 'idle', allowlist: 'idle', nonce: 'idle' },
      gateReason: null,
      activeGateId: null,
      receiptVisible: false,
      directive: null,
      settlement: null,
      ledgerEntry: null,
      ...(keepGoal ? { lastGoal: prevGoal } : {}),
    });
  },

  applyRunEvent: (event: RunEvent) => {
    const state = get();
    switch (event.type) {
      case 'STAGE_CHANGE': {
        set({ stage: event.payload.stage });
        break;
      }
      case 'INTENT_SEALED': {
        set({
          stage: 'sealing',
          packetVisible: true,
          packetX: ORIGIN_INTENT_X,
          redactedGoal: event.payload.redactedPrompt,
        });
        state.addLog({
          level: 'enclave',
          source: 'CLIENT',
          message: 'Intent sealed with client ephemeral key.',
          detail: `Zero server retention. Characters redacted: ${event.payload.originalLength}`,
        });
        break;
      }
      case 'ENCLAVE_ENTER': {
        set({
          stage: 'enclave',
          packetX: ENCLAVE_CORE_X,
        });
        state.addLog({
          level: 'enclave',
          source: 'ENCLAVE',
          message: `Inference underway inside Intel TDX Confidential VM (${event.payload.model}).`,
          detail: 'Host memory bus encryption active (MKTME). No telemetry leaked.',
        });
        break;
      }
      case 'ENCLAVE_ATTESTED': {
        set({
          attestation: event.payload.attestation,
        });
        state.addLog({
          level: event.payload.attestation.verified ? 'pass' : 'warn',
          source: 'VERIFIER',
          message: event.payload.attestation.verified
            ? 'Cryptographic attestation quote verified against fresh client nonce.'
            : 'Attestation verification failed or simulated.',
          detail: `Client Nonce: ${event.payload.attestation.clientNonce.slice(0, 14)}...`,
        });
        break;
      }
      case 'GATE_CHECKING': {
        set({
          stage: 'evaluating',
          activeGateId: event.payload.gateId,
          packetX: GATE_X_COORDS[event.payload.gateId],
          gates: {
            ...state.gates,
            [event.payload.gateId]: 'checking',
          },
        });
        state.addLog({
          level: 'info',
          source: 'POLICY',
          message: `Evaluating Gate [${event.payload.gateId.toUpperCase()}]...`,
        });
        break;
      }
      case 'GATE_RESOLVED': {
        const { gateId, passed, headline, detail, responsibleLayer } = event.payload;
        set({
          gates: {
            ...state.gates,
            [gateId]: passed ? 'passed' : 'failed',
          },
        });

        if (!passed) {
          const shatterX = GATE_X_COORDS[gateId];
          state.triggerShatter([shatterX, 0, 0], gateId);
          set({
            gateReason: {
              gateId,
              headline,
              detail,
              layer: responsibleLayer || 'POLICY_ENGINE',
            },
            receiptVisible: true,
            stats: {
              ...state.stats,
              threatsDeflected: state.stats.threatsDeflected + 1,
              totalRuns: state.stats.totalRuns + 1,
            },
          });
          state.addLog({
            level: 'block',
            source: 'POLICY',
            message: `BLOCKED AT GATE [${gateId.toUpperCase()}]: ${headline}`,
            detail,
          });
        } else {
          state.addLog({
            level: 'pass',
            source: 'POLICY',
            message: `PASSED GATE [${gateId.toUpperCase()}]: ${headline}`,
            detail,
          });
        }
        break;
      }
      case 'PACKET_STEP': {
        set({ packetX: event.payload.x });
        break;
      }
      case 'SETTLEMENT_EVENT': {
        set({
          stage: 'settled',
          packetX: CHAIN_NODES_X,
          settlement: event.payload.settlement,
          directive: event.payload.directive,
          ledgerEntry: event.payload.ledgerEntry || null,
          receiptVisible: true,
          stats: {
            ...state.stats,
            tasksAuthorized: state.stats.tasksAuthorized + 1,
            totalRuns: state.stats.totalRuns + 1,
            cumulativePnlUsd:
              state.stats.cumulativePnlUsd +
              (event.payload.ledgerEntry?.netYieldUsd ?? 0.85),
          },
        });
        state.addLog({
          level: 'pass',
          source: 'SETTLEMENT',
          message: `Settled ${event.payload.directive.amountUsd} ${event.payload.directive.token} across ${event.payload.directive.sourceChain} -> ${event.payload.directive.destinationChain}.`,
          detail: `Tx: ${event.payload.settlement.intentHash.slice(0, 16)}...`,
        });
        break;
      }
      case 'RUN_COMPLETE': {
        set({
          directive: event.payload.directive,
          counterparty: event.payload.counterparty,
          attestation: event.payload.attestation,
          policyResult: event.payload.policyResult,
          settlement: event.payload.settlement,
          ledgerEntry: event.payload.ledgerEntry,
          receiptVisible: true,
        });
        break;
      }
      case 'RUN_FAILED': {
        set({
          stage: 'error',
          packetVisible: false,
          gateReason: {
            gateId: event.payload.gateId || 'spend',
            headline: event.payload.headline || 'Pipeline Execution Failed',
            detail: event.payload.error,
            layer: event.payload.responsibleLayer || 'SYSTEM',
          },
          receiptVisible: true,
        });
        state.addLog({
          level: 'block',
          source: 'CLIENT',
          message: `Execution failed: ${event.payload.error}`,
        });
        break;
      }
    }
  },
}));
