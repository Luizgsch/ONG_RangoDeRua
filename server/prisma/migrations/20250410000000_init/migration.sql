-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('ONCE_A_MONTH', 'TWICE_A_MONTH', 'EVENTUAL', 'REMOTE');

-- CreateTable
CREATE TABLE "volunteers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "idade" INTEGER,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "localidade" TEXT,
    "disponibilidade" "Availability" NOT NULL,
    "motivacao" TEXT,

    CONSTRAINT "volunteers_pkey" PRIMARY KEY ("id")
);
