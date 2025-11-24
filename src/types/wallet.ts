export interface WalletToken {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  address?: string;
  logoUrl?: string;
  usdValue?: number;
}

export interface WalletNFT {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  contractAddress: string;
  tokenId: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: "pending" | "success" | "failed";
  type: "send" | "receive" | "swap";
  tokenSymbol?: string;
}

export type WalletView = "auth" | "assets" | "send" | "swap" | "transactions";

export interface WalletAccount {
  address: string;
  instance: any; // WalletAccountEvmErc4337 instance
}

export interface WalletState {
  isUnlocked: boolean;
  address: string | null;
  tokens: WalletToken[];
  nfts: WalletNFT[];
  transactions: Transaction[];
  currentView: WalletView;
}

