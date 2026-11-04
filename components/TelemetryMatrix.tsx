'use client';

import React, { useState } from 'react';
import { AgentStepTelemetry } from '@/lib/types';
import { SimulatedBadge } from './SimulatedBadge';

interface TelemetryMatrixProps {
  readonly steps: readonly AgentStepTelemetry[];
  readonly activeStepIndex: number;
  readonly isRunning: boolean;
  readonly isBlocked: boolean;
  readonly onReplayStepChange?: (stepIdx: number) => void;
}

export function TelemetryMatrix({
  steps,
  activeStepIndex,
  isRunning,
  isBlocked,
  onReplayStepChange,
}: TelemetryMatrixProps) {
  const [expandedJsonSteps, setExpandedJsonSteps] = useState<Record<number, boolean>>({});

  const toggleJsonDrawer = (idx: number) => {
    setExpandedJsonSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const getStepPrefix = (stepIndex: number): string => {
    switch (stepIndex) {
      case 1:
        return 'NEAR AI Cloud';
      case 2:
        return 'Hardware Attestation';
      case 3:
        return 'OutLayer Protection';
      case 4:
        return 'NEAR Intents';
      default:
        return 'Enclave Execution';
    }
  };

  return (
    <div className="w-full bg-[#FDFBF7] border-2 border-[#1E1E1E] rounded-3xl p-5 shadow-[4px_4px_0px_0px_#1E1E1E] space-y-4">
      {/* Telemetry Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
          <h2 className="text-sm font-mono font-black uppercase tracking-wider text-[#1E1E1E]">
            Telemetry Matrix // Live Enclave Pipeline
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="text-[10px] font-mono font-bold bg-[#D4F0E4] text-[#1E1E1E] px-2 py-0.5 rounded-full border border-[#1E1E1E] animate-pulse">
              EXECUTING
            </span>
          )}
          {isBlocked && (
            <span className="text-[10px] font-mono font-bold bg-[#FCE8E6] text-[#991B1B] px-2 py-0.5 rounded-full border border-[#1E1E1E]">
              BLOCKED
            </span>
          )}
        </div>
      </div>

      {/* Steps List */}
      <div
        className="space-y-3"
        role="region"
        aria-live="polite"
        aria-label="Enclave Telemetry Execution Steps"
      >
        {steps.map((step) => {
          const isCurrent = activeStepIndex === step.stepIndex && isRunning;
          const isPast = activeStepIndex > step.stepIndex || (!isRunning && step.status !== 'pending');
          const isFailed = step.status === 'blocked' || step.status === 'failed';
          const isDrawerOpen = Boolean(expandedJsonSteps[step.stepIndex]);

          let statusBg = 'bg-[#FAF7F0] border-[#D5D0C5] text-[#888888]';
          if (isCurrent) {
            statusBg = 'bg-[#FEF3C7] border-[#1E1E1E] text-[#1E1E1E] shadow-[3px_3px_0px_0px_#1E1E1E]';
          } else if (isFailed) {
            statusBg = 'bg-[#FCE8E6] border-[#1E1E1E] text-[#991B1B] shadow-[3px_3px_0px_0px_#1E1E1E]';
          } else if (isPast) {
            statusBg = 'bg-[#FAF7F0] border-[#1E1E1E] text-[#1E1E1E] shadow-[3px_3px_0px_0px_#1E1E1E]';
          }

          return (
            <div
              key={step.stepIndex}
              className={`p-3.5 rounded-2xl border-2 transition-all duration-200 ${statusBg}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  {/* Status geometric marker */}
                  <div className="pt-0.5">
                    {step.status === 'success' && (
                      <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#2E7D32] border border-[#1E1E1E]" />
                    )}
                    {step.status === 'blocked' && (
                      <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#991B1B] border border-[#1E1E1E]" />
                    )}
                    {step.status === 'running' && (
                      <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#D97706] border border-[#1E1E1E] animate-ping" />
                    )}
                    {step.status === 'pending' && (
                      <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#CCCCCC] border border-[#999999]" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-mono font-bold leading-tight">
                      <span className="text-[#666666]">
                        [{getStepPrefix(step.stepIndex)}]
                      </span>{' '}
                      -&gt; {step.title}
                    </div>
                    <div className="text-[11px] font-mono mt-0.5 opacity-80">
                      {step.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-1">
                  {step.isSimulated && (
                    <SimulatedBadge reason={step.simulationReason} />
                  )}
                  {step.latencyMs > 0 && (
                    <span className="text-[10px] font-mono tabular-nums bg-[#EAE5DC] px-1.5 py-0.5 rounded border border-[#C5BFB5] text-[#1E1E1E]">
                      {step.latencyMs}ms
                    </span>
                  )}
                </div>
              </div>

              {/* Expandable JSON Drawer */}
              {step.details && (
                <div className="mt-2 pt-2 border-t border-[#D5D0C5]">
                  <button
                    type="button"
                    onClick={() => toggleJsonDrawer(step.stepIndex)}
                    className="text-[10px] font-mono font-bold uppercase text-[#555555] hover:text-[#1E1E1E] flex items-center gap-1 transition-colors"
                  >
                    <span>{isDrawerOpen ? 'v Hide Raw Payload' : '&gt; Inspect Raw JSON'}</span>
                  </button>

                  {isDrawerOpen && (
                    <pre className="mt-2 p-2.5 bg-[#1E1E1E] text-[#D4F0E4] rounded-xl text-[10px] font-mono overflow-x-auto border border-[#1E1E1E]">
                      {JSON.stringify(step.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Replay Scrubber */}
      {steps.some((s) => s.status !== 'pending') && !isRunning && onReplayStepChange && (
        <div className="pt-2 border-t border-[#E0DCD3]">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="font-bold text-[#1E1E1E] uppercase">
              Execution Replay Scrubber
            </span>
            <span className="text-[10px] text-[#666666]">
              Step {activeStepIndex} of 4
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value={activeStepIndex}
            onChange={(e) => onReplayStepChange(Number(e.target.value))}
            className="w-full h-2 bg-[#E5E0D8] rounded-lg appearance-none cursor-pointer accent-[#1E1E1E] border border-[#1E1E1E]"
          />
        </div>
      )}
    </div>
  );
}
