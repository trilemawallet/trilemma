import { FC, HTMLAttributes, ReactNode } from "react";

export const MARQUEE =
  "Trilemma is an open source development team based in Turkey, We work on WEB3 projects";

interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  nodes?: ReactNode;
  quantity?: number;
  faster?: boolean;
}

const Marquee: FC<MarqueeProps> = ({
  nodes = MARQUEE,
  quantity = 2,
  faster,
}) => {
  return [...Array(quantity)].map((_, i) => (
    <div
      key={i}
      className={`${faster ? "animate-slider-6" : "animate-slider px-1"}`}
    >
      <span className="flex w-max gap-5">{nodes}</span>
    </div>
  ));
};

export default Marquee;
