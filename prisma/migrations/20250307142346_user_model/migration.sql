/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `FirstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'superadmin');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "FirstName" TEXT NOT NULL,
ADD COLUMN     "LastName" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
