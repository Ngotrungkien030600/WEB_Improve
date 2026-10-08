FROM node:26-bookworm-slim AS web-build

WORKDIR /app
COPY projects/web-en ./projects/web-en
COPY projects/web-app/package*.json ./projects/web-app/
WORKDIR /app/projects/web-app
RUN npm ci
COPY projects/web-app ./projects/web-app
RUN npm run build

FROM node:26-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends openjdk-17-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=web-build --chown=node:node /app/projects/web-en ./projects/web-en
COPY --from=web-build --chown=node:node /app/projects/web-app/dist ./projects/web-app/dist

ENV HOST=0.0.0.0
USER node

CMD ["node", "projects/web-en/server/index.js"]
