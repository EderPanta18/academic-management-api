FROM node:20-alpine AS deps
WORKDIR /app

RUN npm install -g pnpm@latest
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npm install -g pnpm@latest
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm prisma:generate
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm@latest

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma:migrate:prod && pnpm start:prod"]
