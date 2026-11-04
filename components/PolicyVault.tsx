'use client';

import React, { useEffect, useState } from 'react';
import { AgentPolicy } from '@/lib/types';
import { STANDARD_CHAINS, STANDARD_TOKENS } from '@/lib/policy';

interface PolicyVaultProps {
  readonly policy: AgentPolicy;
  readonly onPolicyChange: (newPolicy: AgentPolicy) => void;
  readonly onRevokeToggle: () => void;
}

export function PolicyVault({
  policy,
  onPolicyChange,
  onRevokeToggle,
}: PolicyVaultProps) {
  const [remainingTimeSec, setRemainingTimeSec] = useState<number>(0);

  // Countdown timer for session expiry
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((policy.sessionExpiryMs - now) / 1000));
      setRemainingTimeSec(diff);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [policy.sessionExpiryMs]);

  const formatCountdown = (totalSeconds: number): string => {
    if (totalSeconds <= 0) return 'EXPIRED';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const handleMaxAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onPolicyChange({
      ...policy,
      maxUsdPerTx: val,
    });
  };

  const toggleToken = (token: string) => {
    const exists = policy.tokenWhitelist.includes(token);
    const updated = exists
      ? policy.tokenWhitelist.filter((t) => t !== token)
      : [...policy.tokenWhitelist, token];

    onPolicyChange({
      ...policy,
      tokenWhitelist: updated,
    });
  };

  const toggleChain = (chain: string) => {
    const exists = policy.chainWhitelist.includes(chain);
    const updated = exists
      ? policy.chainWhitelist.filter((c) => c !== chain)
      : [...policy.chainWhitelist, chain];

    onPolicyChange({
      ...policy,
      chainWhitelist: updated,
    });
  };

  const extendSession = () => {
    onPolicyChange({
      ...policy,
      sessionExpiryMs: Date.now() + 60 * 60 * 1000, // extend by 1 hour
    });
  };

  return (
    <div className="w-full bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-3xl p-5 shadow-[4px_4px_0px_0px_#1E1E1E] space-y-5">
      {/* Vault Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
          <h2 className="text-sm font-mono font-black uppercase tracking-wider text-[#1E1E1E]">
            OutLayer Policy Vault // Client Guardrails
          </h2>
        </div>
        <span className="text-[11px] font-mono font-bold bg-[#FEF3C7] text-[#1E1E1E] px-2.5 py-0.5 rounded-full border border-[#1E1E1E]">
          STRICT CONSTRAINTS
        </span>
      </div>

      {/* Revocation Kill-Switch Warning Banner if Revoked */}
      {policy.isRevoked && (
        <div className="p-3 bg-[#FCE8E6] border-2 border-[#991B1B] rounded-2xl text-[#991B1B] text-xs font-mono font-bold animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#991B1B]" />
            <span>AGENT ACCESS WAS REVOKED BY YOU</span>
          </div>
          <p className="mt-1 text-[11px] font-normal text-[#661E1E]">
            All trade directives are hard-blocked by the client security policy.
          </p>
        </div>
      )}

      {/* Control 1: Max USD per Transaction Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="font-bold text-[#1E1E1E] uppercase">
            Max Trade Limit (USD)
          </span>
          <span className="font-bold text-sm bg-[#FAF7F0] px-3 py-0.5 rounded-lg border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_#1E1E1E] tabular-nums">
            ${policy.maxUsdPerTx}.00
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="250"
          step="5"
          value={policy.maxUsdPerTx}
          onChange={handleMaxAmountChange}
          disabled={policy.isRevoked}
          className="w-full h-3 bg-[#E5E0D8] rounded-lg appearance-none cursor-pointer accent-[#1E1E1E] border-2 border-[#1E1E1E]"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#666666]">
          <span>$5 (Micro-hedging)</span>
          <span>$50 (Standard)</span>
          <span>$250 (High Cap)</span>
        </div>
      </div>

      {/* Control 2: Token Whitelist Chips */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold text-[#1E1E1E] uppercase">
          Approved Asset Whitelist
        </div>
        <div className="flex flex-wrap gap-2">
          {STANDARD_TOKENS.map((token) => {
            const isApproved = policy.tokenWhitelist.includes(token);
            return (
              <button
                key={token}
                type="button"
                onClick={() => toggleToken(token)}
                disabled={policy.isRevoked}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_#1E1E1E] active:scale-95 transition-all ${
                  isApproved
                    ? 'bg-[#D4F0E4] text-[#1E1E1E]'
                    : 'bg-[#F5EBE1] text-[#888888] line-through'
                }`}
              >
                {token}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control 3: Chain Whitelist Chips */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold text-[#1E1E1E] uppercase">
          Approved Networks
        </div>
        <div className="flex flex-wrap gap-2">
          {STANDARD_CHAINS.map((chain) => {
            const isApproved = policy.chainWhitelist.includes(chain);
            return (
              <button
                key={chain}
                type="button"
                onClick={() => toggleChain(chain)}
                disabled={policy.isRevoked}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_#1E1E1E] active:scale-95 transition-all ${
                  isApproved
                    ? 'bg-[#FEF3C7] text-[#1E1E1E]'
                    : 'bg-[#F5EBE1] text-[#888888] line-through'
                }`}
              >
                {chain}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control 4: Session Expiry Countdown */}
      <div className="p-3 bg-[#FAF7F0] border-2 border-[#1E1E1E] rounded-2xl flex items-center justify-between shadow-[2px_2px_0px_0px_#1E1E1E]">
        <div>
          <div className="text-[10px] font-mono uppercase text-[#666666] font-bold">
            Session Window
          </div>
          <div className="text-sm font-mono font-black text-[#1E1E1E] tabular-nums">
            {formatCountdown(remainingTimeSec)}
          </div>
        </div>
        <button
          type="button"
          onClick={extendSession}
          disabled={policy.isRevoked}
          className="px-3 py-1 text-xs font-mono font-bold bg-[#D4F0E4] text-[#1E1E1E] border-2 border-[#1E1E1E] rounded-xl shadow-[2px_2px_0px_0px_#1E1E1E] active:scale-95 transition-all disabled:opacity-50"
        >
          +60m Extend
        </button>
      </div>

      {/* Control 5: Revoke Agent Kill-Switch */}
      <button
        type="button"
        onClick={onRevokeToggle}
        className={`w-full py-3 px-4 rounded-2xl font-mono font-black text-xs uppercase tracking-wider border-2 border-[#1E1E1E] shadow-[4px_4px_0px_0px_#1E1E1E] active:scale-95 transition-all flex items-center justify-center gap-2 ${
          policy.isRevoked
            ? 'bg-[#D4F0E4] text-[#1E1E1E] hover:bg-[#B8E3D2]'
            : 'bg-[#FCE8E6] text-[#991B1B] hover:bg-[#F9D0CC]'
        }`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            policy.isRevoked ? 'bg-[#1E1E1E]' : 'bg-[#991B1B]'
          }`}
        />
        {policy.isRevoked ? 'Re-Authorize Agent' : 'Revoke Agent Kill Switch'}
      </button>
    </div>
  );
}
