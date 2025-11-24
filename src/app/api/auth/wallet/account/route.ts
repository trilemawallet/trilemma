import { NextRequest, NextResponse } from 'next/server';
import WDK from '@tetherto/wdk';
import WalletManagerEvm from '@tetherto/wdk-wallet-evm';

export const dynamic = 'force-dynamic';

const defaultProvider = process.env.ETHEREUM_PROVIDER ?? 'wss://base-sepolia.drpc.org';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { seedPhrase?: string; index?: number };
    const { seedPhrase, index = 0 } = body;

    if (!seedPhrase || typeof seedPhrase !== 'string' || !WDK.isValidSeed(seedPhrase)) {
      return NextResponse.json({ error: 'Invalid or missing seed phrase' }, { status: 400 });
    }

    if (!Number.isInteger(index) || index < 0) {
      return NextResponse.json({ error: 'Invalid account index' }, { status: 400 });
    }

    const wdk = new WDK(seedPhrase).registerWallet('ethereum', WalletManagerEvm, { provider: defaultProvider });
    const account = await wdk.getAccount('ethereum', index);

    return NextResponse.json({ account });
  } catch (error) {
    console.error('Wallet address derivation error', error);
    return NextResponse.json({ error: 'Failed to derive wallet address' }, { status: 500 });
  }
}
