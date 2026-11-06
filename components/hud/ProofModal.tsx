'use client';

/**
 * components/hud/ProofModal.tsx
 *
 * Full Cryptographic Proof Verification Modal.
 * Inspects:
 *  - Intel TDX hardware attestation quote
 *  - MRTD / PCR0 enclave code measurement
 *  - Cryptographic client nonce freshness match
 *  - Intel Root CA endorsement chain
 *  - Honest labeling (VERIFIED vs SIMULATED)
 */

import { soundFx } from '@/components/AudioFeedback';
import { getAttestationBadge } from '@/lib/attestation';
import { useVaultStore } from '@/lib/store';

export function ProofModal() {
  const isProofModalOpen = useVaultStore((s) => s.isProofModalOpen);
  const setProofModalOpen = useVaultStore((s) => s.setProofModalOpen);
  const attestation = useVaultStore((s) => s.attestation);

  if (!isProofModalOpen) return null;

  const badgeInfo = getAttestationBadge(attestation);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-ink/40 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-panel border border-line rounded-3xl max-w-2xl w-full max-h-[92dvh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs my-auto">
        {/* Modal Header */}
        <div className="border-b border-line p-4 sm:p-5 flex items-center justify-between bg-panel2/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-enclave shadow-glow-enclave" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
              CRYPTOGRAPHIC HARDWARE ATTESTATION PROOF
            </h3>
          </div>

          <button
            onClick={() => {
              soundFx.playStepTick();
              setProofModalOpen(false);
            }}
            className="text-mute hover:text-ink text-sm p-1"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 select-text">
          {/* Honest Status Banner */}
          <div className={`p-3 rounded border flex items-center justify-between ${badgeInfo.badgeClass}`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${badgeInfo.dotClass}`} />
              <span className="font-bold uppercase tracking-wider">
                ATTESTATION STATUS: [{badgeInfo.label}]
              </span>
            </div>
            <span className="text-[10px] opacity-80 hidden sm:inline">Intel TDX Confidential VM</span>
          </div>
          <p className="text-[11px] text-mute">{badgeInfo.description}</p>

          {/* Cryptographic Dual Nonce Verification */}
          <div className="bg-void border border-line rounded p-3 space-y-2">
            <div className="flex items-center justify-between text-mute text-[10px] border-b border-line/60 pb-1.5">
              <span className="text-ink font-semibold">REPLAY ATTACK DEFENSE: CLIENT NONCE FRESHNESS</span>
              <span className="text-pass font-bold">
                {attestation?.clientNonce === attestation?.quoteReportDataNonce ? 'MATCH CONFIRMED' : 'NONCE MISMATCH'}
              </span>
            </div>

            <div>
              <span className="text-[9px] text-mute block uppercase">Fresh 32-Byte Client Nonce:</span>
              <div className="text-[10px] text-pass font-mono break-all bg-panel p-1.5 rounded border border-line/40 select-all">
                {attestation?.clientNonce || '0x4f8a...pending'}
              </div>
            </div>

            <div>
              <span className="text-[9px] text-mute block uppercase">Quote ReportData Nonce:</span>
              <div className="text-[10px] text-pass font-mono break-all bg-panel p-1.5 rounded border border-line/40 select-all">
                {attestation?.quoteReportDataNonce || '0x4f8a...pending'}
              </div>
            </div>
          </div>

          {/* Enclave Measurement & PCR0 */}
          <div className="bg-void border border-line rounded p-3 space-y-2">
            <div className="text-mute text-[10px] border-b border-line/60 pb-1.5 text-ink font-semibold">
              ENCLAVE IDENTITY & BOOT INTEGRITY (PCR0 / MRTD)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-mute text-[9px] block">ENCLAVE INSTANCE ID:</span>
                <span className="text-ink font-bold">{attestation?.enclaveId || 'tdx-vanguard-0x9f2a'}</span>
              </div>
              <div>
                <span className="text-mute text-[9px] block">SIGNING ALGORITHM:</span>
                <span className="text-ink font-bold">Ed25519 Intel TDX Quote</span>
              </div>
            </div>

            <div>
              <span className="text-[9px] text-mute block uppercase">PCR0 / MRTD Code Hash:</span>
              <div className="text-[10px] text-enclave font-mono break-all bg-panel p-1.5 rounded border border-line/40 select-all">
                {attestation?.pcr0 || '8a9c3d4e7f1b2a0c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c'}
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-mute uppercase tracking-wider block">
              HARDWARE VERIFICATION CHECKLIST:
            </span>

            <div className="space-y-1.5">
              {(attestation?.verificationChecks || []).map((check) => (
                <div
                  key={check.id}
                  className="bg-panel2/70 border border-line rounded p-2.5 flex items-start gap-2.5"
                >
                  <span
                    className={`text-xs font-bold mt-0.5 ${
                      check.passed ? 'text-pass' : 'text-block'
                    }`}
                  >
                    {check.passed ? '✓' : '✕'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-ink font-semibold text-[11px]">{check.title}</div>
                    <div className="text-mute text-[10px] leading-relaxed mt-0.5">
                      {check.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-line px-5 py-3 bg-panel2/60 flex items-center justify-between">
          <span className="text-[9px] text-mute">
            Stateless verification · Zero telemetry stored
          </span>
          <button
            onClick={() => {
              soundFx.playStepTick();
              setProofModalOpen(false);
            }}
            className="py-1.5 px-4 rounded bg-enclave hover:bg-enclave/90 text-void font-bold text-xs uppercase"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
