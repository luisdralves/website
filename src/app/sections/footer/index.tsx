import { GeometricElement } from "@/app/sections/landing/geometric-element";
import { footer } from "@/content/footer";
import { Counter } from "./counter";
import { SocialLinks } from "./social-links";

export const Footer = () => {
  return (
    <footer
      id="footer"
      className="relative flex flex-col items-center gap-16 px-8 pt-24 pb-12 md:px-16 lg:px-24"
    >
      <Counter />
      <div className="flex flex-col items-center gap-5">
        <p className="font-heading text-foreground/70 text-xl">{footer.contactPrompt}</p>
        <SocialLinks links={footer.socialLinks} />
      </div>
      <div className="-translate-y-1/2 pointer-events-none absolute inset-x-0 top-1/2 opacity-30">
        <GeometricElement wrapperHeight="80px" canvasHeight="35vh" />
      </div>
    </footer>
  );
};
