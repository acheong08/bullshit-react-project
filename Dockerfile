FROM docker.io/oven/bun:1 AS base
WORKDIR /usr/src/app


# Allows caching
FROM base AS install
RUN mkdir -p /temp/deps
COPY package.json bun.lock /temp/deps/
RUN cd /temp/deps && bun install

# Build
FROM base AS build
COPY --from=install /temp/deps/node_modules node_modules
COPY . .
RUN bun run build

# Release
FROM base as release
COPY --from=install /temp/deps/node_modules node_modules
COPY --from=build /usr/src/app/dist dist
COPY vite.config.ts vite.config.ts
COPY package.json package.json
EXPOSE 4173
CMD ["bun", "run", "preview", "--host", "0.0.0.0"]

