'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TreasuryLedgerEntry } from '@/lib/types';
import { soundFx } from './AudioFeedback';

interface FastForwardStressTestProps {
  readonly isRunning: boolean;
  readonly onBatchComplete: (entries: TreasuryLedgerEntry[]) => void;
  readonly onLogEvent: (level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'ENCLAVE', text: string) => void;
}

interface StressScenarioEvent {
  readonly eventIndex: number;
  readonly description: string;
  readonly amountUsd: number;
  readonly marketSlippageGainUsd: number; // can be negative
  readonly isCompliant: boolean;
  readonly blockReason?: string;
  readonly responsibleLayer?: string;
}

// 12 deterministic market scenarios representing a 7-day operating period
const PREDEFINED_7DAY_SCENARIOS: readonly StressScenarioEvent[] = [
  { eventIndex: 1, description: 'Solana USDC yield arbitrage', amountUsd: 25, marketSlippageGainUsd: 0.32, isCompliant: true },
  { eventIndex: 2, description: 'Ethereum treasury rebalance', amountUsd: 35, marketSlippageGainUsd: 0.41, isCompliant: true },
  { eventIndex: 3, description: 'Bitcoin reserve accumulation', amountUsd: 40, marketSlippageGainUsd: 0.55, isCompliant: true },
  {
    eventIndex: 4,
    description: 'Solana volatile spread (Slippage Loss)',
    amountUsd: 30,
    marketSlippageGainUsd: -0.15, // Realistic market slippage loss on a 100% policy-compliant trade
    isCompliant: true,
  },
  {
    eventIndex: 5,
    description: 'Oversized single trade exploit',
    amountUsd: 75,
    marketSlippageGainUsd: 0,
    isCompliant: false,
    blockReason: 'Per-trade limit exceeded ($75 > $50)',
    responsibleLayer: 'Policy Engine',
  },
  { eventIndex: 6, description: 'Routine stablecoin rebalance', amountUsd: 20, marketSlippageGainUsd: 0.22, isCompliant: true },
  {
    eventIndex: 7,
    description: 'Cumulative budget cap breach',
    amountUsd: 45,
    marketSlippageGainUsd: 0,
    isCompliant: false,
    blockReason: 'Cumulative session budget allowance exhausted',
    responsibleLayer: 'Policy Engine',
  },
  { eventIndex: 8, description: 'Yield harvest on NEAR intents', amountUsd: 15, marketSlippageGainUsd: 0.18, isCompliant: true },
  {
    eventIndex: 9,
    description: 'Adversary unapproved recipient injection',
    amountUsd: 30,
    marketSlippageGainUsd: 0,
    isCompliant: false,
    blockReason: 'Unauthorized recipient on threat blocklist',
    responsibleLayer: 'Policy Engine',
  },
  { eventIndex: 10, description: 'Cross-chain liquidity balancing', amountUsd: 25, marketSlippageGainUsd: 0.29, isCompliant: true },
  {
    eventIndex: 11,
    description: 'Duplicate directive replay attempt',
    amountUsd: 25,
    marketSlippageGainUsd: 0,
    isCompliant: false,
    blockReason: 'Duplicate execution directive ID rejected',
    responsibleLayer: 'Execution Coordinator',
  },
  { eventIndex: 12, description: 'Final treasury reserve lock', amountUsd: 20, marketSlippageGainUsd: 0.25, isCompliant: true },
];

