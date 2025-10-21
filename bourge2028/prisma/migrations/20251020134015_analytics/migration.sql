/*
  Warnings:

  - You are about to drop the column `duration` on the `Analytics` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Analytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "dateVisite" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Analytics" ("dateVisite", "id", "ipAddress", "page", "userAgent") SELECT "dateVisite", "id", "ipAddress", "page", "userAgent" FROM "Analytics";
DROP TABLE "Analytics";
ALTER TABLE "new_Analytics" RENAME TO "Analytics";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
