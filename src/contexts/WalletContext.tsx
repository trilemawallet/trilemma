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
  refreshTransactions: () => Promise<boolean>;
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
      const balance = await account.getBalance();

      console.log(`✅ Wallet Address: ${address}`);
      console.log(`💰 Wallet Balance: ${Number(balance)/(10**18)} ETH`);
      
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
      const balance = await walletAccount.instance.getBalance();
      setTokens([
        {
          symbol: "ETH",
          name: "Ethereum",
          balance: Number(balance)/10**18,
          decimals: 18,
          usdValue: Number(balance)/10**18 * 2973, // Mock USD value
        },
      ]);
    } catch (error) {
      console.error("Failed to load balances:", error);
    }
  }, [walletAccount]);

  const refreshTransactions = useCallback(async () => {
    if (!walletAccount?.address) return false;

    try {
      const url = new URL("https://api.etherscan.io/v2/api");
      url.search = new URLSearchParams({
        apikey: "PE8KPC2FNRC8FZ38XA7Q9869M869WAMAT2",
        chainid: WALLET_CONFIG.chainId.toString(),
        module: "account",
        action: "txlist",
        address: walletAccount.address,
        page: "1",
        offset: "25",
        tag: "latest",
        startblock: "0",
        endblock: "9999999999",
        sort: "desc",
      }).toString();

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.status !== "1" || !Array.isArray(data.result)) {
        console.error("Failed to fetch transactions", data);
        return false;
      }

      const mapped: Transaction[] = data.result.map((tx: any) => {
        const direction =
          tx.from?.toLowerCase() === walletAccount.address.toLowerCase()
            ? "send"
            : "receive";
        const valueLabel = () => {
          const rawValue = tx.value ?? "0";
          const numeric = Number(rawValue);
          if (Number.isNaN(numeric)) return String(rawValue);
          return `${(numeric / 1e18).toFixed(6)} ETH`;
        };
        const statusValue =
          tx.txreceipt_status !== undefined && tx.txreceipt_status !== null
            ? Number(tx.txreceipt_status)
            : tx.isError !== undefined && tx.isError !== null
              ? Number(tx.isError) === 0
                ? 1
                : 0
              : null;

        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to || null,
          blockHash: tx.blockHash || null,
          blockNumber: tx.blockNumber ? Number(tx.blockNumber) : null,
          transactionIndex: tx.transactionIndex ? Number(tx.transactionIndex) : null,
          nonce: tx.nonce ? Number(tx.nonce) : null,
          value: tx.value ?? "0",
          gas: tx.gas ?? null,
          gasPrice: tx.gasPrice ?? null,
          gasUsed: tx.gasUsed ?? null,
          cumulativeGasUsed: tx.cumulativeGasUsed ?? null,
          timestamp: tx.timeStamp ? Number(tx.timeStamp) * 1000 : null,
          status: statusValue as 0 | 1 | null,
          isError: tx.isError,
          txReceiptStatus: tx.txreceipt_status ?? tx.txReceiptStatus,
          input: tx.input,
          contractAddress: tx.contractAddress || null,
          confirmations: tx.confirmations,
          methodId: tx.methodId,
          functionName: tx.functionName,
          l1Gas: tx.L1Gas,
          l1GasPrice: tx.L1GasPrice,
          l1FeesPaid: tx.L1FeesPaid,
          l1FeeScalar: tx.L1FeeScalar,
          direction,
          amount: valueLabel(),
          tokenSymbol: tx.contractAddress ? undefined : "ETH",
        };
      });

      setTransactions(mapped);
      return true;
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      return false;
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
      refreshTransactions,
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
      refreshTransactions,
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
