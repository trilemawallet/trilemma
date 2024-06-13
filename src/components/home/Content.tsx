"use client";

import Marquee from "@/components/home/Marquee";
import World from "@/components/home/World";
import Presentation from "@/components/Presentation";
import useIsomorphicLayoutEffect from "@/components/useIsomorphicLayoutEffect";
import { email } from "@/content/social-links";
import { gsap } from "@/lib/gsap";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const Content = () => {
  const scope = useRef<HTMLDivElement>(null);

  const presentation = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!presentation.current) return;

    const timeline = gsap.timeline({
      paused: true,
      ease: "none",
    });

    timeline
      .to(".gsap-text", {
        opacity: 1,
        stagger: 0.3,
        delay: 0.4,
        scrambleText: "{original}",
      })
      .to(".gsap-text", { opacity: 0, duration: 0, stagger: 0.15 })
      .to(".gsap-yuri", { opacity: 1, scrambleText: "{original}" })
      .to(".gsap-yuri", { scrambleText: "6666 66666", delay: 0.4 })
      .to(".gsap-yuri", { yPercent: -100, ease: "EASE_2" })
      .to(
        presentation.current,
        {
          yPercent: -100,
          delay: 0.4,
          ease: "EASE_2",
          duration: 1.4,
        },
        "<-1"
      )
      .fromTo(
        content.current,
        { yPercent: 50 },
        { yPercent: 0, ease: "EASE_2", duration: 1.4 },
        "<"
      );
    timeline.play().then(() => {
      scope.current?.removeChild(presentation.current!);
    });

    return () => {
      timeline.revert();
    };
  }, []);

  return (
    <section ref={scope} className="flex h-full w-full justify-center">
      <Presentation ref={presentation} />
      <motion.div
        ref={content}
        className="relative grid h-full w-full place-content-center"
      >
        <div className="absolute left-1/2 top-1/2 h-full max-h-[calc(100%-80px)] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 ">
          <World />
        </div>
        <div className="pointer-events-none m-2.5 flex w-fit flex-col uppercase text-foreground text-white mix-blend-screen *:flex *:justify-between [&>div:last-child]:mt-10">
          <div>
            <p></p>
            <p>{new Date().getFullYear()}</p>
          </div>
          <p className="text-justify">
            We are a WEB3 development team based in Turkey.
          </p>
          <div className="items-baseline text-nowrap">
            <div className="pointer-events-auto flex w-full justify-between sm:justify-normal hover:[&>:not(span)]:underline">
              <Link href="/about">About</Link>
              <span className="hidden sm:inline">,</span>{" "}
              <a href={email}>Contact</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 flex w-36 -translate-x-1/2 overflow-hidden uppercase">
          <Marquee aria-hidden />
        </div>
      </motion.div>
    </section>
  );
};

export default Content;
