
# ---------- Stage 1: Dependencies ----------
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


# ---------- Stage 2: Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables for Next.js static prerendering
ARG NEXT_PUBLIC_BASE_CMS=https://api.ksonsgroup.com/api/v1/
ARG NEXT_PUBLIC_BASE_URL_WEBSITE=https://ksonsgroup.com/
ENV NEXT_PUBLIC_BASE_CMS=$NEXT_PUBLIC_BASE_CMS
ENV NEXT_PUBLIC_BASE_URL_WEBSITE=$NEXT_PUBLIC_BASE_URL_WEBSITE

# Build Next.js (IMPORTANT: should use output: "standalone")
RUN npm run build


# ---------- Stage 3: Production ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user (security best practice)
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy only standalone output (best optimization)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]