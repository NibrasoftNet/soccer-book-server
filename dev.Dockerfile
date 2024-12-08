# Stage 1: Build the NestJS application
FROM node:20.10.0-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

RUN npm install -g npm@10.8.3

# Install dependencies (including devDependencies for the build)
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the container
COPY . .

RUN npm i -g @nestjs/cli

# Build the NestJS project (compiles TypeScript to JavaScript)
RUN npm run build

# Stage 2: Create production-ready image
FROM node:20.10.0-alpine AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

COPY package.json ./
COPY package-lock.json ./

# Copy the build output and other required files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/.env ./.env
COPY --from=builder /app/ecosystem.config.js ./

# Install PM2 globally
RUN npm install pm2@latest -g

# Start the application using PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]