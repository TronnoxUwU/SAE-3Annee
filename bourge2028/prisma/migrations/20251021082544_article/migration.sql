/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Composant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "positionComposant" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "articleId" INTEGER,
    CONSTRAINT "Composant_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Composant" ("articleId", "id", "positionComposant", "type") SELECT "articleId", "id", "positionComposant", "type" FROM "Composant";
DROP TABLE "Composant";
ALTER TABLE "new_Composant" RENAME TO "Composant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
