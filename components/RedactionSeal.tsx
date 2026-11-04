'use client';

import React, { useEffect, useState } from 'react';

interface RedactionSealProps {
  readonly text: string;
  readonly isRedacting: boolean;
  readonly isRedacted: boolean;
  readonly onRedactionComplete?: () => void;
}

export function RedactionSeal({
  text,
  isRedacting,
  isRedacted,
  onRedactionComplete,
}: RedactionSealProps) {
  const words = text ? text.split(/\s+/) : [];
  const [revealedCount, setRevealedCount] = useState<number>(0);

  useEffect(() => {
    if (isRedacting) {
      setRevealedCount(0);
      let index = 0;
      const interval = setInterval(() => {
        index += 1;
        setRevealedCount(index);
        if (index >= words.length) {
          clearInterval(interval);
          if (onRedactionComplete) {
            onRedactionComplete();
          }
        }
      }, 70);

      return () => clearInterval(interval);
    } else if (isRedacted) {
      setRevealedCount(words.length);
    } else {
      setRevealedCount(0);
    }
  }, [isRedacting, isRedacted, words.length, onRedactionComplete]);

  if (!text) {
    return (
      <div className="text-sm font-mono text-[#888888] italic">
        [No prompt entered]
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#666666] font-bold">
          {isRedacted || isRedacting
            ? 'CONFIDENTIAL PROMPT // TDX MEMORY ISOLATION'
            : 'PLAINTEXT INTENT (PRE-ENCLAVE)'}
        </span>
        {(isRedacted || isRedacting) && (
          <span className="text-[10px] font-mono font-bold bg-[#1E1E1E] text-[#FDFBF7] px-2 py-0.5 rounded uppercase">
            SEALED
          </span>
        )}
      </div>

      <div className="p-3 bg-[#F5EBE1] border-2 border-[#1E1E1E] rounded-xl font-mono text-sm leading-relaxed min-h-[4rem] flex flex-wrap gap-1.5 items-center">
        {words.map((word, idx) => {
          const shouldMask = isRedacted || (isRedacting && idx < revealedCount);

          if (shouldMask) {
            return (
              <span
                key={idx}
                className="inline-block bg-[#1E1E1E] text-[#1E1E1E] select-none rounded-[2px] px-1 transition-all duration-150 animate-redact-lock"
                style={{
                  minWidth: `${Math.max(word.length * 8, 24)}px`,
                  height: '1.25em',
                }}
                aria-label="classified"
              >
                {/* Visual solid classified block */}
              </span>
            );
          }

          return (
            <span
              key={idx}
              className="inline-block text-[#1E1E1E] transition-opacity duration-150"
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
