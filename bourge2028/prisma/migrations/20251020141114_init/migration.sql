/*
  Warnings:

  - You are about to drop the column `description` on the `Structure` table. All the data in the column will be lost.
  - Added the required column `email` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prenom` to the `Personne` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Personne` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Personne" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "departementId" INTEGER,
    CONSTRAINT "Personne_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "Departement" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Personne" ("departementId", "id", "nom") SELECT "departementId", "id", "nom" FROM "Personne";
DROP TABLE "Personne";
ALTER TABLE "new_Personne" RENAME TO "Personne";
CREATE UNIQUE INDEX "Personne_password_key" ON "Personne"("password");
CREATE TABLE "new_Structure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomStructure" TEXT,
    "dateCreation" DATETIME,
    "departementId" INTEGER,
    CONSTRAINT "Structure_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "Departement" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Structure" ("dateCreation", "departementId", "id") SELECT "dateCreation", "departementId", "id" FROM "Structure";
DROP TABLE "Structure";
ALTER TABLE "new_Structure" RENAME TO "Structure";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
