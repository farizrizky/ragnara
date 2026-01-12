-- CreateEnum
CREATE TYPE "StreamSpeed" AS ENUM ('INSTANT', 'SLOW', 'FAST', 'NORMAL');

-- CreateTable
CREATE TABLE "ChatPreference" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "streamSpeed" "StreamSpeed" NOT NULL,
    "openingLine" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatPreference_pkey" PRIMARY KEY ("id")
);
