FROM node:24-slim AS deps

WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM deps AS builder

COPY tsconfig.json vite.config.ts eslint.config.js ./
COPY assets ./assets
COPY src ./src

RUN pnpm build
RUN pnpm prune --prod

FROM node:24-slim AS runner

RUN apt-get update \
  && apt-get install -y --no-install-recommends cups-client \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs --create-home printblocks

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder --chown=printblocks:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=printblocks:nodejs /app/assets ./assets
COPY --from=builder --chown=printblocks:nodejs /app/dist ./dist
COPY --from=builder --chown=printblocks:nodejs /app/package.json ./package.json

USER printblocks

EXPOSE 3000

CMD ["node", "dist/index.js"]
