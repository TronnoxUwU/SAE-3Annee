/*
  Warnings:

  - You are about to drop the `StructurePersonne` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StructurePersonne";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Appartenir" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "structureId" INTEGER NOT NULL,
    "personneId" INTEGER NOT NULL,
    "role" TEXT,
    CONSTRAINT "Appartenir_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appartenir_personneId_fkey" FOREIGN KEY ("personneId") REFERENCES "Personne" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lien" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Contenir" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,
    CONSTRAINT "Contenir_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contenir_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Composant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "positionComposant" INTEGER,
    "articleId" INTEGER NOT NULL,
    CONSTRAINT "Composant_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paragraphe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "texteParagraphe" TEXT,
    "composantId" INTEGER NOT NULL,
    CONSTRAINT "Paragraphe_composantId_fkey" FOREIGN KEY ("composantId") REFERENCES "Composant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Titre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "niveauTitre" INTEGER,
    "texteTitre" TEXT,
    "composantId" INTEGER NOT NULL,
    CONSTRAINT "Titre_composantId_fkey" FOREIGN KEY ("composantId") REFERENCES "Composant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lienImage" TEXT,
    "titreImage" TEXT,
    "copyright" TEXT,
    "composantId" INTEGER NOT NULL,
    "carousselId" INTEGER,
    CONSTRAINT "Image_composantId_fkey" FOREIGN KEY ("composantId") REFERENCES "Composant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Image_carousselId_fkey" FOREIGN KEY ("carousselId") REFERENCES "Caroussel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Caroussel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titreCaroussel" TEXT,
    "composantId" INTEGER NOT NULL,
    CONSTRAINT "Caroussel_composantId_fkey" FOREIGN KEY ("composantId") REFERENCES "Composant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Appartenir_structureId_personneId_key" ON "Appartenir"("structureId", "personneId");

-- CreateIndex
CREATE UNIQUE INDEX "Contenir_articleId_documentId_key" ON "Contenir"("articleId", "documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Paragraphe_composantId_key" ON "Paragraphe"("composantId");

-- CreateIndex
CREATE UNIQUE INDEX "Titre_composantId_key" ON "Titre"("composantId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_composantId_key" ON "Image"("composantId");
