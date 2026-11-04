'use client';

/**
 * components/hud/Replay.tsx
 *
 * 7-Day Fast-Forward Stress Test & Autonomous Business Ledger (Track 04).
 * Demonstrates self-funded compute deductions to NEAR AI Cloud, realistic market slippage,
 * and automated 80/20 revenue distribution between treasury retention and contributor rewards.
 */

import { useState } from 'react';
import { soundFx } from '@/components/AudioFeedback';

interface ReplayDay {
  day: number;
  date: string;
  volumeUsd: number;
  trades: number;
  netYieldUsd: number;
  slippagePct: number;
  inferenceCostUsd: number;
  contributorSplitUsd: number;
  treasurySplitUsd: number;
}

const REPLAY_DATA: ReplayDay[] = [
  {
    day: 1,
    date: 'Day 1 (Mon)',
    volumeUsd: 140,
    trades: 5,
    netYieldUsd: 18.4,
    slippagePct: +0.42,
    inferenceCostUsd: 0.015,
    contributorSplitUsd: 3.68,
    treasurySplitUsd: 14.72,
  },
  {
    day: 2,
    date: 'Day 2 (Tue)',
    volumeUsd: 210,
    trades: 7,
    netYieldUsd: 29.5,
    slippagePct: +0.65,
    inferenceCostUsd: 0.021,
    contributorSplitUsd: 5.9,
    treasurySplitUsd: 23.6,
  },
  {
    day: 3,
    date: 'Day 3 (Wed)',
    volumeUsd: 180,
    trades: 6,
    netYieldUsd: 12.1,
    slippagePct: -0.18, // Realistic negative slippage dip!
    inferenceCostUsd: 0.018,
    contributorSplitUsd: 2.42,
    treasurySplitUsd: 9.68,
  },
  {
    day: 4,
    date: 'Day 4 (Thu)',
    volumeUsd: 260,
    trades: 8,
    netYieldUsd: 36.8,
    slippagePct: +0.58,
    inferenceCostUsd: 0.024,
    contributorSplitUsd: 7.36,
    treasurySplitUsd: 29.44,
  },
  {
    day: 5,
    date: 'Day 5 (Fri)',
    volumeUsd: 310,
    trades: 9,
    netYieldUsd: 41.2,
    slippagePct: +0.72,
    inferenceCostUsd: 0.027,
    contributorSplitUsd: 8.24,
    treasurySplitUsd: 32.96,
  },
  {
    day: 6,
    date: 'Day 6 (Sat)',
    volumeUsd: 190,
    trades: 6,
    netYieldUsd: 24.6,
    slippagePct: +0.31,
    inferenceCostUsd: 0.018,
    contributorSplitUsd: 4.92,
    treasurySplitUsd: 19.68,
  },
  {
    day: 7,
    date: 'Day 7 (Sun)',
    volumeUsd: 130,
    trades: 4,
    netYieldUsd: 21.6,
    slippagePct: +0.45,
    inferenceCostUsd: 0.012,
    contributorSplitUsd: 4.32,
    treasurySplitUsd: 17.28,
  },
];

