'use client';

/**
 * components/hud/GuideModal.tsx
 *
 * Interactive Onboarding & Navigation Guide for judges and first-time users.
 * Explains:
 *  1. The Core Architecture & Confidentiality Guarantees
 *  2. The 3D Vault Physical Pipeline (Enclave -> 3 Gates -> Settlement Rails)
 *  3. How to Launch Attacks in the Cyber-Range ("Break the Vault")
 *  4. Inspecting Audit Evidence, Nonces, and the 7-Day Replay
 */

import { useState } from 'react';
import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';
import { runIntent } from '@/lib/runIntent';
import { JUDGE_DEMO_SCENARIOS } from '@/lib/demoScript';

const GUIDE_STEPS = [
  {
    stepNumber: '01',
    badge: 'CORE MISSION',
    title: 'Give AI Money Without Handing It The Keys',
    headline: 'Confidential Reasoning + Deterministic Policy Enclave',
    description:
      'Autonomous agents need to rebalance liquidity across Ethereum, Solana, and Bitcoin, but giving an LLM direct custody of raw private keys is a critical security vulnerability.',
    bullets: [
      'Intel TDX TEE provides CPU-level hardware isolation (MKTME). Neither cloud provider nor host OS can read prompt or memory.',
      'OutLayer Deterministic Policy Engine strictly enforces spending limits and counterparty scans BEFORE funds leave the vault.',
      'Stateless Execution: Zero prompts or keys are stored server-side after execution.',
    ],
    ctaText: 'Explore the 3D Pipeline →',
  },
  {
    stepNumber: '02',
    badge: '3D PIPELINE',
    title: 'Physical Architecture Made Visual',
    headline: 'Every 3D Object Represents a Real Hardware & Security Boundary',
    description:
      'The 3D vault is not a canned animation; every visual movement is driven in real-time by streaming backend events (NDJSON).',
    bullets: [
      'Origin (X: -8.0): User submits intent. Client seals prompt with ephemeral keys.',
      'Intel TDX Enclave (X: -4.5): Frost-glass cube where confidential LLM inference occurs.',
      'Gate 1 (X: -1.0): Spend Limit ($50 single-trade cap / $200 aggregate session cap).',
      'Gate 2 (X: +1.5): Counterparty Allowlist & Honeypot Threat Scanner.',
      'Gate 3 (X: +4.0): Hardware Attestation Nonce Freshness Match (prevents replay attacks).',
      'Multi-Chain Rails (X: +7.5): BTC, ETH, SOL, and NEAR settlement via gasless MPC signatures.',
    ],
    ctaText: 'Learn How to Attack the Vault →',
  },
  {
    stepNumber: '03',
    badge: 'CYBER-RANGE',
    title: 'Break the Vault (Adversary Gauntlet)',
    headline: 'Watch Hostile Attacks Shatter at the Exact Defensive Gate',
    description:
      'To prove defenses are real, judges can launch live simulated attacks from the "Break the Vault" tab:',
    bullets: [
      'Phishing Drainer Attack: Adversary attempts transfer to an unauthorized address -> Shatters at Gate 2 (Allowlist).',
      'Session Budget Exhaustion: Agent attempts large order ($180) -> Shatters at Gate 1 (Spend Limit).',
      'Stale Nonce Replay: Attacker replays captured quote -> Shatters at Gate 3 (Nonce Freshness).',
      '60-Shard Explosion: When an attack is blocked, the packet explodes into 60 high-velocity crimson shards with camera shake!',
    ],
    ctaText: 'Review Audit Proofs & 7-Day Replay →',
  },
  {
    stepNumber: '04',
    badge: 'AUDIT & BUSINESS',
    title: 'Torn Paper Evidence & Autonomous Yield',
    headline: 'Honest Proofs, Zero Exaggeration, Self-Sustaining Treasury',
    description:
      'Every execution prints a physical torn-edge paper receipt directly out of the classified dark vault.',
    bullets: [
      'Honest Labeling: Explicitly labeled [VERIFIED] (Intel TDX hardware verified) or [SIMULATED] (mock TDX key).',
      'Inspect Proofs Modal: View raw PCR0/MRTD hashes, 32-byte nonces, and Root CA verification checklist.',
      '7-Day Replay: Demonstrates realistic market slippage gains/losses, self-funded compute fee deductions to NEAR AI Cloud ($0.003/tx), and automated 80/20 contributor revenue splits.',
    ],
    ctaText: 'Start Rebalancing In Intent Vault →',
  },
];

