"use client";

import { FC, useEffect, useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { ArrowUpIcon, ArrowDownIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Transaction } from "@/types/wallet";

const TransactionsView: FC = () => {
  const { transactions, walletAccount, refreshTransactions } = useWallet();
  const [expandedHash, setExpandedHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDirectionIcon = (direction: Transaction["direction"]) => {
    switch (direction) {
      case "send":
        return <ArrowUpIcon className="w-4 h-4" />;
      case "receive":
        return <ArrowDownIcon className="w-4 h-4" />;
      case "swap":
        return <UpdateIcon className="w-4 h-4" />;
      default:
        return <UpdateIcon className="w-4 h-4" />;
    }
  };

  const getStatusMeta = (status: Transaction["status"]) => {
    if (status === 1) {
      return { label: "Success", color: "text-[rgba(167,232,136,1)]" };
    }
    if (status === 0) {
      return { label: "Failed", color: "text-red-400" };
    }
    return { label: "Pending", color: "text-yellow-400" };
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "--";
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const formatAddress = (address?: string | null) => {
    if (!address) return "—";
    if (address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatGasPrice = (gasPrice: string | null) => {
    if (!gasPrice) return "";
    const priceNumber = Number(gasPrice);
    if (Number.isNaN(priceNumber)) return gasPrice;
    return (priceNumber / 1e9).toFixed(6);
  };

  const toggleExpanded = (hash: string) => {
    setExpandedHash((prev) => (prev === hash ? null : hash));
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!walletAccount?.address) return;
      setLoading(true);
      setError(null);
      try {
        const ok = await refreshTransactions();
        if (!ok && mounted) {
          setError("Unable to fetch transactions");
        }
      } catch (err) {
        console.error("Failed to load transactions", err);
        if (mounted) setError("Unable to fetch transactions");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [refreshTransactions, walletAccount?.address]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-[rgba(167,232,136,0.1)]">
        <h2 className="text-2xl font-bold text-white">Transactions</h2>
        <p className="text-sm text-gray-400 mt-1">
          Your transaction history
        </p>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Loading transactions...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-400 text-sm">
            {error}
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((tx) => {
              const statusMeta = getStatusMeta(tx.status);
              const amountLabel =
                tx.amount || (tx.gasUsed ? `${tx.gasUsed} gas` : "—");

              return (
                <div
                  key={tx.hash}
                  onClick={() => toggleExpanded(tx.hash)}
                  className="p-4 rounded-xl bg-[rgba(167,232,136,0.05)] border border-[rgba(167,232,136,0.1)] hover:border-[rgba(167,232,136,0.3)] transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="mt-1 p-2 rounded-full bg-[rgba(167,232,136,0.1)] text-[rgba(167,232,136,1)]">
                      {getDirectionIcon(tx.direction)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-white capitalize">
                          {tx.direction}
                        </p>
                        <p className={`text-sm font-medium ${statusMeta.color}`}>
                          {statusMeta.label}
                        </p>
                      </div>

                      {/* Compact summary */}
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Token</p>
                          <p className="truncate">
                            {tx.tokenSymbol || "Native"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="text-white font-medium">
                            {amountLabel}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">From</p>
                          <p className="truncate">{formatAddress(tx.from)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">To</p>
                          <p className="truncate">
                            {tx.to ? formatAddress(tx.to) : "Contract creation"}
                          </p>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {expandedHash === tx.hash && (
                        <div className="mt-3 space-y-2 text-xs text-gray-400">
                          <div className="flex justify-between">
                            <span>Status</span>
                            <span className={statusMeta.color}>{statusMeta.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Block</span>
                            <span>#{tx.blockNumber ?? "pending"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Timestamp</span>
                            <span>{formatDate(tx.timestamp)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Gas Used</span>
                            <span>{tx.gasUsed || "—"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Gas Price</span>
                            <span>{tx.gasPrice ? `${formatGasPrice(tx.gasPrice)} gwei` : "—"}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] text-gray-500 mb-1">Tx Hash</span>
                            <a
                              href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-[11px] break-all text-[rgba(167,232,136,1)] hover:text-white underline"
                            >
                              {tx.hash}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-[rgba(167,232,136,0.1)] flex items-center justify-center mb-4">
              <UpdateIcon className="w-8 h-8 text-[rgba(167,232,136,1)]" />
            </div>
            <p className="text-gray-400 font-medium">No transactions yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Your transaction history will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsView;
