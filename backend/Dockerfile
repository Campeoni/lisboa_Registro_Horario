# Stage 1: Build
FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json .
COPY .env.example .env
EXPOSE 3000
CMD ["node", "dist/main.js"]
