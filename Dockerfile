FROM node:22-alpine AS base
ARG POSTGRES_URL
ENV POSTGRES_URL=${POSTGRES_URL}

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production server
FROM gcr.io/distroless/nodejs22-debian12:latest-amd64 AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG POSTGRES_URL
ENV POSTGRES_URL=${POSTGRES_URL}
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["server.js"]