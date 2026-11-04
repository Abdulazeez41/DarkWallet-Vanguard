'use client';

/**
 * components/hud/ConfidentialityStrip.tsx
 *
 * Displays precise architectural confidentiality guarantees.
 * Distinguishes what is visible to the user from what is sealed against the host,
 * hypervisor, network, and cloud provider.
 */

export function ConfidentialityStrip() {
  const guarantees = [
    {
      actor: 'YOU (CLIENT)',
      access: 'SEEN',
      statusClass: 'text-pass border-pass bg-pass/20 shadow-glow-pass',
      description: 'Full unredacted prompt & private directive visibility',
    },
    {
      actor: 'HOST & HYPERVISOR',
      access: 'SEALED',
      statusClass: 'text-enclave border-enclave bg-enclave/20 shadow-glow-enclave',
      description: 'Physical RAM & CPU bus encrypted via Intel TDX MKTME',
    },
    {
      actor: 'NEAR AI CLOUD',
      access: 'SEALED',
      statusClass: 'text-enclave border-enclave bg-enclave/20 shadow-glow-enclave',
      description: 'Stateless confidential inference · Zero server-side retention',
    },
    {
      actor: 'PUBLIC BLOCKCHAIN',
      access: 'SEALED',
      statusClass: 'text-enclave border-enclave bg-enclave/20 shadow-glow-enclave',
      description: 'Gasless settlement via NEAR MPC chain signatures',
    },
  ];

  return (
    <div className="w-full bg-panel/90 backdrop-blur-sm border-b border-line px-4 py-2 select-none text-[11px] font-mono">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4">
        <div className="flex items-center gap-2 text-white font-bold">
          <span className="w-2 h-2 rounded-full bg-enclave shadow-glow-enclave animate-pulse" />
          <span>CONFIDENTIALITY ARCHITECTURE:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3.5">
          {guarantees.map((g) => (
            <div key={g.actor} className="flex items-center gap-1.5" title={g.description}>
              <span className="text-white/80 font-medium">{g.actor}:</span>
              <span
                className={`px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider ${g.statusClass}`}
              >
                [{g.access}]
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
