/*
  Warnings:

  - You are about to drop the column `dateRedaction` on the `Rediger` table. All the data in the column will be lost.
  - You are about to drop the column `realisationId` on the `Rediger` table. All the data in the column will be lost.
  - Added the required column `realisationId` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Made the column `dateModif` on table `Rediger` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "realisationId" INTEGER NOT NULL,
    CONSTRAINT "Article_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("id", "titre") SELECT "id", "titre" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE TABLE "new_Rediger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "personneId" INTEGER NOT NULL,
    "dateModif" DATETIME NOT NULL,
    CONSTRAINT "Rediger_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rediger_personneId_fkey" FOREIGN KEY ("personneId") REFERENCES "Personne" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rediger" ("articleId", "dateModif", "id", "personneId") SELECT "articleId", "dateModif", "id", "personneId" FROM "Rediger";
DROP TABLE "Rediger";
ALTER TABLE "new_Rediger" RENAME TO "Rediger";
CREATE UNIQUE INDEX "Rediger_articleId_personneId_dateModif_key" ON "Rediger"("articleId", "personneId", "dateModif");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
