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
  keywords: ["Trilemma", "Open Source", "Development", "WEB3", "Turkey"],
  authors: [
    {
      name: "Trilemma",
      url: baseUrl,
    },
  ],
  creator: "Trilemma",
  icons: {
    icon: [
      {
        url: "/logo.svg",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Trilema WaaS",
    description: siteConfig.description,
    siteName: "Trilema WaaS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trilema WaaS",
    description: siteConfig.description,
    images: [`${siteConfig.url}/opengraph-image.png`],
    creator: "@trilemma",
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
