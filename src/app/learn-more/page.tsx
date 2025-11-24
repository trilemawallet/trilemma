import AnimatedSection from "@/components/AnimatedSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trilema WaaS - Learn More",
};

const WHY_TRILEMA = [
  "Fully Non-Custodial – Users retain full ownership of their wallets",
  "ERC-4337 Smart Accounts – Gasless transactions, programmable automation, session keys",
  "Base-Optimized Performance – Smart accounts built on Base’s high-throughput infrastructure",
  "Frictionless UX – Passkeys, social logins, no seed phrases",
];

const SECURITY_POINTS = [
  {
    title: "User-Controlled Private Keys",
    body: "Wallet ownership is never shared, stored, or accessible by Trilema.",
  },
  {
    title: "Multi-Factor Authentication",
    body: "Passkeys, social recovery, and hardware key support provide layered protection.",
  },
  {
    title: "Session Keys & Gas Sponsorship",
    body: "Minimizes phishing risk by removing blind approvals and unsafe signing flows.",
  },
  {
    title: "Smart Contract Transparency",
    body: "On-chain audits, verifiable contract logic, and continuous security reviews.",
  },
];

const NETWORKS = ["Base", "Optimism", "Arbitrum"];

const DEV_FEATURES = [
  "Developer-friendly JavaScript & mobile SDKs",
  "Smart account deployment in seconds",
  "Real-time analytics, webhooks, and transaction monitoring",
  "White-label UI and customizable authentication flows",
];

const LearnMorePage = () => {
  return (
    <section className="container mx-auto flex min-h-screen flex-col gap-16 px-6 py-24 text-white md:gap-20">
      {/* Hero / Intro */}
      <AnimatedSection>
        <header className="mx-auto flex max-w-5xl flex-col gap-6 text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-[rgba(167,232,136,0.4)]/60 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[rgba(167,232,136,0.9)]">
             Trilema WaaS
          </p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
            Smart Wallet Infrastructure for the Next Generation of Web3
          </h1>
          <p className="text-lg text-[rgba(167,232,136,0.9)] md:text-xl">
            A New Standard for Self-Custodial Smart Wallets
          </p>
          <div className="space-y-4 text-base leading-relaxed text-gray-300 md:text-lg">
            <p>
              Trilema WaaS is a self-custodial wallet infrastructure powered by ERC-4337 account
              abstraction and built on Base account architecture, enabling fast, secure, and gasless
              smart wallet experiences.
            </p>
            <p>
              Developers can integrate fully non-custodial wallets into any application — without
              blockchain complexity, seed phrases, or onboarding friction.
            </p>
          </div>
        </header>
      </AnimatedSection>

      {/* Why Trilema */}
      <AnimatedSection delay={0.1}>
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-10">
          <h2 className="text-xl font-semibold md:text-2xl">Why Trilema?</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {WHY_TRILEMA.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-gray-200 md:text-base"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </AnimatedSection>

      {/* Recognition */}
      <AnimatedSection delay={0.2}>
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 md:p-10">
          <h2 className="text-xl font-semibold md:text-2xl">
            Recognized as One of the Top Emerging Web3 Startups
          </h2>
          <p className="text-gray-300">
            Trilema is rapidly gaining recognition in the global Web3 ecosystem.
          </p>
          <p className="text-gray-300">
            We were selected among the Top 50 startups showcased at İTÜ Big Bang, one of the
            region’s biggest entrepreneurship events.
          </p>
          <p className="text-gray-300">
            We are also taking the stage at the Take Off Innovation Summit and have been accepted
            into the Finext Acceleration Program, validating both our technology and vision.
          </p>
          <p className="text-gray-300">
            As we scale our infrastructure and expand our partnerships, we are actively seeking POC
            collaborations with fintechs, Web3 platforms, enterprise teams, and ecosystem partners
            looking to deliver next-generation smart wallet experiences.
          </p>
        </section>
      </AnimatedSection>

      {/* Security */}
      <AnimatedSection delay={0.3}>
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold md:text-2xl">Secure by Design</h2>
            <p className="text-gray-300">
              Trilema is built on a modern, self-custodial security architecture powered by ERC-4337
              smart accounts, ensuring users maintain full control of their assets at all times.
            </p>
            <p className="text-gray-300">Our security model includes:</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {SECURITY_POINTS.map((point) => (
              <article
                key={point.title}
                className="rounded-2xl border border-white/10 bg-black/40 p-5"
              >
                <h3 className="text-sm font-semibold md:text-base">{point.title}</h3>
                <p className="mt-2 text-sm text-gray-300">{point.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-400 md:text-base">
            This layered approach ensures every wallet interaction is protected, verifiable, and
            entirely owned by the user.
          </p>
        </section>
      </AnimatedSection>

      {/* Networks & Developer Experience */}
      <AnimatedSection delay={0.4}>
        <section className="mx-auto grid w-full max-w-5xl gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[rgba(167,232,136,0.08)] to-transparent p-6 md:p-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold md:text-2xl">Powered by the Best Ethereum L2s</h2>
            <p className="text-gray-300">Trilema currently supports:</p>
            <ul className="space-y-2 text-lg font-medium text-[rgba(167,232,136,0.9)]">
              {NETWORKS.map((network) => (
                <li key={network}>{network}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-400">
              Additional EVM-compatible networks will be added soon.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold md:text-2xl">
              Seamless Integration for Developers
            </h2>
            <ul className="grid gap-3 text-sm text-gray-300 md:text-base">
              {DEV_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </AnimatedSection>

      {/* Closing */}
      <AnimatedSection delay={0.5}>
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 rounded-3xl border border-white/10 bg-transparent p-6 text-center md:p-10">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Build Next-Gen Wallet Experiences
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-300 md:text-lg">
            From DeFi and NFT marketplaces to fintech applications, GameFi, and enterprise solutions,
            Trilema empowers products to deliver secure, scalable, user-friendly smart wallets with
            minimal development effort — while keeping users fully in control.
          </p>
        </section>
      </AnimatedSection>
    </section>
  );
};

export default LearnMorePage;


