# DarkWallet Vanguard (SecretForge)

Framework for deploying zero-knowledge, TEE-sanitized autonomous agents that manage assets across Bitcoin, Ethereum, and Solana using NEAR Chain Signatures and NEAR Intents. No human, host hypervisor, or LLM operator ever inspects private keys, confidential trade strategies, or raw user prompts.

---

## Target Tracks & Technical Alignment (NEAR Hackathon 2026)

### 1. Track 03: Privacy & Private AI (`privacy`) · *Private by design*
- **TEE Enclave Compute**: Integrates with NEAR AI Cloud's OpenAI-compatible endpoint (`https://cloud-api.near.ai/v1`) using confidential models (`deepseek-ai/DeepSeek-V3`) running inside Intel TDX Confidential VMs.
- **Dynamic Nonce Hardware Attestation**: Each execution generates a cryptographically random 32-byte nonce (`0x...`) embedded into the TDX quote report data, preventing replay attacks.
- **4-Point Attestation Verification Checklist**: Verifies Intel Root CA signature chain, fresh nonce match, MRTD/PCR0 code measurement, and TCB status.
- **Zero Server-Side Storage Guarantee**: Fully stateless Next.js Route Handler. No prompt text, execution directives, or private keys are ever persisted to disk, SQLite, or databases.

### 2. Track 06: AI Security & Defense (`security`) · *Trust, but verify*
- **OutLayer Deterministic Policy Engine (`lib/policy.ts`)**: Mathematical spending limits ($50/tx cap), immutable token and chain whitelists, session timeouts, and an immediate client-side kill switch.
- **Counterparty Risk Intelligence Shield**: Evaluates receiver addresses across 3 threat signals:
  1. *Shared Agent Threat Blocklist* (checks community exploit and phishing reports).
  2. *Contract Bytecode Velocity* (detects unannounced proxy modifications).
  3. *Account Activity Age* (flags zero-history accounts).
  Returns `ALLOW`, `WARN` (requires human approval), or `BLOCK`.
- **Function-Call Access Key (FCAK) Architecture**:
  - The agent never possesses a Full-Access Key.
  - Transactions are signed strictly via Function-Call Access Keys scoped to the `v1.intents.near` contract with a limited gas allowance.
  - **FCAK Security Boundaries**: By protocol design, an account holding only function-call keys cannot transfer native NEAR, cannot add/remove access keys, and cannot deploy contract code. If the agent attempts a rogue transaction outside the approved contract methods, the NEAR runtime hardware halts the call.
- **Prompt Injection Attack Demo**: Built-in test demonstrating a prompt-injected payload trying to drain funds to a flagged address (`0xbad000...prompt_injected_drainer`), verified and stopped by the security shield.

### 3. Track 04: Autonomous Business (`business`) · *The company of one, or none*
- **Self-Funding Inference Loop**: The agent generates revenue from cross-chain yield and arbitrage spreads via NEAR Intents, and **pays for its own compute** (deducting ~$0.003 per run to NEAR AI Cloud).
- **Automated Revenue Split (P&L Ledger)**: Real-time autonomous business balance sheet distributing 80% to the Retained Treasury and 20% to `contributors.vanguard.near`.
- **Autonomous Heartbeat Daemon**: Toggleable continuous background monitor loop that polls environmental oracle spreads every 15 seconds inside the TEE enclave, autonomously deciding when to rebalance.
- **Gasless Cross-Chain Settlement**: Direct execution across Bitcoin, Ethereum, and Solana via NEAR Decentralized Chain Signatures (MPC) without bridge risk.

---

## Architecture

