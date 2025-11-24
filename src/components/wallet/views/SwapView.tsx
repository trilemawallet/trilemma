"use client";

import { FC, useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import { Transaction } from "@/types/wallet";

const SwapView: FC = () => {
  const { tokens, addTransaction } = useWallet();
  const [fromToken, setFromToken] = useState(tokens[0]?.symbol || "ETH");
  const [toToken, setToToken] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleExecuteSwap = async () => {
    if (!fromAmount || !toAmount) {
      setStatus({ message: "Please enter amounts", type: "error" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // Mock swap - will integrate with actual DEX
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const tx: Transaction = {
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        from: "0x...",
        to: "0x...",
        blockHash: null,
        blockNumber: null,
        transactionIndex: null,
        nonce: null,
        value: "0",
        gas: null,
        gasPrice: null,
        gasUsed: null,
        cumulativeGasUsed: null,
        contractAddress: null,
        timestamp: Date.now(),
        status: 1,
        direction: "swap",
        amount: `${fromAmount} ${fromToken} → ${toAmount} ${toToken}`,
        tokenSymbol: `${fromToken} → ${toToken}`,
      };

      addTransaction(tx);
      setStatus({ message: "Swap completed successfully!", type: "success" });
      setFromAmount("");
      setToAmount("");
    } catch (error) {
      console.error("Swap error:", error);
      setStatus({ message: "Swap failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const calculateToAmount = (amount: string) => {
    // Mock conversion rate 1:1 - will integrate with real price feeds
    const rate = 1.0;
    const calculated = parseFloat(amount) * rate;
    setToAmount(isNaN(calculated) ? "" : calculated.toString());
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Swap</h2>
        <p className="text-sm text-gray-400 mt-1">
          Exchange tokens instantly
        </p>
      </div>

      {/* Swap Interface */}
      <div className="flex-1">
        {/* From Token */}
        <div className="p-4 rounded-xl bg-[rgba(167,232,136,0.05)] border border-[rgba(167,232,136,0.2)]">
          <label className="block text-xs font-medium text-gray-400 mb-2">
            From
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => {
                setFromAmount(e.target.value);
                calculateToAmount(e.target.value);
              }}
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl text-white outline-none placeholder-gray-600"
            />
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="px-2 py-1.5 rounded-lg bg-[rgba(167,232,136,0.1)] border border-[rgba(167,232,136,0.2)] text-white text-sm font-medium focus:outline-none w-20"
            >
              {tokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Balance: {tokens.find((t) => t.symbol === fromToken)?.balance || "0.0"}
          </p>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1">
          <button
            onClick={handleSwap}
            className="p-2 rounded-full bg-[rgba(167,232,136,0.1)] border-2 border-[rgba(167,232,136,0.3)] hover:bg-[rgba(167,232,136,0.2)] hover:border-[rgba(167,232,136,1)] transition-all"
          >
            <ArrowDownIcon className="w-5 h-5 text-[rgba(167,232,136,1)]" />
          </button>
        </div>

        {/* To Token */}
        <div className="p-4 rounded-xl bg-[rgba(167,232,136,0.05)] border border-[rgba(167,232,136,0.2)]">
          <label className="block text-xs font-medium text-gray-400 mb-2">
            To
          </label>
          <div className="flex items-center ">
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl text-white outline-none placeholder-gray-600"
            />
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="px-1 py-1.5 rounded-lg bg-[rgba(167,232,136,0.1)] border border-[rgba(167,232,136,0.2)] text-white text-sm font-medium focus:outline-none w-20"
            >
              <option value="USDT">USDT</option>
              <option value="USDC">USDC</option>
              <option value="DAI">DAI</option>
            </select>
          </div>
        </div>

        {/* Rate Info */}
        <div className="px-4 py-3 rounded-xl bg-[rgba(167,232,136,0.05)] border border-[rgba(167,232,136,0.1)] mt-12">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Rate</span>
            <span className="text-white font-medium">
              1 {fromToken} = 1.00 {toToken}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-400">Network Fee</span>
            <span className="text-white font-medium">~$0.50</span>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`p-3 rounded-xl text-sm mt-4 ${
              status.type === "success"
                ? "bg-[rgba(167,232,136,0.1)] text-[rgba(167,232,136,1)]"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Execute Button */}
        <button
          onClick={handleExecuteSwap}
          disabled={loading || !fromAmount}
          className="w-full py-4 rounded-xl bg-[rgba(167,232,136,1)] text-[rgba(23,23,23,1)] font-semibold hover:bg-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-8"
        >
          {loading ? "Swapping..." : "Swap Tokens"}
        </button>
      </div>
    </div>
  );
};

export default SwapView;
