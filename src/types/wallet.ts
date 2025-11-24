import { IWalletAccountWithProtocols } from "@tetherto/wdk";

export interface WalletToken {
  symbol: string;
  name: string;
  balance: number;
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
  to: string | null;
  blockHash: string | null;
  blockNumber: number | null;
  transactionIndex: number | null;
  nonce: number | null;
  value: string;
  gas: string | null;
  gasPrice: string | null;
  gasUsed: string | null;
  cumulativeGasUsed: string | null;
  timestamp: number | null;
  status: 0 | 1 | null;
  isError?: string;
  txReceiptStatus?: string;
  input?: string;
  contractAddress: string | null;
  confirmations?: string;
  methodId?: string;
  functionName?: string;
  l1Gas?: string;
  l1GasPrice?: string;
  l1FeesPaid?: string;
  l1FeeScalar?: string;
  direction: "send" | "receive" | "swap";
  amount?: string;
  tokenSymbol?: string;
}

export type WalletView = "auth" | "assets" | "send" | "swap" | "transactions";

export interface WalletAccount {
  address: string;
  instance: IWalletAccountWithProtocols; // WalletAccountEvm instance
}

export interface WalletState {
  isUnlocked: boolean;
  address: string | null;
  tokens: WalletToken[];
  nfts: WalletNFT[];
  transactions: Transaction[];
  currentView: WalletView;
}
