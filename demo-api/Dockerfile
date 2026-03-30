FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

FROM base AS development
RUN npm install
CMD ["npm", "run", "dev"]

FROM base AS production
CMD ["npm", "start"]
