# Database Schema

The Prisma schema uses PostgreSQL and three main models.

## Board

Stores a workspace:

- `id`
- `name`
- `order`
- `createdAt`
- `updatedAt`

## Bookmark

Stores a visual card:

- `id`
- `boardId`
- `groupId`
- `title`
- `url`
- `imageType`
- `imageValue`
- `positionX`
- `positionY`
- `width`
- `height`
- `createdAt`
- `updatedAt`

`groupId` is nullable so a bookmark can live directly on the canvas.

`imageType` can be `PLACEHOLDER`, `UPLOAD`, or `FAVICON`. `imageValue` stores the placeholder id, uploaded image path, or resolved favicon URL.

## BookmarkGroup

Stores a visual container:

- `id`
- `boardId`
- `name`
- `positionX`
- `positionY`
- `width`
- `height`
- `color`
- `createdAt`
- `updatedAt`

Deleting a group moves its bookmarks back to the root canvas instead of deleting them.
