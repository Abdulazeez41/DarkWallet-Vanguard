'use client';

/**
 * components/hud/Terminal.tsx
 *
 * Real-time luminous terminal log stream in JetBrains Mono / Space Grotesk.
 * Shows color-coded source tags, timestamps, and layer decisions with auto-scroll.
 * Styled with large legible text and rich contrast.
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
        return 'text-enclave border-enclave/60 bg-enclave/20 font-bold';
      case 'ENCLAVE':
        return 'text-[#F5A623] border-[#F5A623]/60 bg-[#F5A623]/20 font-bold';
      case 'POLICY':
        return 'text-warn border-warn/60 bg-warn/20 font-bold';
      case 'VERIFIER':
        return 'text-pass border-pass/60 bg-pass/20 font-bold';
      case 'SETTLEMENT':
        return 'text-pass border-pass/60 bg-pass/20 font-bold';
      default:
        return 'text-mute border-line bg-panel2 font-semibold';
    }
  };

  const getLevelColor = (level: TerminalLogEntry['level']) => {
    switch (level) {
      case 'block':
        return 'text-block font-black';
      case 'pass':
        return 'text-[#48BB78] font-bold';
      case 'warn':
        return 'text-warn font-semibold';
      case 'enclave':
        return 'text-[#ED8936] font-semibold';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="w-full bg-[#181512] rounded-2xl border border-line p-5 sm:p-6 flex flex-col font-mono text-xs sm:text-sm select-text shadow-sm flex-1">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-[#3D332A] pb-3.5 mb-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-warn" />
            <span className="w-2.5 h-2.5 rounded-full bg-pass" />
          </div>
          <span className="font-mono text-xs sm:text-sm text-white font-bold uppercase tracking-wider pl-1 flex items-center gap-2">
            TELEMETRY & POLICY STREAM
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors ${
              autoScroll
                ? 'border-pass/60 text-[#48BB78] bg-pass/10'
                : 'border-[#3D332A] text-mute hover:text-white'
            }`}
          >
            {autoScroll ? 'AUTOSCROLL ON' : 'PAUSED'}
          </button>
          <button
            onClick={clearLogs}
            className="text-xs px-2.5 py-1 rounded-lg border border-[#3D332A] text-mute hover:text-white hover:border-[#524538] transition-colors"
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="flex-1 overflow-y-auto max-h-[320px] sm:max-h-[350px] space-y-2.5 pr-1 font-mono text-xs sm:text-sm leading-relaxed">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2.5 py-0.5">
            <span className="text-[#8F857A] text-xs shrink-0 mt-0.5 font-medium">
              {log.timestamp}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded border uppercase font-bold shrink-0 ${getSourceBadge(
                log.source
              )}`}
            >
              [{log.source}]
            </span>
            <div className="flex-1 min-w-0">
              <span className={getLevelColor(log.level)}>{log.message}</span>
              {log.detail && (
                <div className="text-xs text-[#A89E92] pl-3 border-l-2 border-enclave/60 mt-1 font-mono leading-normal">
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