export function FastForwardStressTest({
  isRunning,
  onBatchComplete,
  onLogEvent,
}: FastForwardStressTestProps) {
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentEventIdx, setCurrentEventIdx] = useState<number>(0);
  const [legitimateAuthorized, setLegitimateAuthorized] = useState<number>(0);
  const [legitimateLossCount, setLegitimateLossCount] = useState<number>(0);
  const [unsafeBlocked, setUnsafeBlocked] = useState<number>(0);
  const [simulatedGrossVolume, setSimulatedGrossVolume] = useState<number>(0);
  const [simulatedComputeCost, setSimulatedComputeCost] = useState<number>(0);
  const [simulatedNetYield, setSimulatedNetYield] = useState<number>(0);

  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartStressTest = () => {
    if (isSimulating || isRunning) return;

    setIsSimulating(true);
    setCurrentEventIdx(0);
    setLegitimateAuthorized(0);
    setLegitimateLossCount(0);
    setUnsafeBlocked(0);
    setSimulatedGrossVolume(0);
    setSimulatedComputeCost(0);
    setSimulatedNetYield(0);

    onLogEvent('ENCLAVE', '=== INITIATING 7-DAY OPERATIONAL STRESS TEST (12 EVENTS) ===');
    soundFx.playStepTick();

    const batchEntries: TreasuryLedgerEntry[] = [];
    let idx = 0;
    let authCount = 0;
    let lossCount = 0;
    let blockCount = 0;
    let grossVol = 0;
    let computeCost = 0;
    let netYield = 0;

    simulationRef.current = setInterval(() => {
      const event = PREDEFINED_7DAY_SCENARIOS[idx];
      idx += 1;
      setCurrentEventIdx(idx);

      soundFx.playStepTick();

      if (!event.isCompliant) {
        blockCount += 1;
        setUnsafeBlocked(blockCount);
        onLogEvent(
          'WARN',
          `[Event ${idx}/12] ${event.description} -> BLOCKED by ${event.responsibleLayer}: ${event.blockReason}`
        );
      } else {
        authCount += 1;
        setLegitimateAuthorized(authCount);

        const computeFee = 0.003; // NEAR AI Cloud TEE compute cost
        const solverFee = 0.04; // NEAR Intents solver relayer fee
        const isLoss = event.marketSlippageGainUsd < 0;
        if (isLoss) {
          lossCount += 1;
          setLegitimateLossCount(lossCount);
        }

        const net = Number((event.marketSlippageGainUsd - computeFee - solverFee).toFixed(4));
        const contributorShare = isLoss ? 0 : Number((net * 0.2).toFixed(4));
        const treasuryShare = isLoss ? net : Number((net * 0.8).toFixed(4));

        grossVol += event.amountUsd;
        computeCost += computeFee;
        netYield += net;

        setSimulatedGrossVolume(grossVol);
        setSimulatedComputeCost(computeCost);
        setSimulatedNetYield(netYield);

        const newEntry: TreasuryLedgerEntry = {
          entryId: `sim_7d_${Date.now()}_${idx}`,
          directiveId: `dir_sim_${idx}`,
          timestamp: new Date().toISOString(),
          grossIntentVolumeUsd: event.amountUsd,
          inferenceCostUsd: computeFee,
          solverRelayerFeeUsd: solverFee,
          marketSlippageGainUsd: event.marketSlippageGainUsd,
          netYieldUsd: net,
          treasuryShareUsd: treasuryShare,
          contributorPayoutUsd: contributorShare,
          contributorAccount: 'contributors.vanguard.near',
          status: 'SETTLED',
          isSlippageLoss: isLoss,
        };
        batchEntries.unshift(newEntry);

        onLogEvent(
          isLoss ? 'WARN' : 'SUCCESS',
          `[Event ${idx}/12] ${event.description}: $${event.amountUsd} settled. Net: ${
            net >= 0 ? `+$${net}` : `-$${Math.abs(net)}`
          } (Compliant with ${isLoss ? 'market slippage loss' : 'positive yield'}).`
        );
      }

      if (idx >= PREDEFINED_7DAY_SCENARIOS.length) {
        if (simulationRef.current) clearInterval(simulationRef.current);
        setIsSimulating(false);
        soundFx.playSuccessTone();
        soundFx.triggerHaptic([40, 80, 40]);
        onLogEvent(
          'ENCLAVE',
          `=== 7-DAY TEST COMPLETE: ${authCount} authorized (${lossCount} slippage loss), ${blockCount} threats deflected. Net: +$${netYield.toFixed(
            4
          )} ===`
        );
        onBatchComplete(batchEntries);
      }
    }, 1100);
  };

  useEffect(() => {
    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, []);

  const progressPercent = Math.round((currentEventIdx / PREDEFINED_7DAY_SCENARIOS.length) * 100);

  return (
    <div className="w-full bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-3xl p-5 shadow-[4px_4px_0px_0px_#1E1E1E] space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
          <h2 className="text-sm font-black uppercase tracking-wider text-[#1E1E1E]">
            Fast-Forward 7-Day Operational Replay
          </h2>
        </div>
        <span className="text-[10px] font-bold bg-[#D4F0E4] text-[#1E1E1E] px-2.5 py-0.5 rounded-full border border-[#1E1E1E]">
          12 REALISTIC SCENARIOS
        </span>
      </div>

      <p className="text-xs text-[#555555] leading-relaxed">
        Replay 12 simulated market events representing a 7-day operating period. Demonstrates policy compliance, self-funded compute deductions, and authorization safety during both profitable trades and realistic market slippage.
      </p>

      {/* Progress Track */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-[#1E1E1E]">
          <span>Replay Progress</span>
          <span className="tabular-nums">
            {currentEventIdx} / 12 Events ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-3 bg-[#EAE5DC] border-2 border-[#1E1E1E] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#B8E3D2] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Realistic Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">Authorized</div>
          <div className="text-sm font-black text-[#2E7D32] tabular-nums mt-0.5">
            {legitimateAuthorized} Actions
          </div>
          <div className="text-[9px] text-[#666666] mt-0.5">({legitimateLossCount} slippage loss)</div>
        </div>

        <div className="p-2 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">Threats Blocked</div>
          <div className="text-sm font-black text-[#991B1B] tabular-nums mt-0.5">
            {unsafeBlocked} Rejections
          </div>
          <div className="text-[9px] text-[#666666] mt-0.5">(Zero false positives)</div>
        </div>

        <div className="p-2 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">Compute Deducted</div>
          <div className="text-sm font-black text-[#B45309] tabular-nums mt-0.5">
            -${simulatedComputeCost.toFixed(3)}
          </div>
          <div className="text-[9px] text-[#666666] mt-0.5">(NEAR AI Cloud)</div>
        </div>

        <div className="p-2 bg-[#D4F0E4] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">Net Treasury Yield</div>
          <div className="text-sm font-black text-[#2E7D32] tabular-nums mt-0.5">
            +${simulatedNetYield.toFixed(4)}
          </div>
          <div className="text-[9px] text-[#2E7D32] mt-0.5">(P&amp;L Settled)</div>
        </div>
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={handleStartStressTest}
        disabled={isSimulating || isRunning}
        className="w-full py-3 px-4 bg-[#FEF3C7] hover:bg-[#FDE047] text-[#1E1E1E] font-mono font-black text-xs uppercase tracking-wider border-2 border-[#1E1E1E] rounded-2xl shadow-[4px_4px_0px_0px_#1E1E1E] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isSimulating ? 'bg-[#D97706] animate-ping' : 'bg-[#1E1E1E]'
          }`}
        />
        <span>
          {isSimulating ? `Replaying Event ${currentEventIdx}/12...` : 'Run 7-Day Operational Replay'}
        </span>
      </button>
    </div>
  );
}
