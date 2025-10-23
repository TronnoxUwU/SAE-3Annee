/*
  Warnings:

  - You are about to drop the column `titreCaroussel` on the `Materiau` table. All the data in the column will be lost.
  - You are about to drop the column `titreCaroussel` on the `Projet` table. All the data in the column will be lost.
  - You are about to drop the column `titreCaroussel` on the `Technique` table. All the data in the column will be lost.
  - Added the required column `realisationId` to the `Rediger` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Materiau" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT,
    "realisationId" INTEGER NOT NULL,
    CONSTRAINT "Materiau_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Materiau" ("id", "realisationId") SELECT "id", "realisationId" FROM "Materiau";
DROP TABLE "Materiau";
ALTER TABLE "new_Materiau" RENAME TO "Materiau";
CREATE UNIQUE INDEX "Materiau_realisationId_key" ON "Materiau"("realisationId");
CREATE TABLE "new_Projet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT,
    "realisationId" INTEGER NOT NULL,
    CONSTRAINT "Projet_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Projet" ("id", "realisationId") SELECT "id", "realisationId" FROM "Projet";
DROP TABLE "Projet";
ALTER TABLE "new_Projet" RENAME TO "Projet";
CREATE UNIQUE INDEX "Projet_realisationId_key" ON "Projet"("realisationId");
CREATE TABLE "new_Rediger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "personneId" INTEGER NOT NULL,
    "realisationId" INTEGER NOT NULL,
    "dateRedaction" DATETIME,
    "dateModif" DATETIME,
    CONSTRAINT "Rediger_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rediger_personneId_fkey" FOREIGN KEY ("personneId") REFERENCES "Personne" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rediger_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rediger" ("articleId", "dateModif", "dateRedaction", "id", "personneId") SELECT "articleId", "dateModif", "dateRedaction", "id", "personneId" FROM "Rediger";
DROP TABLE "Rediger";
ALTER TABLE "new_Rediger" RENAME TO "Rediger";
CREATE UNIQUE INDEX "Rediger_articleId_personneId_key" ON "Rediger"("articleId", "personneId");
CREATE TABLE "new_Technique" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT,
    "realisationId" INTEGER NOT NULL,
    CONSTRAINT "Technique_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Technique" ("id", "realisationId") SELECT "id", "realisationId" FROM "Technique";
DROP TABLE "Technique";
ALTER TABLE "new_Technique" RENAME TO "Technique";
CREATE UNIQUE INDEX "Technique_realisationId_key" ON "Technique"("realisationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
