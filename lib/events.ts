/**
 * lib/events.ts
 *
 * Event model for DarkWallet Vanguard's real-time streaming pipeline.
 * Emitted as NDJSON from /api/agent and consumed by the Zustand run-state store,
 * driving both the 3D WebGL scene and 2D HUD panels synchronously.
 */

import {
  AgentStepTelemetry,
  CounterpartyReport,
  EnclaveAttestation,
  ExecutionDirective,
  PolicyEvaluationResult,
  SettlementResult,
  TreasuryLedgerEntry,
} from './types';

export type Stage =
  | 'idle'
  | 'sealing'
  | 'enclave'
  | 'evaluating'
  | 'settling'
  | 'settled'
  | 'blocked'
  | 'error';

export type GateId = 'spend' | 'allowlist' | 'nonce';

export type GateStatus = 'idle' | 'checking' | 'passed' | 'failed';

export type RunEventType =
  | 'STAGE_CHANGE'
  | 'INTENT_SEALED'
  | 'ENCLAVE_ENTER'
  | 'ENCLAVE_ATTESTED'
  | 'GATE_CHECKING'
  | 'GATE_RESOLVED'
  | 'PACKET_STEP'
  | 'SETTLEMENT_EVENT'
  | 'RUN_COMPLETE'
  | 'RUN_FAILED';

export interface GateReason {
  gateId: GateId;
  headline: string;
  detail: string;
  layer: string;
}

export interface RunEventPayloads {
  STAGE_CHANGE: { stage: Stage };
  INTENT_SEALED: { redactedPrompt: string; originalLength: number };
  ENCLAVE_ENTER: { model: string; enclaveType: string };
  ENCLAVE_ATTESTED: { attestation: EnclaveAttestation };
  GATE_CHECKING: { gateId: GateId };
  GATE_RESOLVED: {
    gateId: GateId;
    passed: boolean;
    headline: string;
    detail: string;
    responsibleLayer?: string;
  };
  PACKET_STEP: { x: number; progress: number };
  SETTLEMENT_EVENT: {
    settlement: SettlementResult;
    directive: ExecutionDirective;
    ledgerEntry?: TreasuryLedgerEntry;
  };
  RUN_COMPLETE: {
    success: boolean;
    directive: ExecutionDirective | null;
    counterparty: CounterpartyReport;
    attestation: EnclaveAttestation;
    policyResult: PolicyEvaluationResult;
    settlement: SettlementResult | null;
    ledgerEntry: TreasuryLedgerEntry | null;
    steps: AgentStepTelemetry[];
    totalLatencyMs: number;
    redactedGoal: string;
  };
  RUN_FAILED: {
    error: string;
    responsibleLayer?: string;
    gateId?: GateId;
    headline?: string;
  };
}

export type RunEvent = {
  [K in RunEventType]: {
    type: K;
    timestamp: number;
    payload: RunEventPayloads[K];
  };
}[RunEventType];

export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'pass' | 'warn' | 'block' | 'enclave';
  source: 'CLIENT' | 'ENCLAVE' | 'POLICY' | 'VERIFIER' | 'SETTLEMENT';
  message: string;
  detail?: string;
}
