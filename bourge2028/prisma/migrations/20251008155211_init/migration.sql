/*
  Warnings:

  - You are about to drop the `Realisation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Realisation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "REALISATION" (
    "idDomaine" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomDomaine" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Materiau" (
    "idDomaine" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titreCaroussel" TEXT NOT NULL,
    CONSTRAINT "Materiau_idDomaine_fkey" FOREIGN KEY ("idDomaine") REFERENCES "REALISATION" ("idDomaine") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Materiau" ("idDomaine", "titreCaroussel") SELECT "idDomaine", "titreCaroussel" FROM "Materiau";
DROP TABLE "Materiau";
ALTER TABLE "new_Materiau" RENAME TO "Materiau";
CREATE TABLE "new_Projet" (
    "idDomaine" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titreCaroussel" TEXT NOT NULL,
    CONSTRAINT "Projet_idDomaine_fkey" FOREIGN KEY ("idDomaine") REFERENCES "REALISATION" ("idDomaine") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Projet" ("idDomaine", "titreCaroussel") SELECT "idDomaine", "titreCaroussel" FROM "Projet";
DROP TABLE "Projet";
ALTER TABLE "new_Projet" RENAME TO "Projet";
CREATE TABLE "new_Technique" (
    "idDomaine" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titreCaroussel" TEXT NOT NULL,
    CONSTRAINT "Technique_idDomaine_fkey" FOREIGN KEY ("idDomaine") REFERENCES "REALISATION" ("idDomaine") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Technique" ("idDomaine", "titreCaroussel") SELECT "idDomaine", "titreCaroussel" FROM "Technique";
DROP TABLE "Technique";
ALTER TABLE "new_Technique" RENAME TO "Technique";
CREATE TABLE "new__DepartementRealisation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DepartementRealisation_A_fkey" FOREIGN KEY ("A") REFERENCES "Departement" ("idDepartement") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DepartementRealisation_B_fkey" FOREIGN KEY ("B") REFERENCES "REALISATION" ("idDomaine") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__DepartementRealisation" ("A", "B") SELECT "A", "B" FROM "_DepartementRealisation";
DROP TABLE "_DepartementRealisation";
ALTER TABLE "new__DepartementRealisation" RENAME TO "_DepartementRealisation";
CREATE UNIQUE INDEX "_DepartementRealisation_AB_unique" ON "_DepartementRealisation"("A", "B");
CREATE INDEX "_DepartementRealisation_B_index" ON "_DepartementRealisation"("B");
CREATE TABLE "new__StructureRealisation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_StructureRealisation_A_fkey" FOREIGN KEY ("A") REFERENCES "REALISATION" ("idDomaine") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_StructureRealisation_B_fkey" FOREIGN KEY ("B") REFERENCES "Structure" ("idStructure") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__StructureRealisation" ("A", "B") SELECT "A", "B" FROM "_StructureRealisation";
DROP TABLE "_StructureRealisation";
ALTER TABLE "new__StructureRealisation" RENAME TO "_StructureRealisation";
CREATE UNIQUE INDEX "_StructureRealisation_AB_unique" ON "_StructureRealisation"("A", "B");
CREATE INDEX "_StructureRealisation_B_index" ON "_StructureRealisation"("B");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
