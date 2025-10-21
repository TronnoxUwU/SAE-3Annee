-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Caroussel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titreCaroussel" TEXT,
    "composantId" INTEGER NOT NULL,
    CONSTRAINT "Caroussel_composantId_fkey" FOREIGN KEY ("composantId") REFERENCES "Composant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Caroussel" ("composantId", "id", "titreCaroussel") SELECT "composantId", "id", "titreCaroussel" FROM "Caroussel";
DROP TABLE "Caroussel";
ALTER TABLE "new_Caroussel" RENAME TO "Caroussel";
CREATE TABLE "new_Composant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "positionComposant" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "articleId" INTEGER,
    CONSTRAINT "Composant_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Composant" ("articleId", "id", "positionComposant", "type") SELECT "articleId", "id", "positionComposant", "type" FROM "Composant";
DROP TABLE "Composant";
ALTER TABLE "new_Composant" RENAME TO "Composant";
CREATE TABLE "new_Contenir" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,
    CONSTRAINT "Contenir_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Contenir_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Contenir" ("articleId", "documentId", "id") SELECT "articleId", "documentId", "id" FROM "Contenir";
DROP TABLE "Contenir";
ALTER TABLE "new_Contenir" RENAME TO "Contenir";
CREATE UNIQUE INDEX "Contenir_articleId_documentId_key" ON "Contenir"("articleId", "documentId");
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lienImage" TEXT,
    "titreImage" TEXT,
    "copyright" TEXT,
    "composantId" INTEGER NOT NULL,
    "carousselId" INTEGER,
    CONSTRAINT "Image_composantId_fkey" FOREIGN KEY ("composantId") REFERENCES "Composant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_carousselId_fkey" FOREIGN KEY ("carousselId") REFERENCES "Caroussel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("carousselId", "composantId", "copyright", "id", "lienImage", "titreImage") SELECT "carousselId", "composantId", "copyright", "id", "lienImage", "titreImage" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_composantId_key" ON "Image"("composantId");
CREATE TABLE "new_Paragraphe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "texteParagraphe" TEXT,
    "composantId" INTEGER NOT NULL,
    CONSTRAINT "Paragraphe_composantId_fkey" FOREIGN KEY ("composantId") REFERENCES "Composant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Paragraphe" ("composantId", "id", "texteParagraphe") SELECT "composantId", "id", "texteParagraphe" FROM "Paragraphe";
DROP TABLE "Paragraphe";
ALTER TABLE "new_Paragraphe" RENAME TO "Paragraphe";
CREATE UNIQUE INDEX "Paragraphe_composantId_key" ON "Paragraphe"("composantId");
CREATE TABLE "new_Titre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "niveauTitre" INTEGER,
    "texteTitre" TEXT,
    "composantId" INTEGER NOT NULL,
    CONSTRAINT "Titre_composantId_fkey" FOREIGN KEY ("composantId") REFERENCES "Composant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Titre" ("composantId", "id", "niveauTitre", "texteTitre") SELECT "composantId", "id", "niveauTitre", "texteTitre" FROM "Titre";
DROP TABLE "Titre";
ALTER TABLE "new_Titre" RENAME TO "Titre";
CREATE UNIQUE INDEX "Titre_composantId_key" ON "Titre"("composantId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