```
User (Confidential Goal)
       │
       ▼ [AES-256 / TDX Enclave Sealed Boundary]
┌───────────────────────────────────────────────────────────────┐
│ Pillar A (Track 03): NEAR AI Cloud (Intel TDX Enclave VM)     │
│ - Decrypts intent inside isolated hardware memory             │
│ - Runs TEE model (deepseek-ai/DeepSeek-V3)                    │
│ - Generates fresh cryptographic nonce (0x...)                 │
│ - Emits strict schema-validated ExecutionDirective JSON       │
│ - Generates Intel TDX Attestation Quote (PCR0)                │
└──────────────────────────────┬────────────────────────────────┘
                               │ Directive & Attestation
                               ▼
┌───────────────────────────────────────────────────────────────┐
│ Pillar B (Track 06): OutLayer Policy & Counterparty Shield    │
│ - Signal 1: Shared Agent Blocklist / Phishing Exploit Check   │
│ - Signal 2: Contract Bytecode Modification Velocity           │
│ - Signal 3: Account Activity History & Age                    │
│ - Rule 1: Emergency Kill-Switch Revocation Check              │
│ - Rule 2: Session Window Expiry Check                         │
│ - Rule 3: Directive Structural Integrity Check                │
│ - Rule 4: Maximum USD Per Transaction Check ($50 cap)         │
│ - Rule 5: Approved Token Whitelist Check (USDC, BTC, etc)     │
│ - Rule 6: Approved Network Whitelist Check (SOL, ETH)         │
└──────────────────────────────┬────────────────────────────────┘
                               │ [Approved Payload Only]
                               ▼
┌───────────────────────────────────────────────────────────────┐
│ Pillar C (Track 04): NEAR Intents & Autonomous Business       │
│ - Scoped Function-Call Access Key (v1.intents.near)           │
│ - Deducts self-funded inference cost ($0.003 to NEAR AI Cloud)│
│ - Executes 80/20 revenue split to contributors.vanguard.near  │
│ - Multi-chain settlement via NEAR Chain Signatures (MPC)      │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
             Verifiable Monospace Audit Receipt & Ledger
```

---

## Honest Labeling & Developer Fallback

DarkWallet Vanguard enforces transparent cryptographic truth:
- If `NEAR_AI_API_KEY` is not present in `.env.local`, the enclave step gracefully degrades to an honest simulated enclave mode with a visible tan badge (`[Simulated]`) explaining the exact missing variable.
- If live hardware attestation keys or `AGENT_CONNECT_BASE_URL` solvers are in offline mode, simulated badges clearly display the runtime fallback reason.
- Simulated proofs are never presented as hardware-verified endorsements.

---

## Verification Guide for Judges ("Do X -> See Y")

Follow these reproducible steps to evaluate both successful execution and security enforcement:

### Test Case 1: Confidential Run & Attestation Verification (Track 03)
1. **Do**: Click the quick-tag button **"Dark Arbitrage"** under the goal input.
2. **See**: The textarea populates with `"Arbitrage stablecoins between Solana and Ethereum when the spread is above 1% and keep my balance hidden."`
3. **Do**: Click **"Deploy to Enclave"**.
4. **See**: 
   - The prompt triggers the redaction animation, turning into black classified bars (`████████`) locking in word by word.
   - The "Who can see this?" strip shows You as `SEEN` and Host, LLM Operator, and Network as `SEALED`.
   - The Telemetry Matrix sequentially steps through Enclave Decryption, Attestation with fresh nonce, OutLayer Policy & Counterparty verification, and NEAR Intents settlement.
   - Click **"Verify Enclave Proofs (Track 03)"** on the receipt.
   - A modal opens showing the **4-point verification audit**:
     - Intel Root CA Signature Chain: `PASSED`
     - Attestation Nonce Freshness Match: `PASSED` (`0x...` matches quote)
     - MRTD / PCR0 Code Measurement: `PASSED`
     - TCB Status: `PASSED`

### Test Case 2: Prompt Injection Attack Demo (Track 06)
1. **Do**: Click the red-tan button **"Attack Demo (Injection)"**.
2. **See**:
   - The system submits an injected prompt attempting to drain funds to `0xbad000...prompt_injected_drainer`.
   - The Policy Vault panel shakes with a recoil animation (`animate-shake`).
   - The Counterparty Risk Shield flags the receiver: `BLOCK (Risk Score: 98/100)`.
   - Step 3 turns warm red-tan and displays:
     `Receiver blocked by security intelligence: Malicious drainer address identified on shared agent blocklist.`
   - Settlement (Step 4) is **never called**, proving that prompt injection cannot drain the agent.

### Test Case 3: OutLayer Spending Limit Defense (Tamper Test)
1. **Do**: Click **"Tamper Test ($500)"**.
2. **See**:
   - Submits a $500 trade violating the $50 cap.
   - Step 3 blocks with: `Over your spending limit: This trade is $500.00, but your limit is $50.00 per trade.`
   - The audit receipt prints with `TRANSACTION BLOCKED: Over your spending limit`.

