/*
  Warnings:

  - Added the required column `identifiant` to the `Personne` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Personne" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "identifiant" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "departementId" INTEGER,
    CONSTRAINT "Personne_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "Departement" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Personne" ("dateCreation", "departementId", "email", "id", "nom", "password", "prenom", "role") SELECT "dateCreation", "departementId", "email", "id", "nom", "password", "prenom", "role" FROM "Personne";
DROP TABLE "Personne";
ALTER TABLE "new_Personne" RENAME TO "Personne";
CREATE UNIQUE INDEX "Personne_identifiant_key" ON "Personne"("identifiant");
CREATE UNIQUE INDEX "Personne_email_key" ON "Personne"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
