FROM oven/bun:1.2.22-alpine AS build
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

COPY tsconfig.json ./
COPY scripts ./scripts
COPY src ./src

RUN bun run build

FROM oven/bun:1.2.22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8083

RUN addgroup -S app && adduser -S app -G app

COPY --from=build --chown=app:app /app/package.json ./package.json
COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/dist ./dist
COPY --from=build --chown=app:app /app/src/db/seed/sql ./dist/db/seed/sql

RUN mkdir -p /app/uploads && chown app:app /app/uploads
VOLUME ["/app/uploads"]

USER app
EXPOSE 8083

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost:8083/api/health || exit 1

CMD ["bun", "dist/index.js"]
