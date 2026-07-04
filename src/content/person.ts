export type PersonContent = {
  name: string;
  alternateName: string;
  givenName: string;
  familyName: string;
  jobTitle: string;
  email: string;
  image: string;
  /** BCP-47 language tags, most to least proficient. */
  knowsLanguage: readonly string[];
  knowsAbout: readonly string[];
  nationality: string;
  homeLocation: {
    locality: string;
    /** ISO 3166-1 alpha-2 country code. */
    countryCode: string;
  };
  worksFor: {
    name: string;
    url: string;
    sameAs: readonly string[];
  };
  alumnusOf: {
    name: string;
    alternateName: string;
    url: string;
    sameAs: readonly string[];
    parentOrganization: {
      name: string;
      url: string;
      sameAs: readonly string[];
    };
  };
  memberOf: {
    name: string;
    alternateName: string;
    url: string;
    role: string;
    sameAs: readonly string[];
  };
};

export const person = {
  name: "Luís Alves",
  alternateName: "luisdralves",
  givenName: "Luís",
  familyName: "Alves",
  jobTitle: "Senior Frontend Engineer",
  email: "hello@luisdralves.dev",
  image: "https://avatars.githubusercontent.com/u/22676183?s=460",
  knowsLanguage: ["pt", "en", "nl"],
  knowsAbout: [
    "Frontend engineering",
    "TypeScript",
    "JavaScript",
    "Rust",
    "Python",
    "React",
    "Next.js",
    "React Native",
    "Svelte",
    "TanStack Query",
    "tRPC",
    "WebSockets",
    "Server-Sent Events",
    "Tailwind CSS",
    "CSS Modules",
    "styled-components",
    "Vite",
    "Bun",
    "Monorepo tooling",
    "WebGL",
    "GLSL shaders",
    "Three.js",
    "Canvas API",
    "Mapbox",
    "Directus",
    "Vitest",
    "Cypress",
    "Storybook",
    "PostgreSQL",
    "Redis",
    "SQLite",
    "Prisma",
    "Drizzle",
    "Docker",
    "Caddy",
    "Linux",
    "GitHub Actions",
    "Model Context Protocol",
    "Embeddings and vector search",
    "Web performance",
    "Self-hosting",
  ],
  nationality: "Portugal",
  homeLocation: {
    locality: "Viana do Castelo",
    countryCode: "PT",
  },
  worksFor: {
    name: "Untile",
    url: "https://untile.pt",
    sameAs: [
      "https://www.linkedin.com/company/untiledigital/",
      "https://github.com/untile",
      "https://www.instagram.com/untile.digital/",
    ],
  },
  alumnusOf: {
    name: "Faculty of Engineering of the University of Porto",
    alternateName: "FEUP",
    url: "https://fe.up.pt",
    sameAs: [
      "https://www.wikidata.org/wiki/Q5428834",
      "https://www.linkedin.com/school/feup/",
      "https://www.instagram.com/feup_porto/",
    ],
    parentOrganization: {
      name: "University of Porto",
      url: "https://www.up.pt",
      sameAs: [
        "https://en.wikipedia.org/wiki/University_of_Porto",
        "https://www.wikidata.org/wiki/Q209842",
      ],
    },
  },
  memberOf: {
    name: "Associação Juvenil de Deão",
    alternateName: "AJD",
    url: "https://ajdeao.pt",
    role: "President",
    sameAs: [
      "https://www.linkedin.com/company/associacao-juvenil-de-deao",
      "https://www.instagram.com/ajdeao",
      "https://www.facebook.com/assocjuvenildeao",
    ],
  },
} as const satisfies PersonContent;
