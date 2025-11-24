"use client";

import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useWallet } from "@/contexts/WalletContext";
import AuthView from "./views/AuthView";
import AssetsView from "./views/AssetsView";
import SendView from "./views/SendView";
import SwapView from "./views/SwapView";
import TransactionsView from "./views/TransactionsView";
import WalletNavigation from "./WalletNavigation";

interface WalletContainerProps {
  open: boolean;
  onClose: () => void;
}

const WalletContainer: FC<WalletContainerProps> = ({ open, onClose }) => {
  const { currentView, isAuthenticated } = useWallet();
  const [walletPosition, setWalletPosition] = useState({ right: "1.5rem" });

  // Calculate wallet position to align with button
  useEffect(() => {
    const calculatePosition = () => {
      const button = document.getElementById("wallet-button");
      if (button) {
        const rect = button.getBoundingClientRect();
        const rightOffset = window.innerWidth - rect.right;
        setWalletPosition({ right: `${rightOffset}px` });
      }
    };

    calculatePosition();
    window.addEventListener("resize", calculatePosition);
    return () => window.removeEventListener("resize", calculatePosition);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case "auth":
        return <AuthView />;
      case "assets":
        return <AssetsView />;
      case "send":
        return <SendView />;
      case "swap":
        return <SwapView />;
      case "transactions":
        return <TransactionsView />;
      default:
        return <AuthView />;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Wallet Container - Positioned at top-right below navbar */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-24 z-[1001] w-[400px] h-[700px] bg-[rgba(23,23,23,0.98)] border-2 border-[rgba(167,232,136,0.3)] rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
            style={{
              backdropFilter: "blur(20px)",
              right: walletPosition.right,
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 text-[rgba(167,232,136,1)] hover:text-white transition-colors rounded-full hover:bg-[rgba(167,232,136,0.1)]"
              aria-label="Close wallet"
            >
              <Cross2Icon className="w-5 h-5" />
            </button>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {renderView()}
            </div>

            {/* Navigation Bar */}
            {isAuthenticated && <WalletNavigation />}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WalletContainer;

