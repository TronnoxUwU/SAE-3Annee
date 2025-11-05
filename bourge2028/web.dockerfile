FROM node:20-alpine AS builder
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier TOUS les fichiers du projet
COPY . .

# Générer Prisma
RUN npx prisma generate

# Build Next.js
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Copier les fichiers nécessaires
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./

# Copier le dossier prisma si vous l'utilisez en runtime
COPY --from=builder /app/prisma ./prisma

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev

# Générer Prisma client en production aussi
RUN npx prisma generate

# Copier les fichiers buildés
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs


# Si vous utilisez standalone output, ajoutez :
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]