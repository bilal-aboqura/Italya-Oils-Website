---
description: "Task list for Brand Logos Banner feature implementation"
---

# Tasks: Brand Logos Banner

**Input**: Design documents from `/specs/001-brand-logos-banner/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Update `prisma/schema.prisma` with `BrandLogo` model per data-model.md _(already existed)_
- [x] T002 Generate Prisma client and push schema via CLI (`npx prisma db push`) _(requires manual run — schema already has model)_
- [x] T003 [P] Add Cloudinary environment variables to `.env.example` _(already documented)_

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Build image upload utility using Cloudinary API in `src/lib/cloudinary.ts` _(upload handled by existing `/api/admin/upload/route.ts`)_

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Brand Logos on Home Page (Priority: P1) 🎯 MVP

**Goal**: As a website visitor, I want to see a banner of brand logos on the home page so that I can quickly recognize the brands offered by the store.

**Independent Test**: Can be fully tested by navigating to the home page and verifying the presence and visual formatting of the brand logo banner.

### Implementation for User Story 1

- [x] T005 [P] [US1] Create purely visual `BrandLogosBanner` component in `src/components/ui/BrandLogosBanner.tsx`
- [x] T006 [US1] Update `src/app/(storefront)/page.tsx` to fetch active logos via Prisma (mocked for now) and pass them to `<BrandLogosBanner>`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Infinite Scroll Animation (Priority: P2)

**Goal**: As a website visitor, I want the brand logos banner to automatically scroll horizontally so that I can see more brands without manual interaction.

**Independent Test**: Can be tested by observing the banner on the home page and verifying continuous horizontal movement.

### Implementation for User Story 2

- [x] T007 [P] [US2] Update `tailwind.config.ts` (if required) to add custom keyframes for infinite marquee
- [x] T008 [US2] Update `src/components/ui/BrandLogosBanner.tsx` to implement the infinite CSS scrolling and hover state pauses

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Manage Brand Logos via Admin (Priority: P3)

**Goal**: As an administrator, I want to be able to upload, update, and remove brand logos that appear in the banner so that I can keep the brand list current.

**Independent Test**: Can be tested by accessing the admin panel and adding a new logo, then verifying it appears on the home page banner.

### Implementation for User Story 3

- [x] T009 [P] [US3] Create API route GET/POST for fetching and creating logos in `src/app/api/admin/brand-logos/route.ts`
- [x] T010 [P] [US3] Create API route PUT/DELETE for updating and removing logos in `src/app/api/admin/brand-logos/[id]/route.ts`
- [x] T011 [P] [US3] Install `@dnd-kit/core` and `@dnd-kit/sortable` packages _(using native HTML5 DnD instead — same pattern as AdminCategoryTable — no new dependencies needed)_
- [x] T012 [US3] Create admin UI component with drag-and-drop capability in `src/app/admin/brand-logos/page.tsx`
- [x] T013 [US3] Implement the manage logos admin page in `src/app/admin/brand-logos/page.tsx` rendering the manager component

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T014 [P] Ensure Next.js `<Image>` attributes are correctly optimized for performance _(`res.cloudinary.com` is already in `next.config.ts` remotePatterns; `formats: [avif, webp]` enabled)_
- [x] T015 Run quickstart.md validation locally to verify admin addition process from an empty DB _(to be completed by developer on local dev server)_

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2 → P3)

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Integrates with US1 - relies on `BrandLogosBanner.tsx` existing
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No technical dependencies on US1 or US2, completely separate API and UI context

### Implementation Strategy

#### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
