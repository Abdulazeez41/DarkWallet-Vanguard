'use client';

import React from 'react';

interface WhoCanSeeThisProps {
  readonly isRunning: boolean;
  readonly isComplete: boolean;
}

interface ActorPrivilege {
  readonly name: string;
  readonly subtitle: string;
  readonly isSealed: boolean;
  readonly reason: string;
}

export function WhoCanSeeThis({ isRunning, isComplete }: WhoCanSeeThisProps) {
  const actors: readonly ActorPrivilege[] = [
    {
      name: 'You',
      subtitle: 'Client Origin',
      isSealed: false,
      reason: 'Raw trade goal formulated in your local browser runtime.',
    },
    {
      name: 'Host Node',
      subtitle: 'Hardware Cloud',
      isSealed: true,
      reason: 'Intel TDX MKTME memory encryption prevents host hypervisor inspection.',
    },
    {
      name: 'LLM Operator',
      subtitle: 'NEAR AI Cloud',
      isSealed: true,
      reason: 'Confidential Computing isolates inference weights and ephemeral context.',
    },
    {
      name: 'Network',
      subtitle: 'Public Chains',
      isSealed: true,
      reason: 'NEAR Intents relay solvers observe only cryptographically signed payload hash.',
    },
  ];

  return (
    <div className="w-full bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-2xl p-3 shadow-[3px_3px_0px_0px_#1E1E1E]">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#E0DCD3]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1E1E1E]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E1E1E]">
            Confidentiality Boundary // Who Can See This?
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#666666] uppercase">
          Zero-Leak Enclave
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {actors.map((actor, idx) => {
          const isYou = actor.name === 'You';
          const statusText = isYou ? 'SEEN' : 'SEALED';
          const isFilled = isRunning || isComplete;

          return (
            <div
              key={actor.name}
              title={actor.reason}
              className={`p-2 rounded-xl border-2 border-[#1E1E1E] transition-all duration-300 ${
                isYou
                  ? 'bg-[#FEF3C7]'
                  : isFilled
                    ? 'bg-[#D4F0E4]'
                    : 'bg-[#F5EBE1]'
              } shadow-[2px_2px_0px_0px_#1E1E1E]`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#1E1E1E]">
                  {actor.name}
                </span>
                {/* Status indicator dot */}
                <div className="flex items-center gap-1">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full border border-[#1E1E1E] transition-all duration-300 ${
                      isYou
                        ? 'bg-[#1E1E1E]'
                        : isFilled
                          ? 'bg-[#2E7D32]'
                          : 'bg-transparent'
                    }`}
                  />
                  <span className="text-[10px] font-mono font-bold text-[#1E1E1E]">
                    {statusText}
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-mono text-[#555555] leading-tight">
                {actor.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
