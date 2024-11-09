
# Linkbook API

## Description

Linkbook API developed with NestJS 10.2.*

## Prerequisites

- Docker
- Docker Compose
- Node.js
- npm

## Database Credentials

- **PostgreSQL:** `10.161.17.100`
- **Username:** `postgres`
- **Password:** ``

## Public IP for K8s

- **Ports:** `3001`

## Running the Project Locally

### Using Docker Compose

To run the project using Docker Compose, ensure you have a `docker-compose.yml` file in your project directory, then run:

```sh
docker-compose up
```

### Using npm

To run the project using npm, install the dependencies and start the development server:

```sh
npm install
npm run start:dev
```

## Access the API

Once the project is running, you can access the API on port `3001`.