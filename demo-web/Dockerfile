FROM node:24-alpine AS base
WORKDIR /app
RUN apk update && apk add --no-cache gettext
COPY package*.json ./
RUN npm install
COPY . .
ENTRYPOINT ["/app/entrypoint.sh"]

FROM base AS development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS build
RUN npm run build

FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html/
COPY inject-config.sh /docker-entrypoint.d/99-inject-config.sh
