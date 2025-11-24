import Hero from "@/components/home/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trilemma Labs - Self-Custodial Web3 Wallet Infrastructure",
  description:
    "Integrate ERC-4337 smart accounts seamlessly. Offer users a self-custodial experience while maintaining full control and scalability.",
};

const page = () => {
  return (
    <div className="relative">
      <Hero />
    </div>
  );
};

export default page;
