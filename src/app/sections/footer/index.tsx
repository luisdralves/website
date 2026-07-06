import { GeometricElement } from "@/app/sections/landing/geometric-element";
import { ExternalLink } from "@/components/external-link";
import { footer } from "@/content/footer";
import { person } from "@/content/person";
import { SITE_CREATED, SITE_REPO } from "@/content/site";
import { Counter } from "./counter";
import { SocialLinks } from "./social-links";

const yearLabel = () => {
  const created = new Date(SITE_CREATED).getUTCFullYear();
  const current = new Date().getUTCFullYear();
  return current > created ? `${created}-${current}` : `${created}`;
};

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
      <p className="font-body text-foreground/40 text-xs tracking-wide">
        {"🄯"} {yearLabel()} {person.name}
        <span className="mx-1.5 text-foreground/25">·</span>
        <ExternalLink href={SITE_REPO}>
          <span>Source</span>
        </ExternalLink>
      </p>
      <div className="-translate-y-1/2 pointer-events-none absolute inset-x-0 top-1/2 opacity-30">
        <GeometricElement wrapperHeight="80px" canvasHeight="35vh" />
      </div>
    </footer>
  );
};
