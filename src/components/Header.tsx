"use client";

import MagneticButton from "@/components/MagneticButton";
import Menu from "@/components/menu/Menu";
import MenuButton from "@/components/MenuButton";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const [isActive, setActive] = useState<boolean>(false);

  return (
    <header className="z-[990] px-8 pt-8">
      <div className="relative z-50 flex justify-between">
        <MagneticButton>
          <Link href="/">
            <Image src="/logo-text.png" alt="logo" width={150} height={150} />
          </Link>
        </MagneticButton>
        <nav>
          <MenuButton state={isActive} setState={setActive} />
        </nav>
      </div>
      <Menu state={isActive} setState={setActive} />
    </header>
  );
};

export default Header;
