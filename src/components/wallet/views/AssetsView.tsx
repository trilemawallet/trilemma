"use client";

import { FC, useEffect, useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import Image from "next/image";

const AssetsView: FC = () => {
  const { address, tokens, nfts, loadBalances } = useWallet();
  const [activeTab, setActiveTab] = useState<"tokens" | "nfts">("tokens");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      loadAssets();
    }
  }, [address]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      // Load balances from WDK
      await loadBalances();
    } catch (error) {
      console.error("Failed to load assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalValue = tokens.reduce((sum, token) => sum + (token.usdValue || 0), 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-[rgba(167,232,136,0.1)]">
        <h2 className="text-lg font-semibold text-white mb-2">My Wallet</h2>
        <p className="text-xs text-gray-400 font-mono truncate">{address}</p>
        
        {/* Total Value */}
        <div className="mt-4">
          <p className="text-sm text-gray-400">Total Balance</p>
          <p className="text-3xl font-bold text-[rgba(167,232,136,1)]">
            ${totalValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[rgba(167,232,136,0.1)]">
        <button
          onClick={() => setActiveTab("tokens")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "tokens"
              ? "text-[rgba(167,232,136,1)] border-b-2 border-[rgba(167,232,136,1)]"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Tokens
        </button>
        <button
          onClick={() => setActiveTab("nfts")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "nfts"
              ? "text-[rgba(167,232,136,1)] border-b-2 border-[rgba(167,232,136,1)]"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          NFTs
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[rgba(167,232,136,1)]"></div>
          </div>
        ) : activeTab === "tokens" ? (
          <div className="space-y-2">
            {tokens.length > 0 ? (
              tokens.map((token, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-[rgba(167,232,136,0.05)] hover:bg-[rgba(167,232,136,0.1)] transition-colors cursor-pointer border border-[rgba(167,232,136,0.1)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[rgba(167,232,136,0.2)] flex items-center justify-center">
                      <span className="text-lg">{token.symbol[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{token.symbol}</p>
                      <p className="text-xs text-gray-400">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{token.balance}</p>
                    <p className="text-xs text-gray-400">
                      ${token.usdValue?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-gray-400">No tokens found</p>
                <p className="text-xs text-gray-500 mt-2">
                  Your tokens will appear here
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {nfts.length > 0 ? (
              nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="rounded-xl overflow-hidden bg-[rgba(167,232,136,0.05)] border border-[rgba(167,232,136,0.1)] hover:border-[rgba(167,232,136,0.3)] transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-[rgba(167,232,136,0.1)] relative">
                    <Image
                      src={nft.imageUrl}
                      alt={nft.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium text-white truncate">
                      {nft.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      #{nft.tokenId}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center h-40 text-center">
                <p className="text-gray-400">No NFTs found</p>
                <p className="text-xs text-gray-500 mt-2">
                  Your NFTs will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsView;

