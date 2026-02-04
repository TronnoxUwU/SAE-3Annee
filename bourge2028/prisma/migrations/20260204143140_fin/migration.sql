/*
  Warnings:

  - You are about to drop the `_DepartementToProjet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `ipAddress` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `Analytics` table. All the data in the column will be lost.
  - You are about to alter the column `dateVisite` on the `Analytics` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `BigInt`.
  - Added the required column `visitorHash` to the `Analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waiting` to the `Structure` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_DepartementToProjet_B_index";

-- DropIndex
DROP INDEX "_DepartementToProjet_AB_unique";

-- AlterTable
ALTER TABLE "Personne" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "Personne" ADD COLUMN "resetTokenExpires" DATETIME;

-- AlterTable
ALTER TABLE "Projet" ADD COLUMN "adresse" TEXT;
ALTER TABLE "Projet" ADD COLUMN "latitude" REAL;
ALTER TABLE "Projet" ADD COLUMN "longitude" REAL;
ALTER TABLE "Projet" ADD COLUMN "nomProjetSearch" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_DepartementToProjet";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ProjetDepartement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projetId" INTEGER NOT NULL,
    "departementId" INTEGER NOT NULL,
    CONSTRAINT "ProjetDepartement_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjetDepartement_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "Departement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Candidature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "structureId" INTEGER NOT NULL,
    "personneId" INTEGER NOT NULL,
    CONSTRAINT "Candidature_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Candidature_personneId_fkey" FOREIGN KEY ("personneId") REFERENCES "Personne" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Carte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT,
    "descriptionCarte" TEXT,
    "lienCarte" TEXT NOT NULL,
    "waiting" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "_CarteToCategorie" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CarteToCategorie_A_fkey" FOREIGN KEY ("A") REFERENCES "Carte" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CarteToCategorie_B_fkey" FOREIGN KEY ("B") REFERENCES "Categorie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Analytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page" TEXT NOT NULL,
    "visitorHash" TEXT NOT NULL,
    "dateVisite" BIGINT NOT NULL
);
INSERT INTO "new_Analytics" ("dateVisite", "id", "page") SELECT "dateVisite", "id", "page" FROM "Analytics";
DROP TABLE "Analytics";
ALTER TABLE "new_Analytics" RENAME TO "Analytics";
CREATE INDEX "Analytics_visitorHash_dateVisite_idx" ON "Analytics"("visitorHash", "dateVisite");
CREATE INDEX "Analytics_page_dateVisite_idx" ON "Analytics"("page", "dateVisite");
CREATE TABLE "new_Appartenir" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "structureId" INTEGER NOT NULL,
    "personneId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    CONSTRAINT "Appartenir_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Appartenir_personneId_fkey" FOREIGN KEY ("personneId") REFERENCES "Personne" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appartenir_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appartenir" ("id", "personneId", "roleId", "structureId") SELECT "id", "personneId", "roleId", "structureId" FROM "Appartenir";
DROP TABLE "Appartenir";
ALTER TABLE "new_Appartenir" RENAME TO "Appartenir";
CREATE UNIQUE INDEX "Appartenir_structureId_personneId_roleId_key" ON "Appartenir"("structureId", "personneId", "roleId");
CREATE TABLE "new_Situer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "structureId" INTEGER NOT NULL,
    "departementId" INTEGER NOT NULL,
    CONSTRAINT "Situer_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Situer_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "Departement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Situer" ("departementId", "id", "structureId") SELECT "departementId", "id", "structureId" FROM "Situer";
DROP TABLE "Situer";
ALTER TABLE "new_Situer" RENAME TO "Situer";
CREATE UNIQUE INDEX "Situer_structureId_departementId_key" ON "Situer"("structureId", "departementId");
CREATE TABLE "new_Structure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomStructure" TEXT,
    "nomStructSearch" TEXT,
    "description" TEXT,
    "adresse" TEXT,
    "lienPhoto" TEXT,
    "dateCreation" DATETIME,
    "longitude" REAL,
    "latitude" REAL,
    "waiting" BOOLEAN NOT NULL
);
INSERT INTO "new_Structure" ("dateCreation", "description", "id", "lienPhoto", "nomStructure") SELECT "dateCreation", "description", "id", "lienPhoto", "nomStructure" FROM "Structure";
DROP TABLE "Structure";
ALTER TABLE "new_Structure" RENAME TO "Structure";
CREATE TABLE "new_StructureCat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "structureId" INTEGER NOT NULL,
    "categorieId" INTEGER NOT NULL,
    CONSTRAINT "StructureCat_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StructureCat_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StructureCat" ("categorieId", "id", "structureId") SELECT "categorieId", "id", "structureId" FROM "StructureCat";
DROP TABLE "StructureCat";
ALTER TABLE "new_StructureCat" RENAME TO "StructureCat";
CREATE UNIQUE INDEX "StructureCat_structureId_categorieId_key" ON "StructureCat"("structureId", "categorieId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ProjetDepartement_projetId_departementId_key" ON "ProjetDepartement"("projetId", "departementId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidature_structureId_personneId_key" ON "Candidature"("structureId", "personneId");

-- CreateIndex
CREATE UNIQUE INDEX "_CarteToCategorie_AB_unique" ON "_CarteToCategorie"("A", "B");

-- CreateIndex
CREATE INDEX "_CarteToCategorie_B_index" ON "_CarteToCategorie"("B");
