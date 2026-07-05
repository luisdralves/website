export type FooterContent = {
  socialLinks: {
    platform: string;
    url: string;
  }[];
  totalVisitsLabel: string;
  counterPrompt: string;
  contactPrompt: string;
  excessClickMessage: string;
  rateLimitMessage: string;
  errorMessage: string;
};

import { person } from "@/content/person";

export const footer = {
  socialLinks: [
    {
      platform: "Email",
      url: `mailto:${person.email}`,
    },
    {
      platform: "GitHub",
      url: "https://github.com/luisdralves",
    },
    {
      platform: "Gitea",
      url: "https://gitea.luisdralves.dev/luis",
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/luisdralves",
    },
    {
      platform: "CV",
      url: "/luisdralves-cv.pdf",
    },
  ],
  totalVisitsLabel: "Total visits:",
  counterPrompt: "Please kindly increase the counter before you leave.",
  contactPrompt: "Say hello.",
  excessClickMessage: "Please don't increase it too much.",
  rateLimitMessage: "Slow down there, speedster.",
  errorMessage: "Counter is taking a nap.",
} as const satisfies FooterContent;
