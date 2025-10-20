/*
  Warnings:

  - Added the required column `type` to the `Composant` table without a default value. This is not possible if the table is not empty.
  - Made the column `positionComposant` on table `Composant` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Composant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "positionComposant" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "articleId" INTEGER NOT NULL,
    CONSTRAINT "Composant_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Composant" ("articleId", "id", "positionComposant") SELECT "articleId", "id", "positionComposant" FROM "Composant";
DROP TABLE "Composant";
ALTER TABLE "new_Composant" RENAME TO "Composant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
