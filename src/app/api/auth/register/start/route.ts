import { randomBytes } from 'crypto';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types';
import { NextResponse } from 'next/server';
import { rememberRegistrationChallenge } from '@/lib/challengeStore';

const rpID = process.env.RP_ID || 'localhost';

export const dynamic = 'force-dynamic';

export interface RegisterStartResponse {
  userHandle: string;
  options: PublicKeyCredentialCreationOptionsJSON;
}

export async function POST() {
  const userIdBytes = randomBytes(32);
  const userHandle = isoBase64URL.fromBuffer(userIdBytes);

  const options = await generateRegistrationOptions({
    rpName: 'Trilema Passkey Wallet',
    rpID,
    userID: userIdBytes,
    userName: userHandle,
    userDisplayName: 'Trilema user',
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'required',
      requireResidentKey: true,
      userVerification: 'preferred',
    },
  });

  rememberRegistrationChallenge(userHandle, options.challenge);

  const response: RegisterStartResponse = { userHandle, options };
  return NextResponse.json(response);
}
