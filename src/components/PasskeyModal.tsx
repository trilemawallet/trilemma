"use client";

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
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { CardStackIcon, Cross2Icon } from "@radix-ui/react-icons";
import WDK, { IWalletAccountWithProtocols } from "@tetherto/wdk";
import {
  decryptData,
  encryptData,
  exportKey,
  generateKey,
  importKey,
} from "@/lib/crypto";
import type { LoginStartResponse } from "@/app/api/auth/login/start/route";
import type { RegisterStartResponse } from "@/app/api/auth/register/start/route";
import WalletManagerEvm from "@tetherto/wdk-wallet-evm";

interface PasskeyModalProps {
  open: boolean;
  onClose: () => void;
  onCreateViaPasskey?: () => void;
  onLoginWithPasskey?: () => void;
}

type Variant = "idle" | "loading" | "success" | "error";
type WalletAddressResponse = { account?: IWalletAccountWithProtocols; error?: string };

const PasskeyModal: FC<PasskeyModalProps> = ({
  open,
  onClose,
  onCreateViaPasskey,
  onLoginWithPasskey,
}) => {
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Use a passkey to create a new wallet or log in to an existing one."
  );
  const [statusVariant, setStatusVariant] = useState<Variant>("idle");
  const [walletAddress, setWalletAddress] = useState("");

  const updateStatus = useCallback((message: string, variant: Variant) => {
    setStatusMessage(message);
    setStatusVariant(variant);
  }, []);


  const createWallet = useCallback(async () => {
    setBusy(true);
    updateStatus("Generating mnemonic and AES-GCM key...", "loading");

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
        await startRegistration(
          startJson.options as PublicKeyCredentialCreationOptionsJSON
        );

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
      const wdk = new WDK(seedPhrase).registerWallet('ethereum', WalletManagerEvm, { provider: 'wss://base-sepolia.drpc.org' });
        const account = await wdk.getAccount('ethereum', 0);
      const ethAddress = await account.getAddress();
      console.log("Derived Ethereum address:", ethAddress);
      setWalletAddress(ethAddress ?? "");
      updateStatus(
        "Wallet created and sealed behind your passkey.",
        "success"
      );
      onCreateViaPasskey?.();
    } catch (error) {
      console.error(error);
      updateStatus(
        error instanceof Error ? error.message : "Registration error",
        "error"
      );
    } finally {
      setBusy(false);
    }
  }, [onCreateViaPasskey, updateStatus]);

  const loginWithPasskey = useCallback(async () => {
    setBusy(true);
    updateStatus("Prompting passkey...", "loading");

    try {
      const startRes = await fetch("/api/auth/login/start");
      const startJson = (await startRes.json()) as LoginStartResponse & {
        error?: string;
      };
      if (!startRes.ok || !startJson.options) {
        throw new Error(startJson.error || "Failed to start authentication.");
      }

      const assertionResponse: AuthenticationResponseJSON =
        await startAuthentication(
          startJson.options as PublicKeyCredentialRequestOptionsJSON
        );

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
      console.log("Decrypted seed phrase:", decryptedSeed);
      // const ethAccount = await deriveWalletAccount(decryptedSeed);
      // console.log("Derived account:", ethAccount);
      const wdk = new WDK(decryptedSeed).registerWallet('ethereum', WalletManagerEvm, { provider: 'wss://base-sepolia.drpc.org' });
        const account = await wdk.getAccount('ethereum', 0);
      const ethAddress = await account.getAddress();
      console.log("Derived Ethereum address:", ethAddress);
      setWalletAddress(ethAddress ?? "");
      updateStatus(
        "Passkey verified. Wallet unlocked with your passkey.",
        "success"
      );
      onLoginWithPasskey?.();
    } catch (error) {
      console.error(error);
      updateStatus(
        error instanceof Error ? error.message : "Login error",
        "error"
      );
    } finally {
      setBusy(false);
    }
  }, [ onLoginWithPasskey, updateStatus]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setStatusMessage(
        "Use a passkey to create a new wallet or log in to an existing one."
      );
      setStatusVariant("idle");
      setWalletAddress("");
      setBusy(false);
    }
  }, [open]);

  const statusTone = useMemo(() => {
    if (statusVariant === "error") return "text-red-400";
    if (statusVariant === "success") return "text-[rgba(167,232,136,1)]";
    if (statusVariant === "loading") return "text-[rgba(255,255,255,0.85)]";
    return "text-[rgba(255,255,255,0.65)]";
  }, [statusVariant]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-[rgba(167,232,136,0.2)] bg-[rgba(23,23,23,0.95)] p-6 shadow-2xl">
        <button
          type="button"
          className="absolute right-4 top-4 text-[rgba(167,232,136,1)] transition-colors hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          <Cross2Icon className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(167,232,136,0.15)] border border-[rgba(167,232,136,0.4)]">
            <CardStackIcon className="h-5 w-5 text-[rgba(167,232,136,1)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Access your wallet</h2>
            <p className="text-sm text-[rgba(255,255,255,0.65)]">
              Securely create or unlock with your device passkey.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[rgba(167,232,136,1)] px-4 py-3 text-base font-semibold text-black transition-colors duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            onClick={createWallet}
            disabled={busy}
          >
            {busy ? "Working..." : "Create via passkey"}
          </button>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[rgba(167,232,136,0.4)] px-4 py-3 text-base font-semibold text-[rgba(167,232,136,1)] transition-colors duration-200 hover:border-[rgba(167,232,136,0.8)] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
            onClick={loginWithPasskey}
            disabled={busy}
          >
            {busy ? "Working..." : "Login with passkey"}
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <p className={`text-sm ${statusTone}`}>{statusMessage}</p>
          {walletAddress && (
            <p className="text-xs text-[rgba(167,232,136,0.8)] break-all">
              Wallet address: {walletAddress}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasskeyModal;
