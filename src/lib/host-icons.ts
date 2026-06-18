import type { FC, SVGProps } from "react";
import DocumentIcon from "@/components/icons/document.svg";
import GiteaIcon from "@/components/icons/gitea.svg";
import GitHubIcon from "@/components/icons/github.svg";
import SourceIcon from "@/components/icons/source.svg";

type IconProps = SVGProps<SVGSVGElement>;

const hostRules: { match: (hostname: string) => boolean; name: string; Icon: FC<IconProps> }[] = [
  {
    match: (h) => h === "github.com" || h.endsWith(".github.com"),
    name: "GitHub",
    Icon: GitHubIcon,
  },
  { match: (h) => h.includes("gitea"), name: "Gitea", Icon: GiteaIcon },
];

export type HostInfo = {
  name: string;
  Icon: FC<IconProps>;
};

export const resolveHost = (url: string): HostInfo => {
  if (url.toLowerCase().endsWith(".pdf")) {
    return { name: "Document", Icon: DocumentIcon };
  }

  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return { name: "Source", Icon: SourceIcon };
  }
  const rule = hostRules.find((r) => r.match(hostname));
  return rule ? { name: rule.name, Icon: rule.Icon } : { name: "Source", Icon: SourceIcon };
};
