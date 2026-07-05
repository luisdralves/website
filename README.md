# luisdralves.dev

Despite immensely enjoying thinking about and implementing ideas and personal projects, my personal website had been stale since university. That's what this iteration was born out of, with some of the things I picked up along the way.

## Stack

- Next.js 16 (RSC-first)
- motion.dev
- Tailwind CSS 4
- better-sqlite3
- Biome

## Environment

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `RATE_MY_SHOTS_URL` | Base URL of the rate-my-shots instance that feeds the photography section (photos, thumbnails, and EXIF) |
| `HOST_PORT` | Host port the app is published on (default `3000`) |
| `DATA_DIR` | Host directory bind-mounted to `/app/data`, where the SQLite counter DB lives (default `./data`) |

## Development

```bash
bun install
bun dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Development server (Turbopack) |
| `bun build` | Production build |
| `bun start` | Production server |
| `bun lint` | Biome checks |
| `bun format` | Biome formatting |
