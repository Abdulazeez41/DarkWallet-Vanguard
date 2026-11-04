'use client';

import React from 'react';
import { AgentPolicy, SecurityPosture } from '@/lib/types';

interface SecurityPosturePanelProps {
  readonly policy: AgentPolicy;
  readonly posture: SecurityPosture;
}

export function SecurityPosturePanel({ policy, posture }: SecurityPosturePanelProps) {
  const budgetSpentPercent = Math.min(
    100,
    Math.round((policy.spentInSessionUsd / policy.sessionBudgetCapUsd) * 100)
  );

  return (
    <div className="w-full bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-3xl p-5 shadow-[4px_4px_0px_0px_#1E1E1E] space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
          <h2 className="text-sm font-black uppercase tracking-wider text-[#1E1E1E]">
            Security Posture &amp; Authority State
          </h2>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#1E1E1E] uppercase ${
            posture.operationalReadiness === 'READY'
              ? 'bg-[#D4F0E4] text-[#2E7D32]'
              : posture.operationalReadiness === 'AWAITING_APPROVAL'
                ? 'bg-[#FEF3C7] text-[#B45309]'
                : 'bg-[#FCE8E6] text-[#991B1B]'
          }`}
        >
          {posture.operationalReadiness}
        </span>
      </div>

      {/* Operational Matrix Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {/* Dimension 1: Agent Authority State */}
        <div className="p-2.5 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">
            Agent State
          </div>
          <div className="text-xs font-black text-[#1E1E1E] mt-0.5 uppercase">
            {policy.isRevoked ? 'REVOKED (LOCKED)' : 'ACTIVE & SIGNING'}
          </div>
        </div>

        {/* Dimension 2: Attestation Evidence */}
        <div className="p-2.5 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">
            Evidence Freshness
          </div>
          <div className="text-xs font-black text-[#2E7D32] mt-0.5 uppercase">
            {posture.attestationEvidence} (TDX Quote)
          </div>
        </div>

        {/* Dimension 3: Per-Action Cap */}
        <div className="p-2.5 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">
            Per-Action Limit
          </div>
          <div className="text-xs font-black text-[#1E1E1E] mt-0.5 tabular-nums">
            ${policy.maxUsdPerTx}.00 / trade
          </div>
        </div>

        {/* Dimension 4: Cumulative Budget Remaining */}
        <div className="p-2.5 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">
            Session Budget Left
          </div>
          <div className="text-xs font-black text-[#1E1E1E] mt-0.5 tabular-nums">
            ${posture.remainingBudgetUsd.toFixed(2)} / ${policy.sessionBudgetCapUsd}.00
          </div>
        </div>

        {/* Dimension 5: Counterparty Allowlist */}
        <div className="p-2.5 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">
            Counterparty Policy
          </div>
          <div className="text-xs font-black text-[#1E1E1E] mt-0.5 uppercase">
            Strict Allowlist
          </div>
        </div>

        {/* Dimension 6: Idempotency Protection */}
        <div className="p-2.5 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">
            Idempotency Guard
          </div>
          <div className="text-xs font-black text-[#2E7D32] mt-0.5 uppercase">
            Active (No Replay)
          </div>
        </div>
      </div>

      {/* Aggregate Session Budget Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[11px] font-bold text-[#1E1E1E]">
          <span>Stateful Aggregate Budget Depletion</span>
          <span className="tabular-nums">
            ${policy.spentInSessionUsd.toFixed(2)} spent ({budgetSpentPercent}%)
          </span>
        </div>
        <div className="w-full h-3 bg-[#EAE5DC] border-2 border-[#1E1E1E] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              budgetSpentPercent > 85
                ? 'bg-[#E06A55]'
                : budgetSpentPercent > 50
                  ? 'bg-[#FDE047]'
                  : 'bg-[#B8E3D2]'
            }`}
            style={{ width: `${budgetSpentPercent}%` }}
          />
        </div>
      </div>

      {/* Scenario Performance Audit Track */}
      <div className="pt-2 border-t border-[#E0DCD3] flex items-center justify-between text-[11px] text-[#444444]">
        <span>Scenario Performance Audit:</span>
        <div className="flex items-center gap-3">
          <span className="text-[#2E7D32] font-bold">
            {posture.scenarioPerformance.tasksAuthorized} Authorized
          </span>
          <span className="text-[#991B1B] font-bold">
            {posture.scenarioPerformance.threatsDeflected} Deflected
          </span>
          <span className="text-[#666666]">
            {posture.scenarioPerformance.falsePositives} False Positives
          </span>
        </div>
      </div>
    </div>
  );
}
