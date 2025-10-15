/*
  Warnings:

  - You are about to drop the `REALISATION` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DepartementRealisation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StructureDepartement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StructureRealisation` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Departement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idDepartement` on the `Departement` table. All the data in the column will be lost.
  - You are about to drop the column `nomDepartement` on the `Departement` table. All the data in the column will be lost.
  - The primary key for the `Materiau` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idDomaine` on the `Materiau` table. All the data in the column will be lost.
  - The primary key for the `Projet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idDomaine` on the `Projet` table. All the data in the column will be lost.
  - The primary key for the `Structure` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idStructure` on the `Structure` table. All the data in the column will be lost.
  - The primary key for the `Technique` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idDomaine` on the `Technique` table. All the data in the column will be lost.
  - Added the required column `id` to the `Departement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `Departement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Materiau` table without a default value. This is not possible if the table is not empty.
  - Added the required column `realisationId` to the `Materiau` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Projet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `realisationId` to the `Projet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Structure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Technique` table without a default value. This is not possible if the table is not empty.
  - Added the required column `realisationId` to the `Technique` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_DepartementRealisation_B_index";

-- DropIndex
DROP INDEX "_DepartementRealisation_AB_unique";

-- DropIndex
DROP INDEX "_StructureDepartement_B_index";

-- DropIndex
DROP INDEX "_StructureDepartement_AB_unique";

-- DropIndex
DROP INDEX "_StructureRealisation_B_index";

-- DropIndex
DROP INDEX "_StructureRealisation_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "REALISATION";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_DepartementRealisation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_StructureDepartement";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_StructureRealisation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Personne" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "departementId" INTEGER,
    CONSTRAINT "Personne_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "Departement" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StructurePersonne" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "structureId" INTEGER NOT NULL,
    "personneId" INTEGER NOT NULL,
    "role" TEXT,
    CONSTRAINT "StructurePersonne_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StructurePersonne_personneId_fkey" FOREIGN KEY ("personneId") REFERENCES "Personne" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Realisation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT,
    "departementId" INTEGER,
    "structureId" INTEGER,
    CONSTRAINT "Realisation_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "Departement" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Realisation_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "categoryId" INTEGER,
    CONSTRAINT "Tag_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categorie" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RealisationTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "realisationId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    CONSTRAINT "RealisationTag_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RealisationTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StructureTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "structureId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    CONSTRAINT "StructureTag_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StructureTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Categorie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Rediger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "personneId" INTEGER NOT NULL,
    "dateRedaction" DATETIME,
    "dateModif" DATETIME,
    CONSTRAINT "Rediger_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rediger_personneId_fkey" FOREIGN KEY ("personneId") REFERENCES "Personne" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Departement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);
DROP TABLE "Departement";
ALTER TABLE "new_Departement" RENAME TO "Departement";
CREATE TABLE "new_Materiau" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titreCaroussel" TEXT,
    "realisationId" INTEGER NOT NULL,
    CONSTRAINT "Materiau_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Materiau" ("titreCaroussel") SELECT "titreCaroussel" FROM "Materiau";
DROP TABLE "Materiau";
ALTER TABLE "new_Materiau" RENAME TO "Materiau";
CREATE UNIQUE INDEX "Materiau_realisationId_key" ON "Materiau"("realisationId");
CREATE TABLE "new_Projet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titreCaroussel" TEXT,
    "realisationId" INTEGER NOT NULL,
    CONSTRAINT "Projet_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Projet" ("titreCaroussel") SELECT "titreCaroussel" FROM "Projet";
DROP TABLE "Projet";
ALTER TABLE "new_Projet" RENAME TO "Projet";
CREATE UNIQUE INDEX "Projet_realisationId_key" ON "Projet"("realisationId");
CREATE TABLE "new_Structure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "dateCreation" DATETIME,
    "departementId" INTEGER,
    CONSTRAINT "Structure_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "Departement" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Structure" ("dateCreation", "description") SELECT "dateCreation", "description" FROM "Structure";
DROP TABLE "Structure";
ALTER TABLE "new_Structure" RENAME TO "Structure";
CREATE TABLE "new_Technique" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titreCaroussel" TEXT,
    "realisationId" INTEGER NOT NULL,
    CONSTRAINT "Technique_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Technique" ("titreCaroussel") SELECT "titreCaroussel" FROM "Technique";
DROP TABLE "Technique";
ALTER TABLE "new_Technique" RENAME TO "Technique";
CREATE UNIQUE INDEX "Technique_realisationId_key" ON "Technique"("realisationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "StructurePersonne_structureId_personneId_key" ON "StructurePersonne"("structureId", "personneId");

-- CreateIndex
CREATE UNIQUE INDEX "RealisationTag_realisationId_tagId_key" ON "RealisationTag"("realisationId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "StructureTag_structureId_tagId_key" ON "StructureTag"("structureId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Rediger_articleId_personneId_key" ON "Rediger"("articleId", "personneId");
