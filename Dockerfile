FROM node:18-alpine AS base


# --- Builder ---
FROM base AS Builder
WORKDIR /api

RUN apk add --no-cache libc6-compat
RUN apk update

COPY src ./src
COPY .yarn/releases ./.yarn/releases
COPY .yarn/plugins ./.yarn/plugins
COPY tsconfig.json package.json yarn.lock .yarnrc.yml ./

# Build the application
RUN yarn --immutable
RUN yarn build

# Remove dev-dependencies from node_modules
RUN yarn pinst --disable
RUN yarn workspaces focus --production --all


# --- Runner ---
FROM base AS runner
WORKDIR /api

ENV NODE_ENV production
USER node

COPY --from=builder --chown=node:node /api/node_modules ./node_modules
COPY --from=builder --chown=node:node /api/package.json /api/yarn.lock ./
COPY --from=builder --chown=node:node /api/dist ./dist

CMD yarn start
