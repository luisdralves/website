import type { AnchorHTMLAttributes, ReactNode } from "react";
import ArrowUpRight from "@/components/icons/arrow-up-right.svg";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
} & Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick">;

export const ExternalLink = ({ href, children, className, onClick }: ExternalLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer noopener"
    onClick={onClick}
    className={`group inline-flex items-center gap-1.5 transition-colors hover:text-accent-cyan${
      className ? ` ${className}` : ""
    }`}
  >
    {children}
    <ArrowUpRight className="group-hover:-translate-y-0.5 size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
  </a>
);
