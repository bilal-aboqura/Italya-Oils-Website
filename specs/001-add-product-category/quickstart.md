# Quickstart: Add Product Category

## Overview
This feature adds a UI button "إضافة تصنيف" to the admin products page, allowing administrators to create a new category quickly without leaving the page. It connects to a new backend API endpoint that leverages Prisma and MongoDB.

## Development Setup
No new environment variables or external dependencies are required for this feature. The existing Prisma setup and Next.js App Router will be used.

## Useful Commands
- `npm run dev` - Run the development server
- `npx prisma db push` - Push schema changes (not strictly needed since `Category` model exists, but good for syncing if new)
- `npx prisma generate` - Generate Prisma client
- `npx prisma studio` - Browse the database locally to verify category creation

## Key Files to Edit/Create
1. `src/components/admin/AddCategoryModal.tsx` (New)
2. `src/app/admin/products/page.tsx` (Modify to include the button/modal)
3. `src/app/api/admin/categories/route.ts` (New API route)

## API Testing (cURL Example)
```bash
curl -X POST http://localhost:3000/api/admin/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"زيوت الفرامل", "description":"سوائل الفرامل عالية الأداء"}'
```
