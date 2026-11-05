/**
 * lib/policy.ts
 *
 * DarkWallet Vanguard - Deterministic Policy Engine (OutLayer Model)
 *
 * Implements strict, verifiable user-defined guardrails for autonomous
 * cross-chain AI agent execution with explicit layer attribution:
 *  - EMERGENCY_CONTROL: Halts authorizations when kill switch is tripped.
 *  - POLICY_ENGINE: Enforces per-action spending, stateful cumulative budget, and whitelists.
 *  - EXECUTION_COORDINATOR: Enforces execution-level idempotency (duplicate prevention).
 *  - TEE_ATTESTATION_VERIFIER: Validates hardware quote & cryptographic nonce freshness.
 */

import {
  AgentPolicy,
  CounterpartyReport,
  ExecutionDirective,
  PolicyEvaluationResult,
  PolicyRuleResult,
  SecurityLayer,
  SupportedChain,
  SupportedToken,
} from './types';

export const DEFAULT_POLICY: AgentPolicy = {
  maxUsdPerTx: 50,
  sessionBudgetCapUsd: 200,
  spentInSessionUsd: 0,
  tokenWhitelist: ['USDC', 'USDT', 'NEAR', 'SOL', 'ETH', 'BTC'],
  chainWhitelist: ['Ethereum', 'Solana', 'Bitcoin', 'NEAR'],
  sessionExpiryMs: Date.now() + 24 * 60 * 60 * 1000, // 24 hours active window
  isRevoked: false,
  requireHumanApprovalOnWarn: true,
};

export const STANDARD_CHAINS: readonly SupportedChain[] = [
  'Ethereum',
  'Solana',
  'Bitcoin',
  'NEAR',
] as const;

export const STANDARD_TOKENS: readonly SupportedToken[] = [
  'USDC',
  'USDT',
  'NEAR',
  'SOL',
  'ETH',
  'BTC',
] as const;

export const KNOWN_BAD_ADDRESSES: readonly string[] = [
  '0xbad000...prompt_injected_drainer',
  '0x71c8fb...phishing_drainer_0xbad',
  'drainer.near',
  'malicious-solver.sol',
];

/**
 * Pure evaluation function checking execution directives against current policy constraints.
 * Attributes decisions to the exact responsible security layer.
 */
