-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('image', 'audio', 'video');

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "type" "AttachmentType" NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- Backfill: turn existing image/audio/video Message rows into Attachment rows
INSERT INTO "Attachment" ("id", "messageId", "type", "mediaUrl", "createdAt")
SELECT gen_random_uuid()::text, "id", "type"::text::"AttachmentType", "mediaUrl", "createdAt"
FROM "Message"
WHERE "type" != 'text' AND "mediaUrl" IS NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "type",
DROP COLUMN "mediaUrl";

-- DropEnum
DROP TYPE "MessageType";

-- CreateIndex
CREATE INDEX "Attachment_messageId_idx" ON "Attachment"("messageId");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
