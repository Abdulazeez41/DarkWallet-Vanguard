'use client';

import React, { useState } from 'react';
import { AgentPolicy, GauntletThreatType } from '@/lib/types';
import { soundFx } from './AudioFeedback';

export interface ThreatScenario {
  readonly id: GauntletThreatType;
  readonly name: string;
  readonly testedControl: string;
  readonly responsibleLayer: string;
  readonly attackerChallenge: string;
  readonly evidenceDisplayed: string;
}

export const THREAT_SCENARIOS: readonly ThreatScenario[] = [
  {
    id: 'UNAUTHORIZED_RECIPIENT',
    name: 'Unauthorized Recipient',
    testedControl: 'Recipient Authorization at Execution',
    responsibleLayer: 'OutLayer Policy Engine',
    attackerChallenge:
      'An external injected message instructs the agent to route funds to an unwhitelisted threat address (0xbad000...prompt_injected_drainer).',
    evidenceDisplayed:
      'Proposed recipient compared against strict allowlist -> Policy Engine refuses authorization before signing.',
  },
  {
    id: 'CUMULATIVE_BUDGET_EXHAUSTION',
    name: 'Cumulative Budget Exhaustion',
    testedControl: 'Stateful Aggregate Budget Accounting',
    responsibleLayer: 'OutLayer Policy Engine',
    attackerChallenge:
      'Several individually compliant orders (e.g. $45 < $50 limit) attempt to exceed the $200 session allowance aggregate cap.',
    evidenceDisplayed:
      'Stateful ledger: Reserved, spent so far, remaining allowance, and explicit aggregate cap rejection.',
  },
  {
    id: 'STALE_ATTESTATION_NONCE',
    name: 'Stale Attestation Replay',
    testedControl: 'Hardware Attestation Freshness Verification',
    responsibleLayer: 'TEE Attestation Verifier',
    attackerChallenge:
      'Previously captured Intel TDX quote evidence is re-broadcast without binding a fresh client-generated cryptographic nonce.',
    evidenceDisplayed:
      'Client fresh nonce compared against quote report data -> Nonce mismatch detected; Attestation Verifier halts run at Step 2.',
  },
  {
    id: 'DUPLICATE_DIRECTIVE_REPLAY',
    name: 'Duplicate Directive Double-Spend',
    testedControl: 'Execution-Level Idempotency Tracking',
    responsibleLayer: 'Execution Coordinator',
    attackerChallenge:
      'The exact same approved directive ID is submitted a second time in an attempt to trigger a duplicate settlement swap.',
    evidenceDisplayed:
      'Directive ID checked against execution cache -> Duplicate directive ID identified; Execution Coordinator rejects duplicate.',
  },
];

interface SecurityGauntletProps {
  readonly policy: AgentPolicy;
  readonly isRunning: boolean;
  readonly onLaunchThreat: (scenario: ThreatScenario) => void;
}

export function SecurityGauntlet({
  policy,
  isRunning,
  onLaunchThreat,
}: SecurityGauntletProps) {
  const [selectedThreatId, setSelectedThreatId] =
    useState<GauntletThreatType>('UNAUTHORIZED_RECIPIENT');

  const selectedThreat =
    THREAT_SCENARIOS.find((t) => t.id === selectedThreatId) || THREAT_SCENARIOS[0];

  const handleLaunch = () => {
    soundFx.playBlockThud();
    soundFx.triggerHaptic([30, 50, 30]);
    onLaunchThreat(selectedThreat);
  };

  return (
    <div className="w-full bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-3xl p-5 shadow-[4px_4px_0px_0px_#1E1E1E] space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#991B1B]" />
          <h2 className="text-sm font-black uppercase tracking-wider text-[#1E1E1E]">
            Security Gauntlet // Specific Control Verification
          </h2>
        </div>
        <span className="text-[10px] font-bold bg-[#FCE8E6] text-[#991B1B] px-2.5 py-0.5 rounded-full border border-[#1E1E1E]">
          LAYER ATTRIBUTION
        </span>
      </div>

      <p className="text-xs text-[#555555] leading-relaxed">
        Test specific, decoupled controls across the architecture. Verify how each layer independently halts unauthorized inputs:
      </p>

      {/* Scenario Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {THREAT_SCENARIOS.map((threat) => {
          const isSelected = threat.id === selectedThreatId;
          return (
            <button
              key={threat.id}
              type="button"
              onClick={() => setSelectedThreatId(threat.id)}
              disabled={isRunning}
              className={`p-3 rounded-2xl text-left border-2 transition-all shadow-[2px_2px_0px_0px_#1E1E1E] active:scale-95 disabled:opacity-50 ${
                isSelected
                  ? 'bg-[#FEF3C7] border-[#1E1E1E] text-[#1E1E1E]'
                  : 'bg-[#FAF7F0] border-[#D5D0C5] text-[#555555] hover:bg-[#F5EBE1]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>{threat.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded uppercase bg-[#FAF7F0] border border-[#1E1E1E] text-[#1E1E1E]">
                  {threat.responsibleLayer}
                </span>
              </div>
              <div className="text-[10px] text-[#666666]">
                Control: {threat.testedControl}
              </div>
            </button>
          );
        })}
      </div>

      {/* Scenario Breakdown Card */}
      <div className="p-3.5 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-2xl space-y-2.5 text-xs shadow-[2px_2px_0px_0px_#1E1E1E]">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#666666]">
          <span>Adversary Challenge Payload</span>
          <span className="text-[#991B1B]">Target: {selectedThreat.responsibleLayer}</span>
        </div>

        <div className="p-2.5 bg-[#1E1E1E] text-[#FCE8E6] rounded-xl text-[11px] leading-relaxed font-mono">
          &quot;{selectedThreat.attackerChallenge}&quot;
        </div>

        <div className="text-[11px] text-[#444444] pt-1.5 border-t border-[#E0DCD3] space-y-1">
          <div>
            <span className="font-bold text-[#1E1E1E]">Control Being Tested: </span>
            {selectedThreat.testedControl}
          </div>
          <div>
            <span className="font-bold text-[#1E1E1E]">Evidence Displayed: </span>
            {selectedThreat.evidenceDisplayed}
          </div>
        </div>
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleLaunch}
        disabled={isRunning}
        className="w-full py-3 px-4 bg-[#FCE8E6] hover:bg-[#F9D0CC] text-[#991B1B] font-mono font-black text-xs uppercase tracking-wider border-2 border-[#1E1E1E] rounded-2xl shadow-[4px_4px_0px_0px_#1E1E1E] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#991B1B] animate-ping" />
        <span>Execute Controlled Threat Challenge</span>
      </button>
    </div>
  );
}