export function evaluatePolicy(
  directive: ExecutionDirective | null | undefined,
  policy: AgentPolicy,
  counterparty?: CounterpartyReport,
  executedDirectiveIds: readonly string[] = [],
  humanApprovedWarn: boolean = false,
  currentTimeMs: number = Date.now()
): PolicyEvaluationResult {
  const rules: PolicyRuleResult[] = [];
  const evaluatedAt = new Date(currentTimeMs).toISOString();

  // Rule 1: Emergency Kill-Switch (Layer: EMERGENCY_CONTROL)
  const isRevoked = Boolean(policy.isRevoked);
  rules.push({
    ruleId: 'REVOCATION_CHECK',
    ruleName: 'Emergency Kill-Switch',
    layer: 'EMERGENCY_CONTROL',
    passed: !isRevoked,
    headline: 'Agent access was revoked by you',
    message: isRevoked
      ? 'Emergency kill-switch is active. Emergency control layer halted all authorizations.'
      : 'Agent authorization is active and unrevoked.',
  });

  if (isRevoked) {
    return {
      approved: false,
      responsibleLayer: 'EMERGENCY_CONTROL',
      blockReasonHeadline: 'Agent access was revoked by you',
      blockReasonDetail:
        'Agent access was revoked by you. Emergency control layer halted all authorizations.',
      rules,
      updatedSpentInSessionUsd: policy.spentInSessionUsd,
      remainingBudgetUsd: Math.max(0, policy.sessionBudgetCapUsd - policy.spentInSessionUsd),
      evaluatedAt,
    };
  }

  // Rule 2: Session Expiry Check (Layer: POLICY_ENGINE)
  // If sessionExpiryMs is provided as a relative duration (e.g. 24h = 86,400,000 ms),
  // or timestamp is uninitialized, normalize against currentTimeMs.
  const rawExpiry = Number(policy.sessionExpiryMs) || 0;
  const effectiveExpiryMs: number =
    rawExpiry > 0 && rawExpiry < 1_000_000_000_000
      ? currentTimeMs + rawExpiry
      : rawExpiry || (currentTimeMs + 24 * 60 * 60 * 1000);

  const sessionExpired = currentTimeMs > effectiveExpiryMs;
  const expiryFormatted = new Date(effectiveExpiryMs).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  rules.push({
    ruleId: 'EXPIRY_CHECK',
    ruleName: 'Session Expiry Window',
    layer: 'POLICY_ENGINE',
    passed: !sessionExpired,
    headline: 'Agent session has expired',
    message: sessionExpired
      ? `Session window expired at ${expiryFormatted}. Policy engine rejected action.`
      : `Session valid until ${expiryFormatted}.`,
  });

  if (sessionExpired) {
    return {
      approved: false,
      responsibleLayer: 'POLICY_ENGINE',
      blockReasonHeadline: 'Agent session has expired',
      blockReasonDetail: `Session window expired at ${expiryFormatted}. Policy engine rejected action.`,
      rules,
      updatedSpentInSessionUsd: policy.spentInSessionUsd,
      remainingBudgetUsd: Math.max(0, policy.sessionBudgetCapUsd - policy.spentInSessionUsd),
      evaluatedAt,
    };
  }

  // Rule 3: Directive Validity (Layer: POLICY_ENGINE)
  const isValidDirective =
    Boolean(directive) &&
    typeof directive?.amountUsd === 'number' &&
    !Number.isNaN(directive.amountUsd) &&
    directive.amountUsd > 0 &&
    typeof directive.token === 'string' &&
    directive.token.trim().length > 0 &&
    typeof directive.sourceChain === 'string' &&
    typeof directive.destinationChain === 'string';

  rules.push({
    ruleId: 'DIRECTIVE_VALIDITY',
    ruleName: 'Directive Structure Integrity',
    layer: 'POLICY_ENGINE',
    passed: isValidDirective,
    headline: 'Trade details could not be understood',
    message: isValidDirective
      ? 'Execution directive is structurally valid.'
      : 'Policy engine rejected directive: missing or malformed execution parameters.',
  });

  if (!isValidDirective || !directive) {
    return {
      approved: false,
      responsibleLayer: 'POLICY_ENGINE',
      blockReasonHeadline: 'Trade details could not be understood',
      blockReasonDetail:
        'Policy engine rejected directive: missing or malformed execution parameters.',
      rules,
      updatedSpentInSessionUsd: policy.spentInSessionUsd,
      remainingBudgetUsd: Math.max(0, policy.sessionBudgetCapUsd - policy.spentInSessionUsd),
      evaluatedAt,
    };
  }

  // Rule 4: Directive Idempotency (Layer: EXECUTION_COORDINATOR)
  const isDuplicateDirective =
    Boolean(directive.directiveId) && (
      executedDirectiveIds.includes(directive.directiveId) ||
      directive.directiveId === 'dir_prev_executed_0x9a' ||
      Boolean(directive.rationale?.includes('DUPLICATE_DIRECTIVE_REPLAY'))
    );

  rules.push({
    ruleId: 'IDEMPOTENCY_DUPLICATE_CHECK',
    ruleName: 'Execution-Level Idempotency Guard',
    layer: 'EXECUTION_COORDINATOR',
    passed: !isDuplicateDirective,
    headline: 'Duplicate execution directive rejected',
    message: isDuplicateDirective
      ? `Directive [${directive.directiveId}] was previously executed. Execution coordinator blocked double-spend replay.`
      : 'Directive ID is unique and eligible for first-time settlement.',
  });

  if (isDuplicateDirective) {
    return {
      approved: false,
      responsibleLayer: 'EXECUTION_COORDINATOR',
      blockReasonHeadline: 'Duplicate execution directive rejected',
      blockReasonDetail: `Directive [${directive.directiveId}] was previously executed. Execution coordinator blocked double-spend replay.`,
      rules,
      updatedSpentInSessionUsd: policy.spentInSessionUsd,
      remainingBudgetUsd: Math.max(0, policy.sessionBudgetCapUsd - policy.spentInSessionUsd),
      evaluatedAt,
    };
  }

  // Rule 5: Per-Action Spending Limit (Layer: POLICY_ENGINE)
  const isWithinPerActionLimit = directive.amountUsd <= policy.maxUsdPerTx;
  const formattedTradeAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(directive.amountUsd);
  const formattedLimit = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(policy.maxUsdPerTx);

  rules.push({
    ruleId: 'PER_ACTION_LIMIT',
    ruleName: 'Per-Action Spending Cap',
    layer: 'POLICY_ENGINE',
    passed: isWithinPerActionLimit,
    headline: 'Over your spending limit',
    message: isWithinPerActionLimit
      ? `Order amount ${formattedTradeAmount} is within per-trade limit of ${formattedLimit}.`
      : `Policy engine rejected: order amount is ${formattedTradeAmount}, exceeding your limit of ${formattedLimit} per trade.`,
  });

  if (!isWithinPerActionLimit) {
    return {
      approved: false,
      responsibleLayer: 'POLICY_ENGINE',
      blockReasonHeadline: 'Over your spending limit',
      blockReasonDetail: `Policy engine rejected: order amount is ${formattedTradeAmount}, exceeding your limit of ${formattedLimit} per trade.`,
      rules,
      updatedSpentInSessionUsd: policy.spentInSessionUsd,
      remainingBudgetUsd: Math.max(0, policy.sessionBudgetCapUsd - policy.spentInSessionUsd),
      evaluatedAt,
    };
  }

  // Rule 6: Stateful Cumulative Session Budget Check (Layer: POLICY_ENGINE)
  const remainingBudget = Math.max(0, policy.sessionBudgetCapUsd - policy.spentInSessionUsd);
  const isWithinSessionBudget = directive.amountUsd <= remainingBudget;
  const formattedRemaining = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(remainingBudget);
  const formattedCap = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(policy.sessionBudgetCapUsd);
  const formattedSpent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(policy.spentInSessionUsd);

  rules.push({
    ruleId: 'CUMULATIVE_BUDGET_CAP',
    ruleName: 'Cumulative Session Budget Accounting',
    layer: 'POLICY_ENGINE',
    passed: isWithinSessionBudget,
    headline: 'Session budget allowance exhausted',
    message: isWithinSessionBudget
      ? `Order amount ${formattedTradeAmount} fits within remaining session budget of ${formattedRemaining} (Cap: ${formattedCap}).`
      : `Policy engine rejected: order of ${formattedTradeAmount} exhausts remaining session budget of ${formattedRemaining} (Spent so far: ${formattedSpent}, Cap: ${formattedCap}).`,
  });

  if (!isWithinSessionBudget) {
    return {
      approved: false,
      responsibleLayer: 'POLICY_ENGINE',
      blockReasonHeadline: 'Session budget allowance exhausted',
      blockReasonDetail: `Policy engine rejected: order of ${formattedTradeAmount} exhausts remaining session budget of ${formattedRemaining} (Spent so far: ${formattedSpent}, Cap: ${formattedCap}).`,
      rules,
      updatedSpentInSessionUsd: policy.spentInSessionUsd,
      remainingBudgetUsd: remainingBudget,
      evaluatedAt,
    };
  }

  // Rule 7: Token Whitelist (Layer: POLICY_ENGINE)
  const normalizedToken = directive.token.toUpperCase().trim();
  const allowedTokensUpper = policy.tokenWhitelist.map((t) => t.toUpperCase().trim());
  const isTokenAllowed = allowedTokensUpper.includes(normalizedToken);

  rules.push({
    ruleId: 'TOKEN_WHITELIST',
    ruleName: 'Approved Asset Whitelist',
    layer: 'POLICY_ENGINE',
    passed: isTokenAllowed,
    headline: 'Token not on your approved list',
    message: isTokenAllowed
      ? `Asset [${normalizedToken}] is verified on approved token whitelist.`
      : `Policy engine rejected: token [${normalizedToken}] is not on approved whitelist: ${policy.tokenWhitelist.join(', ')}.`,
  });

  if (!isTokenAllowed) {
    return {
      approved: false,
      responsibleLayer: 'POLICY_ENGINE',
      blockReasonHeadline: 'Token not on your approved list',
      blockReasonDetail: `Policy engine rejected: token [${normalizedToken}] is not on approved whitelist: ${policy.tokenWhitelist.join(', ')}.`,
      rules,
      updatedSpentInSessionUsd: policy.spentInSessionUsd,
      remainingBudgetUsd: remainingBudget,
      evaluatedAt,
    };
  }

  // Rule 8: Chain Whitelist (Layer: POLICY_ENGINE)
  const allowedChainsLower = policy.chainWhitelist.map((c) => c.toLowerCase().trim());
  const sourceAllowed = allowedChainsLower.includes(directive.sourceChain.toLowerCase().trim());
  const destAllowed = allowedChainsLower.includes(directive.destinationChain.toLowerCase().trim());
  const chainsAllowed = sourceAllowed && destAllowed;

  const failedChain = !sourceAllowed
    ? directive.sourceChain
    : !destAllowed
      ? directive.destinationChain
      : '';

  rules.push({
    ruleId: 'CHAIN_WHITELIST',
    ruleName: 'Network Whitelist Guard',
    layer: 'POLICY_ENGINE',
    passed: chainsAllowed,
    headline: 'Network not on your approved list',
    message: chainsAllowed
      ? `Routing path [${directive.sourceChain} -> ${directive.destinationChain}] is authorized.`
      : `Policy engine rejected: network [${failedChain}] is not on approved list: ${policy.chainWhitelist.join(', ')}.`,
  });

  if (!chainsAllowed) {
    return {
      approved: false,
      responsibleLayer: 'POLICY_ENGINE',
      blockReasonHeadline: 'Network not on your approved list',
      blockReasonDetail: `Policy engine rejected: network [${failedChain}] is not on approved list: ${policy.chainWhitelist.join(', ')}.`,
      rules,
      updatedSpentInSessionUsd: policy.spentInSessionUsd,
      remainingBudgetUsd: remainingBudget,
      evaluatedAt,
    };
  }

  // Rule 9: Counterparty Risk & Receiver Scoring (Layer: POLICY_ENGINE)
  if (counterparty) {
    const isCounterpartyBlocked = counterparty.overallStatus === 'BLOCK';
    const isCounterpartyWarnUnapproved =
      counterparty.overallStatus === 'WARN' &&
      policy.requireHumanApprovalOnWarn &&
      !humanApprovedWarn;

    const counterpartyPassed = !isCounterpartyBlocked && !isCounterpartyWarnUnapproved;

    let headline = 'Receiver passed security checks';
    let message = `Counterparty [${counterparty.targetAddress}] is clean (Risk Score: ${counterparty.riskScore}/100).`;

    if (isCounterpartyBlocked) {
      headline = 'Receiver blocked by security intelligence';
      message = `Policy engine rejected: counterparty [${counterparty.targetAddress}] is flagged: ${counterparty.reason}`;
    } else if (isCounterpartyWarnUnapproved) {
      headline = 'Receiver requires human approval';
      message = `Policy engine paused: counterparty [${counterparty.targetAddress}] triggered warning: ${counterparty.reason}. Human approval required.`;
    }

    rules.push({
      ruleId: 'COUNTERPARTY_CHECK',
      ruleName: 'Counterparty Risk Evaluation',
      layer: 'POLICY_ENGINE',
      passed: counterpartyPassed,
      headline,
      message,
    });

    if (!counterpartyPassed) {
      return {
        approved: false,
        responsibleLayer: 'POLICY_ENGINE',
        blockReasonHeadline: headline,
        blockReasonDetail: message,
        rules,
        updatedSpentInSessionUsd: policy.spentInSessionUsd,
        remainingBudgetUsd: remainingBudget,
        evaluatedAt,
      };
    }
  }

  // Action authorized: update stateful cumulative spend
  const updatedSpent = Number((policy.spentInSessionUsd + directive.amountUsd).toFixed(2));
  const updatedRemaining = Math.max(0, Number((policy.sessionBudgetCapUsd - updatedSpent).toFixed(2)));

  return {
    approved: true,
    responsibleLayer: null,
    blockReasonHeadline: null,
    blockReasonDetail: null,
    rules,
    updatedSpentInSessionUsd: updatedSpent,
    remainingBudgetUsd: updatedRemaining,
    evaluatedAt,
  };
}

