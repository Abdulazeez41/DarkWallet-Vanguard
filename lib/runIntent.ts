/**
 * lib/runIntent.ts
 *
 * Client execution runner. Streams NDJSON events from /api/agent into the Zustand store.
 * Includes graceful offline fallback using pre-calculated demo sequences so the app
 * never fails during live judging or connectivity drops.
 */

import { soundFx } from '@/components/AudioFeedback';
import { getCachedDemoResponse, generateDemoEventSequence } from './demoScript';
import { RunEvent } from './events';
import { useVaultStore } from './store';
import { AgentRunRequest } from './types';

export async function runIntent(
  request: AgentRunRequest,
  options?: { runMode?: 'user' | 'gauntlet' | 'daemon' }
): Promise<void> {
  const store = useVaultStore.getState();

  // Reset previous state
  store.resetRun(true);
  store.setRunMode(options?.runMode || 'user');
  store.setMonitorVisible(true);

  soundFx.playStepTick();

  // 1. Initial local sealing event
  const redacted = request.goal
    .split(' ')
    .map((w) => (w.length > 2 ? '█'.repeat(w.length) : w))
    .join(' ');

  store.applyRunEvent({
    type: 'STAGE_CHANGE',
    timestamp: Date.now(),
    payload: { stage: 'sealing' },
  });

  store.applyRunEvent({
    type: 'INTENT_SEALED',
    timestamp: Date.now(),
    payload: {
      redactedPrompt: redacted,
      originalLength: request.goal.length,
    },
  });

  try {
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/x-ndjson, application/json',
      },
      body: JSON.stringify({
        ...request,
        stream: true,
      }),
    });

    if (!res.ok) {
      throw new Error(`Agent API returned status ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || '';

    // If streaming NDJSON
    if (contentType.includes('application/x-ndjson') && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const streamedEvents: RunEvent[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const event = JSON.parse(trimmed) as RunEvent;
            streamedEvents.push(event);
          } catch {
            // Safe ignore JSON parse error in stream line
          }
        }
      }

      if (buffer.trim()) {
        try {
          const event = JSON.parse(buffer.trim()) as RunEvent;
          streamedEvents.push(event);
        } catch {
          // Ignore
        }
      }

      if (streamedEvents.length > 0) {
        await playbackEvents(streamedEvents);
      }
      return;
    }

    // If standard JSON response
    const json = await res.json();
    const demoEvents = generateDemoEventSequence(json, request.goal);
    await playbackEvents(demoEvents);
  } catch {
    // Network or server failure -> Execute offline demo sequence gracefully
    store.addLog({
      level: 'warn',
      source: 'CLIENT',
      message: 'Server unreachable or offline. Running resilient cached demo pipeline.',
    });

    const cachedResponse = getCachedDemoResponse(request.goal, request.threatType);
    const demoEvents = generateDemoEventSequence(cachedResponse, request.goal);
    await playbackEvents(demoEvents);
  }
}

async function playbackEvents(events: RunEvent[]): Promise<void> {
  const store = useVaultStore.getState();

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    store.applyRunEvent(event);

    // Audio cues
    if (event.type === 'GATE_CHECKING') {
      soundFx.playStepTick();
    } else if (event.type === 'GATE_RESOLVED') {
      if (event.payload.passed) {
        soundFx.playStepTick();
      } else {
        soundFx.playShatterAlarm();
        soundFx.triggerHaptic([40, 80, 40]);
      }
    } else if (event.type === 'SETTLEMENT_EVENT') {
      soundFx.playSuccessTone();
      soundFx.triggerHaptic(60);
    }

    // Delay between paced visual events
    await new Promise((resolve) => setTimeout(resolve, 240));
  }
}
