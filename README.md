# luisdralves

Despite immensely enjoying thinking about and implementing ideas and personal projects, my personal website had been stale since university. That's what this iteration was born out of, with some of the things I picked up along the way.

## Stack

- Next.js 16 (RSC-first)
- motion.dev
- react-three-fiber
- Tailwind CSS 4
- better-sqlite3
- Biome

## Environment

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `IMMICH_API_URL` | Immich API base URL (e.g., `https://my.immich.app/api`) |
| `IMMICH_API_KEY` | API key with scopes: `album.read`, `asset.read`, `asset.download` |
| `IMMICH_ALBUM_ID` | UUID of the album to display in the photography section |

## Server Requirements

- [exiftool](https://exiftool.org/) (image metadata stripping)

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
