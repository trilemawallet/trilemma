"use client";

import { FC } from "react";
import { useWallet } from "@/contexts/WalletContext";
import type { WalletView } from "@/types/wallet";

interface NavItem {
  view: WalletView;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { view: "assets", label: "Assets", icon: "💼" },
  { view: "send", label: "Send", icon: "📤" },
  { view: "swap", label: "Swap", icon: "🔄" },
  { view: "transactions", label: "History", icon: "📜" },
];

const WalletNavigation: FC = () => {
  const { currentView, setCurrentView } = useWallet();

  return (
    <nav className="border-t border-[rgba(167,232,136,0.2)] bg-[rgba(23,23,23,0.95)] backdrop-blur-sm">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200 ${
              currentView === item.view
                ? "text-[rgba(167,232,136,1)]"
                : "text-gray-400 hover:text-[rgba(167,232,136,0.7)]"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default WalletNavigation;

