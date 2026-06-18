FROM oven/bun:1-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ nodejs npm
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
RUN npm rebuild better-sqlite3

FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG RATE_MY_SHOTS_URL
ENV RATE_MY_SHOTS_URL=$RATE_MY_SHOTS_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM oven/bun:1-alpine AS runner
WORKDIR /app
RUN apk add --no-cache nodejs
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
