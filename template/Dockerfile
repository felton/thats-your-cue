# syntax=docker/dockerfile:1

# corepack installs the pnpm version pinned in package.json's "packageManager".
# It's installed explicitly because Node 25+ no longer bundles it.
FROM node:24-alpine AS base
RUN npm install -g corepack@latest && corepack enable
WORKDIR /app

# All dependencies, for the build
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

# Production dependencies only, for the final image
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --store-dir /pnpm/store

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Runtime: no pnpm needed, `npm run` just executes the "start" script
FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["npm", "run", "start"]
