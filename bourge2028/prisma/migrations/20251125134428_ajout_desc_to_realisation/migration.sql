/*
  Warnings:

  - You are about to drop the `RealisationTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StructureTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `role` on the `Appartenir` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Departement` table. All the data in the column will be lost.
  - You are about to drop the column `departementId` on the `Personne` table. All the data in the column will be lost.
  - You are about to drop the column `departementId` on the `Realisation` table. All the data in the column will be lost.
  - You are about to drop the column `structureId` on the `Realisation` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `Appartenir` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomDep` to the `Departement` table without a default value. This is not possible if the table is not empty.
  - Made the column `nomMateriau` on table `Materiau` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nomProjet` on table `Projet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nomTechnique` on table `Technique` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "RealisationTag_realisationId_tagId_key";

-- DropIndex
DROP INDEX "StructureTag_structureId_tagId_key";

-- AlterTable
ALTER TABLE "Structure" ADD COLUMN "lienPhoto" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RealisationTag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StructureTag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tag";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RealisationCat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "realisationId" INTEGER NOT NULL,
    "categorieId" INTEGER NOT NULL,
    CONSTRAINT "RealisationCat_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RealisationCat_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StructureCat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "structureId" INTEGER NOT NULL,
    "categorieId" INTEGER NOT NULL,
    CONSTRAINT "StructureCat_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StructureCat_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DepartementToProjet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DepartementToProjet_A_fkey" FOREIGN KEY ("A") REFERENCES "Departement" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DepartementToProjet_B_fkey" FOREIGN KEY ("B") REFERENCES "Projet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RealisationToStructure" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_RealisationToStructure_A_fkey" FOREIGN KEY ("A") REFERENCES "Realisation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RealisationToStructure_B_fkey" FOREIGN KEY ("B") REFERENCES "Structure" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appartenir" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "structureId" INTEGER NOT NULL,
    "personneId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    CONSTRAINT "Appartenir_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appartenir_personneId_fkey" FOREIGN KEY ("personneId") REFERENCES "Personne" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appartenir_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appartenir" ("id", "personneId", "structureId") SELECT "id", "personneId", "structureId" FROM "Appartenir";
DROP TABLE "Appartenir";
ALTER TABLE "new_Appartenir" RENAME TO "Appartenir";
CREATE UNIQUE INDEX "Appartenir_structureId_personneId_key" ON "Appartenir"("structureId", "personneId");
CREATE TABLE "new_Departement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomDep" TEXT NOT NULL
);
INSERT INTO "new_Departement" ("id") SELECT "id" FROM "Departement";
DROP TABLE "Departement";
ALTER TABLE "new_Departement" RENAME TO "Departement";
CREATE TABLE "new_Materiau" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomMateriau" TEXT NOT NULL,
    "realisationId" INTEGER NOT NULL,
    CONSTRAINT "Materiau_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Materiau" ("id", "nomMateriau", "realisationId") SELECT "id", "nomMateriau", "realisationId" FROM "Materiau";
DROP TABLE "Materiau";
ALTER TABLE "new_Materiau" RENAME TO "Materiau";
CREATE UNIQUE INDEX "Materiau_realisationId_key" ON "Materiau"("realisationId");
CREATE TABLE "new_Personne" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "identifiant" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tel" TEXT,
    "password" TEXT NOT NULL,
    "description" TEXT,
    "lienPhoto" TEXT,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL
);
INSERT INTO "new_Personne" ("dateCreation", "email", "id", "identifiant", "nom", "password", "prenom", "role") SELECT "dateCreation", "email", "id", "identifiant", "nom", "password", "prenom", "role" FROM "Personne";
DROP TABLE "Personne";
ALTER TABLE "new_Personne" RENAME TO "Personne";
CREATE UNIQUE INDEX "Personne_identifiant_key" ON "Personne"("identifiant");
CREATE UNIQUE INDEX "Personne_email_key" ON "Personne"("email");
CREATE TABLE "new_Projet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomProjet" TEXT NOT NULL,
    "realisationId" INTEGER NOT NULL,
    CONSTRAINT "Projet_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Projet" ("id", "nomProjet", "realisationId") SELECT "id", "nomProjet", "realisationId" FROM "Projet";
DROP TABLE "Projet";
ALTER TABLE "new_Projet" RENAME TO "Projet";
CREATE UNIQUE INDEX "Projet_realisationId_key" ON "Projet"("realisationId");
CREATE TABLE "new_Realisation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT,
    "description" TEXT,
    "dateCreation" DATETIME
);
INSERT INTO "new_Realisation" ("id", "nom") SELECT "id", "nom" FROM "Realisation";
DROP TABLE "Realisation";
ALTER TABLE "new_Realisation" RENAME TO "Realisation";
CREATE TABLE "new_Technique" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomTechnique" TEXT NOT NULL,
    "realisationId" INTEGER NOT NULL,
    CONSTRAINT "Technique_realisationId_fkey" FOREIGN KEY ("realisationId") REFERENCES "Realisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Technique" ("id", "nomTechnique", "realisationId") SELECT "id", "nomTechnique", "realisationId" FROM "Technique";
DROP TABLE "Technique";
ALTER TABLE "new_Technique" RENAME TO "Technique";
CREATE UNIQUE INDEX "Technique_realisationId_key" ON "Technique"("realisationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Role_nom_key" ON "Role"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "RealisationCat_realisationId_categorieId_key" ON "RealisationCat"("realisationId", "categorieId");

-- CreateIndex
CREATE UNIQUE INDEX "StructureCat_structureId_categorieId_key" ON "StructureCat"("structureId", "categorieId");

-- CreateIndex
CREATE UNIQUE INDEX "_DepartementToProjet_AB_unique" ON "_DepartementToProjet"("A", "B");

-- CreateIndex
CREATE INDEX "_DepartementToProjet_B_index" ON "_DepartementToProjet"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RealisationToStructure_AB_unique" ON "_RealisationToStructure"("A", "B");

-- CreateIndex
CREATE INDEX "_RealisationToStructure_B_index" ON "_RealisationToStructure"("B");
