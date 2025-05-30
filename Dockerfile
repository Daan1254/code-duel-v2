# Stage 1: Dependencies and Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Set build-time environment variables
ENV NEXT_PUBLIC_BACK_END_URL=https://code-duel-api.daanverbeek.nl
ENV NEXT_PUBLIC_SOCKET_URL=wss://code-duel-api.daanverbeek.nl:80


# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_BACK_END_URL=https://code-duel-api.daanverbeek.nl
ENV NEXT_PUBLIC_SOCKET_URL=wss://code-duel-api.daanverbeek.nl:80

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port your app runs on
EXPOSE 4444

# Start the application
CMD ["node", "server.js"]
