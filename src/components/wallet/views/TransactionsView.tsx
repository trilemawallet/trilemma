"use client";

import { FC } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { ArrowUpIcon, ArrowDownIcon, UpdateIcon } from "@radix-ui/react-icons";

const TransactionsView: FC = () => {
  const { transactions } = useWallet();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpIcon className="w-4 h-4" />;
      case "receive":
        return <ArrowDownIcon className="w-4 h-4" />;
      case "swap":
        return <UpdateIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-[rgba(167,232,136,1)]";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const formatAddress = (address: string) => {
    if (address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
        {transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                className="p-4 rounded-xl bg-[rgba(167,232,136,0.05)] border border-[rgba(167,232,136,0.1)] hover:border-[rgba(167,232,136,0.3)] transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="mt-1 p-2 rounded-full bg-[rgba(167,232,136,0.1)] text-[rgba(167,232,136,1)]">
                    {getTypeIcon(tx.type)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-white capitalize">
                        {tx.type}
                      </p>
                      <p className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div>
                        <p className="truncate">To: {formatAddress(tx.to)}</p>
                        {tx.tokenSymbol && (
                          <p className="text-xs mt-0.5">{tx.tokenSymbol}</p>
                        )}
                      </div>
                      <p className="text-xs">{formatDate(tx.timestamp)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-white font-medium">{tx.value}</p>
                      <button className="text-xs text-[rgba(167,232,136,1)] hover:text-white transition-colors">
                        View →
                      </button>
                    </div>

                    {/* Hash */}
                    <p className="text-xs text-gray-500 mt-2 font-mono truncate">
                      {tx.hash}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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

