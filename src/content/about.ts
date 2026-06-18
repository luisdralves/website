export type AboutContent = {
  builderPhrase: {
    prefix: string;
    suffixes: readonly string[];
  };
  personalFacts: readonly {
    label: string;
    value: string;
  }[];
  transitionalStatement: string;
};

export const about = {
  builderPhrase: {
    prefix: "Building",
    suffixes: [
      " systems that connect",
      " to preserve",
      " new ways to see familiar things",
      " community",
      " understanding",
      " a bloated sense of self-importance",
    ],
  },
  personalFacts: [
    {
      label: "Based in",
      value: "Viana do Castelo, Portugal. Looking to relocate.",
    },
    {
      label: "Internationally known",
      value: "Volunteered in rural Bulgaria, until COVID interrupted me",
    },
    {
      label: "NGO",
      value: "President of a youth organization",
    },
    {
      label: "Soapbox",
      value: "Cities would be better with fewer cars and more transit",
    },
    {
      label: "Languages",
      value: "🇵🇹 Portuguese (native), 🇬🇧 English (fluent), 🇳🇱 Dutch (learning)",
    },
    {
      label: "Off the clock",
      value: "Board games, hiking, photography",
    },
  ],
  transitionalStatement: "Easier to show than tell.",
} as const satisfies AboutContent;
