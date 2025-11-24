// WDK ERC-4337 Configuration for Base Sepolia Testnet
export const WALLET_CONFIG = {
  chainId: 84532, // Base Sepolia
  provider: "https://sepolia.base.org",
  bundlerUrl: "https://api.candide.dev/bundler/v3/base-sepolia/5264bafebfef602225ecd0facc8a4e4b",
  paymasterUrl: "https://api.candide.dev/paymaster/v3/base-sepolia/5264bafebfef602225ecd0facc8a4e4b", 
  paymasterAddress: "0x8b1f6cb5d062aa2ce8d581942bbb960420d875ba", 
  entryPointAddress: "0x0000000071727De22E5E9d8BAf0edAc6f37da032", // EntryPoint v0.7
  safeModulesVersion: "1.0.0",
  paymasterToken: {
    address: "0x0000000000000000000000000000000000000000", // Native ETH
  },
  transferMaxFee: 100000000000000, // 0.0001 ETH max fee
};

export type WalletConfig = typeof WALLET_CONFIG;

