/*
  Warnings:

  - You are about to drop the column `status` on the `document_information` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user_information` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `user_information` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `user_information` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "document_information" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "user_information" DROP COLUMN "name",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "middle_name" TEXT;
