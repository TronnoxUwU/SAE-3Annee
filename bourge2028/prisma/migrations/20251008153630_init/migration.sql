-- CreateTable
CREATE TABLE "Structure" (
    "idStructure" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "dateCreation" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Departement" (
    "idDepartement" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomDepartement" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Realisation" (
    "idDomaine" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomDomaine" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Projet" (
    "idDomaine" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titreCaroussel" TEXT NOT NULL,
    CONSTRAINT "Projet_idDomaine_fkey" FOREIGN KEY ("idDomaine") REFERENCES "Realisation" ("idDomaine") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Materiau" (
    "idDomaine" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titreCaroussel" TEXT NOT NULL,
    CONSTRAINT "Materiau_idDomaine_fkey" FOREIGN KEY ("idDomaine") REFERENCES "Realisation" ("idDomaine") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Technique" (
    "idDomaine" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titreCaroussel" TEXT NOT NULL,
    CONSTRAINT "Technique_idDomaine_fkey" FOREIGN KEY ("idDomaine") REFERENCES "Realisation" ("idDomaine") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_StructureDepartement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_StructureDepartement_A_fkey" FOREIGN KEY ("A") REFERENCES "Departement" ("idDepartement") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_StructureDepartement_B_fkey" FOREIGN KEY ("B") REFERENCES "Structure" ("idStructure") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DepartementRealisation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DepartementRealisation_A_fkey" FOREIGN KEY ("A") REFERENCES "Departement" ("idDepartement") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DepartementRealisation_B_fkey" FOREIGN KEY ("B") REFERENCES "Realisation" ("idDomaine") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_StructureRealisation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_StructureRealisation_A_fkey" FOREIGN KEY ("A") REFERENCES "Realisation" ("idDomaine") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_StructureRealisation_B_fkey" FOREIGN KEY ("B") REFERENCES "Structure" ("idStructure") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_StructureDepartement_AB_unique" ON "_StructureDepartement"("A", "B");

-- CreateIndex
CREATE INDEX "_StructureDepartement_B_index" ON "_StructureDepartement"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DepartementRealisation_AB_unique" ON "_DepartementRealisation"("A", "B");

-- CreateIndex
CREATE INDEX "_DepartementRealisation_B_index" ON "_DepartementRealisation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StructureRealisation_AB_unique" ON "_StructureRealisation"("A", "B");

-- CreateIndex
CREATE INDEX "_StructureRealisation_B_index" ON "_StructureRealisation"("B");
