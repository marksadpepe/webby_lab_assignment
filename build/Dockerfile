FROM node:20-bullseye AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build || true

FROM node:20-bullseye AS runner
WORKDIR /app
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends postgresql postgresql-client redis-server && rm -rf /var/lib/apt/lists/*

ENV PG_MAJOR=13
ENV PATH="/usr/lib/postgresql/${PG_MAJOR}/bin:${PATH}"
ENV PGDATA=/var/lib/postgresql/data

RUN mkdir -p "$PGDATA" && chown -R postgres:postgres /var/lib/postgresql

COPY package*.json ./
RUN npm ci --omit=dev
RUN npm i -g sequelize-cli

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/db/migrations ./migrations
COPY build/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && sed -i '1s/^\xEF\xBB\xBF//' /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8050

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

