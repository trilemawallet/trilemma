import MagneticButton from "@/components/MagneticButton";
import Roll from "@/components/Roll";
import { email, linkedin } from "@/content/social-links";
import { FC } from "react";

interface FooterProps {}

const Footer: FC<FooterProps> = ({}) => {
  return (
    <footer className="flex justify-between px-8 pb-8 max-[320px]:justify-end text-[rgba(167,232,136,1)]">
      <div className="group select-none">
        <Roll initial="top-full" className="max-[320px]:hidden" text="2025" />
      </div>
      <div className="flex gap-6 uppercase">
        <MagneticButton>
          <a href={linkedin} className="hover:text-white transition-colors duration-300">LinkedIn</a>
        </MagneticButton>
        <MagneticButton>
          <a href={email} className="hover:text-white transition-colors duration-300">Contact</a>
        </MagneticButton>
      </div>
    </footer>
  );
};

export default Footer;
