FROM node:20-alpine AS builder
WORKDIR /app

# Copier fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier tout le projet
COPY . .

# Générer Prisma
RUN npx prisma generate

# Build Next.js en mode standalone
RUN npm run build

# ---------------------- RUNNER ------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copier le code standalone + fichiers nécessaires
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./public/_next/static
COPY --from=builder /app/public ./public

# Copier Prisma (schema + client généré)
COPY --from=builder /app/prisma ./prisma

# USER non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000

# Pas de skip-generate, car déjà fait dans l'étape build
CMD ["node", "server.js"]
