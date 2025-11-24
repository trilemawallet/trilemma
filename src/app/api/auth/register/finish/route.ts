import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import type { RegistrationResponseJSON } from '@simplewebauthn/types';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { consumeRegistrationChallenge } from '@/lib/challengeStore';
import WalletUser from '@/models/User';

const rpID = process.env.RP_ID || 'localhost';

export const dynamic = 'force-dynamic';

interface RegisterFinishRequest {
  data: RegistrationResponseJSON;
  encryptedSeed: string;
  iv: string;
  encryptionKey: string;
  userHandle: string;
}

interface RegisterFinishResponse {
  success: boolean;
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
    const body = (await request.json()) as RegisterFinishRequest;
    const { data, encryptedSeed, iv, encryptionKey, userHandle } = body;

    if (!data || !encryptedSeed || !iv || !encryptionKey || !userHandle) {
      return NextResponse.json({ error: 'Missing fields in registration payload' }, { status: 400 });
    }

    const expectedChallenge = consumeRegistrationChallenge(userHandle);
    if (!expectedChallenge) {
      return NextResponse.json({ error: 'Registration challenge not found or expired' }, { status: 400 });
    }

    const verification = await verifyRegistrationResponse({
      response: data,
      expectedChallenge,
      expectedOrigin: expectedOrigins(request),
      expectedRPID: rpID,
      requireUserVerification: true,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: 'Passkey attestation failed' }, { status: 400 });
    }

    const { credential, counter } =
      verification.registrationInfo;

    const credentialIDRaw = credential?.id;
    const credentialPublicKeyRaw = credential?.publicKey;

    if (!credentialIDRaw || !credentialPublicKeyRaw) {
      return NextResponse.json({ error: 'Attestation missing credential data' }, { status: 400 });
    }

    const credentialIDString =
      typeof credentialIDRaw === 'string' ? credentialIDRaw : isoBase64URL.fromBuffer(credentialIDRaw);

    const credentialPublicKeyBuffer = (() => {
      if (Buffer.isBuffer(credentialPublicKeyRaw)) return credentialPublicKeyRaw;
      if (credentialPublicKeyRaw instanceof ArrayBuffer || ArrayBuffer.isView(credentialPublicKeyRaw)) {
        return Buffer.from(credentialPublicKeyRaw as unknown as ArrayBuffer);
      }
      if (typeof credentialPublicKeyRaw === 'string') {
        return isoBase64URL.toBuffer(credentialPublicKeyRaw);
      }
      throw new Error('Unsupported credentialPublicKey type');
    })();

    await connectDB();

    const existingUser = await WalletUser.findOne({ userHandle }).exec();
    if (existingUser) {
      return NextResponse.json({ error: 'User already registered for this handle' }, { status: 400 });
    }

    await WalletUser.create({
      userHandle,
      credentialID: credentialIDString,
      credentialPublicKey: credentialPublicKeyBuffer,
      counter,
      encryptedSeed,
      iv,
      encryptionKey,
    });

    const response: RegisterFinishResponse = { success: true };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Register finish error', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
