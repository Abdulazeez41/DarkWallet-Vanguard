# DarkWallet Vanguard

[![Intel TDX TEE](https://img.shields.io/badge/Hardware_Enclave-Intel_TDX-blue.svg)](https://docs.near.ai/cloud/quickstart)
[![NEAR Chain Signatures](https://img.shields.io/badge/Custody-NEAR_MPC_Chain_Signatures-black.svg)](https://docs.near.org/abstraction/chain-signatures)
[![Framework](https://img.shields.io/badge/Framework-Next.js_15_(App_Router)-000000.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **The Hardware-Isolated Security Middleware and Autonomous Cross-Chain Treasury for AI Agents on NEAR.**  
> *Give AI agents capital without handing them the keys to everything.*

---

## 1. Overview & Problem Statement

Giving an autonomous AI agent an on-chain crypto wallet is fundamentally broken: **it requires handing the LLM direct access to raw private keys or seed phrases**. 

If the agent is manipulated through prompt injection, hallucinates an address, or interacts with a malicious contract, the entire treasury is vulnerable to immediate, irreversible drainage.

**DarkWallet Vanguard** solves this problem by acting as an armor-plated, hardware-isolated execution middleware:
* **The Agent Never Touches Private Keys**: Assets across Bitcoin, Ethereum, Solana, and NEAR are controlled through **NEAR Decentralized Chain Signatures (MPC)**.
* **Confidential Hardware Enclaves**: Sensitive reasoning and execution directives occur strictly within an **Intel TDX Trusted Execution Environment (TEE)** on **NEAR AI Cloud**, verified against fresh client nonces.
* **Deterministic Policy Firewall**: Every transaction is mathematically validated against strict spending limits, session budget caps, safe recipient allowlists, and real-time counterparty threat intelligence before an MPC signature can ever be generated.
* **Zero Server-Side Persistence**: The middleware maintains zero state on disk or databases. Prompts are sealed client-side with ephemeral keys and memory-cleared immediately upon response delivery.

```
┌──────────────┐     Plain Intent      ┌──────────────────────────────────┐
│  User / Web3 │ ────────────────────► │  Intel TDX Confidential Enclave  │
│  Delegator   │                       │  (NEAR AI Cloud / MKTME Encrypt) │
└──────────────┘                       └─────────────────┬────────────────┘
                                                         │
                                               Execution Directive &
                                            Hardware Attestation Quote
                                                         │
                                                         ▼
                                       ┌──────────────────────────────────┐
                                       │ Deterministic Policy Firewall    │
                                       │  • Gate 1: Per-Tx & Session Cap  │
                                       │  • Gate 2: Counterparty Allowlist│
                                       │  • Gate 3: Fresh Nonce & Expiry  │
                                       └─────────────────┬────────────────┘
                                                         │ (Pass All 3 Gates)
                                                         ▼
                                       ┌──────────────────────────────────┐
                                       │ NEAR MPC Chain Signatures        │
                                       │  • Bitcoin  (bc1...)             │
                                       │  • Ethereum (0x...)              │
                                       │  • Solana   (Base58...)          │
                                       └─────────────────┬────────────────┘
                                                         │
                                                         ▼
                                          Multi-Chain Gasless Settlement
```

---

## 2. Core Architectural Pillars

### Pillar 1: Confidential Hardware Isolation (Intel TDX on NEAR AI Cloud)
* **Hardware Memory Encryption**: AI inference runs inside Intel TDX Confidential Virtual Machines with Intel MKTME (Multi-Key Total Memory Encryption) enabled. The host hypervisor, server operators, and cloud providers cannot inspect enclave memory.
* **Dynamic Client-Side Nonce**: For every execution, the client generates a cryptographically secure 32-byte nonce (`crypto.getRandomValues`) that must match the signed report data within the Intel TDX attestation quote, mathematically eliminating replay attacks.
* **4-Point Attestation Verification**: Verifies the Intel Root CA signature chain, attestation quote freshness, Trusted Computing Base (TCB) firmware measurements, and enclave runtime parameters.

### Pillar 2: Deterministic Policy Engine & Security Firewall
Before any signature is generated, `lib/policy.ts` evaluates the execution directive across strict, independent security rules:
1. **Per-Action Spending Limit**: Rejects single transactions exceeding operator-configured thresholds (e.g., $50.00 max).
2. **Cumulative Session Budget**: Enforces stateful accounting that tracks aggregate volume across an active session window (e.g., $200.00 total cap).
3. **Session Expiry Window**: Time-bounds agent authorization; expired sessions are immediately halted.
4. **Counterparty Reputation Scanner**: Cross-references recipient addresses against known drainers, malicious solvers, and phishing registries.
5. **Approved Asset & Chain Whitelists**: Restricts execution strictly to authorized networks (Ethereum, Solana, Bitcoin, NEAR) and authorized assets (USDC, USDT, NEAR, SOL, ETH, BTC).
6. **Client-Side Emergency Kill-Switch**: Operator can instantly revoke all agent authorizations with a single click.

### Pillar 3: Multi-Chain Custody via NEAR Chain Signatures (MPC)
* **Single Account, Universal Execution**: The agent derives native addresses for Bitcoin (`bc1...`), Ethereum (`0x...`), and Solana from a single root NEAR identity (`vanguard-agent.near`) using standardized derivation paths (`vanguard-agent.near/ethereum-1`).
* **Threshold Signature Generation**: Signatures are generated by NEAR's decentralized validator network through Multi-Party Computation (MPC). No single node, agent, or developer ever reconstructs or holds a master private key.

### Pillar 4: Autonomous Treasury & Self-Funding Inference Loop
* **Self-Paying Compute Loop**: The agent generates revenue from cross-chain yield and arbitrage spreads via NEAR Intents, and autonomously pays for its own inference compute (~$0.003 per run to NEAR AI Cloud).
* **Real-Time P&L Accounting**: Automated business balance sheet tracking retained treasury reserves and contributor revenue distributions.
* **Autonomous Heartbeat Daemon**: Continuous background monitor that polls oracle spreads and liquidity conditions inside the TEE enclave, autonomously executing rebalancing within safety bounds.

---

## 3. Pluggable Developer SDK

DarkWallet Vanguard can be imported into any autonomous agent framework (ElizaOS, LangChain, AutoGPT, or custom NEAR AI agents) as a pluggable security proxy.

```typescript
import { VanguardClient } from '@darkwallet/vanguard-sdk';

// Initialize the Vanguard Security Proxy
const vanguard = new VanguardClient({
  agentId: 'vanguard-agent.near',
  policy: {
    maxUsdPerTx: 50,
    sessionBudgetCapUsd: 200,
    allowedChains: ['Ethereum', 'Solana', 'Bitcoin', 'NEAR'],
    allowedTokens: ['USDC', 'USDT', 'NEAR', 'SOL'],
  },
  enclaveEndpoint: 'https://cloud-api.near.ai/v1',
});

// Execute an autonomous cross-chain trade through the hardware policy shield
const result = await vanguard.executeIntent({
  goal: 'Rebalance $25 USDC from NEAR into Ethereum for higher staking yield',
  destinationChain: 'Ethereum',
  token: 'USDC',
  amountUsd: 25,
});

if (result.approved) {
  console.log(`Settled across NEAR -> Ethereum! Tx: ${result.settlement.txHash}`);
} else {
  console.error(`Blocked by Policy Gate: ${result.policyResult.blockReasonHeadline}`);
}
```

---

## 4. Security Gauntlet & Attack Scenarios

DarkWallet Vanguard includes a built-in **Security Gauntlet** to test and verify defensive resilience against common adversarial vectors:

| Attack Vector | Simulated Threat | Defending Security Layer | System Behavior |
| :--- | :--- | :--- | :--- |
| **Prompt Injection** | Adversary injects malicious prompt instruction to transfer funds to a drainer address. | `Counterparty Reputation Scanner` | Gate 2 identifies flagged recipient (`0xbad0...`) and blocks execution before signature. |
| **Budget Exhaustion** | Agent attempts a series of orders that cumulatively exceed the session limit. | `Stateful Session Accounting` | Gate 1 blocks the transaction once cumulative volume hits the session cap. |
| **Attestation Replay** | Attacker intercepts a past valid quote and attempts to reuse it for a new directive. | `TEE Hardware Attestation Verifier` | Gate 3 rejects the quote because the embedded quote report does not match the fresh client nonce. |
| **Double-Spend Replay** | Replay of a previously settled execution directive hash. | `Execution Coordinator` | Idempotency guard detects duplicate directive ID and terminates settlement. |

---

## 5. Verification & Audit Walkthrough

Follow these reproducible steps to evaluate both successful execution and security enforcement:

### Scenario 1: Standard Confidential Execution & Proof Verification
1. In the **Command Card**, enter a trade goal (or click the quick tag **"Arbitrage USDC"**).
2. Click **"Execute Through Shield"**.
3. Observe:
   - Sensitive trade goals are sealed client-side before transmission (`Characters redacted: 58`).
   - The **Live 3D Telemetry** lights up as the trade packet traverses Enclave Inference, Hardware Attestation, Gate 1 (Spend Limit), Gate 2 (Allowlist), and Gate 3 (Nonce Freshness).
   - The transaction settles across chains with an MPC signature.
4. Click **"Inspect Proof"** to inspect:
   - Client Nonce (`0x...`) matching the Intel TDX quote.
   - Enclave TCB status and MKTME memory encryption verification.
   - NEAR MPC derivation path (`vanguard-agent.near/ethereum-1`).

### Scenario 2: Policy Enforcement (Single-Trade Cap Exceeded)
1. In the **Guardrails Card**, set the **Max Per-Trade Cap** to `$35.00`.
2. In the goal input, submit an order for `$45.00`.
3. Click **"Execute Through Shield"**.
4. Observe:
   - Gate 1 immediately blocks the trade:  
     `BLOCKED AT GATE [SPEND]: Over your spending limit ($45.00 exceeds $35.00 limit)`.
   - The trade is terminated with zero funds moved and zero keys exposed.

### Scenario 3: Malicious Drainer & Phishing Defense
1. Switch to the **"Security Gauntlet"** tab in the command area.
2. Select **"Unauthorized Recipient Attack"** and click **"Run Gauntlet Challenge"**.
3. Observe:
   - Gate 2 (Allowlist & Drainer Check) intercepts the target address:  
     `BLOCKED AT GATE [ALLOWLIST]: Target address is flagged as unauthorized drainer`.
   - The malicious payload is deflected into harmless particles.

---

## 6. Zero Server-Side Retention Guarantee

DarkWallet Vanguard enforces a strict zero-retention policy:
* **Stateless API Handlers**: All requests are processed entirely in memory.
* **No Database or Storage Volumes**: The application contains no SQLite, MongoDB, PostgreSQL, Redis, or disk-backed session stores.
* **Ephemeral Memory Flushing**: Directives, nonces, and parsed intents are immediately deallocated after the response stream completes.
* **Verifiable Open Codebase**: Review [`app/api/agent/route.ts`](app/api/agent/route.ts) and [`lib/policy.ts`](lib/policy.ts) for verifiable confirmation.

---

## 7. Quick Start & Installation

### Prerequisites
* Node.js 18.17+ or Node.js 20+ (tested on Node.js v24)
* npm 9+

### 1. Clone & Install
```bash
git clone https://github.com/Abdulazeez41/DarkWallet-Vanguard.git
cd DarkWallet-Vanguard
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```bash
# NEAR AI Cloud TEE API (OpenAI-compatible)
NEAR_AI_BASE_URL=https://cloud-api.near.ai/v1
NEAR_AI_API_KEY=your_near_ai_api_key_here

# Hardware TEE Confidential Model
NEAR_AI_MODEL=deepseek-ai/DeepSeek-V3

# Execution & Intent Network
NEAR_NETWORK=mainnet
AGENT_CONNECT_BASE_URL=https://agentsonintents.com
```
*Note: If no API key is configured, DarkWallet Vanguard automatically operates in local sandbox mode, allowing full evaluation of all 3D telemetry, policy firewall gates, attestation verification routines, and gauntlet attack challenges without external API dependencies.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build Verification
```bash
npm run build
npm run start
```

---

## 8. Technology Stack

* **Core Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server-Sent Event streaming)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode, 100% type-safe)
* **Confidential Computing**: [Intel TDX TEE](https://docs.near.ai/cloud/quickstart) on [NEAR AI Cloud](https://app.near.ai)
* **Multi-Chain Custody**: [NEAR Chain Signatures](https://docs.near.org/abstraction/chain-signatures) (MPC Threshold Key Derivation)
* **Execution Layer**: [NEAR Intents](https://docs.agentsonintents.com/)
* **3D Visual Telemetry**: [Three.js](https://threejs.org/) & WebGL (Hardware Enclave & Policy Pipeline Shader)
* **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) (Space-separated RGB alpha channels, signature Oreo Cream & Roasted Cocoa palette)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand)
* **Cryptographic Verification**: Web Crypto API (SubtleCrypto SHA-256, 32-byte CSPRNG nonces)

---

## 9. License

This project is licensed under the [MIT License](LICENSE). Built for the NEAR Protocol & AI Agent ecosystem.
