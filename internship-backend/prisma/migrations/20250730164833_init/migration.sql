-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('STUDENT', 'COORDINATOR');

-- CreateEnum
CREATE TYPE "public"."InternshipType" AS ENUM ('VOLUNTARY', 'COMPULSORY');

-- CreateEnum
CREATE TYPE "public"."InternshipStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phone" TEXT,
    "schoolNumber" TEXT,
    "grade" INTEGER,
    "faculty" TEXT,
    "department" TEXT,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Internship" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."InternshipType" NOT NULL,
    "status" "public"."InternshipStatus" NOT NULL,
    "internshipFormUrl" TEXT NOT NULL,
    "unemploymentFormUrl" TEXT NOT NULL,
    "healthFormUrl" TEXT NOT NULL,
    "internshipFormStatus" "public"."InternshipStatus" NOT NULL DEFAULT 'PENDING',
    "unemploymentFormStatus" "public"."InternshipStatus" NOT NULL DEFAULT 'PENDING',
    "healthFormStatus" "public"."InternshipStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Internship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- AddForeignKey
ALTER TABLE "public"."Internship" ADD CONSTRAINT "Internship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
