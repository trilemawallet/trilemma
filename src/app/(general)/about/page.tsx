import Marquee from "@/components/home/Marquee";
import SmoothScroll from "@/components/SmoothScroll";
import { Separator } from "@/components/ui/separator";
import { technologies } from "@/content/about-tech";
import { email } from "@/content/social-links";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

const page = () => {
  return (
    <section className="container flex flex-col items-center justify-center gap-20 overflow-hidden md:gap-40">
      <SmoothScroll />
      <section className="relative grid h-[70dvh] place-content-center text-center  uppercase">
        <div className=" absolute inset-0 left-1/2 top-1/2 z-10 aspect-square w-3/6 max-w-md -translate-x-1/2 -translate-y-1/2 bg-green-300"></div>
        <h1 className="relative z-20 mt-64 text-[clamp(32px,16vw,128px)] leading-none">
          Trilemma Team
        </h1>
        <p className="relative z-20">
          <span className="italic">(</span>Open Source WEB3 Development Team
          <span className="italic">)</span>
        </p>
      </section>
      <section className="flex flex-col gap-5 text-justify text-xl md:text-2xl xl:text-3xl">
        <h1 className="before:mr-3 before:text-base before:italic before:text-muted-foreground before:content-['(who_we_are)'] md:before:mr-6">
          We&apos;re{" "}
          <span className="text-primary">
            open source WEB3 development team
          </span>{" "}
          based in Turkey. We&apos;re passionate about creating Open Source
          projects that are useful for everyone.
        </h1>

        <h1 className="before:mr-3 before:text-base before:italic before:text-muted-foreground before:content-['(our_background)'] md:before:mr-6">
          The two founding members of our team,{" "}
          <Link
            href="https://www.linkedin.com/in/alperen-bekci//"
            className="text-primary"
          >
            Alperen Bekçi
          </Link>{" "}
          and{" "}
          <Link
            href="https://www.linkedin.com/in/murathan-kagan/"
            className="text-primary"
          >
            Murathan Kagan Bayram
          </Link>{" "}
          worked together in the{" "}
          <Link href="https://trioblockchainlabs.com/" className="text-primary">
            Trio Blockchain Labs
          </Link>{" "}
          hackathon team and gained experience and degrees by participating in
          WEB3 hackathons with open source projects. After increasing their
          experience in this field, they established the Trilemma team to
          develop their own initiatives and applications. Currently, our team is
          working on various projects, especially the Trilemma wallet, and they
          are especially working on the user experience to make WEB3 available
          to everyone.
        </h1>
        <section className="w-full space-y-3 uppercase">
          <div className="group relative h-[clamp(380px,60vw,620px)] w-full saturate-[0.25]">
            <div className="absolute inset-0 z-40 grid place-content-center bg-background/50 font-bold opacity-0 transition-opacity group-hover:opacity-100">
              (our team)
            </div>
            <Image
              className="object-cover"
              src="/team.JPG"
              alt="Screenshot of my work"
              priority
              fill
            />
          </div>
        </section>
        <h1 className="before:mr-3 before:text-base before:italic before:text-muted-foreground before:content-['(goals)'] md:before:mr-6">
          Our goal is to create a community of developers who are passionate
          about Open Source projects and We aim to make WEB3 easier for
          individuals of all ages to use and increase the user experience.
        </h1>
      </section>
      <section className="w-full space-y-5 uppercase">
        <h1>
          <span className="italic">(</span>Technologies we use
          <span className="italic">)</span>
        </h1>
        <ul className="text-xs sm:text-base md:text-lg">
          {technologies.map((items, i) => (
            <li key={`line${i}`}>
              <Separator />
              <div className="flex flex-wrap py-1 md:py-2">
                {items.map((technology, j) => (
                  <span
                    key={`tech${j}`}
                    className="w-[clamp(100px,25vw,300px)]"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </li>
          ))}
          <Separator />
        </ul>
      </section>
      <h1 className="relative  text-[clamp(24px,20vw,48px)] leading-none">
        OUR PROJECTS
      </h1>
      <section className="w-full space-y-1 uppercase">
        <Link href="https://github.com/alperenbekci">
          <p className="text-justify before:mr-3 before:italic before:text-muted-foreground before:content-['(...)'] md:before:mr-6">
            TRILEMMA WALLET is a smart wallet application that allows users to
            carry out their transactions with a comfortable UX.
          </p>
          <div className="group relative h-[clamp(112px,40vw,320px)] w-full saturate-[0.25]">
            <div className="absolute inset-0 z-40 grid place-content-center bg-background/50 font-bold opacity-0 transition-opacity group-hover:opacity-100">
              (DEVELOPMENT IN PROGRESS, FOLLOW US!)
            </div>

            <Image
              className="object-cover"
              src="/wallet.png"
              alt="Screenshot of my work"
              priority
              fill
            />
          </div>
        </Link>
      </section>
      <section className="w-full space-y-5 uppercase">
        <Link href="https://github.com/alperenbekci/tvote-app">
          <p className="text-justify before:mr-3 before:italic before:text-muted-foreground before:content-['(...)'] md:before:mr-6">
            T-VOTE DAO allows users to vote in an equitable manner
          </p>
          <div className="group relative h-[clamp(112px,40vw,320px)] w-full saturate-[0.25]">
            <div className=" absolute inset-0 z-40 grid place-content-center bg-background/50 font-black opacity-0 transition-opacity group-hover:opacity-100">
              T-VOTE DAO
            </div>
            <Image
              className="object-cover"
              src="/tvote.png"
              alt="Screenshot of my work"
              priority
              fill
            />
          </div>
        </Link>
      </section>
      <section className="w-full space-y-5 uppercase">
        <Link href="https://github.com/alperenbekci/anadolu-sigorta">
          <p className="text-justify before:mr-3 before:italic before:text-muted-foreground before:content-['(...)'] md:before:mr-6">
            ANADOLU SIGORTA SADAKAT PROGRAMI is a platform that provides
            customer loyalty in the insurance industry to its users with native
            token.
          </p>
          <div className="group relative h-[clamp(112px,40vw,320px)] w-full saturate-[0.25]">
            <div className="absolute inset-0 z-40 grid place-content-center bg-background/50 font-black opacity-0 transition-opacity group-hover:opacity-100">
              ANADOLU SIGORTA SADAKAT PROGRAMI
            </div>
            <Image
              className="object-cover"
              src="/anadolu.png"
              alt="Screenshot of my work"
              priority
              fill
            />
          </div>
        </Link>
      </section>{" "}
      <section className="w-full space-y-1 uppercase">
        <Link href="https://github.com/alperenbekci/borusan-otomotiv-aibot">
          <p className="text-justify before:mr-3 before:italic before:text-muted-foreground before:content-['(...)'] md:before:mr-6">
            BORUSAN OTOMATİV AİBOT is a helpful artificial intelligence
            assistant developed for Borusan Automotive.
          </p>
          <div className="group relative h-[clamp(112px,40vw,320px)] w-full saturate-[0.25]">
            <div className="absolute inset-0 z-40  grid place-content-center bg-background/50 font-black opacity-0 transition-opacity group-hover:opacity-100">
              BORUSAN OTOMATİV AİBOT
            </div>
            <Image
              className="object-cover"
              src="/borusan.png"
              alt="Screenshot of my work"
              priority
              fill
            />
          </div>
        </Link>
      </section>
      <section className="w-full space-y-1 uppercase">
        <Link href="https://github.com/alperenbekci/ranval-eth">
          <p className="text-justify before:mr-3 before:italic before:text-muted-foreground before:content-['(...)'] md:before:mr-6">
            RANVAL-ETH AI APP is the second version of RANVAL (SOLANA). It
            allows users to create NFTs with artificial intelligence on the
            Ethereum network.
          </p>
          <div className="group relative h-[clamp(112px,40vw,320px)] w-full saturate-[0.25]">
            <div className="absolute inset-0  z-40 grid place-content-center bg-background/50 font-black opacity-0 transition-opacity group-hover:opacity-100">
              RANVAL-ETH AI APP
            </div>
            <Image
              className="object-cover"
              src="/ranval.png"
              alt="Screenshot of my work"
              priority
              fill
            />
          </div>
        </Link>
      </section>
      <section className="space-y- w-full uppercase">
        <Separator />
        <div className="flex w-full overflow-hidden text-base uppercase md:text-2xl">
          <Marquee
            quantity={6}
            nodes={
              <>
                <p className="ml-5">Lets work together</p>
                <p>Contact US anytime</p>
                <a
                  href={email}
                  className="text-primary underline underline-offset-2"
                >
                  trilemmadev@gmail.com
                </a>
              </>
            }
          />
        </div>
        <Separator />
      </section>
      <footer className="mb-20 flex w-full flex-wrap items-center justify-center gap-2 text-center text-sm sm:justify-between [&_p]:uppercase">
        <a className="underline underline-offset-2" href={email}>
          trilemmadev@gmail.com
        </a>
        <p>Open Source WEB3 Projects for Everyone</p>
      </footer>
    </section>
  );
};

export default page;
