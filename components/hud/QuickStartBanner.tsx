'use client';

/**
 * components/hud/QuickStartBanner.tsx
 *
 * Prominent 3-step navigation ribbon helping operators and users
 * quickly understand the core flow of the application.
 */

import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';

export function QuickStartBanner() {
  const activeTab = useVaultStore((s) => s.activeTab);
  const setActiveTab = useVaultStore((s) => s.setActiveTab);
  const setGuideModalOpen = useVaultStore((s) => s.setGuideModalOpen);
  const stage = useVaultStore((s) => s.stage);

  const isRunning =
    stage === 'sealing' || stage === 'enclave' || stage === 'evaluating' || stage === 'settling';

  const steps = [
    {
      num: '01',
      title: 'TYPE OR CHOOSE INTENT',
      desc: 'Prompt sealed in Intel TDX TEE',
      active: activeTab === 'intent',
      action: () => {
        soundFx.playStepTick();
        setActiveTab('intent');
      },
    },
    {
      num: '02',
      title: 'WATCH 3D GATES VERIFY',
      desc: 'Packet traverses 3 security toruses',
      active: isRunning,
      action: () => {
        soundFx.playStepTick();
        setActiveTab('intent');
      },
    },
    {
      num: '03',
      title: 'ATTACK & BREAK THE VAULT',
      desc: 'Launch attacks & watch them shatter',
      active: activeTab === 'gauntlet',
      action: () => {
        soundFx.playStepTick();
        setActiveTab('gauntlet');
      },
    },
  ];

  return (
    <div className="w-full bg-panel2/80 backdrop-blur-md border-y border-line px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 select-none">
      <div className="w-full max-w-[1720px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono">
        {/* Navigation Step Pills */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] text-mute uppercase font-bold tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-enclave shadow-glow-enclave" />
            HOW TO NAVIGATE:
          </span>

          <div className="flex items-center gap-2 shrink-0">
            {steps.map((st, i) => (
              <div key={st.num} className="flex items-center gap-2">
                <button
                  onClick={st.action}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-left transition-all ${
                    st.active
                      ? 'bg-enclave/20 border-enclave text-ink shadow-glow-enclave scale-[1.02]'
                      : 'bg-panel/90 border-line hover:border-enclave/40 text-mute hover:text-ink'
                  }`}
                >
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      st.active
                        ? 'bg-enclave text-white'
                        : 'bg-void text-mute border border-line'
                    }`}
                  >
                    {st.num}
                  </span>
                  <div>
                    <div className="text-[10px] font-bold tracking-tight text-ink">
                      {st.title}
                    </div>
                    <div className="text-[8px] text-mute hidden sm:block">
                      {st.desc}
                    </div>
                  </div>
                </button>
                {i < steps.length - 1 && (
                  <span className="text-line text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Guided Tour Modal Trigger Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              soundFx.playStepTick();
              setGuideModalOpen(true);
            }}
            className="w-full md:w-auto font-mono text-[11px] font-bold px-3 py-1.5 rounded-md bg-panel hover:bg-enclave/15 text-enclave border border-enclave/50 hover:border-enclave shadow-glow-enclave transition-all flex items-center justify-center gap-1.5 active:scale-95"
            title="Open Interactive Navigation & Architectural Walkthrough"
          >
            <span className="w-2 h-2 rounded-full bg-enclave animate-ping" />
            <span>INTERACTIVE WALKTHROUGH GUIDE (?)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
