'use client';

/**
 * components/hud/Terminal.tsx
 *
 * Real-time luminous terminal log stream in JetBrains Mono / Space Grotesk.
 * Shows color-coded source tags, timestamps, and layer decisions with auto-scroll.
 */

import { useEffect, useRef, useState } from 'react';
import { useVaultStore } from '@/lib/store';
import { TerminalLogEntry } from '@/lib/events';

export function Terminal() {
  const logs = useVaultStore((s) => s.logs);
  const clearLogs = useVaultStore((s) => s.clearLogs);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const getSourceBadge = (source: TerminalLogEntry['source']) => {
    switch (source) {
      case 'CLIENT':
        return 'text-enclave border-enclave/60 bg-enclave/20 shadow-glow-enclave font-bold';
      case 'ENCLAVE':
        return 'text-cyanGlow border-cyanGlow/60 bg-cyanGlow/20 shadow-glow-cyan font-bold';
      case 'POLICY':
        return 'text-warn border-warn/60 bg-warn/20 font-bold';
      case 'VERIFIER':
        return 'text-pass border-pass/60 bg-pass/20 shadow-glow-pass font-bold';
      case 'SETTLEMENT':
        return 'text-pass border-pass/60 bg-pass/20 shadow-glow-pass font-bold';
      default:
        return 'text-mute border-line bg-panel2 font-semibold';
    }
  };

  const getLevelColor = (level: TerminalLogEntry['level']) => {
    switch (level) {
      case 'block':
        return 'text-block font-black';
      case 'pass':
        return 'text-pass font-bold';
      case 'warn':
        return 'text-warn font-semibold';
      case 'enclave':
        return 'text-cyanGlow font-semibold';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="w-full bg-void rounded-xl border border-line p-5 flex flex-col font-mono text-xs select-text shadow-xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-line pb-3 mb-2.5 select-none">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-block shadow-glow-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-warn shadow-glow-warn" />
            <span className="w-2.5 h-2.5 rounded-full bg-pass shadow-glow-pass" />
          </div>
          <span className="font-mono text-xs text-white font-bold uppercase tracking-wider pl-1 flex items-center gap-2">
            ENCLAVE & POLICY TELEMETRY STREAM
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
              autoScroll
                ? 'border-pass/60 text-pass bg-pass/20 shadow-glow-pass'
                : 'border-line text-mute hover:text-white'
            }`}
          >
            {autoScroll ? 'AUTOSCROLL ON' : 'AUTOSCROLL PAUSED'}
          </button>
          <button
            onClick={clearLogs}
            className="text-[10px] px-2 py-0.5 rounded border border-line text-mute hover:text-white hover:border-line/80 transition-colors"
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="flex-1 overflow-y-auto max-h-[230px] space-y-2 pr-1 font-mono text-xs leading-relaxed">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2.5 py-0.5">
            <span className="text-mute/80 text-[10px] shrink-0 mt-0.5 font-medium">
              {log.timestamp}
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold shrink-0 ${getSourceBadge(
                log.source
              )}`}
            >
              [{log.source}]
            </span>
            <div className="flex-1 min-w-0">
              <span className={getLevelColor(log.level)}>{log.message}</span>
              {log.detail && (
                <div className="text-[11px] text-mute pl-2.5 border-l-2 border-enclave/40 mt-1 font-mono leading-normal">
                  {log.detail}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
