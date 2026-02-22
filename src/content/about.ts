export type AboutContent = {
  builderPhrases: string[];
  personalFacts: {
    label: string;
    value: string;
  }[];
  transitionalStatement: string;
};

export const about = {
  builderPhrases: [
    "Building systems that connect",
    "Building to preserve",
    "Building new ways to see familiar things",
    "Building community",
    "Building understanding",
    "Building a bloated sense of self-importance",
  ],
  personalFacts: [
    {
      label: "Location",
      value: "Viana do Castelo, Portugal",
    },
    {
      label: "Homelab",
      value: "15+ services on hardware I control",
    },
    {
      label: "Side project",
      value: "Cataloguing my father's coin collection in 3D",
    },
    {
      label: "Non-profit",
      value: "President of a youth organization",
    },
    {
      label: "Languages",
      value: "Portuguese (native), English (fluent), Dutch (WIP)",
    },
  ],
  transitionalStatement: "Easier to show than tell.",
} as const satisfies AboutContent;
