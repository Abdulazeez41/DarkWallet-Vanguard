'use client';

import React from 'react';

interface SimulatedBadgeProps {
  readonly reason?: string;
  readonly className?: string;
}

export function SimulatedBadge({ reason, className = '' }: SimulatedBadgeProps) {
  return (
    <span
      title={reason || 'Simulated execution for developer environment'}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold rounded-md bg-[#F5EBE1] text-[#7A583A] border border-[#D5C0AC] select-none ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#B88757]" />
      Simulated
    </span>
  );
}
