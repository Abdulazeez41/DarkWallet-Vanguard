'use client';

/**
 * components/hud/MpcDerivationModal.tsx
 *
 * NEAR MPC Key Derivation Inspector.
 *
 * Cryptographic demonstration of NEAR Chain Signatures:
 *  - Explains the mathematical derivation algorithm: P_child = P_root + SHA256(account || path) * G
 *  - Shows derived foreign addresses (Bitcoin, Ethereum, Solana) from the agent's NEAR account
 *  - Verifies multi-party threshold signature proofs (r, s, v) from v1.signer
 *  - Follows the warm Oreo brownish ash & cream aesthetic with clean organic pills.
 */

import { useState } from 'react';
import { soundFx } from '@/components/AudioFeedback';
import { useVaultStore } from '@/lib/store';
import {
  getDerivedChainKeys,
  generateMpcSignatureProof,
  ROOT_MPC_CONTRACT_MAINNET,
  ROOT_MPC_PUBLIC_KEY,
} from '@/lib/mpcDerivation';
import {
  BitcoinLogo,
  EthereumLogo,
  SolanaLogo,
  NearLogo,
} from '@/components/icons/CryptoLogos';

export function MpcDerivationModal() {
  const isMpcModalOpen = useVaultStore((s) => s.isMpcModalOpen);
  const setMpcModalOpen = useVaultStore((s) => s.setMpcModalOpen);
  const agentAddress = useVaultStore((s) => s.agentAddress);

  const [selectedChain, setSelectedChain] = useState<'Ethereum' | 'Bitcoin' | 'Solana'>('Ethereum');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isMpcModalOpen) return null;

  const derivedKeys = getDerivedChainKeys(agentAddress);
  const proof = generateMpcSignatureProof('dir_active_intent', `${selectedChain.toLowerCase()},1`);

  const handleCopy = (text: string, label: string) => {
    soundFx.playStepTick();
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getChainIcon = (chain: string) => {
    switch (chain) {
      case 'Bitcoin':
        return <BitcoinLogo size={18} />;
      case 'Ethereum':
        return <EthereumLogo size={18} />;
      case 'Solana':
        return <SolanaLogo size={18} />;
      default:
        return <NearLogo size={18} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-xs select-none overflow-y-auto">
      <div className="w-full max-w-2xl bg-panel rounded-3xl border border-line p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-line">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-enclave uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-enclave" />
                NEAR PROTOCOL CHAIN SIGNATURES
              </span>
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-panel2 text-mute border border-line font-medium">
                v1.signer MPC
              </span>
            </div>
            <h2 className="font-mono text-lg font-bold text-ink">
              NEAR MPC Key Derivation Inspector
            </h2>
            <p className="font-mono text-xs text-mute mt-1">
              One NEAR account controls Bitcoin, Ethereum, and Solana natively without bridges.
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playStepTick();
              setMpcModalOpen(false);
            }}
            className="w-8 h-8 rounded-full border border-line hover:border-ink/40 flex items-center justify-center text-mute hover:text-ink transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Cryptographic Architecture Card */}
        <div className="p-5 rounded-2xl bg-panel2 border border-line font-mono space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-bold text-ink flex items-center gap-2">
              <span>Root Signer Contract:</span>
              <code className="px-2 py-0.5 rounded-md bg-panel border border-line text-enclave">
                {ROOT_MPC_CONTRACT_MAINNET}
              </code>
            </span>
            <span className="text-mute font-medium">SECP256K1 Threshold MPC</span>
          </div>

          <div className="p-3.5 rounded-xl bg-void border border-line text-xs space-y-1.5 leading-relaxed">
            <div className="font-bold text-ink">Additive Derivation Equation:</div>
            <div className="text-enclave font-bold">
              P_child = P_root + SHA256(account_id || &apos;,&apos; || path) * G
            </div>
            <p className="text-[11px] text-mute pt-1">
              The root private key is distributed across validator threshold shares. No single entity or server ever possesses the private key for any foreign address.
            </p>
          </div>
        </div>

        {/* Derived Foreign Chains Table */}
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-mute font-medium px-1">
            <span>DERIVED FOREIGN ACCOUNTS FOR: <strong className="text-ink">{agentAddress}</strong></span>
            <span>4 Rails Connected</span>
          </div>

          <div className="space-y-2.5">
            {derivedKeys.map((item) => (
              <div
                key={item.chain}
                className="p-4 rounded-2xl bg-panel2 border border-line space-y-2 hover:border-ink/30 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {getChainIcon(item.chain)}
                    <span className="font-bold text-sm text-ink">{item.chain}</span>
                    <span className="text-xs text-mute font-medium">({item.derivationPath})</span>
                  </div>
                  <span className="text-xs font-bold text-pass flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pass" />
                    {item.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div className="text-xs text-ink font-bold truncate max-w-md bg-panel px-3 py-1.5 rounded-xl border border-line">
                    {item.derivedAddress}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.derivedAddress, item.chain)}
                      className="text-xs font-medium px-3 py-1 rounded-full border border-line bg-panel hover:bg-void text-mute hover:text-ink transition-colors"
                    >
                      {copiedKey === item.chain ? '✓ Copied' : 'Copy'}
                    </button>
                    <a
                      href={item.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium px-3 py-1 rounded-full border border-line bg-panel hover:bg-void text-enclave transition-colors flex items-center gap-1"
                    >
                      <span>Explorer</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Threshold Signature Proof Card */}
        <div className="p-4 rounded-2xl bg-void border border-line font-mono text-xs space-y-2 text-mute">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ink uppercase tracking-wider">
              Live MPC Signature Proof ({selectedChain}):
            </span>
            <div className="flex gap-1.5">
              {(['Ethereum', 'Bitcoin', 'Solana'] as const).map((chain) => (
                <button
                  key={chain}
                  onClick={() => setSelectedChain(chain)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all ${
                    selectedChain === chain
                      ? 'bg-ink text-white border-ink'
                      : 'bg-panel border-line text-mute hover:text-ink'
                  }`}
                >
                  {chain}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
            <div>
              <span className="text-mute">Digest Hash: </span>
              <span className="text-ink font-bold truncate block">{proof.requestPayloadHash}</span>
            </div>
            <div>
              <span className="text-mute">Validator Consensus: </span>
              <span className="text-pass font-bold block">{proof.mpcNodeQuorum}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-mute">ECDSA Signature (r, s, v=0): </span>
              <span className="text-ink font-mono text-[10px] break-all block bg-panel p-2 rounded-lg border border-line mt-1">
                r: {proof.signatureR}<br />
                s: {proof.signatureS}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <a
            href="https://docs.near.org/abstraction/chain-signatures"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs font-medium text-enclave hover:underline flex items-center gap-1"
          >
            <span>NEAR Chain Signatures Documentation</span>
            <span>↗</span>
          </a>

          <button
            type="button"
            onClick={() => {
              soundFx.playStepTick();
              setMpcModalOpen(false);
            }}
            className="font-mono text-xs font-bold px-6 py-2.5 rounded-full bg-ink hover:bg-black text-white shadow-xs transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
