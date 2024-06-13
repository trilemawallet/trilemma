import { forwardRef } from "react";

const Presentation = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[999] grid select-none place-content-center overflow-hidden bg-foreground text-center uppercase text-background [&_p]:opacity-0"
    >
      <p className="gsap-text">Open Source</p>
      <p className="gsap-text">WEB33 Projects</p>
      <p className="gsap-text">for Everyone</p>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <p className="gsap-yuri relative">Trilemma</p>
      </div>
    </div>
  );
});
Presentation.displayName = "Presentation";

export default Presentation;
