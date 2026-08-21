/*
  Warnings:

  - You are about to drop the column `predictedDisease` on the `Prediction` table. All the data in the column will be lost.
  - Added the required column `disease` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "predictedDisease",
ADD COLUMN     "disease" TEXT NOT NULL;
