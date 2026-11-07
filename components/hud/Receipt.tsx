'use client';

/**
 * components/hud/Receipt.tsx
 *
 * Physical torn-edge cream paper receipt emerging from the classified dark vault.
 * Uses Framer Motion for slide-up printout animation.
 * Features honest labeling (VERIFIED vs SIMULATED), layer attribution,
 * and button to trigger the Cryptographic Proofs modal.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { soundFx } from '@/components/AudioFeedback';
import { getAttestationBadge } from '@/lib/attestation';
import { useVaultStore } from '@/lib/store';
import { CryptoChainIcon } from '@/components/icons/CryptoLogos';

export function Receipt() {
  const receiptVisible = useVaultStore((s) => s.receiptVisible);
  const setReceiptVisible = useVaultStore((s) => s.setReceiptVisible);
  const setProofModalOpen = useVaultStore((s) => s.setProofModalOpen);

  const stage = useVaultStore((s) => s.stage);
  const directive = useVaultStore((s) => s.directive);
  const attestation = useVaultStore((s) => s.attestation);
  const policyResult = useVaultStore((s) => s.policyResult);
  const settlement = useVaultStore((s) => s.settlement);
  const ledgerEntry = useVaultStore((s) => s.ledgerEntry);
  const gateReason = useVaultStore((s) => s.gateReason);
  const walletAddress = useVaultStore((s) => s.walletAddress);

  const isBlocked = stage === 'blocked' || Boolean(gateReason);
  const badgeInfo = getAttestationBadge(attestation);

  if (!receiptVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 right-4 z-40 max-w-md w-full px-4 pointer-events-none select-none">
        <motion.div
          initial={{ y: 120, opacity: 0, rotate: 1 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className={`pointer-events-auto rounded-t-lg shadow-2xl border ${
            isBlocked
              ? 'bg-[#FFF1F2] border-block/40 text-[#4C0519]'
              : 'bg-[#FDFBF7] border-[#D1D5DB] text-[#1E1E1E]'
          } font-mono text-xs overflow-hidden`}
        >
          {/* Top Paper Header */}
          <div className="border-b border-black/10 px-4 py-2.5 flex items-center justify-between bg-black/5">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-[11px] uppercase">
                {isBlocked ? 'SECURITY INTERCEPTION EVIDENCE' : 'ENCLAVE EXECUTION RECEIPT'}
              </span>
            </div>

            <button
              onClick={() => {
                soundFx.playStepTick();
                setReceiptVisible(false);
              }}
              className="text-black/50 hover:text-black font-bold text-xs p-1"
              title="Close Receipt"
            >
              ✕
            </button>
          </div>

          {/* Receipt Body Content */}
          <div className="p-4 space-y-3 font-mono text-[11px] leading-relaxed">
            {/* Status Stamp & Attestation Badge */}
            <div className="flex items-center justify-between border-b border-black/10 pb-2">
              <div>
                <span className="text-[9px] uppercase tracking-wider block opacity-70">
                  VERIFICATION STATUS:
                </span>
                <span
                  className={`inline-block font-bold px-1.5 py-0.5 rounded text-[10px] uppercase border mt-0.5 ${
                    isBlocked
                      ? 'border-block/60 text-block bg-block/10'
                      : 'border-pass text-emerald-800 bg-emerald-100'
                  }`}
                >
                  {isBlocked ? 'HALTED & SHATTERED' : 'APPROVED & SETTLED'}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider block opacity-70">
                  INTEL TDX ATTESTATION:
                </span>
                <span
                  className={`inline-block font-bold px-1.5 py-0.5 rounded text-[10px] uppercase border mt-0.5 ${
                    badgeInfo.label === 'VERIFIED'
                      ? 'border-pass text-emerald-800 bg-emerald-100'
                      : 'border-amber-600 text-amber-800 bg-amber-100'
                  }`}
                >
                  [{badgeInfo.label}]
                </span>
              </div>
            </div>

            {/* If Blocked: Display Gate Attribution & Detail */}
            {isBlocked && gateReason && (
              <div className="bg-red-100/80 border border-red-300 rounded p-2.5 space-y-1">
                <div className="font-bold text-red-900 text-[10px] uppercase tracking-wider">
                  HALTED AT GATE [{gateReason.gateId.toUpperCase()}]
                </div>
                <div className="text-red-950 font-bold">{gateReason.headline}</div>
                <p className="text-red-800 text-[10px]">{gateReason.detail}</p>
                <div className="text-[9px] text-red-700 opacity-90 pt-1 border-t border-red-200">
                  Responsible Layer: <span className="font-bold">{gateReason.layer}</span>
                </div>
              </div>
            )}

            {/* Directive Breakdown */}
            {directive && (
              <div className="space-y-1 bg-black/5 p-2 rounded border border-black/5 text-[10px]">
                <div className="flex justify-between">
                  <span className="opacity-70">DIRECTIVE ID:</span>
                  <span className="font-bold">{directive.directiveId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">ROUTE:</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <CryptoChainIcon chain={directive.sourceChain} size={14} />
                    <span>{directive.sourceChain}</span>
                    <span className="opacity-60">→</span>
                    <CryptoChainIcon chain={directive.destinationChain} size={14} />
                    <span>{directive.destinationChain}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">AMOUNT / ASSET:</span>
                  <span className="font-bold">
                    ${directive.amountUsd.toFixed(2)} USD ({directive.token})
                  </span>
                </div>
                {directive.destinationAddress && (
                  <div className="flex justify-between">
                    <span className="opacity-70">COUNTERPARTY:</span>
                    <span className="font-bold truncate max-w-[180px]">
                      {directive.destinationAddress}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Autonomous Ledger Split (Settled Only) */}
            {!isBlocked && ledgerEntry && (
              <div className="border-t border-black/10 pt-2 space-y-1 text-[10px]">
                <div className="flex justify-between text-emerald-900 font-bold">
                  <span>NET SPREAD YIELD:</span>
                  <span>+${ledgerEntry.netYieldUsd.toFixed(4)}</span>
                </div>
                <div className="flex justify-between opacity-80">
                  <span>80% TREASURY RETENTION:</span>
                  <span>+${ledgerEntry.treasuryShareUsd.toFixed(4)}</span>
                </div>
                <div className="flex justify-between opacity-80">
                  <span>20% CONTRIBUTOR SPLIT:</span>
                  <span>+${ledgerEntry.contributorPayoutUsd.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-[9px] opacity-60">
                  <span>COMPUTE DEDUCTION:</span>
                  <span>-${ledgerEntry.inferenceCostUsd} (to NEAR AI Cloud)</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-black/10 pt-3 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  soundFx.playStepTick();
                  setProofModalOpen(true);
                }}
                className="flex-1 py-1.5 px-2 rounded bg-black/10 hover:bg-black/15 text-black font-bold text-[10px] tracking-wider uppercase border border-black/20 text-center transition-colors"
              >
                INSPECT PROOFS ↗
              </button>

              {!isBlocked && (
                <a
                  href={
                    settlement?.explorerUrl && !settlement.explorerUrl.includes('demo')
                      ? settlement.explorerUrl
                      : walletAddress.endsWith('.testnet')
                      ? `https://testnet.nearblocks.io/address/${walletAddress}`
                      : 'https://testnet.nearblocks.io/address/v1.signer-prod.testnet'
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-3 rounded bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[10px] tracking-wider uppercase text-center transition-colors"
                  title="View account on NEAR Testnet Explorer"
                >
                  TESTNET EXPLORER ↗
                </a>
              )}
            </div>
          </div>

          {/* Torn Edge Sawtooth Teeth (SVG Footer) */}
          <div className="w-full h-3 overflow-hidden -mt-0.5">
            <svg
              className="w-full h-3"
              viewBox="0 0 400 12"
              preserveAspectRatio="none"
              fill={isBlocked ? '#FFF1F2' : '#FDFBF7'}
            >
              <polygon points="0,0 10,12 20,0 30,12 40,0 50,12 60,0 70,12 80,0 90,12 100,0 110,12 120,0 130,12 140,0 150,12 160,0 170,12 180,0 190,12 200,0 210,12 220,0 230,12 240,0 250,12 260,0 270,12 280,0 290,12 300,0 310,12 320,0 330,12 340,0 350,12 360,0 370,12 380,0 390,12 400,0 400,0 0,0" />
            </svg>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
