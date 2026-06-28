# ─── Stage 1: Build frontend ──────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app
COPY ./frontend/package.json ./frontend/package-lock.json* ./
RUN npm install --frozen-lockfile 2>/dev/null || npm install
COPY ./frontend .
RUN npm run build

# Verify the build output exists and has CSS/JS
RUN ls -la /app/dist/ && ls -la /app/dist/assets/

# ─── Stage 2: Production server ───────────────────────────────────────────────
FROM node:20-alpine

# Install Docker CLI for code execution sandboxing
RUN apk add --no-cache docker-cli

WORKDIR /app

# Install backend dependencies
COPY ./backend/package.json ./backend/package-lock.json* ./
RUN npm install --frozen-lockfile 2>/dev/null || npm install --production

# Copy backend source
COPY ./backend .

# Copy built frontend into public/ (server.js serves from here)
COPY --from=frontend-builder /app/dist ./public

# Verify static files are in place
RUN ls -la /app/public/ && ls -la /app/public/assets/

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Run as root so Docker socket works without group juggling
CMD ["node", "server.js"]