-- CreateEnum
CREATE TYPE "BookmarkImageType" AS ENUM ('PLACEHOLDER', 'UPLOAD');

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "groupId" TEXT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "imageType" "BookmarkImageType" NOT NULL,
    "imageValue" TEXT NOT NULL,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "width" INTEGER NOT NULL DEFAULT 180,
    "height" INTEGER NOT NULL DEFAULT 96,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookmarkGroup" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "width" INTEGER NOT NULL DEFAULT 420,
    "height" INTEGER NOT NULL DEFAULT 280,
    "color" TEXT NOT NULL DEFAULT '#eef6ff',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookmarkGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_name_key" ON "Board"("name");

-- CreateIndex
CREATE INDEX "Bookmark_boardId_idx" ON "Bookmark"("boardId");

-- CreateIndex
CREATE INDEX "Bookmark_groupId_idx" ON "Bookmark"("groupId");

-- CreateIndex
CREATE INDEX "BookmarkGroup_boardId_idx" ON "BookmarkGroup"("boardId");

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "BookmarkGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkGroup" ADD CONSTRAINT "BookmarkGroup_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
