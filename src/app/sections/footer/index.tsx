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
      <SocialLinks links={footer.socialLinks} />
      <div className="pointer-events-none w-full opacity-30">
        <GeometricElement wrapperHeight="80px" canvasHeight="35vh" />
      </div>
    </footer>
  );
};
