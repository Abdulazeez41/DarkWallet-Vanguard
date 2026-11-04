'use client';

import React, { useState } from 'react';
import {
  CounterpartyReport,
  EnclaveAttestation,
  PolicyEvaluationResult,
  SettlementResult,
  TreasuryLedgerEntry,
} from '@/lib/types';
import { AttestationVerifyPanel } from './AttestationVerifyPanel';
import { SimulatedBadge } from './SimulatedBadge';

interface EnclaveReceiptProps {
  readonly attestation: EnclaveAttestation | null;
  readonly policyResult: PolicyEvaluationResult | null;
  readonly settlement: SettlementResult | null;
  readonly counterparty?: CounterpartyReport | null;
  readonly ledgerEntry?: TreasuryLedgerEntry | null;
  readonly isBlocked: boolean;
  readonly isTamperTest: boolean;
  readonly isAttackDemo?: boolean;
  readonly latencyMs: number;
}

export function EnclaveReceipt({
  attestation,
  policyResult,
  settlement,
  counterparty,
  ledgerEntry,
  isBlocked,
  isTamperTest,
  isAttackDemo,
  latencyMs,
}: EnclaveReceiptProps) {
  const [showProofModal, setShowProofModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!attestation || !policyResult) {
    return null;
  }

  const handleCopy = () => {
    const summary = JSON.stringify(
      {
        enclaveId: attestation.enclaveId,
        pcr0: attestation.pcr0,
        nonce: attestation.nonce,
        counterpartyStatus: counterparty?.overallStatus || 'N/A',
        policyPassed: policyResult.approved,
        blockReason: policyResult.blockReasonHeadline,
        settlementIntent: settlement?.intentHash || 'N/A',
        netYieldUsd: ledgerEntry?.netYieldUsd || 0,
        contributorPayoutUsd: ledgerEntry?.contributorPayoutUsd || 0,
        evaluatedAt: policyResult.evaluatedAt,
      },
      null,
      2
    );
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full relative mt-4">
      {/* Torn Paper Header Effect */}
      <div className="w-full h-3 flex overflow-hidden">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#FAF7F0]"
          />
        ))}
      </div>

      {/* Main Ticket Body */}
      <div className="bg-[#FAF7F0] border-x-2 border-b-2 border-[#1E1E1E] p-4 sm:p-5 font-mono text-xs text-[#1E1E1E] shadow-[4px_4px_0px_0px_#1E1E1E]">
        {/* Receipt Header */}
        <div className="text-center pb-3 border-b-2 border-dashed border-[#1E1E1E]">
          <div className="text-sm font-black tracking-widest uppercase">
            DARKWALLET VANGUARD
          </div>
          <div className="text-[10px] text-[#666666] uppercase mt-0.5">
            TEE Enclave Execution Proof &amp; Audit Receipt
          </div>
          <div className="text-[10px] text-[#444444] mt-1 tabular-nums">
            {policyResult.evaluatedAt} // Latency: {latencyMs}ms
          </div>

          {isTamperTest && (
            <div className="mt-2 inline-block px-2 py-0.5 bg-[#FCE8E6] text-[#991B1B] border border-[#1E1E1E] font-bold text-[10px] uppercase">
              [TAMPER TEST AUDIT VERIFICATION]
            </div>
          )}

          {isAttackDemo && (
            <div className="mt-2 inline-block px-2 py-0.5 bg-[#FCE8E6] text-[#991B1B] border border-[#991B1B] font-bold text-[10px] uppercase">
              [ATTACK DEMO: INJECTION BLOCKED]
            </div>
          )}
        </div>

        {/* Status Headline */}
        <div
          className={`my-3 p-2.5 rounded-lg border-2 border-[#1E1E1E] ${
            isBlocked
              ? 'bg-[#FCE8E6] text-[#991B1B]'
              : 'bg-[#D4F0E4] text-[#1E1E1E]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[11px]">
              {isBlocked ? 'TRANSACTION BLOCKED' : 'TRANSACTION AUTHORIZED'}
            </span>
            <span className="font-bold text-[10px] uppercase">
              {isBlocked ? 'HALTED' : 'SETTLED'}
            </span>
          </div>
          {isBlocked && policyResult.blockReasonHeadline && (
            <div className="mt-1 font-bold text-xs">
              {policyResult.blockReasonHeadline}
            </div>
          )}
          {isBlocked && policyResult.blockReasonDetail && (
            <div className="mt-0.5 text-[11px] text-[#661E1E]">
              {policyResult.blockReasonDetail}
            </div>
          )}
        </div>

        {/* Hardware Enclave Identifiers & Fresh Nonce (Track 03) */}
        <div className="space-y-1.5 py-2 border-b border-dashed border-[#D5D0C5] text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-[#666666]">Hardware Enclave:</span>
            <span className="font-bold text-[#1E1E1E]">
              {attestation.enclaveId}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#666666]">Attestation Status:</span>
            <div className="flex items-center gap-1.5">
              {attestation.isSimulated && (
                <SimulatedBadge reason={attestation.simulationReason} />
              )}
              <span className="font-bold text-[#2E7D32]">VERIFIED</span>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-[#666666]">Fresh Nonce (Replay Proof):</span>
            <span className="font-mono text-[10px] text-[#1E1E1E]">
              {attestation.nonce.slice(0, 16)}...
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-[#666666]">PCR0 Digest:</span>
            <span className="font-mono text-[10px] max-w-[210px] truncate text-right text-[#1E1E1E]" title={attestation.pcr0}>
              {attestation.pcr0.slice(0, 18)}...{attestation.pcr0.slice(-8)}
            </span>
          </div>
        </div>

        {/* Counterparty Receiver Security (Track 06) */}
        {counterparty && (
          <div className="py-2 border-b border-dashed border-[#D5D0C5] text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-[#666666]">Counterparty Status:</span>
              <span
                className={`font-bold px-1.5 py-0.2 rounded text-[10px] uppercase ${
                  counterparty.overallStatus === 'ALLOW'
                    ? 'text-[#2E7D32]'
                    : 'text-[#991B1B]'
                }`}
              >
                {counterparty.overallStatus} ({counterparty.riskScore}/100)
              </span>
            </div>
          </div>
        )}

        {/* Security Policy Checklist (Plain Language) */}
        <div className="py-2.5 border-b border-dashed border-[#D5D0C5]">
          <div className="text-[10px] font-bold text-[#666666] uppercase mb-1.5">
            Security Policy Outcomes (Deterministic)
          </div>
          <div className="space-y-1">
            {policyResult.rules.map((rule) => (
              <div key={rule.ruleId} className="flex items-start justify-between gap-2 text-[11px]">
                <span className="text-[#444444] leading-snug">
                  {rule.ruleName}:
                </span>
                <span
                  className={`font-bold uppercase text-[10px] shrink-0 ${
                    rule.passed ? 'text-[#2E7D32]' : 'text-[#991B1B]'
                  }`}
                >
                  {rule.passed ? '[PASS]' : '[BLOCK]'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Autonomous Business Revenue Split & Self-Funded Compute (Track 04) */}
        {ledgerEntry && (
          <div className="py-2.5 border-b border-dashed border-[#D5D0C5] text-[11px] space-y-1">
            <div className="text-[10px] font-bold text-[#666666] uppercase">
              Autonomous Business Settlement (P&amp;L)
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-[#666666]">Self-Funded Inference Cost:</span>
              <span className="font-bold text-[#B45309] tabular-nums">
                -${ledgerEntry.inferenceCostUsd.toFixed(3)} (NEAR AI Cloud)
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-[#666666]">Contributor Payout (20%):</span>
              <span className="font-bold text-[#2E7D32] tabular-nums">
                +${ledgerEntry.contributorPayoutUsd.toFixed(4)}
              </span>
            </div>
          </div>
        )}

        {/* Settlement Intent Reference */}
        <div className="py-2.5 border-b border-dashed border-[#D5D0C5] text-[11px]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[#666666]">Cross-Chain Settlement:</span>
            {settlement?.isSimulated && (
              <SimulatedBadge reason={settlement.simulationReason} />
            )}
          </div>
          <div className="font-mono text-[10px] break-all bg-[#EDE8DE] p-1.5 rounded border border-[#D5D0C5]">
            {settlement ? settlement.intentHash : 'NO SETTLEMENT DISPATCHED (BLOCKED)'}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-3 pt-2 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setShowProofModal(true)}
            className="px-3 py-1 bg-[#D4F0E4] hover:bg-[#B8E3D2] text-[#1E1E1E] border-2 border-[#1E1E1E] rounded-lg font-bold text-[11px] shadow-[2px_2px_0px_0px_#1E1E1E] active:scale-95 transition-all"
          >
            Verify Enclave Proofs (Track 03)
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1 bg-[#FDFBF7] hover:bg-[#F5EBE1] text-[#1E1E1E] border-2 border-[#1E1E1E] rounded-lg font-bold text-[11px] shadow-[2px_2px_0px_0px_#1E1E1E] active:scale-95 transition-all"
          >
            {copied ? 'Copied Receipt' : 'Copy Audit Log'}
          </button>
        </div>
      </div>

      {/* Torn Paper Bottom Edge */}
      <div className="w-full h-3 flex overflow-hidden">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#FAF7F0]"
          />
        ))}
      </div>

      {/* Verification Modal Panel */}
      <AttestationVerifyPanel
        attestation={attestation}
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
      />
    </div>
  );
}
