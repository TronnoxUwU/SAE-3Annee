/*
  Warnings:

  - A unique constraint covering the columns `[structureId,departementId]` on the table `Situer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Personne" ADD COLUMN "description" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Situer_structureId_departementId_key" ON "Situer"("structureId", "departementId");
