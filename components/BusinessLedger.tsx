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
    <div className="w-full bg-panel border border-line rounded-3xl p-5 shadow-xs space-y-4 font-mono text-ink">
      {/* Ledger Header */}
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pass" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
            Autonomous Business Ledger
          </h2>
        </div>
        <span className="text-[10px] font-bold bg-enclave/15 text-enclave px-2.5 py-0.5 rounded-full border border-enclave/30">
          SELF-FUNDED INFERENCE
        </span>
      </div>

      {/* Financial Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-panel2 border border-line rounded-2xl shadow-xs">
          <div className="text-[9px] uppercase text-mute font-bold">
            Gross Volume
          </div>
          <div className="text-sm sm:text-base font-bold text-ink tabular-nums mt-0.5">
            ${totalVolume.toFixed(2)}
          </div>
        </div>

        <div className="p-3 bg-panel2 border border-line rounded-2xl shadow-xs">
          <div className="text-[9px] uppercase text-mute font-bold">
            Inference Self-Paid
          </div>
          <div className="text-sm sm:text-base font-bold text-warn tabular-nums mt-0.5">
            -${totalInferenceCost.toFixed(3)}
          </div>
        </div>

        <div className="p-3 bg-panel2 border border-line rounded-2xl shadow-xs">
          <div className="text-[9px] uppercase text-mute font-bold">
            Net Treasury Yield
          </div>
          <div
            className={`text-sm sm:text-base font-bold tabular-nums mt-0.5 ${
              totalNetYield >= 0 ? 'text-pass' : 'text-block'
            }`}
          >
            {totalNetYield >= 0 ? `+$${totalNetYield.toFixed(4)}` : `-$${Math.abs(totalNetYield).toFixed(4)}`}
          </div>
        </div>

        <div className="p-3 bg-panel2 border border-line rounded-2xl shadow-xs">
          <div className="text-[9px] uppercase text-mute font-bold">
            Contributor Split (20%)
          </div>
          <div className="text-sm sm:text-base font-bold text-enclave tabular-nums mt-0.5">
            ${totalContributorPayout.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-mute uppercase px-1">
          <span>Real-Time Audit Transactions</span>
          <span>Target: contributors.vanguard.near</span>
        </div>

        {entries.length === 0 ? (
          <div className="p-4 text-center text-xs text-mute italic bg-panel2 border border-line rounded-2xl">
            [No autonomous transactions logged yet. Deploy an intent or run 7-day replay to observe self-funded revenue split.]
          </div>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {entries.map((entry) => (
              <div
                key={entry.entryId}
                className="p-2.5 bg-panel2 border border-line rounded-xl flex items-center justify-between text-[11px] shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      entry.isSlippageLoss ? 'bg-warn' : 'bg-pass'
                    }`}
                  />
                  <span className="font-bold text-ink tabular-nums">
                    ${entry.grossIntentVolumeUsd.toFixed(2)} Vol
                  </span>
                  <span className="text-[10px] text-mute hidden sm:inline">
                    [{entry.directiveId}] (Compute: -${entry.inferenceCostUsd.toFixed(3)})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <span
                    className={`text-[11px] font-bold tabular-nums ${
                      entry.netYieldUsd >= 0 ? 'text-pass' : 'text-block'
                    }`}
                  >
                    {entry.netYieldUsd >= 0
                      ? `+$${entry.netYieldUsd.toFixed(4)}`
                      : `-$${Math.abs(entry.netYieldUsd).toFixed(4)}`} Net
                  </span>
                  {entry.isSlippageLoss ? (
                    <span className="text-[9px] bg-warn/15 text-warn px-2 py-0.5 rounded-full border border-warn/30 hidden sm:inline font-semibold">
                      ⚠️ Slippage Loss
                    </span>
                  ) : (
                    <span className="text-[9px] bg-pass/15 text-pass px-2 py-0.5 rounded-full border border-pass/30 hidden sm:inline font-semibold">
                      ✓ 20% Paid
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-line text-[10px] text-mute flex items-center justify-between px-1">
        <span>Autonomous Policy: 80% Retained / 20% Contributor</span>
        <span className="font-bold text-ink">Zero Custodian Key</span>
      </div>
    </div>
  );
}
