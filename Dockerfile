# Install dependencies
FROM node:16-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.prd ./.env

RUN npm run build

# Production image
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/build ./build

RUN npm install -g serve

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 reactjs

USER reactjs

EXPOSE 3000
ENV PORT 3000

CMD ["serve", "-s", "build"]
