import { KeyPair, KeyPairSigner, Account, actions, parseNearAmount } from 'near-api-js';
import fs from 'fs';

async function main() {
  console.log('Generating keypair for DarkWallet Vanguard Agent...');
  const keyPair = KeyPair.fromRandom('ed25519');
  const pubKey = keyPair.getPublicKey().toString();
  const privKey = keyPair.toString();
  const accountId = 'vanguard-' + Math.random().toString(36).slice(2, 8) + '.testnet';

  console.log('Target Agent Account ID:', accountId);
  console.log('Target Public Key:', pubKey);

  console.log('Requesting NEAR Testnet account creation via official helper...');
  const res = await fetch('https://helper.testnet.near.org/account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      newAccountId: accountId,
      newAccountPublicKey: pubKey,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Helper failed with status ${res.status}: ${errText}`);
  }

  const helperData = await res.json();
  console.log('Account creation status:', helperData.final_execution_status);
  console.log('Creation Tx Hash:', helperData.transaction?.hash);

  const walletConfig = {
    accountId,
    publicKey: pubKey,
    privateKey: privKey,
    createdTxHash: helperData.transaction?.hash,
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
  };

  fs.writeFileSync('server_agent_wallet.json', JSON.stringify(walletConfig, null, 2));
  console.log('Credentials written to server_agent_wallet.json');

  // Verify by sending a live transaction to dulaz.testnet!
  console.log('Connecting to NEAR Testnet RPC to send 0.05 NEAR test transfer to dulaz.testnet...');
  const signer = new KeyPairSigner(keyPair);
  const account = new Account(accountId, 'https://rpc.testnet.near.org', signer);

  const transferAmount = parseNearAmount('0.05');
  const txOutcome = await account.signAndSendTransaction({
    receiverId: 'dulaz.testnet',
    actions: [actions.transfer(transferAmount)],
  });

  console.log('\n=============================================');
  console.log('LIVE TRANSACTION CONFIRMED ON NEAR TESTNET!');
  console.log('Transaction Hash:', txOutcome.transaction.hash);
  console.log('Explorer URL:', `https://testnet.nearblocks.io/txns/${txOutcome.transaction.hash}`);
  console.log('Receiver:', 'dulaz.testnet');
  console.log('Amount:', '0.05 NEAR');
  console.log('=============================================\n');
}

main().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
