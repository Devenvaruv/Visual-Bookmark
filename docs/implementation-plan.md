# Implementation Plan

## Checklist

- [x] Inspect repository and confirm it is a fresh workspace.
- [x] Confirm package compatibility with current Next.js, React, React Flow, and Prisma.
- [x] Create product and architecture documentation.
- [x] Scaffold Next.js, TypeScript, Tailwind, Prisma, Vitest, and Playwright.
- [x] Add Prisma schema and seed data.
- [x] Build board sidebar and board route handlers.
- [x] Build React Flow canvas with bookmark and group nodes.
- [x] Add bookmark panel with placeholder and upload image flows.
- [x] Add group creation, rename, resize, and delete flows.
- [x] Add parent-child coordinate conversion and persistence.
- [x] Add unit tests for URL, validation, and canvas math.
- [x] Add a Playwright smoke flow.
- [x] Run typecheck, lint, build, and unit tests.

## Environment-Dependent Checks

- [ ] Run `npm run db:migrate` with a configured PostgreSQL `DATABASE_URL`.
- [ ] Run `npm run db:seed`.
- [ ] Run `npm run test:e2e` after the database is available.

## Implementation Notes

The MVP favors a small number of route handlers and simple React state over extra client-side state libraries. Uploads are stored locally under `public/uploads` through a storage helper that can later be replaced by cloud object storage.
