'use client';

/**
 * components/hud/Terminal.tsx
 *
 * Real-time dark terminal log stream in JetBrains Mono / Space Grotesk.
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
        return 'text-enclave border-enclave/30 bg-enclave/10';
      case 'ENCLAVE':
        return 'text-[#7C9CFF] border-[#7C9CFF]/30 bg-[#7C9CFF]/10';
      case 'POLICY':
        return 'text-warn border-warn/30 bg-warn/10';
      case 'VERIFIER':
        return 'text-pass border-pass/30 bg-pass/10';
      case 'SETTLEMENT':
        return 'text-pass border-pass/30 bg-pass/10';
      default:
        return 'text-mute border-line bg-panel2';
    }
  };

  const getLevelColor = (level: TerminalLogEntry['level']) => {
    switch (level) {
      case 'block':
        return 'text-block font-semibold';
      case 'pass':
        return 'text-pass';
      case 'warn':
        return 'text-warn';
      case 'enclave':
        return 'text-[#7C9CFF]';
      default:
        return 'text-ink';
    }
  };

  return (
    <div className="w-full bg-void rounded-lg border border-line p-4 flex flex-col font-mono text-xs select-text">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-line pb-2.5 mb-2 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-block/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-warn/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-pass/70" />
          </div>
          <span className="font-mono text-[10px] text-mute uppercase tracking-widest pl-1">
            ENCLAVE & POLICY TELEMETRY STREAM
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
              autoScroll
                ? 'border-pass/40 text-pass bg-pass/10'
                : 'border-line text-mute hover:text-ink'
            }`}
          >
            {autoScroll ? 'AUTOSCROLL ON' : 'AUTOSCROLL PAUSED'}
          </button>
          <button
            onClick={clearLogs}
            className="text-[9px] px-1.5 py-0.5 rounded border border-line text-mute hover:text-ink hover:border-line/80 transition-colors"
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="flex-1 overflow-y-auto max-h-[220px] space-y-1.5 pr-1 font-mono text-[11px] leading-relaxed">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 py-0.5">
            <span className="text-mute/60 text-[9px] shrink-0 mt-0.5">
              {log.timestamp}
            </span>
            <span
              className={`text-[9px] px-1 py-0.2 rounded border uppercase font-semibold shrink-0 ${getSourceBadge(
                log.source
              )}`}
            >
              [{log.source}]
            </span>
            <div className="flex-1 min-w-0">
              <span className={getLevelColor(log.level)}>{log.message}</span>
              {log.detail && (
                <div className="text-[10px] text-mute/80 pl-2 border-l border-line/60 mt-0.5 font-mono">
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
