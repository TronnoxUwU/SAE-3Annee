/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Personne` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Personne_password_key";

-- CreateIndex
CREATE UNIQUE INDEX "Personne_email_key" ON "Personne"("email");
