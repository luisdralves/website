export type TechEntry = {
  label: string;
  url: string;
};

export const techRegistry: Record<string, TechEntry> = {
  TypeScript: { label: "TypeScript", url: "https://www.typescriptlang.org/" },
  React: { label: "React", url: "https://react.dev/" },
  Vite: { label: "Vite", url: "https://vitejs.dev/" },
  Bun: { label: "Bun", url: "https://bun.sh/" },
  Elysia: { label: "Elysia", url: "https://elysiajs.com/" },
  Rust: { label: "Rust", url: "https://www.rust-lang.org/" },
  GLSL: {
    label: "GLSL",
    url: "https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)",
  },
  WebGL: { label: "WebGL", url: "https://www.khronos.org/webgl/" },
  WebSockets: {
    label: "WebSockets",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
  },
  Canvas: {
    label: "Canvas",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
  },
  SQLite: { label: "SQLite", url: "https://www.sqlite.org/" },
  Mapbox: { label: "Mapbox", url: "https://www.mapbox.com/" },
  "Three.js": { label: "Three.js", url: "https://threejs.org/" },
  R3F: { label: "R3F", url: "https://r3f.docs.pmnd.rs/" },
  Docker: { label: "Docker", url: "https://www.docker.com/" },
  Caddy: { label: "Caddy", url: "https://caddyserver.com/" },
  Linux: { label: "Linux", url: "https://www.kernel.org/" },
};

export const getTechEntry = (key: string): { label: string; url?: string } =>
  techRegistry[key] ?? { label: key };
