'use client';

import React, { useState } from 'react';
import { CounterpartyReport } from '@/lib/types';

interface CounterpartyBadgeProps {
  readonly report: CounterpartyReport | null;
  readonly onHumanApproveWarn?: () => void;
}

export function CounterpartyBadge({
  report,
  onHumanApproveWarn,
}: CounterpartyBadgeProps) {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  if (!report) return null;

  const getStatusBadge = () => {
    switch (report.overallStatus) {
      case 'ALLOW':
        return 'bg-[#D4F0E4] text-[#2E7D32] border-[#2E7D32]';
      case 'WARN':
        return 'bg-[#FEF3C7] text-[#B45309] border-[#B45309]';
      case 'BLOCK':
        return 'bg-[#FCE8E6] text-[#991B1B] border-[#991B1B]';
    }
  };

  return (
    <div className="w-full bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-2xl p-3 shadow-[3px_3px_0px_0px_#1E1E1E] font-mono text-xs space-y-2">
      <div className="flex items-center justify-between pb-1.5 border-b border-[#E0DCD3]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1E1E1E]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E1E1E]">
            Counterparty Risk Shield // Track 06
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-md font-bold text-[10px] border uppercase ${getStatusBadge()}`}
          >
            {report.overallStatus} ({report.riskScore}/100)
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 truncate max-w-[260px]">
          <span className="text-[#666666]">Target:</span>
          <span className="font-bold text-[#1E1E1E] truncate" title={report.targetAddress}>
            {report.targetAddress}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowDrawer(!showDrawer)}
          className="text-[10px] font-bold text-[#555555] hover:text-[#1E1E1E] uppercase underline transition-colors"
        >
          {showDrawer ? 'Hide Signals' : 'Inspect Signals'}
        </button>
      </div>

      {report.overallStatus === 'WARN' && report.requiresHumanApproval && (
        <div className="p-2 bg-[#FEF3C7] border border-[#B45309] rounded-xl flex items-center justify-between gap-2">
          <span className="text-[10px] text-[#92400E] font-bold">
            Human approval required for warning status.
          </span>
          {onHumanApproveWarn && (
            <button
              type="button"
              onClick={onHumanApproveWarn}
              className="px-2 py-1 bg-[#1E1E1E] text-[#FDFBF7] text-[10px] rounded-lg font-bold shadow-[2px_2px_0px_0px_#1E1E1E] active:scale-95"
            >
              Approve Warn
            </button>
          )}
        </div>
      )}

      {showDrawer && (
        <div className="pt-2 border-t border-[#E0DCD3] space-y-1.5 text-[10px]">
          {report.signals.map((sig) => (
            <div
              key={sig.id}
              className="p-1.5 bg-[#FAF7F0] border border-[#D5D0C5] rounded-lg flex items-start justify-between gap-2"
            >
              <div>
                <span className="font-bold text-[#1E1E1E]">{sig.name}: </span>
                <span className="text-[#555555]">{sig.message}</span>
              </div>
              <span
                className={`font-bold px-1.5 py-0.5 rounded text-[9px] uppercase shrink-0 ${
                  sig.status === 'SAFE'
                    ? 'bg-[#D4F0E4] text-[#2E7D32]'
                    : 'bg-[#FCE8E6] text-[#991B1B]'
                }`}
              >
                {sig.status} ({sig.score})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