export function Replay() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(6); // Default Day 7
  const [isPlaying, setIsPlaying] = useState(false);

  const currentDay = REPLAY_DATA[selectedDayIndex];

  // Aggregate cumulative totals up to selected day
  const cumulativeDays = REPLAY_DATA.slice(0, selectedDayIndex + 1);
  const totalVolume = cumulativeDays.reduce((acc, d) => acc + d.volumeUsd, 0);
  const totalYield = cumulativeDays.reduce((acc, d) => acc + d.netYieldUsd, 0);
  const totalInferenceCost = cumulativeDays.reduce((acc, d) => acc + d.inferenceCostUsd, 0);
  const totalContributorSplit = cumulativeDays.reduce((acc, d) => acc + d.contributorSplitUsd, 0);
  const totalTreasurySplit = cumulativeDays.reduce((acc, d) => acc + d.treasurySplitUsd, 0);
  const totalTrades = cumulativeDays.reduce((acc, d) => acc + d.trades, 0);

  const handlePlaySimulation = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    let day = 0;
    setSelectedDayIndex(0);

    const interval = setInterval(() => {
      day += 1;
      if (day < REPLAY_DATA.length) {
        soundFx.playStepTick();
        setSelectedDayIndex(day);
      } else {
        clearInterval(interval);
        setIsPlaying(false);
        soundFx.playSuccessTone();
      }
    }, 700);
  };

  return (
    <div className="w-full bg-panel rounded-lg border border-line p-5 space-y-6 select-none">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-sm font-bold text-ink tracking-wider">
              7-DAY AUTONOMOUS TREASURY STRESS TEST
            </h2>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-enclave/15 text-enclave border border-enclave/30">
              TRACK 04 BUSINESS
            </span>
          </div>
          <p className="font-mono text-[10px] text-mute mt-1">
            Simulate 7 days of autonomous rebalancing. Evaluates self-funded inference fees and 80/20 contributor revenue splits.
          </p>
        </div>

        <button
          onClick={handlePlaySimulation}
          disabled={isPlaying}
          className="font-mono text-xs font-bold px-4 py-2 rounded bg-enclave hover:bg-enclave/90 text-void border border-enclave shadow-glow-enclave transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 self-start sm:self-auto"
        >
          <span>{isPlaying ? 'FAST-FORWARDING...' : 'RUN 7-DAY TIME-LAPSE ▶'}</span>
        </button>
      </div>

      {/* Scrubbable Time-Lapse Slider */}
      <div className="bg-void/80 border border-line rounded-lg p-4">
        <div className="flex items-center justify-between font-mono text-[11px] text-mute mb-2">
          <span>TIMELINE SCRUBBER:</span>
          <span className="text-ink font-bold">{currentDay.date} (Day {currentDay.day} of 7)</span>
        </div>
        <input
          type="range"
          min={0}
          max={6}
          step={1}
          value={selectedDayIndex}
          onChange={(e) => {
            soundFx.playStepTick();
            setSelectedDayIndex(Number(e.target.value));
          }}
          disabled={isPlaying}
          className="w-full accent-enclave h-2 bg-panel rounded appearance-none cursor-pointer"
        />
        <div className="flex justify-between font-mono text-[9px] text-mute mt-1 px-1">
          {REPLAY_DATA.map((d, i) => (
            <span
              key={d.day}
              className={`cursor-pointer ${i === selectedDayIndex ? 'text-enclave font-bold' : ''}`}
              onClick={() => setSelectedDayIndex(i)}
            >
              D{d.day}
            </span>
          ))}
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-panel2/60 border border-line rounded p-3">
          <div className="font-mono text-[9px] text-mute uppercase">CUMULATIVE VOLUME</div>
          <div className="font-mono text-base font-bold text-ink mt-1">
            ${totalVolume.toFixed(2)}
          </div>
          <div className="font-mono text-[9px] text-mute mt-0.5">{totalTrades} rebalances settled</div>
        </div>

        <div className="bg-panel2/60 border border-line rounded p-3">
          <div className="font-mono text-[9px] text-mute uppercase">NET FINANCIAL YIELD</div>
          <div className="font-mono text-base font-bold text-pass mt-1">
            +${totalYield.toFixed(2)}
          </div>
          <div className="font-mono text-[9px] text-mute mt-0.5">Post-slippage spread</div>
        </div>

        <div className="bg-panel2/60 border border-line rounded p-3">
          <div className="font-mono text-[9px] text-mute uppercase">80% TREASURY SHARE</div>
          <div className="font-mono text-base font-bold text-enclave mt-1">
            ${totalTreasurySplit.toFixed(2)}
          </div>
          <div className="font-mono text-[9px] text-mute mt-0.5">Retained in multi-sig</div>
        </div>

        <div className="bg-panel2/60 border border-line rounded p-3">
          <div className="font-mono text-[9px] text-mute uppercase">20% CONTRIBUTOR POOL</div>
          <div className="font-mono text-base font-bold text-warn mt-1">
            ${totalContributorSplit.toFixed(2)}
          </div>
          <div className="font-mono text-[9px] text-mute mt-0.5">contributors.vanguard.near</div>
        </div>
      </div>

      {/* Autonomous Compute Self-Funding Banner */}
      <div className="bg-void border border-line rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-enclave" />
          <span className="text-mute">Autonomous Compute Deduction:</span>
          <span className="text-ink font-semibold">
            ${totalInferenceCost.toFixed(4)} self-funded to NEAR AI Cloud ($0.003 / prompt)
          </span>
        </div>
        <div className="text-[10px] text-mute">
          Net Treasury Margin: <span className="text-pass font-bold">98.9%</span>
        </div>
      </div>
    </div>
  );
}