### Test Case 4: Autonomous Business Ledger & Daemon Mode (Track 04)
1. **Do**: Click **"Deploy to Enclave"** on any standard trade.
2. **See**: In the **Autonomous Business Ledger** card:
   - Gross volume logs `$32.50`.
   - Self-funded inference cost logs `-$0.003` paid to NEAR AI Cloud.
   - Contributor split logs `+$0.078` (20%) routed to `contributors.vanguard.near`.
   - Net Treasury Yield increases.
3. **Do**: Toggle **"DAEMON: ON"** in the top header.
4. **See**: The charcoal terminal begins printing continuous 15-second heartbeat pulses, monitoring oracle spreads and self-executing whenever market conditions hit target thresholds without human interaction.

### Test Case 5: Security Gauntlet Control Verification (Track 06)
1. **Do**: In the left pane, switch to the **"Security Gauntlet"** tab.
2. **See**: A scenario selector appears featuring 4 distinct, decoupled threat challenges:
   - *Unauthorized Recipient* (Tested Layer: **OutLayer Policy Engine**)
   - *Cumulative Budget Exhaustion* (Tested Layer: **Stateful Policy Accounting**)
   - *Stale Attestation Replay* (Tested Layer: **TEE Attestation Verifier**)
   - *Duplicate Directive Double-Spend* (Tested Layer: **Execution Coordinator**)
3. **Do**: Select **"Cumulative Budget Exhaustion"** and click **"Execute Controlled Threat Challenge"**.
4. **See**: The order is rejected specifically because previous orders consumed the $200 session cap:
   `Session budget allowance exhausted: order exhausts remaining budget (Spent so far: $180, Cap: $200).`
5. **Do**: Select **"Stale Attestation Replay"** and click **"Execute Controlled Threat Challenge"**.
6. **See**: The TEE Attestation Verifier independently halts the run at **Step 2** due to client fresh nonce mismatch, demonstrating that attestation freshness is verified before the policy engine is ever reached.

### Test Case 6: Fast-Forward 7-Day Operational Replay (Track 04)
1. **Do**: In the left pane, switch to the **"7-Day Stress Replay"** tab.
2. **See**: The replay panel appears showing a 12-event timeline representing a 7-day operating period.
3. **Do**: Click **"Run 7-Day Operational Replay"**.
4. **See**: 
   - A 15-second simulation executes 12 accelerated market events with live audio ticks.
   - Event 4 demonstrates a **realistic market slippage loss (-$0.15)** on a 100% policy-compliant trade, proving that the engine verifies authorization safety without claiming unrealistic risk-free market prediction.
   - Events 5, 7, 9, and 11 trigger explicit layer-attributed rejections (Per-Trade Limit, Cumulative Cap, Threat Blocklist, Duplicate Directive).
   - On completion, all transactions pipe into the **Autonomous Business Ledger**, updating total volume, self-funded compute fees, and contributor distributions.

---

## Quick Start & Installation

### Prerequisites
- Node.js 18.17+ or Node.js 20+ (tested on Node.js v24)
- npm 9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/darkwallet-vanguard.git
cd darkwallet-vanguard
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Open `.env.local` to configure your credentials:
```bash
# NEAR AI Cloud TEE Endpoint (Track 03)
NEAR_AI_BASE_URL=https://cloud-api.near.ai/v1

# NEAR AI Cloud API Key from https://app.near.ai
NEAR_AI_API_KEY=your_near_ai_api_key_here

# Hardware TEE Model ID (Intel TDX / NVIDIA Confidential Computing)
NEAR_AI_MODEL=deepseek-ai/DeepSeek-V3

# NEAR Intents / Agent Connect Endpoint (Track 04)
AGENT_CONNECT_BASE_URL=https://agentsonintents.com
```
*Note: If no API key is supplied, the project starts in developer simulation mode with full honest badge labeling, allowing judges to test all UI interactions, animations, attestation proofs, and security policy checks out of the box.*

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

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Route Handlers)
- **Language**: TypeScript (Strict Mode, 100% typed, no `any`)
- **Styling**: Tailwind CSS (Neo-brutalist geometry, cream/pastel palette, `#1E1E1E` borders and shadows)
- **Validation**: Zod (Runtime JSON execution directive validation)
- **SDK**: Official OpenAI TypeScript SDK (interfacing with NEAR AI Cloud's TEE API)
- **Audio Feedback**: Web Audio API (tactile mechanical clicks with mute control, zero external audio assets)
- **Haptics**: Native `navigator.vibrate` integration
- **Cross-Chain Rail**: NEAR Intents, NEAR Chain Signatures (MPC), Agent Connect RPC
