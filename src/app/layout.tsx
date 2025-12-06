import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "@/style/globals.css";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { WalletProvider } from "@/contexts/WalletContext";
import { baseUrl, siteConfig } from "@/config/site";

const neue = localFont({
  src: "../font/HelveticaNowDisplayRegular.woff2",
  variable: "--font-neue",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Trilema WaaS",
  description: siteConfig.description,
  keywords: ["Trilema", "WEB3", "Self Custody", "WaaS"],
  authors: [
    {
      name: "Trilema",
      url: baseUrl,
    },
  ],
  creator: "Trilema",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Trilema WaaS",
    description: siteConfig.description,
    siteName: "Trilema WaaS",
    images: [
      {
        url: "/opengraph-image.png", // Make sure this file exists in your public folder
        width: 1026,
        height: 1026,
        alt: "Trilema WaaS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trilema WaaS",
    description: siteConfig.description,
    images: [`${siteConfig.url}/opengraph-image.png`],
    creator: "@trilema",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen font-sans antialiased ${neue.variable}`}>
        <WalletProvider>
          <main className="relative flex min-h-screen flex-col">
            <div className="grid flex-1 grid-rows-fill">
              <Header />
              {children}
              <Footer />
            </div>
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}
