#!/usr/bin/env bash
# Copy environment file
cp env-example env

# Start PostgreSQL and Adminer using Docker Compose
docker compose up -d

/opt/wait-for-it.sh postgres:5432
# Run migration generate command
npm run migration:generate -- src/database/migrations/migration

# Run migration command
npm run migration:run

# Run seed command
npm run seed:run

# Run start development server command
npm run start:dev
