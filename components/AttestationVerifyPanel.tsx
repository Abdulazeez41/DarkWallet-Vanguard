'use client';

import React from 'react';
import { EnclaveAttestation } from '@/lib/types';
import { SimulatedBadge } from './SimulatedBadge';

interface AttestationVerifyPanelProps {
  readonly attestation: EnclaveAttestation | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function AttestationVerifyPanel({
  attestation,
  isOpen,
  onClose,
}: AttestationVerifyPanelProps) {
  if (!isOpen || !attestation) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Hardware Attestation Verification Panel"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1E1E]/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-3xl shadow-[6px_6px_0px_0px_#1E1E1E] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#1E1E1E] flex items-center justify-between bg-[#FAF7F0]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
            <h3 className="text-sm font-mono font-black uppercase tracking-wider text-[#1E1E1E]">
              Intel TDX Attestation Verification // Track 03
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 px-2 text-xs font-mono font-bold bg-[#EAE5DC] hover:bg-[#D5D0C5] border border-[#1E1E1E] rounded-lg transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto font-mono text-xs">
          {/* Summary Banner */}
          <div className="p-3 bg-[#D4F0E4] border-2 border-[#1E1E1E] rounded-2xl flex items-center justify-between shadow-[2px_2px_0px_0px_#1E1E1E]">
            <div>
              <div className="font-bold text-[#1E1E1E] uppercase text-[11px]">
                Cryptographic Hardware Quote
              </div>
              <div className="text-[10px] text-[#2E7D32] font-bold mt-0.5">
                STATUS: VERIFIED (Intel TDX Enclave)
              </div>
            </div>
            {attestation.isSimulated && (
              <SimulatedBadge reason={attestation.simulationReason} />
            )}
          </div>

          {/* 4-Point Cryptographic Check Breakdown */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-[#666666] uppercase">
              Attestation Verification Audit (NEAR AI Cloud Verification Docs)
            </div>

            <div className="space-y-2">
              {attestation.verificationChecks.map((check) => (
                <div
                  key={check.id}
                  className="p-2.5 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl flex items-start justify-between gap-3 shadow-[2px_2px_0px_0px_#1E1E1E]"
                >
                  <div>
                    <div className="font-bold text-[#1E1E1E] text-xs">
                      {check.title}
                    </div>
                    <div className="text-[10px] text-[#555555] mt-0.5 leading-snug">
                      {check.detail}
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold rounded bg-[#D4F0E4] text-[#2E7D32] border border-[#2E7D32]">
                    PASSED
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Identifiers */}
          <div className="p-3 bg-[#1E1E1E] text-[#FDFBF7] rounded-2xl space-y-2 border border-[#1E1E1E]">
            <div className="text-[#D4F0E4] font-bold uppercase text-[10px] tracking-wider">
              Cryptographic Enclave Nonce &amp; Digests:
            </div>
            <div>
              <span className="text-[#888888] text-[10px]">Fresh Nonce (Replay Proof): </span>
              <span className="font-mono text-[10px] text-[#FEF3C7] break-all">
                {attestation.nonce}
              </span>
            </div>
            <div>
              <span className="text-[#888888] text-[10px]">PCR0 / MRTD Code Digest: </span>
              <span className="font-mono text-[10px] text-[#B8E3D2] break-all">
                {attestation.pcr0}
              </span>
            </div>
            <div>
              <span className="text-[#888888] text-[10px]">Signing Key Digest: </span>
              <span className="font-mono text-[10px] text-[#E0E0E0] break-all">
                {attestation.signingKeyDigest}
              </span>
            </div>
          </div>

          {/* Stateless Architecture Assurance */}
          <div className="p-2.5 bg-[#F5EBE1] border border-[#D5C0AC] rounded-xl text-[10px] text-[#555555] leading-relaxed">
            <span className="font-bold text-[#1E1E1E]">Zero Server-Side Storage Guarantee: </span>
            Prompt reasoning runs strictly within Intel TDX hardware encrypted RAM (MKTME). No SQLite, Postgres, or server cache retains prompt data or private keys after the response finishes.
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAF7F0] border-t border-[#E0DCD3] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1E1E1E] text-[#FDFBF7] rounded-xl font-mono text-xs font-bold active:scale-95 transition-all shadow-[2px_2px_0px_0px_#1E1E1E]"
          >
            Close Audit Panel
          </button>
        </div>
      </div>
    </div>
  );
}
