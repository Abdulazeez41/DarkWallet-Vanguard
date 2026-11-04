'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TreasuryLedgerEntry } from '@/lib/types';
import { soundFx } from './AudioFeedback';

interface FastForwardStressTestProps {
  readonly isRunning: boolean;
  readonly onBatchComplete: (entries: TreasuryLedgerEntry[]) => void;
  readonly onLogEvent: (level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'ENCLAVE', text: string) => void;
}

export function FastForwardStressTest({
  isRunning,
  onBatchComplete,
  onLogEvent,
}: FastForwardStressTestProps) {
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentCycle, setCurrentCycle] = useState<number>(0);
  const [totalCycles] = useState<number>(12);
  const [approvedCount, setApprovedCount] = useState<number>(0);
  const [blockedCount, setBlockedCount] = useState<number>(0);
  const [simulatedGrossVolume, setSimulatedGrossVolume] = useState<number>(0);
  const [simulatedInferenceCost, setSimulatedInferenceCost] = useState<number>(0);
  const [simulatedNetYield, setSimulatedNetYield] = useState<number>(0);

  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartStressTest = () => {
    if (isSimulating || isRunning) return;

    setIsSimulating(true);
    setCurrentCycle(0);
    setApprovedCount(0);
    setBlockedCount(0);
    setSimulatedGrossVolume(0);
    setSimulatedInferenceCost(0);
    setSimulatedNetYield(0);

    onLogEvent('ENCLAVE', '=== INITIATING FAST-FORWARD STRESS TEST (12 CYCLES) ===');
    soundFx.playStepTick();

    const batchEntries: TreasuryLedgerEntry[] = [];
    let cycle = 0;
    let approved = 0;
    let blocked = 0;
    let grossVol = 0;
    let inferCost = 0;
    let netYield = 0;

    simulationRef.current = setInterval(() => {
      cycle += 1;
      setCurrentCycle(cycle);

      // Random market event simulation
      const spread = 0.5 + Math.random() * 1.8; // 0.5% to 2.3%
      const amount = Math.floor(15 + Math.random() * 55); // $15 to $70
      const isOverCap = amount > 50;

      soundFx.playStepTick();

      if (isOverCap) {
        blocked += 1;
        setBlockedCount(blocked);
        onLogEvent(
          'WARN',
          `[Cycle ${cycle}/12] Trade size $${amount}.00 exceeds $50.00 limit -> OutLayer Blocked.`
        );
      } else {
        approved += 1;
        setApprovedCount(approved);

        const fee = 0.003; // NEAR AI Cloud TEE inference cost
        const solverFee = 0.04;
        const gain = Number((amount * (spread / 100)).toFixed(4));
        const net = Math.max(0, Number((gain - fee - solverFee).toFixed(4)));
        const contributorShare = Number((net * 0.2).toFixed(4));
        const treasuryShare = Number((net * 0.8).toFixed(4));

        grossVol += amount;
        inferCost += fee;
        netYield += net;

        setSimulatedGrossVolume(grossVol);
        setSimulatedInferenceCost(inferCost);
        setSimulatedNetYield(netYield);

        const newEntry: TreasuryLedgerEntry = {
          entryId: `sim_${Date.now()}_${cycle}`,
          timestamp: new Date().toISOString(),
          grossIntentVolumeUsd: amount,
          inferenceCostUsd: fee,
          solverRelayerFeeUsd: solverFee,
          netYieldUsd: net,
          treasuryShareUsd: treasuryShare,
          contributorPayoutUsd: contributorShare,
          contributorAccount: 'contributors.vanguard.near',
          status: 'SETTLED',
        };
        batchEntries.unshift(newEntry);

        onLogEvent(
          'SUCCESS',
          `[Cycle ${cycle}/12] Intent settled: $${amount} USDC via NEAR Intents. Net: +$${net}.`
        );
      }

      if (cycle >= totalCycles) {
        if (simulationRef.current) clearInterval(simulationRef.current);
        setIsSimulating(false);
        soundFx.playSuccessTone();
        soundFx.triggerHaptic([40, 80, 40]);
        onLogEvent(
          'ENCLAVE',
          `=== STRESS TEST COMPLETE: ${approved} settled, ${blocked} blocked. Net Yield: +$${netYield.toFixed(
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

  const progressPercent = Math.round((currentCycle / totalCycles) * 100);

  return (
    <div className="w-full bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-3xl p-5 shadow-[4px_4px_0px_0px_#1E1E1E] space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
          <h2 className="text-sm font-black uppercase tracking-wider text-[#1E1E1E]">
            Fast-Forward Stress Test // Autonomous Simulation
          </h2>
        </div>
        <span className="text-[10px] font-bold bg-[#D4F0E4] text-[#1E1E1E] px-2.5 py-0.5 rounded-full border border-[#1E1E1E]">
          12 ACCELERATED CYCLES
        </span>
      </div>

      <p className="text-xs text-[#555555] leading-relaxed">
        Simulate an entire month of autonomous market volatility and cross-chain treasury execution in 15 seconds. Observe self-funded TEE compute deductions and automatic contributor revenue splits.
      </p>

      {/* Progress Bar Track */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-[#1E1E1E]">
          <span>Simulation Progress</span>
          <span className="tabular-nums">
            {currentCycle} / {totalCycles} Cycles ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-3 bg-[#EAE5DC] border-2 border-[#1E1E1E] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#B8E3D2] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Live Simulation Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">Settled</div>
          <div className="text-sm font-black text-[#2E7D32] tabular-nums mt-0.5">
            {approvedCount} Runs
          </div>
        </div>

        <div className="p-2 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">Policy Blocked</div>
          <div className="text-sm font-black text-[#991B1B] tabular-nums mt-0.5">
            {blockedCount} Trades
          </div>
        </div>

        <div className="p-2 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">Simulated Vol</div>
          <div className="text-sm font-black text-[#1E1E1E] tabular-nums mt-0.5">
            ${simulatedGrossVolume.toFixed(2)}
          </div>
        </div>

        <div className="p-2 bg-[#D4F0E4] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E]">
          <div className="text-[9px] uppercase text-[#666666] font-bold">Net Yield</div>
          <div className="text-sm font-black text-[#2E7D32] tabular-nums mt-0.5">
            +${simulatedNetYield.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Action Button */}
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
          {isSimulating ? `Simulating Cycle ${currentCycle}/12...` : 'Run Fast-Forward Stress Test'}
        </span>
      </button>
    </div>
  );
}
