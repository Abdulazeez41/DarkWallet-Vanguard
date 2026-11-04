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
      statusClass: 'text-pass border-pass/40 bg-pass/10',
      description: 'Full unredacted prompt & private directive visibility',
    },
    {
      actor: 'HOST & HYPERVISOR',
      access: 'SEALED',
      statusClass: 'text-enclave border-enclave/40 bg-enclave/10',
      description: 'Physical RAM & CPU bus encrypted via Intel TDX MKTME',
    },
    {
      actor: 'NEAR AI CLOUD',
      access: 'SEALED',
      statusClass: 'text-enclave border-enclave/40 bg-enclave/10',
      description: 'Stateless confidential inference · Zero server-side retention',
    },
    {
      actor: 'PUBLIC BLOCKCHAIN',
      access: 'SEALED',
      statusClass: 'text-enclave border-enclave/40 bg-enclave/10',
      description: 'Gasless settlement via NEAR MPC chain signatures',
    },
  ];

  return (
    <div className="w-full bg-panel/70 border-b border-line px-4 py-1.5 select-none text-[10px] font-mono">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
        <div className="flex items-center gap-1.5 text-mute font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-enclave animate-pulse" />
          <span>CONFIDENTIALITY ARCHITECTURE:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {guarantees.map((g) => (
            <div key={g.actor} className="flex items-center gap-1.5" title={g.description}>
              <span className="text-mute">{g.actor}:</span>
              <span
                className={`px-1.5 py-0.2 rounded border text-[9px] font-bold tracking-wider ${g.statusClass}`}
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
