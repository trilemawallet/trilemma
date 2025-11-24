"use client";

import Image from "next/image";
import Link from "next/link";
import { FC, useState, useEffect } from "react";
import { MenuLinks } from "@/content/menu-links";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const [isScrolled, setIsScrolled] = useState(false);

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

          {/* Desktop Navigation */}
          
        </div>
      </div>
    </header>
  );
};

export default Header;
