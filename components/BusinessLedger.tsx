'use client';

import React from 'react';
import { TreasuryLedgerEntry } from '@/lib/types';

interface BusinessLedgerProps {
  readonly entries: readonly TreasuryLedgerEntry[];
}

export function BusinessLedger({ entries }: BusinessLedgerProps) {
  const totalVolume = entries.reduce((acc, e) => acc + e.grossIntentVolumeUsd, 0);
  const totalInferenceCost = entries.reduce((acc, e) => acc + e.inferenceCostUsd, 0);
  const totalContributorPayout = entries.reduce((acc, e) => acc + e.contributorPayoutUsd, 0);
  const totalNetYield = entries.reduce((acc, e) => acc + e.netYieldUsd, 0);

  return (
    <div className="w-full bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-3xl p-5 shadow-[4px_4px_0px_0px_#1E1E1E] space-y-4 font-mono">
      {/* Ledger Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
          <h2 className="text-sm font-black uppercase tracking-wider text-[#1E1E1E]">
            Autonomous Business Ledger // Track 04
          </h2>
        </div>
        <span className="text-[10px] font-bold bg-[#FEF3C7] text-[#1E1E1E] px-2 py-0.5 rounded-full border border-[#1E1E1E]">
          SELF-FUNDED INFERENCE
        </span>
      </div>

      {/* Financial Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">
            Gross Volume
          </div>
          <div className="text-sm font-black text-[#1E1E1E] tabular-nums mt-0.5">
            ${totalVolume.toFixed(2)}
          </div>
        </div>

        <div className="p-2.5 bg-[#F5EBE1] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">
            Inference Self-Paid
          </div>
          <div className="text-sm font-black text-[#B45309] tabular-nums mt-0.5">
            -${totalInferenceCost.toFixed(3)}
          </div>
        </div>

        <div className="p-2.5 bg-[#D4F0E4] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">
            Net Treasury Yield
          </div>
          <div
            className={`text-sm font-black tabular-nums mt-0.5 ${
              totalNetYield >= 0 ? 'text-[#2E7D32]' : 'text-[#991B1B]'
            }`}
          >
            {totalNetYield >= 0 ? `+$${totalNetYield.toFixed(4)}` : `-$${Math.abs(totalNetYield).toFixed(4)}`}
          </div>
        </div>

        <div className="p-2.5 bg-[#FEF3C7] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">
            Contributor Split (20%)
          </div>
          <div className="text-sm font-black text-[#1E1E1E] tabular-nums mt-0.5">
            ${totalContributorPayout.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-[#666666] uppercase">
          <span>Real-Time Audit Transactions</span>
          <span>Target: contributors.vanguard.near</span>
        </div>

        {entries.length === 0 ? (
          <div className="p-4 text-center text-xs text-[#888888] italic bg-[#FAF7F0] border border-[#D5D0C5] rounded-xl">
            [No autonomous transactions logged yet. Deploy an intent or run 7-day replay to observe self-funded revenue split.]
          </div>
        ) : (
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {entries.map((entry) => (
              <div
                key={entry.entryId}
                className="p-2 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl flex items-center justify-between text-[11px] shadow-[2px_2px_0px_0px_#1E1E1E]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      entry.isSlippageLoss ? 'bg-[#D97706]' : 'bg-[#2E7D32]'
                    }`}
                  />
                  <span className="font-bold text-[#1E1E1E] tabular-nums">
                    ${entry.grossIntentVolumeUsd.toFixed(2)} Vol
                  </span>
                  <span className="text-[9px] text-[#666666] hidden sm:inline">
                    [{entry.directiveId}] (Compute: -${entry.inferenceCostUsd.toFixed(3)})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <span
                    className={`text-[10px] font-bold tabular-nums ${
                      entry.netYieldUsd >= 0 ? 'text-[#2E7D32]' : 'text-[#991B1B]'
                    }`}
                  >
                    {entry.netYieldUsd >= 0
                      ? `+$${entry.netYieldUsd.toFixed(4)}`
                      : `-$${Math.abs(entry.netYieldUsd).toFixed(4)}`} Net
                  </span>
                  {entry.isSlippageLoss ? (
                    <span className="text-[9px] bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded border border-[#D97706] hidden sm:inline">
                      Slippage Loss (Compliant)
                    </span>
                  ) : (
                    <span className="text-[9px] bg-[#EAE5DC] px-1.5 py-0.5 rounded border border-[#C5BFB5] text-[#1E1E1E] hidden sm:inline">
                      20% Split Paid
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-[#E0DCD3] text-[10px] text-[#555555] flex items-center justify-between">
        <span>Autonomous Business Policy: 80% Retained / 20% Contributor</span>
        <span className="font-bold text-[#1E1E1E]">Zero Custodian Key</span>
      </div>
    </div>
  );
}