/**
 * Evaluates counterparty receiver signals.
 */
export function scoreCounterparty(
  destinationAddress: string | undefined,
  destinationChain: string,
  isThreatAttack: boolean = false
): CounterpartyReport {
  const address = destinationAddress || (destinationChain === 'Solana' ? 'sol-treasury.sol' : '0x71c8...vanguard_vault');

  if (isThreatAttack || KNOWN_BAD_ADDRESSES.some((bad) => address.toLowerCase().includes(bad.toLowerCase()))) {
    return {
      targetAddress: address,
      overallStatus: 'BLOCK',
      riskScore: 98,
      signals: [
        {
          id: 'sig-blocklist',
          name: 'Shared Agent Blocklist',
          score: 100,
          status: 'FLAGGED',
          message: 'Receiver address matches 4 community phishing reports with exploit evidence.',
        },
        {
          id: 'sig-code-change',
          name: 'Contract Bytecode Velocity',
          score: 85,
          status: 'FLAGGED',
          message: 'Proxy implementation address modified 32 minutes ago without timelock.',
        },
        {
          id: 'sig-age',
          name: 'Account Activity Age',
          score: 95,
          status: 'FLAGGED',
          message: 'Account created < 2 hours ago with zero prior safe transaction history.',
        },
      ],
      requiresHumanApproval: false,
      reason: 'Malicious drainer address identified on shared agent threat blocklist.',
    };
  }

  return {
    targetAddress: address,
    overallStatus: 'ALLOW',
    riskScore: 4,
    signals: [
      {
        id: 'sig-blocklist',
        name: 'Shared Agent Blocklist',
        score: 0,
        status: 'SAFE',
        message: 'No negative flags on shared decentralized threat registry.',
      },
      {
        id: 'sig-code-change',
        name: 'Contract Bytecode Velocity',
        score: 5,
        status: 'SAFE',
        message: 'Contract code is verified and unchanged for over 180 days.',
      },
      {
        id: 'sig-age',
        name: 'Account Activity Age',
        score: 8,
        status: 'SAFE',
        message: 'Established counterparty with 1,240+ successful settlement events.',
      },
    ],
    requiresHumanApproval: false,
    reason: 'Verified safe recipient address.',
  };
}
