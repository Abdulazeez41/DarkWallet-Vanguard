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
  const attestation = useVaultStore((s) => s.attestation);
  const directive = useVaultStore((s) => s.directive);

  const steps = [
    {
      id: 1,
      title: 'SEAL INTENT & GENERATE NONCE',
      subtitle: attestation?.clientNonce
        ? `Fresh Nonce: ${attestation.clientNonce.slice(0, 12)}...`
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
    <div className="w-full bg-panel rounded-xl border border-line p-5 select-none shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
        <span className="font-mono text-xs text-white font-bold uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-enclave shadow-glow-enclave" />
          LIVE PIPELINE STEPPER:
        </span>
        <span className="font-mono text-[10px] text-enclave font-black px-2.5 py-0.5 rounded-full bg-enclave/20 border border-enclave uppercase shadow-glow-enclave">
          STAGE: {stage}
        </span>
      </div>

      <div className="space-y-3.5">
        {steps.map((st) => {
          const isCurrent = st.status === 'running';
          const isPassed = st.status === 'passed';
          const isBlocked = st.status === 'blocked';

          return (
            <div key={st.id} className="flex items-start gap-3.5 text-xs font-mono">
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                  isPassed
                    ? 'border-pass bg-pass/30 text-pass shadow-glow-pass'
                    : isBlocked
                    ? 'border-block bg-block/30 text-block shadow-glow-block'
                    : isCurrent
                    ? 'border-warn bg-warn/30 text-warn animate-pulse'
                    : 'border-line bg-void text-mute'
                }`}
              >
                {isPassed ? '✓' : isBlocked ? '✕' : st.id}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold tracking-wider ${
                      isPassed
                        ? 'text-white'
                        : isBlocked
                        ? 'text-block font-black'
                        : isCurrent
                        ? 'text-warn font-black'
                        : 'text-mute'
                    }`}
                  >
                    {st.title}
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      isPassed
                        ? 'text-pass bg-pass/10'
                        : isBlocked
                        ? 'text-block bg-block/10'
                        : isCurrent
                        ? 'text-warn bg-warn/10'
                        : 'text-mute/60'
                    }`}
                  >
                    {st.status}
                  </span>
                </div>
                <p className="text-[11px] text-mute truncate mt-0.5 font-medium">{st.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
