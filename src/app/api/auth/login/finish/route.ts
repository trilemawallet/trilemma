import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import type { AuthenticationResponseJSON } from '@simplewebauthn/types';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { consumeAuthenticationChallenge } from '@/lib/challengeStore';
import WalletUser from '@/models/User';

const rpID = process.env.RP_ID || 'localhost';

export const dynamic = 'force-dynamic';

interface LoginFinishRequest {
  data: AuthenticationResponseJSON;
}

interface LoginFinishResponse {
  encryptedSeed: string;
  iv: string;
  encryptionKey: string;
}

const expectedOrigins = (request: NextRequest): string[] => {
  const origins = new Set<string>(['http://localhost:3000', `https://${rpID}`, `http://${rpID}`]);
  const originHeader = request.headers.get('origin');
  if (originHeader) {
    origins.add(originHeader);
  }
  return Array.from(origins);
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginFinishRequest;
    const { data } = body;

    if (!data) {
      return NextResponse.json({ error: 'Missing assertion data' }, { status: 400 });
    }

    const expectedChallenge = consumeAuthenticationChallenge();
    if (!expectedChallenge) {
      return NextResponse.json({ error: 'Authentication challenge not found or expired' }, { status: 400 });
    }

    const userHandle = data.response.userHandle;
    if (!userHandle) {
      return NextResponse.json({ error: 'User handle missing from assertion' }, { status: 400 });
    }

    await connectDB();

    const user = await WalletUser.findOne({ userHandle }).exec();
    if (!user) {
      return NextResponse.json({ error: 'User not found for provided handle' }, { status: 404 });
    }

    const credential = {
      id: user.credentialID,
      publicKey: Buffer.isBuffer(user.credentialPublicKey)
        ? user.credentialPublicKey
        : Buffer.from(user.credentialPublicKey),
      counter: user.counter ?? 0,
    };

    const verification = await verifyAuthenticationResponse({
      response: data,
      expectedChallenge,
      expectedOrigin: expectedOrigins(request),
      expectedRPID: rpID,
      credential,
      requireUserVerification: true,
    });

    if (!verification.verified || !verification.authenticationInfo) {
      return NextResponse.json({ error: 'Passkey assertion failed' }, { status: 401 });
    }

    user.counter = verification.authenticationInfo.newCounter;
    await user.save();

    const response: LoginFinishResponse = {
      encryptedSeed: user.encryptedSeed,
      iv: user.iv,
      encryptionKey: user.encryptionKey,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Login finish error', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
