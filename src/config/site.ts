import { SiteConfig } from "@/types";

export const baseUrl = process.env["NEXT_PUBLIC_VERCEL_URL"]
  ? `https://${process.env["NEXT_PUBLIC_VERCEL_URL"]}`
  : "http://localhost:3000";

export const siteConfig: SiteConfig = {
  name: "",
  description: "Self-Custodial Web3 Wallet Infrastructure",
  url: "wallet.trilema.io",
};
