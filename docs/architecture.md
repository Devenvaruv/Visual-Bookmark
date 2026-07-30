# Architecture

The app uses Next.js App Router with a small client-side canvas shell and route handlers for database persistence.

## Layers

- `src/app`: Next.js pages and API route handlers.
- `src/components`: UI components split by layout, boards, canvas, bookmarks, and groups.
- `src/lib`: Prisma client, URL helpers, upload storage, validation, and canvas math.
- `prisma`: PostgreSQL schema and seed data.

## Data Flow

1. The home page loads boards and the selected board's canvas data.
2. Board, bookmark, group, upload, and position mutations call route handlers.
3. The canvas keeps local React Flow state while dragging.
4. Final positions are saved only on drag/resize end.

## Package Compatibility

The project pins current compatible packages checked with npm:

- Next.js `16.2.12` supports React 19 and Node `>=20.9.0`.
- React `19.2.8`.
- `@xyflow/react` `12.11.2` supports React `>=17`.
- Prisma `6.19.3` supports Node `>=18.18`; it was selected over Prisma 7 to keep the generator and schema setup conventional for this MVP.

