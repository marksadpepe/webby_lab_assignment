#!/usr/bin/env bash
set -euo pipefail
: "${APP_PORT:=8050}"
: "${APP_HOST:=0.0.0.0}"
: "${DB_HOST:=127.0.0.1}"
: "${DB_PORT:=5432}"
: "${DB_NAME:=movie_gallery}"
: "${DB_USERNAME:=postgres}"
: "${DB_PASSWORD:=postgres}"
: "${DB_LOGGING:=false}"
: "${REDIS_HOST:=127.0.0.1}"
: "${REDIS_PORT:=6379}"
: "${PGDATA:=/var/lib/postgresql/data}"
export APP_PORT APP_HOST
export DB_HOST DB_PORT DB_NAME DB_USERNAME DB_PASSWORD DB_LOGGING
export REDIS_HOST REDIS_PORT
export REDIS_URL="redis://${REDIS_HOST}:${REDIS_PORT}"
export DATABASE_URL="postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
redis-server --port "${REDIS_PORT}" --daemonize yes
i=0; until (echo -ne "" >/dev/tcp/"${REDIS_HOST}"/"${REDIS_PORT}") 2>/dev/null; do i=$((i+1)); if [ "$i" -ge 60 ]; then echo "Redis did not start in time"; exit 1; fi; sleep 1; done
if [ ! -s "${PGDATA}/PG_VERSION" ]; then chown -R postgres:postgres /var/lib/postgresql; INITDB="$(find /usr/lib/postgresql -type f -name initdb | sort -V | tail -n1)"; su -s /bin/bash postgres -c "${INITDB} -D '${PGDATA}' -E UTF8 --locale=C"; echo "listen_addresses = '127.0.0.1'" >> "${PGDATA}/postgresql.conf"; echo "port = ${DB_PORT}" >> "${PGDATA}/postgresql.conf"; echo "host all all 127.0.0.1/32 md5" >> "${PGDATA}/pg_hba.conf"; echo "host all all ::1/128 md5" >> "${PGDATA}/pg_hba.conf"; fi
POSTGRES_BIN="$(find /usr/lib/postgresql -type f -name postgres | sort -V | tail -n1)"
su -s /bin/bash postgres -c "${POSTGRES_BIN} -D '${PGDATA}'" >/var/log/postgresql.log 2>&1 &
PG_READY="$(find /usr/lib/postgresql -type f -name pg_isready | sort -V | tail -n1)"
i=0; until "${PG_READY}" -h 127.0.0.1 -p "${DB_PORT}" >/dev/null 2>&1; do i=$((i+1)); if [ "$i" -ge 60 ]; then echo "PostgreSQL did not start in time"; exit 1; fi; sleep 1; done
if [ "${DB_USERNAME}" = "postgres" ]; then su -s /bin/bash postgres -c "psql -U postgres -d postgres -c \"ALTER USER postgres WITH PASSWORD '${DB_PASSWORD}';\"" || true; else su -s /bin/bash postgres -c "psql -U postgres -d postgres -tc \"SELECT 1 FROM pg_roles WHERE rolname='${DB_USERNAME}'\" | grep -q 1 || psql -U postgres -d postgres -c \"CREATE USER ${DB_USERNAME} WITH PASSWORD '${DB_PASSWORD}';\""; fi
su -s /bin/bash postgres -c "psql -U postgres -d postgres -tc \"SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'\" | grep -q 1 || psql -U postgres -d postgres -c \"CREATE DATABASE ${DB_NAME} OWNER ${DB_USERNAME};\""
if [ -d "./migrations" ]; then sequelize-cli db:migrate --url "${DATABASE_URL}" --migrations-path "./migrations" || echo "Skip migrations"; fi
exec node dist/index.js

