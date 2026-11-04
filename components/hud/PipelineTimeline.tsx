'use client';

/**
 * components/hud/PipelineTimeline.tsx
 *
 * 4-step security pipeline stepper showing the progression of each stage:
 *  1. Ephemeral Client Nonce & Prompt Sealing
 *  2. Intel TDX Hardware Enclave Inference
 *  3. OutLayer Policy Engine & Reputation Scan
 *  4. NEAR Intents Cross-Chain Settlement
 */

import { useVaultStore } from '@/lib/store';

export function PipelineTimeline() {
  const stage = useVaultStore((s) => s.stage);
  const gates = useVaultStore((s) => s.gates);
  const attestation = useVaultStore((s) => s.attestation);
  const directive = useVaultStore((s) => s.directive);

  const steps = [
    {
      id: 1,
      title: 'SEAL INTENT & GENERATE NONCE',
      subtitle: attestation?.clientNonce
        ? `Fresh Nonce: ${attestation.clientNonce.slice(0, 10)}...`
        : 'Ephemeral client-side sealing',
      status:
        stage === 'sealing'
          ? 'running'
          : stage === 'idle'
          ? 'idle'
          : 'passed',
    },
    {
      id: 2,
      title: 'INTEL TDX TEE INFERENCE',
      subtitle: 'Stateless confidential VM (MKTME)',
      status:
        stage === 'enclave'
          ? 'running'
          : stage === 'sealing' || stage === 'idle'
          ? 'idle'
          : 'passed',
    },
    {
      id: 3,
      title: 'OUTLAYER POLICY & REPUTATION',
      subtitle: '$50.00 cap · strict allowlist · replay shield',
      status:
        stage === 'evaluating'
          ? 'running'
          : stage === 'blocked'
          ? 'blocked'
          : stage === 'settling' || stage === 'settled'
          ? 'passed'
          : 'idle',
    },
    {
      id: 4,
      title: 'NEAR INTENTS SETTLEMENT',
      subtitle: directive
        ? `${directive.token} across ${directive.sourceChain} → ${directive.destinationChain}`
        : 'Gasless MPC cross-chain relay',
      status:
        stage === 'settling'
          ? 'running'
          : stage === 'settled'
          ? 'passed'
          : 'idle',
    },
  ];

  return (
    <div className="w-full bg-panel rounded-lg border border-line p-4 select-none">
      <div className="flex items-center justify-between mb-3 border-b border-line pb-2">
        <span className="font-mono text-[10px] text-mute uppercase tracking-wider">
          LIVE EXECUTION TIMELINE:
        </span>
        <span className="font-mono text-[9px] text-enclave font-bold uppercase">
          STAGE: {stage}
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((st) => {
          const isCurrent = st.status === 'running';
          const isPassed = st.status === 'passed';
          const isBlocked = st.status === 'blocked';

          return (
            <div key={st.id} className="flex items-start gap-3 text-xs font-mono">
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0 transition-colors ${
                  isPassed
                    ? 'border-pass bg-pass/20 text-pass shadow-glow-pass'
                    : isBlocked
                    ? 'border-block bg-block/20 text-block shadow-glow-block'
                    : isCurrent
                    ? 'border-warn bg-warn/20 text-warn animate-pulse'
                    : 'border-line bg-void text-mute'
                }`}
              >
                {isPassed ? '✓' : isBlocked ? '✕' : st.id}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold tracking-wider ${
                      isPassed
                        ? 'text-ink'
                        : isBlocked
                        ? 'text-block'
                        : isCurrent
                        ? 'text-warn'
                        : 'text-mute'
                    }`}
                  >
                    {st.title}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase ${
                      isPassed
                        ? 'text-pass'
                        : isBlocked
                        ? 'text-block'
                        : isCurrent
                        ? 'text-warn'
                        : 'text-mute/60'
                    }`}
                  >
                    {st.status}
                  </span>
                </div>
                <p className="text-[10px] text-mute truncate mt-0.5">{st.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
