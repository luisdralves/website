export type FooterContent = {
  socialLinks: {
    platform: string;
    url: string;
  }[];
  counterPrompt: string;
  rateLimitMessage: string;
  errorMessage: string;
};

export const footer = {
  socialLinks: [
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
  ],
  counterPrompt: "Please kindly increase the counter before you leave.",
  rateLimitMessage: "Slow down there, speedster.",
  errorMessage: "Counter is taking a nap.",
} as const satisfies FooterContent;
