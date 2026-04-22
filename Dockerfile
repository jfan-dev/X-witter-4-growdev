FROM node:20-bookworm-slim AS base
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY tsconfig*.json ./
COPY src ./src

RUN npx prisma generate

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3002
CMD ["npm", "run", "dev"]

FROM base AS build
RUN npm run build

FROM node:20-bookworm-slim AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
COPY --from=base /app/generated ./generated
COPY --from=build /app/dist ./dist

EXPOSE 3002
CMD ["node", "dist/server.js"]