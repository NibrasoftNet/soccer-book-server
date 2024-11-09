FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run migrations, then run the app
CMD npm run migration:generate -- src/database/migrations/migration \
    && npm run migration:run \
    && npm run seed:run \
    && npm run start:dev

