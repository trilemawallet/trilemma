"use client";

import { FC } from "react";
import { useWallet } from "@/contexts/WalletContext";
import type { WalletView } from "@/types/wallet";
import { 
  BackpackIcon, 
  PaperPlaneIcon, 
  UpdateIcon, 
  ClockIcon 
} from "@radix-ui/react-icons";

interface NavItem {
  view: WalletView;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { view: "assets", label: "Assets", icon: <BackpackIcon className="w-5 h-5" /> },
  { view: "send", label: "Send", icon: <PaperPlaneIcon className="w-5 h-5" /> },
  { view: "swap", label: "Swap", icon: <UpdateIcon className="w-5 h-5" /> },
  { view: "transactions", label: "History", icon: <ClockIcon className="w-5 h-5" /> },
];

const WalletNavigation: FC = () => {
  const { currentView, setCurrentView } = useWallet();

  return (
    <nav className="border-t border-[rgba(167,232,136,0.2)] bg-[rgba(23,23,23,0.95)] backdrop-blur-sm">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 ${
              currentView === item.view
                ? "text-[rgba(167,232,136,1)] bg-[rgba(167,232,136,0.1)]"
                : "text-gray-400 hover:text-[rgba(167,232,136,0.7)] hover:bg-[rgba(167,232,136,0.05)]"
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default WalletNavigation;

