'use client';

import React from 'react';
import { CounterpartyReport } from '@/lib/types';

interface RouteVisualizerProps {
  readonly sourceChain: string;
  readonly destinationChain: string;
  readonly token: string;
  readonly amountUsd: number;
  readonly counterparty?: CounterpartyReport | null;
  readonly isRunning: boolean;
  readonly isComplete: boolean;
  readonly isBlocked: boolean;
}

export function RouteVisualizer({
  sourceChain = 'Solana',
  destinationChain = 'Ethereum',
  token = 'USDC',
  amountUsd = 50,
  counterparty,
  isRunning = false,
  isComplete = false,
  isBlocked = false,
}: RouteVisualizerProps) {
  const getChainColor = (chain: string): string => {
    const c = chain.toLowerCase();
    if (c.includes('sol')) return 'bg-[#D4F0E4] border-[#1E1E1E] text-[#1E1E1E]';
    if (c.includes('eth')) return 'bg-[#FEF3C7] border-[#1E1E1E] text-[#1E1E1E]';
    if (c.includes('btc') || c.includes('bit'))
      return 'bg-[#F5EBE1] border-[#1E1E1E] text-[#1E1E1E]';
    return 'bg-[#E2F0D9] border-[#1E1E1E] text-[#1E1E1E]';
  };

  return (
    <div className="w-full bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-2xl p-4 shadow-[3px_3px_0px_0px_#1E1E1E]">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E0DCD3]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1E1E1E]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E1E1E]">
            NEAR Intents Route // Gasless Multi-Chain Path
          </span>
        </div>
        <div className="flex items-center gap-2">
          {counterparty && (
            <span
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                counterparty.overallStatus === 'ALLOW'
                  ? 'bg-[#D4F0E4] text-[#2E7D32] border-[#2E7D32]'
                  : 'bg-[#FCE8E6] text-[#991B1B] border-[#991B1B]'
              }`}
            >
              RECEIVER: {counterparty.overallStatus}
            </span>
          )}
          <span className="text-[10px] font-mono font-bold text-[#1E1E1E] bg-[#F5EBE1] px-2 py-0.5 rounded border border-[#D5C0AC]">
            CHAIN SIGNATURES
          </span>
        </div>
      </div>

      <div className="relative py-3">
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-[#1E1E1E] -translate-y-1/2 z-0" />

        {isRunning && (
          <div className="absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 pointer-events-none z-10 overflow-hidden">
            <div className="w-4 h-4 rounded-full bg-[#1E1E1E] -translate-y-1.5 animate-travel-line" />
          </div>
        )}

        <div className="relative z-20 flex items-center justify-between">
          {/* Node 1: Origin */}
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 rounded-full border-2 border-[#1E1E1E] flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_#1E1E1E] transition-all duration-300 ${getChainColor(
                sourceChain
              )} ${isRunning ? 'animate-pulse' : ''}`}
            >
              <span className="text-[11px] font-mono font-black uppercase">
                {sourceChain.slice(0, 3)}
              </span>
              <span className="text-[9px] font-mono text-[#555555]">SRC</span>
            </div>
            <span className="mt-1.5 text-xs font-bold text-[#1E1E1E]">
              {sourceChain}
            </span>
          </div>

          {/* Node 2: NEAR MPC Network Core */}
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 rounded-full border-2 border-[#1E1E1E] flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_#1E1E1E] transition-all duration-300 ${
                isBlocked
                  ? 'bg-[#FCE8E6] text-[#991B1B]'
                  : isComplete
                    ? 'bg-[#D4F0E4] text-[#1E1E1E]'
                    : 'bg-[#FEF3C7] text-[#1E1E1E]'
              } ${isRunning ? 'animate-bounce' : ''}`}
            >
              <span className="text-[11px] font-mono font-black uppercase">NEAR</span>
              <span className="text-[9px] font-mono text-[#555555]">MPC</span>
            </div>
            <span className="mt-1.5 text-xs font-bold text-[#1E1E1E]">
              Chain Signatures
            </span>
          </div>

          {/* Node 3: Destination */}
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 rounded-full border-2 border-[#1E1E1E] flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_#1E1E1E] transition-all duration-300 ${getChainColor(
                destinationChain
              )} ${isComplete && !isBlocked ? 'ring-2 ring-[#2E7D32]' : ''}`}
            >
              <span className="text-[11px] font-mono font-black uppercase">
                {destinationChain.slice(0, 3)}
              </span>
              <span className="text-[9px] font-mono text-[#555555]">DST</span>
            </div>
            <span className="mt-1.5 text-xs font-bold text-[#1E1E1E]">
              {destinationChain}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-[#E0DCD3] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-[#666666]">Asset:</span>
          <span className="font-bold text-[#1E1E1E] tabular-nums">
            {amountUsd > 0 ? `$${amountUsd.toFixed(2)}` : '$0.00'} {token}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#666666]">Bridge:</span>
          <span className="font-bold text-[#1E1E1E]">Zero-Custodian Intent</span>
        </div>
      </div>
    </div>
  );
}
