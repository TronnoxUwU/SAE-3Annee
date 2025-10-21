-- CreateTable
CREATE TABLE "Analytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "duration" INTEGER,
    "dateVisite" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
