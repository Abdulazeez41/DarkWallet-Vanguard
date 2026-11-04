/**
 * lib/attestation.ts
 *
 * Helpers for Intel TDX hardware attestation verification,
 * cryptographic nonce checking, and honest labeling (VERIFIED vs SIMULATED).
 */

import { EnclaveAttestation, VerificationCheckItem } from './types';

export function isHardwareAttested(attestation?: EnclaveAttestation | null): boolean {
  if (!attestation) return false;
  return attestation.verified && !attestation.isSimulated;
}

export function verifyClientNonce(
  clientNonce: string,
  quoteReportDataNonce: string
): boolean {
  if (!clientNonce || !quoteReportDataNonce) return false;
  const cleanA = clientNonce.toLowerCase().trim();
  const cleanB = quoteReportDataNonce.toLowerCase().trim();
  return cleanA === cleanB;
}

export interface AttestationBadgeInfo {
  label: 'VERIFIED' | 'SIMULATED' | 'REJECTED' | 'UNVERIFIED';
  badgeClass: string;
  dotClass: string;
  description: string;
}

export function getAttestationBadge(
  attestation?: EnclaveAttestation | null
): AttestationBadgeInfo {
  if (!attestation) {
    return {
      label: 'UNVERIFIED',
      badgeClass: 'border-line text-mute bg-void/60',
      dotClass: 'bg-mute',
      description: 'No hardware quote fetched yet.',
    };
  }

  if (!attestation.verified) {
    return {
      label: 'REJECTED',
      badgeClass: 'border-block/50 text-block bg-block/10',
      dotClass: 'bg-block animate-pulse',
      description: 'Quote rejected: fresh nonce mismatch or invalid signature.',
    };
  }

  if (attestation.isSimulated) {
    return {
      label: 'SIMULATED',
      badgeClass: 'border-warn/40 text-warn bg-warn/10',
      dotClass: 'bg-warn',
      description:
        'Mock Intel TDX signature key. Real hardware verification requires deployed TEE host.',
    };
  }

  return {
    label: 'VERIFIED',
    badgeClass: 'border-pass/40 text-pass bg-pass/10',
    dotClass: 'bg-pass',
    description:
      'Intel TDX quote cryptographically verified against Intel Root CA & fresh client nonce.',
  };
}

export function generateFreshNonce(): string {
  const bytes = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 32; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return `0x${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}`;
}

export function createSimulatedAttestation(
  verified = true,
  clientNonce = generateFreshNonce(),
  isReplayAttack = false
): EnclaveAttestation {
  const quoteNonce = isReplayAttack
    ? '0xdeadbeef00000000000000000000000000000000000000000000000000000000'
    : clientNonce;

  const checks: VerificationCheckItem[] = [
    {
      id: 'check-root-ca',
      title: 'Intel Root CA Signature Chain',
      passed: true,
      detail: 'Cryptographic certificate chain traces to Intel SGX/TDX root endorsement authority.',
    },
    {
      id: 'check-nonce-freshness',
      title: 'Attestation Nonce Freshness Match',
      passed: !isReplayAttack,
      detail: !isReplayAttack
        ? `Fresh client nonce matches quote report data (${clientNonce.slice(0, 10)}...).`
        : `STALE NONCE MISMATCH: Client nonce (${clientNonce.slice(0, 10)}...) does not match quote report data (${quoteNonce.slice(0, 10)}...). Replay attack rejected.`,
    },
    {
      id: 'check-mrtd-pcr0',
      title: 'MRTD / PCR0 Code Measurement',
      passed: true,
      detail: 'Enclave boot measurement matches verified DarkWallet Vanguard binary digest.',
    },
    {
      id: 'check-tcb-status',
      title: 'TCB (Trusted Computing Base) Status',
      passed: true,
      detail: 'Hardware microcode and firmware verified up-to-date with no revocation flags.',
    },
  ];

  return {
    enclaveId: 'tdx-vanguard-0x9f2a',
    pcr0: '8a9c3d4e7f1b2a0c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c',
    tdxQuote: 'AgAAAAAAAADAAAAAAQAAAFq7iP3...tdx_quote_sha256_e7d2b4f9c1a0e8d3c5b7',
    signingKeyDigest: 'ed25519:6h2N4hB...78yVvM8zK2',
    clientNonce,
    quoteReportDataNonce: quoteNonce,
    verified: verified && !isReplayAttack,
    isSimulated: true,
    simulationReason:
      'Honest simulation: Hardware quote verified with local mock TDX endorsement key.',
    generatedAt: new Date().toISOString(),
    verificationChecks: checks,
  };
}
