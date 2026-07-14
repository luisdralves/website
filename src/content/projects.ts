export type ProjectMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt: string }
  | {
      type: "iframe";
      src: string;
      alt: string;
      aspectRatio?: number;
      /**
       * When set, render the iframe at this CSS pixel width (with height derived from
       * aspectRatio, defaulting to 16/10 to match the showcase frame) and scale it down via
       * a CSS transform so the embedded page sees a "desktop-sized" viewport.
       */
      simulatedWidth?: number;
    };

export type ProjectSource = {
  url: string;
  label?: string;
};

export type Project = {
  name: string;
  hook: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  os?: string;
  sources?: ProjectSource[];
  media: ProjectMedia[];
  /** OKLCH "L C H" triplet (space-separated, no parentheses). Bound as --project-accent. */
  accent: string;
};

export const giteaProfileUrl = "https://gitea.luisdralves.dev/luis" as const;
export const githubProfileUrl = "https://github.com/luisdralves" as const;

export const projects = [
  {
    name: "clocks",
    hook: "Time doesn't have to be a circle.",
    description:
      "A collection of alternative clocks that challenge how we visualize time. Some are practical, some aren't, but they all toy with convention.",
    techStack: ["TypeScript", "Vite", "WebGL", "GLSL"],
    liveUrl: "https://clocks.luisdralves.dev",
    sources: [{ url: "https://gitea.luisdralves.dev/luis/clocks" }],
    media: [
      {
        type: "iframe",
        src: "https://clocks.luisdralves.dev/wall-o-clocks/",
        alt: "Wall o'Clocks",
      },
      { type: "iframe", src: "https://clocks.luisdralves.dev/spiral/", alt: "Spiral Clock" },
      {
        type: "iframe",
        src: "https://clocks.luisdralves.dev/precalculated-grid/",
        alt: "Precalculated Grid",
      },
    ],
    accent: "0.75 0.14 340",
  },
  {
    name: "drosterizer",
    hook: "Now everyone can have a cool profile pic like me",
    description:
      'Add recursion to your photos! Simply draw a "hole" around an object or region and watch your photo fold in on itself, infinitely. All processing happens locally via WebGL shaders, nothing leaves your browser.',
    techStack: ["React", "TypeScript", "WebGL", "GLSL"],
    liveUrl: "https://drosterizer.luisdralves.dev",
    sources: [{ url: "https://gitea.luisdralves.dev/luis/drosterizer" }],
    media: [
      {
        type: "image",
        src: "/images/projects/drosterizer/mask.png",
        alt: "Drawing a mask on a photo",
      },
      {
        type: "image",
        src: "/images/projects/drosterizer/effect.png",
        alt: "The resulting effect",
      },
    ],
    accent: "0.58 0.19 300",
  },
  {
    name: "coins-catalogue",
    hook: "A physical collection, rendered in physics.",
    description:
      "Cataloguing my father's coin collection in 3D, built from Numista data and assets. Browse by country, inspect coins in a showcase, or watch a set tumble into a pile.",
    techStack: ["React", "TypeScript", "Three.js", "R3F"],
    liveUrl: "https://coins.luisdralves.dev",
    sources: [{ url: "https://gitea.luisdralves.dev/luis/coins" }],
    media: [
      {
        type: "iframe",
        src: "https://coins.luisdralves.dev/",
        alt: "Index by country, with coins falling in the background",
        simulatedWidth: 1920,
      },
      {
        type: "iframe",
        src: "https://coins.luisdralves.dev/pile?countries=royaume-uni",
        alt: "A pile of coins on a surface",
      },
    ],
    accent: "0.78 0.13 90",
  },
  {
    name: "fizalgo",
    hook: "Bring the receipts to your next argument.",
    description:
      "A household chore tracker with a bit of gamification. Log who did what, when, and with how much effort. Each finished task earns XP and drops down a queue that ranks chores by urgency. Track your XP over time.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle"],
    liveUrl: "https://fizalgo.luisdralves.dev",
    sources: [{ url: "https://gitea.luisdralves.dev/luis/fizalgo" }],
    media: [
      {
        type: "image",
        src: "/images/projects/fizalgo/stats.png",
        alt: "Per-person XP, an evolution chart, and recent history",
      },
      {
        type: "image",
        src: "/images/projects/fizalgo/next.png",
        alt: "The ranked queue of due tasks",
      },
      {
        type: "image",
        src: "/images/projects/fizalgo/register.png",
        alt: "Logging a session: who did it, when, and which tasks",
      },
    ],
    accent: "0.72 0.11 142",
  },
  {
    name: "places-ive-been-in",
    hook: "Putting memories on the map",
    description:
      "I've been known to indulge in retrospection and melancholy from time to time. I like to keep track of where I've been and look back.",
    techStack: ["React", "TypeScript", "Mapbox", "Vite"],
    liveUrl: "https://places-ive-been-in.luisdralves.dev",
    sources: [{ url: "https://gitea.luisdralves.dev/luis/places-ive-been-in" }],
    media: [
      {
        type: "image",
        src: "/images/projects/places-ive-been-in/overview.png",
        alt: "Locations without clustering",
      },
      {
        type: "image",
        src: "/images/projects/places-ive-been-in/carousel.png",
        alt: "The carousel on a location",
      },
    ],
    accent: "0.70 0.16 246",
  },
  {
    name: "todo3",
    hook: "TUI aesthetics and real-time",
    description:
      "Just another todo app. This one mimics a terminal interface and is collaborative in real-time. Everything over WebSockets, even auth.",
    techStack: ["React", "Elysia", "Bun", "SQLite", "WebSockets"],
    liveUrl: "https://todo3.luisdralves.dev",
    sources: [{ url: "https://gitea.luisdralves.dev/luis/todo3" }],
    media: [
      { type: "image", src: "/images/projects/todo3/lists.png", alt: "Todo lists with items" },
    ],
    accent: "0.78 0.18 145",
  },
  {
    name: "sysmon-web",
    hook: "System monitor on the web",
    description:
      "A system monitor that reads metrics with Rust and renders them on HTML canvas. CPU, memory, disk, network, all updating in real-time with a persistent window so that the charts are populated on first load. This one uses simple polling instead of WebSockets or SSEs though.",
    techStack: ["TypeScript", "Rust", "React", "Canvas"],
    liveUrl: "https://sysmon.luisdralves.dev",
    sources: [{ url: "https://gitea.luisdralves.dev/luis/sysmon-web" }],
    media: [
      {
        type: "iframe",
        src: "https://sysmon.luisdralves.dev",
        alt: "sysmon-web dashboard",
        simulatedWidth: 1920,
      },
    ],
    accent: "0.72 0.10 219",
  },
  {
    name: "homelab",
    hook: "It outgrew its own case.",
    description:
      "15+ services on hardware I own, behind a reverse proxy. Email, photos, code, media, dashboards, personal projects. A repurposed gaming desktop that ran out of room in two different ways: no free space left on its disks and no free bays left inside the case. Shown here mid-upgrade. Don't worry about the cables, they don't look like this now :)",
    techStack: ["Linux", "Docker", "Caddy"],
    os: "Linux",
    media: [
      {
        type: "image",
        src: "/images/projects/homelab/dissection.jpg",
        alt: "The server with its side panel off, an external drive cage wired in beside it",
      },
    ],
    accent: "0.65 0.18 18",
  },
] as const satisfies Project[];
