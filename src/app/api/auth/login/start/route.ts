import { generateAuthenticationOptions } from '@simplewebauthn/server';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/types';
import { NextResponse } from 'next/server';
import { rememberAuthenticationChallenge } from '@/lib/challengeStore';

const rpID = process.env.RP_ID || 'localhost';

export const dynamic = 'force-dynamic';

export interface LoginStartResponse {
  options: PublicKeyCredentialRequestOptionsJSON;
}

export async function GET() {
  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: [],
    userVerification: 'preferred',
  });

  rememberAuthenticationChallenge(options.challenge);

  const response: LoginStartResponse = { options };
  return NextResponse.json(response);
}
