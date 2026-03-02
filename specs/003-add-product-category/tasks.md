# Implementation Tasks: Add Product Category

**Feature Branch**: `001-add-product-category`
**Generated**: 2026-02-28 20:00

## Strategy
We will implement the feature in a single pass focused on the primary User Story (Add a New Category). The backend API will be built first (Foundation/Core) so that the UI component can immediately integrate with it. The API operates independently of the UI and handles validation, slug generation, and database interactions through Prisma.

## Phase 1: Setup
*(No feature-specific external libraries or complex scaffolding needed. Relying on existing Next.js, Tailwind, and Prisma setup.)*

- [x] T001 Create a placeholder file for the API route `src/app/api/admin/categories/route.ts`
- [x] T002 Create a placeholder file for the UI component `src/components/admin/AddCategoryModal.tsx`

## Phase 2: Foundational (Backend API)
*Goal: Provide a stable, tested endpoint for the UI to consume.*

- [x] T003 [P] Implement `POST` handler in `src/app/api/admin/categories/route.ts` to parse incoming JSON payload.
- [x] T004 Implement server-side validation in `src/app/api/admin/categories/route.ts` to ensure `name` is provided (FR-008).
- [x] T005 Implement slug auto-generation logic inside the route handler, parsing the category `name` (FR-011).
- [x] T006 Integrate Prisma `upsert` or `create` wrapped in a try/catch mapping `P2002` to a 409 Conflict error for duplicates (FR-012).
- [x] T007 Return the 201 Created response containing the new category data matching the API contract.

## Phase 3: User Story 1 - Add a New Category (Priority: P1)
*Goal: As an administrator, I want to add a new product category by clicking "إضافة تصنيف".*
*Independent Test: Can be fully tested by clicking the "إضافة تصنيف" button, filling the form with valid data, submitting, and verifying that the category is saved in the database.*

- [x] T008 [US1] Build the visual modal container in `src/components/admin/AddCategoryModal.tsx` matching existing dark theme and glassmorphism (FR-001).
- [x] T009 [US1] Add form inputs for "Category Name" (required) and "Description" (optional) inside the modal (FR-007, FR-009).
- [x] T010 [US1] Implement local React state (`useState`) to manage form data, loading state, and error/success messages.
- [x] T011 [US1] Add client-side validation to prevent submission if "Category Name" is empty (FR-002, SC-002).
- [x] T012 [US1] Implement the `fetch` API call inside the form `onSubmit` handler pointing to `POST /api/admin/categories` (FR-010).
- [x] T013 [US1] Handle API responses (display 409 conflict errors, general 500 errors, or close modal on 201 success).
- [x] T014 [US1] Export a trigger button "إضافة تصنيف" from the component, or integrate it into the parent page.
- [x] T015 [US1] Import and mount `<AddCategoryModal />` inside `src/app/admin/products/page.tsx` near the existing page header/actions (FR-006).
- [x] T016 [US1] Ensure the product table or category list refreshes (via `router.refresh()` or state update) upon successful modal submission so the new category is visible immediately (SC-003).

## Final Phase: Polish & Review
- [ ] T017 Verify responsive design of the modal on mobile viewport sizes.
- [ ] T018 Test edge cases: exact duplicate names, extremely long names, and empty form submissions.

## Dependencies & Execution Order
1. **T001 - T002** (Setup paths)
2. **T003 - T007** (Backend implementation) - *Can be done in parallel to UI framing.*
3. **T008 - T016** (Frontend UI and Integration) - *Depends on backend API contract (T007) for full integration, but UI build (T008-T010) can happen parallel to T003.*
4. **T017 - T018** (Verification) - *Depends on all previous tasks.*
