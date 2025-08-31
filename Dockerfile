FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies separately for better layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

ENV NODE_ENV=production
EXPOSE 5001

CMD ["node","server.js"]
