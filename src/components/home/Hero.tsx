"use client";

import Image from "next/image";
import { FC } from "react";

interface HeroProps {}

const Hero: FC<HeroProps> = ({}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 lg:px-8 overflow-hidden">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgba(167,232,136,0.1)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgba(167,232,136,0.05)] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1600px] mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center">
          {/* Left Content */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8 lg:pl-12">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-[rgba(167,232,136,1)] to-[rgba(167,232,136,0.8)] bg-clip-text text-transparent">
                Self-Custodial Web3
              </span>
              <br />
              <span className="text-white">Wallet Infrastructure</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
              Integrate ERC-4337 smart accounts seamlessly. Offer users a
              self-custodial experience while maintaining full control and
              scalability.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button className="group relative px-8 py-4 bg-[rgba(167,232,136,1)] text-[rgba(23,23,23,1)] font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[rgba(167,232,136,0.3)]">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
              <button className="px-8 py-4 border-2 border-[rgba(167,232,136,1)] text-[rgba(167,232,136,1)] font-semibold rounded-lg transition-all duration-300 hover:bg-[rgba(167,232,136,0.1)] hover:scale-105">
                Learn More
              </button>
            </div>

            {/* Stats or Features */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-[rgba(167,232,136,0.2)]">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[rgba(167,232,136,1)]">
                  100%
                </div>
                <div className="text-sm text-gray-400 mt-1">Self-Custodial</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[rgba(167,232,136,1)]">
                  ERC-4337
                </div>
                <div className="text-sm text-gray-400 mt-1">Compatible</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[rgba(167,232,136,1)]">
                  ∞
                </div>
                <div className="text-sm text-gray-400 mt-1">Scalable</div>
              </div>
            </div>
          </div>

          {/* Right Content - SDK Image */}
          <div className="lg:col-span-7 relative flex items-start justify-center lg:justify-end lg:-mt-20">
            <div className="relative w-full max-w-4xl">
              {/* Glow Effect Behind Image */}
              <div className="absolute inset-0 bg-[rgba(167,232,136,0.15)] blur-3xl rounded-full"></div>
              
              {/* SDK Image */}
              <div className="relative animate-float">
                <Image
                  src="/trilema-sdk.svg"
                  alt="Trilema SDK Interface"
                  width={1200}
                  height={900}
                  className="w-full h-auto drop-shadow-2xl scale-110 lg:scale-125"
                  priority
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-[rgba(167,232,136,0.3)] rounded-lg rotate-12 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 border-2 border-[rgba(167,232,136,0.3)] rounded-lg -rotate-12 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[rgba(167,232,136,0.5)] rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2 bg-[rgba(167,232,136,1)] rounded-full animate-scroll"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(12px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;

