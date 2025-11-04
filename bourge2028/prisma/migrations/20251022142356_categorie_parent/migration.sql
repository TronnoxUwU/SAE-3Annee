-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Categorie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "Categorie_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Categorie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Categorie" ("id", "nom") SELECT "id", "nom" FROM "Categorie";
DROP TABLE "Categorie";
ALTER TABLE "new_Categorie" RENAME TO "Categorie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
