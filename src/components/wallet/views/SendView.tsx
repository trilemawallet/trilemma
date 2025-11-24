"use client";

import { FC, useState } from "react";
import { useWallet } from "@/contexts/WalletContext";

const SendView: FC = () => {
  const { tokens, walletAccount } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState(tokens[0]?.symbol || "ETH");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSend = async () => {
    if (!recipient || !amount) {
      setStatus({ message: "Please fill all fields", type: "error" });
      return;
    }

    if (!walletAccount) {
      setStatus({ message: "Wallet not connected", type: "error" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const txResult = await walletAccount.instance.sendTransaction({
        to: recipient,
        value: Number(amount) * 10 ** 18, // Assuming ETH for simplicity
      });

      if (!txResult || !txResult.hash) {
        throw new Error("Transaction submission failed");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const receipt = await walletAccount.instance.getTransactionReceipt(txResult.hash);

      if (!receipt) {
        throw new Error("No transaction receipt returned");
      }

      console.log("Transaction receipt:", receipt);
      setStatus({ message: "Transaction sent successfully!", type: "success" });
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Send error:", error);
      setStatus({ message: "Transaction failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Send</h2>
        <p className="text-sm text-gray-400 mt-1">
          Transfer tokens to another address
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 space-y-4">
        {/* Token Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Token
          </label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[rgba(167,232,136,0.05)] border border-[rgba(167,232,136,0.2)] text-white focus:outline-none focus:border-[rgba(167,232,136,1)] transition-colors"
          >
            {tokens.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol} - {token.balance}
              </option>
            ))}
          </select>
        </div>

        {/* Recipient */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 rounded-xl bg-[rgba(167,232,136,0.05)] border border-[rgba(167,232,136,0.2)] text-white placeholder-gray-500 focus:outline-none focus:border-[rgba(167,232,136,1)] transition-colors"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 rounded-xl bg-[rgba(167,232,136,0.05)] border border-[rgba(167,232,136,0.2)] text-white placeholder-gray-500 focus:outline-none focus:border-[rgba(167,232,136,1)] transition-colors"
            />
            <button
              onClick={() => {
                const token = tokens.find((t) => t.symbol === selectedToken);
                if (token) setAmount(token.balance.toString());
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[rgba(167,232,136,1)] hover:text-white transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`p-3 rounded-xl text-sm ${
              status.type === "success"
                ? "bg-[rgba(167,232,136,0.1)] text-[rgba(167,232,136,1)]"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-[rgba(167,232,136,1)] text-[rgba(23,23,23,1)] font-semibold hover:bg-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? "Sending..." : "Send Transaction"}
        </button>
      </div>
    </div>
  );
};

export default SendView;
