"use client";

import Image from "next/image";
import Link from "next/link";
import { FC, useState, useEffect } from "react";
import { CardStackIcon } from "@radix-ui/react-icons";
import { MenuLinks } from "@/content/menu-links";
import WalletContainer from "@/components/wallet/WalletContainer";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[990] transition-all duration-300 ${
        isScrolled
          ? "bg-[rgba(23,23,23,0.95)] backdrop-blur-md border-b border-[rgba(167,232,136,0.1)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-50 transition-transform duration-300 hover:scale-105"
          >
            <Image
              src="/logo-new.svg"
              alt="Trilemma Labs"
              width={200}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-6">
            {/* Wallet Button */}
            <button
              type="button"
              id="wallet-button"
              className="relative z-50 inline-flex items-center gap-2 rounded-full bg-[rgba(167,232,136,1)] px-4 py-2 text-lg font-medium text-black transition-colors duration-300 hover:bg-white"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsWalletOpen(true);
              }}
            >
              <CardStackIcon className="h-5 w-5 text-black" />
              Go to my wallet
            </button>
          </div>
        </div>
      </div>

      <WalletContainer open={isWalletOpen} onClose={() => setIsWalletOpen(false)} />

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-[rgba(23,23,23,0.98)] backdrop-blur-lg transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: "80px" }}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {MenuLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[rgba(167,232,136,1)] hover:text-white transition-all duration-300 text-2xl font-medium transform hover:scale-110"
              style={{
                animation: isMobileMenuOpen
                  ? `slideIn 0.3s ease-out ${index * 0.1}s forwards`
                  : "none",
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
