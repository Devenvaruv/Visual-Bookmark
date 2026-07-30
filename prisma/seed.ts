import * as nextEnv from "@next/env";
import { PrismaClient, type BookmarkImageType } from "@prisma/client";

nextEnv.loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

const boards = ["YouTube", "Work", "Job Apps", "Personal", "Learning"];

const youtubeGroups = [
  {
    name: "Content Pipeline",
    positionX: 40,
    positionY: 60,
    width: 440,
    height: 300,
    color: "#eef6ff",
    bookmarks: [
      { title: "Video Studio", imageValue: "video", positionX: 28, positionY: 92 },
      { title: "Analytics", imageValue: "analytics", positionX: 228, positionY: 92 },
      { title: "Thumbnail Tool", imageValue: "image", positionX: 28, positionY: 212 },
      { title: "Notes", imageValue: "notes", positionX: 228, positionY: 212 }
    ]
  },
  {
    name: "Publishing",
    positionX: 520,
    positionY: 60,
    width: 440,
    height: 300,
    color: "#effaf5",
    bookmarks: [
      { title: "Scheduler", imageValue: "calendar", positionX: 28, positionY: 92 },
      { title: "SEO Tools", imageValue: "globe", positionX: 228, positionY: 92 },
      { title: "Community", imageValue: "chat", positionX: 28, positionY: 212 },
      { title: "Asset Library", imageValue: "folder", positionX: 228, positionY: 212 }
    ]
  },
  {
    name: "Job Hunt",
    positionX: 120,
    positionY: 440,
    width: 800,
    height: 220,
    color: "#f8f5ff",
    bookmarks: [
      { title: "Email", imageValue: "email", positionX: 28, positionY: 92 },
      { title: "Resume", imageValue: "document", positionX: 228, positionY: 92 },
      { title: "Applications", imageValue: "briefcase", positionX: 428, positionY: 92 },
      { title: "Research", imageValue: "search", positionX: 628, positionY: 92 }
    ]
  }
];

async function main() {
  await prisma.bookmark.deleteMany();
  await prisma.bookmarkGroup.deleteMany();
  await prisma.board.deleteMany();

  for (const [index, name] of boards.entries()) {
    await prisma.board.create({
      data: {
        name,
        order: index
      }
    });
  }

  const youtube = await prisma.board.findUniqueOrThrow({ where: { name: "YouTube" } });

  for (const group of youtubeGroups) {
    const created = await prisma.bookmarkGroup.create({
      data: {
        boardId: youtube.id,
        name: group.name,
        positionX: group.positionX,
        positionY: group.positionY,
        width: group.width,
        height: group.height,
        color: group.color
      }
    });

    await prisma.bookmark.createMany({
      data: group.bookmarks.map((bookmark) => ({
        boardId: youtube.id,
        groupId: created.id,
        title: bookmark.title,
        url: "https://example.com/",
        imageType: "PLACEHOLDER" as BookmarkImageType,
        imageValue: bookmark.imageValue,
        positionX: bookmark.positionX,
        positionY: bookmark.positionY,
        width: 180,
        height: 96
      }))
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
