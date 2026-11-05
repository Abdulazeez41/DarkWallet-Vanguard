'use client';

/**
 * components/hud/DeveloperSdkTab.tsx
 *
 * Developer SDK & Agent Middleware Integration Tab.
 *
 * Implements the ecosystem force-multiplier requirement of Grand Prize winners (Voog / Roke.to):
 *  - Empowers any developer on NEAR AI Cloud to wrap their agent in hardware guardrails in 3 lines.
 *  - Interactive snippets across Python (nearai), TypeScript/Next.js, and REST JSON-RPC.
 *  - Dynamic 1-click export of the active policy configuration (vanguard-policy.yaml).
 */

import { useState } from 'react';
import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';

export function DeveloperSdkTab() {
  const [activeLang, setActiveLang] = useState<'python' | 'typescript' | 'rest' | 'yaml'>('python');
  const [copied, setCopied] = useState(false);

  const policy = useVaultStore((s) => s.policy);
  const agentAddress = useVaultStore((s) => s.agentAddress);

  const pythonSnippet = `# pip install vanguard-near-ai
from vanguard_sdk import VanguardShield, NearMpcSigner

# 1. Initialize hardware-isolated policy guardrails
shield = VanguardShield(
    agent_account="${agentAddress}",
    max_usd_per_tx=${policy.maxUsdPerTx}.0,
    daily_budget_usd=${policy.sessionBudgetCapUsd}.0,
    allowed_chains=${JSON.stringify(policy.chainWhitelist)},
    enforce_tdx_attestation=True
)

# 2. Intercept & execute agent intents safely
@shield.guard
def execute_autonomous_intent(intent_prompt: str):
    # Runs securely inside Intel TDX TEE on cloud-api.near.ai
    directive = shield.infer_directive(intent_prompt)
    
    # Pre-execution policy check prevents drain & re-entrancy
    receipt = shield.settle_via_mpc(directive, contract_id="outlayer-policy.near")
    return receipt`;

  const tsSnippet = `// npm install @darkwallet/vanguard
import { VanguardGuardrails, NearChainSigner } from '@darkwallet/vanguard';

const guard = new VanguardGuardrails({
  accountId: '${agentAddress}',
  maxUsdPerTx: ${policy.maxUsdPerTx},
  sessionBudgetCapUsd: ${policy.sessionBudgetCapUsd},
  chainWhitelist: ${JSON.stringify(policy.chainWhitelist)},
  enforceHardwareTdx: true,
  accessKeyScope: 'outlayer-policy.near'
});

export async function POST(req: Request) {
  const { goal } = await req.json();

  // Evaluates spending cap, whitelist & fresh nonce in 12ms
  const result = await guard.verifyAndExecute(goal);
  if (!result.approved) {
    return Response.json({ blocked: true, reason: result.blockReasonHeadline }, { status: 403 });
  }

  return Response.json({ txHash: result.settlement.txHash });
}`;

  const restSnippet = `// POST https://cloud-api.near.ai/v1/agent/guard
// Headers: Authorization: Bearer <NEAR_AI_API_KEY>
{
  "account_id": "${agentAddress}",
  "policy": {
    "max_usd_per_tx": ${policy.maxUsdPerTx},
    "budget_cap_usd": ${policy.sessionBudgetCapUsd},
    "chain_whitelist": ${JSON.stringify(policy.chainWhitelist)},
    "require_human_warn": true
  },
  "intent": {
    "goal": "Rebalance 25 USDC from Solana to Ethereum via NEAR Intents",
    "nonce": "${Date.now()}"
  }
}`;

  const yamlConfig = `# vanguard-policy.yaml
# Auto-generated from DarkWallet Vanguard active UI controls
version: "1.0.0"
agent:
  account_id: "${agentAddress}"
  signer_contract: "v1.signer"
  policy_contract: "outlayer-policy.near"
  tee_enclave: "intel_tdx_mktme"

guardrails:
  max_usd_per_tx: ${policy.maxUsdPerTx}
  session_budget_cap_usd: ${policy.sessionBudgetCapUsd}
  chain_whitelist:
${policy.chainWhitelist.map((c) => `    - "${c}"`).join('\n')}
  token_whitelist:
${policy.tokenWhitelist.map((t) => `    - "${t}"`).join('\n')}
  enforce_nonce_freshness: true
  auto_freeze_on_threat: true
  is_revoked: ${policy.isRevoked}`;

  const getCurrentSnippet = () => {
    switch (activeLang) {
      case 'python':
        return pythonSnippet;
      case 'typescript':
        return tsSnippet;
      case 'rest':
        return restSnippet;
      case 'yaml':
        return yamlConfig;
    }
  };

  const handleCopy = () => {
    soundFx.playStepTick();
    navigator.clipboard.writeText(getCurrentSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-panel2 rounded-3xl border border-line p-5 sm:p-6 font-mono text-xs text-ink justify-between space-y-4">
      <div>
        {/* Header & Language Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3.5 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-enclave" />
              <span className="font-bold text-sm sm:text-base text-ink">
                VANGUARD AGENT SDK
              </span>
            </div>
            <p className="text-xs text-mute mt-0.5">
              Secure any NEAR AI agent with TEE guardrails in 3 lines of code.
            </p>
          </div>

          {/* Lang Tabs */}
          <div className="flex items-center gap-1 p-1 bg-panel rounded-full border border-line">
            {(['python', 'typescript', 'rest', 'yaml'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  soundFx.playStepTick();
                  setActiveLang(lang);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                  activeLang === lang
                    ? 'bg-ink text-white shadow-xs'
                    : 'text-mute hover:text-ink'
                }`}
              >
                {lang === 'yaml' ? 'Live YAML' : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="relative rounded-2xl bg-[#1E1917] border border-[#3A332E] p-4 overflow-x-auto text-xs text-white leading-relaxed max-h-[300px] overflow-y-auto shadow-inner">
          <pre className="font-mono text-[11px] sm:text-xs">
            <code>{getCurrentSnippet()}</code>
          </pre>
        </div>
      </div>

      {/* Footer Info & Copy Button */}
      <div className="pt-3 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-mute font-medium flex items-center gap-1.5">
          <span className="text-pass">✓</span>
          Matches active UI spending caps (${policy.maxUsdPerTx}.00 / ${policy.sessionBudgetCapUsd}.00)
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="font-mono text-xs font-bold px-5 py-2 rounded-full bg-ink hover:bg-black text-white shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>{copied ? '✓ Copied to Clipboard' : 'Copy SDK Snippet'}</span>
        </button>
      </div>
    </div>
  );
}
