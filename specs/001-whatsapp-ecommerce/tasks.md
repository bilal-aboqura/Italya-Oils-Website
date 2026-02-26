# Tasks: Automotive Oils E-Commerce & Admin Platform

**Input**: Design documents from `/specs/001-whatsapp-ecommerce/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- Paths shown below map to the Next.js App Router structure defined in plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Next.js 20.x project with App Router, TypeScript, and Tailwind CSS in the root directory
- [ ] T002 Install required dependencies: `prisma`, `@prisma/client`, `xlsx`
- [ ] T003 [P] Configure global Tailwind CSS to match the provided antigravity HTML UI in `src/app/globals.css`
- [ ] T004 Setup `public/uploads` directory to handle local image storage

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Initialize Prisma schema in `prisma/schema.prisma` mapping to SQLite (for dev) or PostgreSQL
- [ ] T006 [P] Create the `Category` model in `prisma/schema.prisma`
- [ ] T007 [P] Create the `Product` model in `prisma/schema.prisma`
- [ ] T008 [P] Create the `PromoBanner` model in `prisma/schema.prisma`
- [ ] T009 Run initial Prisma migration to generate the database schema and client
- [ ] T010 Setup basic Next.js API route error handling utility in `src/lib/api-error.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Customer Browsing and WhatsApp Checkout (Priority: P1) 🎯 MVP

**Goal**: Customers can browse products, manage a cart, and generate a WhatsApp checkout link.

**Independent Test**: Can be fully tested by adding a product to the cart, filling out dummy customer details, and verifying that a correctly formatted WhatsApp link is generated with the order contents.

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create the `/api/storefront/products` GET API route in `src/app/api/storefront/products/route.ts`
- [ ] T012 [P] [US1] Create a client-side Cart State manager (Context or Zustand) in `src/lib/cart-store.ts`
- [ ] T013 [P] [US1] Build the storefront product grid server component in `src/app/(storefront)/page.tsx`
- [ ] T014 [US1] Build the standalone product filter sidebar component in `src/components/ui/ProductList.tsx`
- [ ] T015 [US1] Build the Cart Sheet/Sidebar client component in `src/components/ui/CartPanel.tsx`
- [ ] T016 [US1] Build the Checkout Form component (Name, Address, Phone) with robust client-side validation in `src/components/ui/CheckoutForm.tsx`
- [ ] T017 [US1] Implement the `wa.me` URL generation and redirection utility in `src/lib/whatsapp.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (MVP ready).

---

## Phase 4: User Story 2 - Admin Bulk Import and Post-Import Management (Priority: P1)

**Goal**: Admins can bulk upload products via Excel and bulk-assign categories or upload images later.

**Independent Test**: Can be fully tested by uploading a sample Excel file, verifying the products appear in the dashboard, selecting multiple products to assign a category, and uploading an image to a single product.

### Implementation for User Story 2

- [ ] T018 [P] [US2] Create the generic file upload API Route in `src/app/api/admin/upload/route.ts`
- [ ] T019 [P] [US2] Create the Excel bulk import API Route using `xlsx` in `src/app/api/admin/products/import/route.ts`
- [ ] T020 [P] [US2] Create the bulk category assignment API Route in `src/app/api/admin/products/bulk-category/route.ts`
- [ ] T021 [US2] Build the unified Admin Layout container in `src/app/admin/layout.tsx`
- [ ] T022 [US2] Build the Admin Product List page (with bulk category select UI) in `src/app/admin/products/page.tsx`
- [ ] T023 [US2] Build the Excel Upload UI component in `src/components/admin/ExcelUploader.tsx`
- [ ] T024 [US2] Build the single product edit page (including image upload logic) in `src/app/admin/products/[id]/page.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Admin Dynamic Promos (Priority: P2)

**Goal**: Admins can inject promotional banners into specific storefront pages directly from the dashboard.

**Independent Test**: Can be tested by creating a promo banner in the admin panel, targeting the homepage, and verifying the banner appears on the customer-facing homepage upon reload.

### Implementation for User Story 3

- [ ] T025 [P] [US3] Create the storefront promo fetching API Route in `src/app/api/storefront/promos/route.ts`
- [ ] T026 [P] [US3] Create the admin Promo CRUD API Routes in `src/app/api/admin/promos/route.ts` (and `[id]/route.ts`)
- [ ] T027 [US3] Build the Admin Promo Banner management page in `src/app/admin/promos/page.tsx`
- [ ] T028 [US3] Build a reusable client-side Carousel component for promo display in `src/components/ui/PromoCarousel.tsx`
- [ ] T029 [US3] Integrate `PromoCarousel` into the main storefront page `src/app/(storefront)/page.tsx`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T030 [P] Audit all mobile inputs to ensure proper keyboard layouts (e.g., number pad for Phone)
- [ ] T031 Perform a final cross-device responsive check matching the original HTML UI
- [ ] T032 Verify security of wildcard API endpoints (basic protection on `/api/admin/*` routes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 & 2 can proceed in parallel once Phase 2 is complete.
  - User Story 3 integrates into User Story 1's UI, so US1 must be functional first.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Implementation Strategy

#### MVP First Delivery

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (WhatsApp Checkout)
4. **STOP and VALIDATE**: Test User Story 1 independently. Deploy if ready.
5. Proceed to Phase 4 (Admin Management) iteratively.
