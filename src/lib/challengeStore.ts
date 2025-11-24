type ChallengeState = {
  registrationChallenges: Map<string, string>;
  authenticationChallenge: string | null;
};

const globalStore = globalThis as typeof globalThis & { __trilemaChallengeStore?: ChallengeState };

if (!globalStore.__trilemaChallengeStore) {
  globalStore.__trilemaChallengeStore = {
    registrationChallenges: new Map<string, string>(),
    authenticationChallenge: null,
  };
}

const store = globalStore.__trilemaChallengeStore;

export const rememberRegistrationChallenge = (userHandle: string, challenge: string): void => {
  store.registrationChallenges.set(userHandle, challenge);
};

export const consumeRegistrationChallenge = (userHandle: string): string | undefined => {
  const challenge = store.registrationChallenges.get(userHandle);
  store.registrationChallenges.delete(userHandle);
  return challenge;
};

export const rememberAuthenticationChallenge = (challenge: string): void => {
  store.authenticationChallenge = challenge;
};

export const consumeAuthenticationChallenge = (): string | null => {
  const challenge = store.authenticationChallenge;
  store.authenticationChallenge = null;
  return challenge;
};
