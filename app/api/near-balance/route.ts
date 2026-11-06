import { NextResponse } from 'next/server';

/**
 * app/api/near-balance/route.ts
 *
 * Real-time NEAR JSON-RPC Balance Lookup.
 * Queries public RPC (testnet / mainnet) to fetch exact on-chain yoctoNEAR balances.
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawAccount = searchParams.get('account')?.trim();

  if (!rawAccount) {
    return NextResponse.json({ error: 'Missing account parameter' }, { status: 400 });
  }

  const isTestnet = rawAccount.endsWith('.testnet') || rawAccount.includes('testnet');
  const rpcUrl = isTestnet
    ? 'https://rpc.testnet.near.org'
    : 'https://rpc.mainnet.near.org';

  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'darkwallet-balance-check',
        method: 'query',
        params: {
          request_type: 'view_account',
          finality: 'final',
          account_id: rawAccount,
        },
      }),
    });

    const data = await res.json();
    if (data.result && data.result.amount) {
      const yocto = BigInt(data.result.amount);
      // 1 NEAR = 10^24 yoctoNEAR (BigInt precision math)
      const near = Number(yocto / 10n ** 20n) / 10000;
      return NextResponse.json({
        success: true,
        account: rawAccount,
        network: isTestnet ? 'testnet' : 'mainnet',
        balanceNear: near,
        balanceYocto: data.result.amount,
        storageUsage: data.result.storage_usage,
      });
    }

    return NextResponse.json({
      success: false,
      account: rawAccount,
      network: isTestnet ? 'testnet' : 'mainnet',
      error: data.error?.message || 'Account not found on chain',
      balanceNear: null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'RPC query failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
