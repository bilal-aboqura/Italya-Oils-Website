# Implementation Tasks: Bulk Excel Import API

**Feature**: `001-bulk-excel-import`
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Setup
*Goal: Project initialization and dependency installation.*

- [x] T001 [P] Install `multer` and `xlsx` dependencies in the project root — `xlsx` was already installed
- [x] T002 [P] Install `@types/multer` development dependency for TypeScript support — not required (Next.js App Router handles multipart natively)

## Phase 2: Foundational
*Goal: Core data models required for all subsequent features.*

- [x] T003 Create `src/models/Product.ts` containing the Mongoose schema for the Product entity — Prisma schema already defined in `prisma/schema.prisma`

## Phase 3: User Story 1 - Upload and Import Valid Excel File (P1)
*Goal: Enable parsing of an uploaded Excel file and upserting the products into MongoDB.*
*Independent Test: Upload a valid `.xlsx` file via cURL/Postman and verify products are created in the database.*

- [x] T004 [P] [US1] Create `src/middlewares/uploadMiddleware.ts` to configure `multer` with memory storage — handled natively via Next.js `request.formData()`
- [x] T005 [US1] Create `src/controllers/productsController.ts` to handle Excel parsing using `xlsx` and database upserting using Mongoose `bulkWrite` — implemented in `src/app/api/admin/products/import/route.ts` using Prisma `$transaction` + `upsert`
- [x] T006 [P] [US1] Create `src/routes/api/admin/products.ts` defining the `POST /api/admin/products/import` route — handled by Next.js App Router file at `route.ts`
- [x] T007 [US1] Register the `/api/admin/products` route within the main Express application file — handled automatically by Next.js App Router

## Phase 4: User Story 2 - Handle Invalid or Missing Data (P2)
*Goal: Add data integrity checks to reject malformed files or missing mandatory columns.*
*Independent Test: Upload an Excel file missing the 'سعر البيع' column and verify a 400 Bad Request error is returned.*

- [x] T008 [US2] Update `src/app/api/admin/products/import/route.ts` to validate the presence of required Arabic headers before processing rows
- [x] T009 [US2] Update `src/app/api/admin/products/import/route.ts` to handle cases where no file is uploaded, returning a 400 Bad Request

## Phase 5: Polish & Cross-Cutting Concerns
*Goal: Refinement and final quality checks.*

- [x] T010 Review `src/app/api/admin/products/import/route.ts` for proper error handling and async wrapper usage — try/catch wraps entire handler; each error path returns correct HTTP status
- [x] T011 Verify memory buffer cleanup and memory usage constraints for large files — using `file.arrayBuffer()` (stream-safe); no temp files written to disk

---

## Dependencies & Execution Order

- **Setup** (T001-T002) — completed (dependencies already present).
- **Foundational** (T003) — completed (Prisma schema already defines Product).
- **US1** (T004-T007) — completed; T004, T005, T006 implemented in `route.ts`.
- **US2** (T008-T009) — completed; validation merged into same handler.
- **Polish** (T010-T011) — completed; reviewed and confirmed inline.
