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
    <div className="w-full bg-panel rounded-xl border border-line p-6 space-y-6 select-none shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-mono text-base font-black text-white tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-enclave shadow-glow-enclave" />
              7-DAY AUTONOMOUS TREASURY STRESS TEST
            </h2>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-enclave/20 text-enclave border border-enclave/40 font-bold uppercase shadow-glow-enclave">
              TRACK 04 BUSINESS
            </span>
          </div>
          <p className="font-mono text-xs text-mute mt-1.5 leading-relaxed">
            Simulate 7 days of autonomous rebalancing across Bitcoin, Ethereum, and Solana. Demonstrates self-funded compute fee deductions to NEAR AI Cloud and automated 80/20 contributor revenue splits.
          </p>
        </div>

        <button
          onClick={handlePlaySimulation}
          disabled={isPlaying}
          className="font-mono text-xs font-black px-5 py-2.5 rounded-lg bg-gradient-to-r from-enclave to-cyan-400 hover:from-cyan-400 hover:to-enclave text-void border border-enclave shadow-glow-cyan transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 self-start sm:self-auto"
        >
          <span>{isPlaying ? 'FAST-FORWARDING...' : 'RUN 7-DAY TIME-LAPSE ▶'}</span>
        </button>
      </div>

      {/* Scrubbable Time-Lapse Slider */}
      <div className="bg-void/90 border border-line rounded-xl p-4.5 shadow-inner">
        <div className="flex items-center justify-between font-mono text-xs text-mute mb-2">
          <span className="text-white font-bold">TIMELINE SCRUBBER:</span>
          <span className="text-enclave font-black">{currentDay.date} (Day {currentDay.day} of 7)</span>
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
          className="w-full accent-enclave h-2.5 bg-panel2 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between font-mono text-[10px] text-mute font-bold mt-2 px-1">
          {REPLAY_DATA.map((d, i) => (
            <span
              key={d.day}
              className={`cursor-pointer px-1.5 py-0.5 rounded transition-all ${
                i === selectedDayIndex
                  ? 'text-white bg-enclave/30 border border-enclave shadow-glow-enclave font-black scale-105'
                  : 'text-mute hover:text-white'
              }`}
              onClick={() => setSelectedDayIndex(i)}
            >
              Day {d.day}
            </span>
          ))}
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-panel2 border border-line rounded-xl p-4 shadow-sm">
          <div className="font-mono text-[10px] text-mute uppercase font-bold">CUMULATIVE VOLUME</div>
          <div className="font-mono text-lg font-black text-white mt-1">
            ${totalVolume.toFixed(2)}
          </div>
          <div className="font-mono text-[10px] text-mute mt-0.5">{totalTrades} rebalances settled</div>
        </div>

        <div className="bg-panel2 border border-pass/40 rounded-xl p-4 shadow-sm shadow-glow-pass">
          <div className="font-mono text-[10px] text-pass uppercase font-bold">NET FINANCIAL YIELD</div>
          <div className="font-mono text-lg font-black text-pass mt-1">
            +${totalYield.toFixed(2)}
          </div>
          <div className="font-mono text-[10px] text-white/80 mt-0.5">Post-slippage spread</div>
        </div>

        <div className="bg-panel2 border border-enclave/40 rounded-xl p-4 shadow-sm shadow-glow-enclave">
          <div className="font-mono text-[10px] text-enclave uppercase font-bold">80% TREASURY SHARE</div>
          <div className="font-mono text-lg font-black text-enclave mt-1">
            ${totalTreasurySplit.toFixed(2)}
          </div>
          <div className="font-mono text-[10px] text-white/80 mt-0.5">Retained in multi-sig</div>
        </div>

        <div className="bg-panel2 border border-warn/40 rounded-xl p-4 shadow-sm shadow-glow-warn">
          <div className="font-mono text-[10px] text-warn uppercase font-bold">20% CONTRIBUTOR POOL</div>
          <div className="font-mono text-lg font-black text-warn mt-1">
            ${totalContributorSplit.toFixed(2)}
          </div>
          <div className="font-mono text-[10px] text-white/80 mt-0.5">contributors.vanguard.near</div>
        </div>
      </div>

      {/* Autonomous Compute Self-Funding Banner */}
      <div className="bg-void border border-enclave/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-enclave shadow-glow-enclave" />
          <span className="text-mute font-semibold">Autonomous Compute Fee:</span>
          <span className="text-white font-bold">
            ${totalInferenceCost.toFixed(4)} self-funded to NEAR AI Cloud ($0.003 / prompt)
          </span>
        </div>
        <div className="text-[11px] text-mute">
          Net Treasury Margin: <span className="text-pass font-black">98.9%</span>
        </div>
      </div>
    </div>
  );
}
