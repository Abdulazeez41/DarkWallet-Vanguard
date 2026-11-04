'use client';

import React, { useEffect, useRef } from 'react';

export interface TerminalMessage {
  readonly id: string;
  readonly timestamp: string;
  readonly level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'ENCLAVE';
  readonly text: string;
}

interface TerminalLogProps {
  readonly logs: readonly TerminalMessage[];
  readonly onClear?: () => void;
}

export function TerminalLog({ logs, onClear }: TerminalLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelStyle = (level: TerminalMessage['level']) => {
    switch (level) {
      case 'SUCCESS':
        return 'text-[#B8E3D2] font-bold';
      case 'ERROR':
        return 'text-[#FCE8E6] font-bold';
      case 'WARN':
        return 'text-[#FEF3C7] font-bold';
      case 'ENCLAVE':
        return 'text-[#D4F0E4] font-bold';
      case 'INFO':
      default:
        return 'text-[#E0E0E0]';
    }
  };

  return (
    <div className="w-full bg-[#1E1E1E] text-[#FDFBF7] border-2 border-[#1E1E1E] rounded-2xl p-3 sm:p-4 shadow-[4px_4px_0px_0px_#1E1E1E] font-mono flex flex-col h-48 sm:h-56">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#333333] shrink-0 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#991B1B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
          </div>
          <span className="text-[#888888] font-bold uppercase tracking-wider text-[10px] ml-1">
            Enclave Telemetry Terminal // Intel TDX Guest
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-[10px] text-[#888888] hover:text-[#FFFFFF] uppercase transition-colors"
            >
              Clear
            </button>
          )}
          <span className="text-[10px] text-[#555555]">TTY-0</span>
        </div>
      </div>

      {/* Terminal Output Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 text-xs pr-1 scrollbar-thin scrollbar-thumb-[#444444]"
      >
        {logs.length === 0 ? (
          <div className="text-[#666666] italic text-[11px] py-4">
            [Awaiting agent initialization. Submit trading goal or run tamper test...]
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#666666] text-[10px] shrink-0 tabular-nums">
                {log.timestamp}
              </span>
              <span className="text-[#888888] text-[10px] shrink-0">
                [{log.level}]
              </span>
              <span className={`text-[11px] break-words ${getLevelStyle(log.level)}`}>
                {log.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
