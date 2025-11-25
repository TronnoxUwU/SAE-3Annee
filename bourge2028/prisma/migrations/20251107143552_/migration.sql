/*
  Warnings:

  - A unique constraint covering the columns `[structureId,departementId]` on the table `Situer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Carte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT,
    "descriptionCarte" TEXT,
    "lienCarte" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CarteToCategorie" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CarteToCategorie_A_fkey" FOREIGN KEY ("A") REFERENCES "Carte" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CarteToCategorie_B_fkey" FOREIGN KEY ("B") REFERENCES "Categorie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_CarteToCategorie_AB_unique" ON "_CarteToCategorie"("A", "B");

-- CreateIndex
CREATE INDEX "_CarteToCategorie_B_index" ON "_CarteToCategorie"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Situer_structureId_departementId_key" ON "Situer"("structureId", "departementId");
