"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import WDK from "@tetherto/wdk";
import WalletManagerEvmErc4337 from "@tetherto/wdk-wallet-evm-erc-4337";
import WalletManagerEvm from "@tetherto/wdk-wallet-evm";
import { WalletAccount, WalletView, WalletToken, WalletNFT, Transaction } from "@/types/wallet";
import { WALLET_CONFIG } from "@/lib/wallet-config";
import { encryptData, decryptData, generateKey, exportKey, importKey } from "@/lib/crypto";
import { WalletAccountEvm } from "@tetherto/wdk-wallet-evm";

interface WalletContextType {
  walletAccount: WalletAccount | null;
  address: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentView: WalletView;
  tokens: WalletToken[];
  nfts: WalletNFT[];
  transactions: Transaction[];
  setCurrentView: (view: WalletView) => void;
  login: (seedPhrase: string) => Promise<void>;
  logout: () => void;
  createWallet: (seedPhrase: string) => Promise<void>;
  addTransaction: (tx: Transaction) => void;
  loadBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const SESSION_KEY = "trilemma_wallet_session";
const SESSION_IV_KEY = "trilemma_wallet_session_iv";
const SESSION_CRYPTO_KEY = "trilemma_wallet_crypto_key";

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletAccount, setWalletAccount] = useState<WalletAccount | null>(
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<WalletView>("auth");
  const [tokens, setTokens] = useState<WalletToken[]>([]);
  const [nfts, setNfts] = useState<WalletNFT[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const initializeWallet = useCallback(async (seedPhrase: string) => {
    try {
      const wdk = new WDK(seedPhrase);
      wdk.registerWallet(
        "ethereum",
        WalletManagerEvm,
        {provider: WALLET_CONFIG.provider}
      );
      const account = await wdk.getAccount("ethereum", 0);
      const address = await account.getAddress();
      
      setWalletAccount({
        address,
        instance: account,
      });
      setIsAuthenticated(true);
      
      // Ensure view changes after authentication
      setTimeout(() => {
        setCurrentView("assets");
        console.log("✅ Wallet initialized, switching to assets view");
      }, 0);
    } catch (error) {
      console.error("Failed to initialize wallet:", error);
      setIsAuthenticated(false);
      setWalletAccount(null);
      setCurrentView("auth");
      // Clear session on error
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_IV_KEY);
      localStorage.removeItem(SESSION_CRYPTO_KEY);
    }
  }, []);

  const saveSession = useCallback(async (seedPhrase: string) => {
    try {
      const cryptoKey = await generateKey();
      const { encrypted, iv } = await encryptData(seedPhrase, cryptoKey);
      const exportedKey = await exportKey(cryptoKey);
      
      localStorage.setItem(SESSION_KEY, encrypted);
      localStorage.setItem(SESSION_IV_KEY, iv);
      localStorage.setItem(SESSION_CRYPTO_KEY, exportedKey);
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  }, []);

  const loadSession = useCallback(async () => {
    try {
      const encryptedSeed = localStorage.getItem(SESSION_KEY);
      const iv = localStorage.getItem(SESSION_IV_KEY);
      const exportedKey = localStorage.getItem(SESSION_CRYPTO_KEY);

      if (!encryptedSeed || !iv || !exportedKey) {
        setIsLoading(false);
        return;
      }

      const cryptoKey = await importKey(exportedKey);
      const decryptedSeed = await decryptData(encryptedSeed, iv, cryptoKey);
      
      await initializeWallet(decryptedSeed);
    } catch (error) {
      console.error("Failed to load session:", error);
      // Clear corrupted session
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_IV_KEY);
      localStorage.removeItem(SESSION_CRYPTO_KEY);
    } finally {
      setIsLoading(false);
    }
  }, [initializeWallet]);

  const login = useCallback(
    async (seedPhrase: string) => {
      setIsLoading(true);
      try {
        await initializeWallet(seedPhrase);
        await saveSession(seedPhrase);
      } finally {
        setIsLoading(false);
      }
    },
    [initializeWallet, saveSession]
  );

  const createWallet = useCallback(
    async (seedPhrase: string) => {
      setIsLoading(true);
      try {
        await initializeWallet(seedPhrase);
        await saveSession(seedPhrase);
      } finally {
        setIsLoading(false);
      }
    },
    [initializeWallet, saveSession]
  );

  const logout = useCallback(() => {
    setWalletAccount(null);
    setIsAuthenticated(false);
    setCurrentView("auth");
    setTokens([]);
    setNfts([]);
    setTransactions([]);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_IV_KEY);
    localStorage.removeItem(SESSION_CRYPTO_KEY);
  }, []);

  const addTransaction = useCallback((tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  const loadBalances = useCallback(async () => {
    if (!walletAccount) return;
    
    try {
      // Mock data for now - in production, fetch real balances
      setTokens([
        {
          symbol: "ETH",
          name: "Ethereum",
          balance: "0.0",
          decimals: 18,
          usdValue: 0,
        },
      ]);
    } catch (error) {
      console.error("Failed to load balances:", error);
    }
  }, [walletAccount]);

  // Auto-load session on mount
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const value = useMemo(
    () => ({
      walletAccount,
      address: walletAccount?.address || null,
      isAuthenticated,
      isLoading,
      currentView,
      tokens,
      nfts,
      transactions,
      setCurrentView,
      login,
      logout,
      createWallet,
      addTransaction,
      loadBalances,
    }),
    [
      walletAccount,
      isAuthenticated,
      isLoading,
      currentView,
      tokens,
      nfts,
      transactions,
      setCurrentView,
      login,
      logout,
      createWallet,
      addTransaction,
      loadBalances,
    ]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
