FROM node:20-alpine AS builder
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier TOUS les fichiers du projet
COPY . .

# Générer Prisma
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate

# Build Next.js
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="file:./prisma/dev.db"

# Créer utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copier UNIQUEMENT ce qui est nécessaire (standalone inclut déjà node_modules optimisés)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copier Prisma
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Permissions pour la DB
RUN mkdir -p /app/prisma && chown -R nextjs:nodejs /app/prisma

USER nextjs

EXPOSE 3000

CMD sh -c "npx prisma db push --skip-generate --accept-data-loss && node server.js"