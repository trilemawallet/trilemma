"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { CardStackIcon } from "@radix-ui/react-icons";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/types";
import WDK from "@tetherto/wdk";
import {
  decryptData,
  encryptData,
  exportKey,
  generateKey,
  importKey,
} from "@/lib/crypto";
import type { LoginStartResponse } from "@/app/api/auth/login/start/route";
import type { RegisterStartResponse } from "@/app/api/auth/register/start/route";
import { useWallet } from "@/contexts/WalletContext";

interface AuthViewProps {}

type Variant = "idle" | "loading" | "success" | "error";

const AuthView: FC<AuthViewProps> = ({}) => {
  const { login, createWallet: createWalletContext } = useWallet();
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusVariant, setStatusVariant] = useState<Variant>("idle");

  const updateStatus = useCallback((message: string, variant: Variant) => {
    setStatusMessage(message);
    setStatusVariant(variant);
  }, []);

  const createWallet = useCallback(async () => {
    setBusy(true);
    updateStatus("Generating wallet...", "loading");

    try {
      const seedPhrase = WDK.getRandomSeedPhrase();
      if (!seedPhrase) {
        throw new Error("Mnemonic could not be generated.");
      }

      const aesKey = await generateKey();
      const { encrypted, iv } = await encryptData(seedPhrase, aesKey);
      const exportedKey = await exportKey(aesKey);

      const startRes = await fetch("/api/auth/register/start", {
        method: "POST",
      });
      const startJson = (await startRes.json()) as RegisterStartResponse & {
        error?: string;
      };
      if (!startRes.ok || !startJson.options) {
        throw new Error(startJson.error || "Failed to start registration.");
      }

      const attestationResponse: RegistrationResponseJSON =
        await startRegistration({
          optionsJSON:
            startJson.options as PublicKeyCredentialCreationOptionsJSON,
        });

      const finishRes = await fetch("/api/auth/register/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: attestationResponse,
          encryptedSeed: encrypted,
          iv,
          encryptionKey: exportedKey,
          userHandle: startJson.userHandle,
        }),
      });

      const finishJson = (await finishRes.json()) as {
        success?: boolean;
        error?: string;
      };
      if (!finishRes.ok || !finishJson.success) {
        throw new Error(finishJson.error || "Registration failed.");
      }

      await createWalletContext(seedPhrase);
      // View will automatically change to "assets" via WalletContext
      // No need to show success message as user will see the wallet
    } catch (error) {
      console.error(error);
      updateStatus(
        error instanceof Error ? error.message : "Registration error",
        "error"
      );
    } finally {
      setBusy(false);
    }
  }, [createWalletContext, updateStatus]);

  const loginWithPasskey = useCallback(async () => {
    setBusy(true);
    updateStatus("Authenticating...", "loading");

    try {
      const startRes = await fetch("/api/auth/login/start");
      const startJson = (await startRes.json()) as LoginStartResponse & {
        error?: string;
      };
      if (!startRes.ok || !startJson.options) {
        throw new Error(startJson.error || "Failed to start authentication.");
      }

      const assertionResponse: AuthenticationResponseJSON =
        await startAuthentication({
          optionsJSON:
            startJson.options as PublicKeyCredentialRequestOptionsJSON,
        });

      const finishRes = await fetch("/api/auth/login/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: assertionResponse }),
      });

      const finishJson = (await finishRes.json()) as
        | {
            encryptedSeed?: string;
            iv?: string;
            encryptionKey?: string;
            error?: string;
          }
        | { error: string };

      if (
        !finishRes.ok ||
        !("encryptedSeed" in finishJson) ||
        !finishJson.encryptedSeed
      ) {
        const errorMessage =
          "error" in finishJson && finishJson.error
            ? finishJson.error
            : "Authentication failed.";
        throw new Error(errorMessage);
      }

      const cryptoKey = await importKey(finishJson.encryptionKey as string);
      const decryptedSeed = await decryptData(
        finishJson.encryptedSeed,
        finishJson.iv as string,
        cryptoKey
      );

      await login(decryptedSeed);
      // View will automatically change to "assets" via WalletContext
      // No need to show success message as user will see the wallet
    } catch (error) {
      console.error(error);
      updateStatus(
        error instanceof Error ? error.message : "Login error",
        "error"
      );
    } finally {
      setBusy(false);
    }
  }, [login, updateStatus]);

  const statusTone = useMemo(() => {
    if (statusVariant === "error") return "text-red-400";
    if (statusVariant === "success") return "text-[rgba(167,232,136,1)]";
    if (statusVariant === "loading") return "text-[rgba(255,255,255,0.85)]";
    return "text-[rgba(255,255,255,0.65)]";
  }, [statusVariant]);

  return (
    <div className="flex flex-col h-full px-8 py-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-8 mt-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(167,232,136,0.15)] border-2 border-[rgba(167,232,136,0.4)]">
          <CardStackIcon className="h-10 w-10 text-[rgba(167,232,136,1)]" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Web3 Wallet</h2>
          <p className="text-sm text-gray-400">
            Self-custodial ERC-4337 wallet
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-[rgba(167,232,136,0.05)] border border-[rgba(167,232,136,0.2)] rounded-2xl p-4 mb-6">
        <p className="text-sm text-gray-300 text-center mb-3">
          Secure wallet protected by passkey authentication
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-[rgba(167,232,136,1)]">
          <span>✓ Self-Custodial</span>
          <span>•</span>
          <span>✓ Gasless</span>
          <span>•</span>
          <span>✓ ERC-4337</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[rgba(167,232,136,1)] px-6 py-4 text-base font-semibold text-[rgba(23,23,23,1)] transition-all duration-200 hover:bg-white hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          onClick={loginWithPasskey}
          disabled={busy}
        >
          {busy && statusMessage.includes("Authenticating")
            ? "Authenticating..."
            : "Login with passkey"}
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[rgba(167,232,136,0.4)] px-6 py-4 text-base font-semibold text-[rgba(167,232,136,1)] transition-all duration-200 hover:border-[rgba(167,232,136,0.8)] hover:bg-[rgba(167,232,136,0.1)] hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          onClick={createWallet}
          disabled={busy}
        >
          {busy && statusMessage.includes("Generating")
            ? "Creating..."
            : "Create wallet via passkey"}
        </button>
      </div>

      {/* Status */}
      {statusMessage && (
        <div className="space-y-2 mb-4">
          <p className={`text-sm text-center ${statusTone}`}>{statusMessage}</p>
        </div>
      )}

      {/* Note */}
      {!statusMessage && (
        <div className="text-center mt-auto">
          <p className="text-xs text-gray-500">
            Your keys, your crypto. Powered by ERC-4337.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthView;
