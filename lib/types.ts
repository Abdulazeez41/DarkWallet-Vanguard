/**
 * lib/types.ts
 *
 * Core TypeScript definitions for DarkWallet Vanguard (SecretForge).
 * Strict types across:
 *  - Track 03: NEAR AI Cloud TEE with Fresh Nonce Attestation Verification
 *  - Track 06: OutLayer Policy Engine with Counterparty Risk Scoring (ALLOW/WARN/BLOCK)
 *  - Track 04: Autonomous Business Ledger with Self-Funding Inference & Revenue Split
 */

export type SupportedChain = 'Ethereum' | 'Solana' | 'Bitcoin' | 'NEAR';

export type SupportedToken = 'USDC' | 'USDT' | 'NEAR' | 'SOL' | 'ETH' | 'BTC';

export interface ExecutionDirective {
  readonly sourceChain: string;
  readonly destinationChain: string;
  readonly token: string;
  readonly amountUsd: number;
  readonly rationale: string;
  readonly estimatedGasUsd?: number;
  readonly destinationAddress?: string;
}

export interface AgentPolicy {
  readonly maxUsdPerTx: number;
  readonly tokenWhitelist: string[];
  readonly chainWhitelist: string[];
  readonly sessionExpiryMs: number;
  readonly isRevoked: boolean;
  readonly requireHumanApprovalOnWarn: boolean;
}

export type PolicyRuleIdentifier =
  | 'REVOCATION_CHECK'
  | 'EXPIRY_CHECK'
  | 'DIRECTIVE_VALIDITY'
  | 'SPENDING_LIMIT'
  | 'TOKEN_WHITELIST'
  | 'CHAIN_WHITELIST'
  | 'COUNTERPARTY_CHECK';

export interface PolicyRuleResult {
  readonly ruleId: PolicyRuleIdentifier;
  readonly ruleName: string;
  readonly passed: boolean;
  readonly headline: string;
  readonly message: string;
}

export interface PolicyEvaluationResult {
  readonly approved: boolean;
  readonly blockReasonHeadline: string | null;
  readonly blockReasonDetail: string | null;
  readonly rules: PolicyRuleResult[];
  readonly evaluatedAt: string;
}

// Track 06: Counterparty Risk Engine Types
export type CounterpartyStatus = 'ALLOW' | 'WARN' | 'BLOCK';

export interface CounterpartySignal {
  readonly id: string;
  readonly name: string;
  readonly score: number; // 0 (safest) to 100 (highest risk)
  readonly status: 'SAFE' | 'SUSPICIOUS' | 'FLAGGED';
  readonly message: string;
}

export interface CounterpartyReport {
  readonly targetAddress: string;
  readonly overallStatus: CounterpartyStatus;
  readonly riskScore: number; // 0 to 100
  readonly signals: CounterpartySignal[];
  readonly requiresHumanApproval: boolean;
  readonly reason: string;
}

// Track 03: Hardware Attestation Verification Types
export interface VerificationCheckItem {
  readonly id: string;
  readonly title: string;
  readonly passed: boolean;
  readonly detail: string;
}

export interface EnclaveAttestation {
  readonly enclaveId: string;
  readonly pcr0: string;
  readonly tdxQuote: string;
  readonly signingKeyDigest: string;
  readonly nonce: string; // Cryptographic fresh random nonce
  readonly verified: boolean;
  readonly isSimulated: boolean;
  readonly simulationReason?: string;
  readonly generatedAt: string;
  readonly verificationChecks: VerificationCheckItem[];
}

export type SettlementStatus = 'settled' | 'pending' | 'blocked' | 'simulated';

export interface SettlementResult {
  readonly intentHash: string;
  readonly sourceChain: string;
  readonly destinationChain: string;
  readonly token: string;
  readonly amountUsd: number;
  readonly settlementPath: string[];
  readonly status: SettlementStatus;
  readonly explorerUrl: string;
  readonly isSimulated: boolean;
  readonly simulationReason?: string;
  readonly executedAt: string;
}

// Track 04: Autonomous Business Treasury Ledger Types
export interface TreasuryLedgerEntry {
  readonly entryId: string;
  readonly timestamp: string;
  readonly grossIntentVolumeUsd: number;
  readonly inferenceCostUsd: number; // Self-funded to NEAR AI Cloud
  readonly solverRelayerFeeUsd: number;
  readonly netYieldUsd: number;
  readonly treasuryShareUsd: number; // e.g. 80% retained
  readonly contributorPayoutUsd: number; // e.g. 20% distributed
  readonly contributorAccount: string;
  readonly status: 'SETTLED' | 'BLOCKED';
}

export type TelemetryStepStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'blocked'
  | 'failed';

export interface AgentStepTelemetry {
  readonly stepIndex: number;
  readonly stepId:
    | 'TEE_DECRYPT'
    | 'HARDWARE_ATTESTATION'
    | 'POLICY_VERIFICATION'
    | 'INTENTS_SETTLEMENT';
  readonly title: string;
  readonly subtitle: string;
  readonly status: TelemetryStepStatus;
  readonly latencyMs: number;
  readonly timestamp: string;
  readonly isSimulated: boolean;
  readonly simulationReason?: string;
  readonly details?: Record<string, unknown>;
}

export interface AgentRunRequest {
  readonly goal: string;
  readonly policy: AgentPolicy;
  readonly isTamperTest?: boolean;
  readonly isAttackDemo?: boolean;
  readonly humanApprovedWarn?: boolean;
}

export interface AgentRunResponse {
  readonly success: boolean;
  readonly isTamperTest: boolean;
  readonly isAttackDemo: boolean;
  readonly directive: ExecutionDirective | null;
  readonly counterparty: CounterpartyReport;
  readonly attestation: EnclaveAttestation;
  readonly policyResult: PolicyEvaluationResult;
  readonly settlement: SettlementResult | null;
  readonly ledgerEntry: TreasuryLedgerEntry | null;
  readonly steps: AgentStepTelemetry[];
  readonly totalLatencyMs: number;
  readonly redactedGoal: string;
  readonly error?: string;
}

export interface PrivacyEntityState {
  readonly id: 'YOU' | 'HOST' | 'LLM_OPERATOR' | 'NETWORK';
  readonly label: string;
  readonly subtitle: string;
  readonly state: 'SEEN' | 'SEALED';
  readonly detail: string;
}

export interface QuickPromptTag {
  readonly id: string;
  readonly label: string;
  readonly goal: string;
  readonly description: string;
}
