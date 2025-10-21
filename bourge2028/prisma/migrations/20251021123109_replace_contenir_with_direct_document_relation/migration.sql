/*
  Warnings:

  - You are about to drop the `Contenir` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `articleId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Contenir_articleId_documentId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Contenir";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Document" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lien" TEXT NOT NULL,
    "articleId" INTEGER NOT NULL,
    CONSTRAINT "Document_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Document" ("id", "lien") SELECT "id", "lien" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