export function GuideModal() {
  const isGuideModalOpen = useVaultStore((s) => s.isGuideModalOpen);
  const setGuideModalOpen = useVaultStore((s) => s.setGuideModalOpen);
  const setActiveTab = useVaultStore((s) => s.setActiveTab);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isGuideModalOpen) return null;

  const currentStep = GUIDE_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === GUIDE_STEPS.length - 1;

  const handleNext = () => {
    soundFx.playStepTick();
    if (isLastStep) {
      setGuideModalOpen(false);
      setActiveTab('intent');
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    soundFx.playStepTick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md select-none">
      <div className="bg-panel border border-enclave/40 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden font-mono text-xs flex flex-col">
        {/* Header Bar */}
        <div className="border-b border-line px-5 py-3.5 flex items-center justify-between bg-panel2/80">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-enclave shadow-glow-enclave" />
            <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              DARKWALLET VANGUARD: NAVIGATION & ARCHITECTURE GUIDE
            </span>
          </div>

          <button
            onClick={() => {
              soundFx.playStepTick();
              setGuideModalOpen(false);
            }}
            className="text-mute hover:text-ink text-sm p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator Ribbon */}
        <div className="bg-void/90 border-b border-line px-5 py-2 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2">
            {GUIDE_STEPS.map((st, i) => (
              <button
                key={st.stepNumber}
                onClick={() => {
                  soundFx.playStepTick();
                  setCurrentStepIndex(i);
                }}
                className={`px-2 py-0.5 rounded border transition-all ${
                  i === currentStepIndex
                    ? 'border-enclave bg-enclave/20 text-enclave font-bold shadow-glow-enclave'
                    : i < currentStepIndex
                    ? 'border-pass/50 bg-pass/10 text-pass'
                    : 'border-line text-mute'
                }`}
              >
                {st.stepNumber} {st.badge}
              </button>
            ))}
          </div>

          <span className="text-mute">
            Step {currentStepIndex + 1} of {GUIDE_STEPS.length}
          </span>
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto space-y-4 select-text">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-enclave/20 text-enclave border border-enclave/40 uppercase">
                {currentStep.badge}
              </span>
              <span className="text-xs text-mute uppercase font-semibold">
                PHASE {currentStep.stepNumber}
              </span>
            </div>

            <h3 className="font-mono text-base font-bold text-ink mt-2">
              {currentStep.title}
            </h3>
            <p className="font-mono text-xs text-pass font-semibold mt-1">
              {currentStep.headline}
            </p>
          </div>

          <p className="font-mono text-xs text-mute leading-relaxed bg-void/60 p-3 rounded border border-line">
            {currentStep.description}
          </p>

          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-bold text-ink uppercase tracking-wider block">
              KEY ARCHITECTURAL HIGHLIGHTS:
            </span>
            <div className="space-y-1.5">
              {currentStep.bullets.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-mute/95 bg-panel2/50 p-2.5 rounded border border-line/60"
                >
                  <span className="text-enclave font-bold shrink-0">▸</span>
                  <span className="leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="border-t border-line px-5 py-3.5 bg-panel2/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="py-1.5 px-3 rounded border border-line text-mute hover:text-ink text-xs font-mono font-semibold transition-colors"
              >
                ← PREVIOUS
              </button>
            )}
            <button
              onClick={() => {
                soundFx.playStepTick();
                setGuideModalOpen(false);
              }}
              className="py-1.5 px-3 rounded text-mute hover:text-ink text-xs font-mono transition-colors"
            >
              SKIP TOUR
            </button>
          </div>

          <button
            onClick={handleNext}
            className="py-2 px-5 rounded bg-enclave hover:bg-enclave/90 text-void font-mono text-xs font-bold uppercase border border-enclave shadow-glow-enclave transition-all active:scale-95 flex items-center gap-2"
          >
            <span>{currentStep.ctaText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
