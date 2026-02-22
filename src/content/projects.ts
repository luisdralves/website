export type Project = {
  name: string;
  hook: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  giteaUrl: string;
  images: {
    src: string;
    alt: string;
  }[];
};

export const projects = [
  {
    name: "clocks",
    hook: "Time doesn't have to be a circle.",
    description:
      "A collection of alternative clocks that challenge how we visualize time. Varying degrees of practicality, but consistent subversion. The screenshots don't do them justice, see them in action.",
    techStack: ["TypeScript", "Vite", "GLSL"],
    liveUrl: "https://clocks.bate-estacas.xyz",
    giteaUrl: "https://gitea.bate-estacas.xyz/luis/clocks",
    images: [
      { src: "/images/projects/clocks/wall.png", alt: "Wall o'Clocks" },
      { src: "/images/projects/clocks/spiral.png", alt: "Spiral Clock" },
      { src: "/images/projects/clocks/lemniscate.png", alt: "Lemniscate Clock" },
    ],
  },
  {
    name: "drosterizer",
    hook: "Now everyone can have stylish profile pics like me",
    description:
      'Add recursion to your photos! Simply draw a "hole" around an object or region and watch your photo fold in on itself, infinitely. All processing happens locally via WebGL shaders, nothing leaves your browser.',
    techStack: ["React", "TypeScript", "WebGL", "GLSL"],
    liveUrl: "https://drosterizer.bate-estacas.xyz",
    giteaUrl: "https://gitea.bate-estacas.xyz/luis/drosterizer",
    images: [
      { src: "/images/projects/drosterizer/mask.png", alt: "Drawing a mask on a photo" },
      { src: "/images/projects/drosterizer/effect.png", alt: "The resulting effect" },
      { src: "/images/projects/drosterizer/params.png", alt: "Playing around with the parameters" },
    ],
  },
  {
    name: "todo3",
    hook: "TUI aesthetics and real-time",
    description:
      "Just another todo app. This one mimics a terminal interface and is collaborative in real-time. Everything over WebSockets, even auth.",
    techStack: ["React", "Elysia", "Bun", "SQLite", "WebSockets"],
    liveUrl: "https://todo3.bate-estacas.xyz",
    giteaUrl: "https://gitea.bate-estacas.xyz/luis/todo3",
    images: [{ src: "/images/projects/todo3/lists.png", alt: "Todo lists with items" }],
  },
  {
    name: "sysmon-web",
    hook: "System monitor on the web",
    description:
      "A system monitor that reads metrics with Rust and renders them on HTML canvas. CPU, memory, disk, network, all updating in real-time with a persistent window so that the charts are populated on first load. This one uses simple polling instead of WebSockets or SSEs though.",
    techStack: ["TypeScript", "Rust", "React", "Canvas"],
    liveUrl: "https://sysmon.bate-estacas.xyz",
    giteaUrl: "https://gitea.bate-estacas.xyz/luis/sysmon-web",
    images: [{ src: "/images/projects/sysmon/dashboard.png", alt: "sysmon-web dashboard" }],
  },
  {
    name: "places-ive-been-in",
    hook: "Putting memories on the map",
    description:
      "I've been known to indulge in retrospection and melancholy from time to time. I like to keep track of where I've been and look back.",
    techStack: ["React", "TypeScript", "Mapbox", "Vite"],
    liveUrl: "https://places-ive-been-in.bate-estacas.xyz",
    giteaUrl: "https://gitea.bate-estacas.xyz/luis/places-ive-been-in",
    images: [
      {
        src: "/images/projects/places-ive-been-in/overview.png",
        alt: "Locations without clustering",
      },
      {
        src: "/images/projects/places-ive-been-in/carousel.png",
        alt: "The carousel on a location",
      },
    ],
  },
] as const satisfies Project[];
