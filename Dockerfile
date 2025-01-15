FROM node:22-alpine AS base

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
FROM base AS runner
WORKDIR /app

ARG POSTGRES_URL
ENV POSTGRES_URL ${POSTGRES_URL}

ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN if [ -d "/app/public" ]; then cp -r /app/public ./public; fi # Copy public folder if it exists

EXPOSE 3000
CMD ["node", "server.js"]