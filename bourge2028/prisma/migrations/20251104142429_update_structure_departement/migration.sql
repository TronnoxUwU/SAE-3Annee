/*
  Warnings:

  - You are about to drop the column `departementId` on the `Structure` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Situer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "structureId" INTEGER NOT NULL,
    "departementId" INTEGER NOT NULL,
    CONSTRAINT "Situer_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Situer_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "Departement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Structure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomStructure" TEXT,
    "description" TEXT,
    "dateCreation" DATETIME
);
INSERT INTO "new_Structure" ("dateCreation", "description", "id", "nomStructure") SELECT "dateCreation", "description", "id", "nomStructure" FROM "Structure";
DROP TABLE "Structure";
ALTER TABLE "new_Structure" RENAME TO "Structure";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
