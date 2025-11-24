"use client";

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isUnlocking, setIsUnlocking] = useState(false);

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

      // Trigger unlock animation
      setIsUnlocking(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Wait for animation
      await createWalletContext(seedPhrase);
      // View will automatically change to "assets" via WalletContext
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

      // Trigger unlock animation
      setIsUnlocking(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Wait for animation
      await login(decryptedSeed);
      // View will automatically change to "assets" via WalletContext
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
    <div className="flex flex-col items-center justify-between h-full px-8 py-12">
      {/* Trilemma Logo */}
      <div className="flex items-center justify-center">
        <Image
          src="/logo-new.svg"
          alt="Trilemma"
          width={180}
          height={45}
          className="h-12 w-auto"
          priority
        />
      </div>

      {/* Lock Icon - Centered with Animation */}
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[rgba(167,232,136,0.1)] border-2 border-[rgba(167,232,136,0.3)]">
        <AnimatePresence mode="wait">
          {isUnlocking ? (
            <motion.div
              key="unlocked"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <LockOpen1Icon className="h-12 w-12 text-[rgba(167,232,136,1)]" />
            </motion.div>
          ) : (
            <motion.div
              key="locked"
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ duration: 0.4 }}
            >
              <LockClosedIcon className="h-12 w-12 text-[rgba(167,232,136,1)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons - Bottom */}
      <div className="space-y-3 w-full max-w-sm">
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

        {/* Status */}
        {statusMessage && (
          <p className={`text-sm text-center mt-4 ${statusTone}`}>{statusMessage}</p>
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Your keys, your crypto. Powered by ERC-4337.
        </p>
      </div>
    </div>
  );
};

export default AuthView;
