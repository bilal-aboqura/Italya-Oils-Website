# Research: Add Product Category

## 1. Mongoose vs. Existing Prisma Architecture
**Decision**: Use the existing Prisma ORM with the MongoDB provider, retaining the existing `Category` model.  
**Rationale**: The user prompted for "Node.js, Express, and Mongoose" with "a new Mongoose schema for Category." However, the repository is already built as a Next.js App Router full-stack application utilizing Prisma (`prisma/schema.prisma`) connected to MongoDB. Introducing Express and Mongoose alongside Next.js App Router and Prisma would fracture the architecture, increase bundle size, add unnecessary complexity, and violate the principle of "High-Performance Modular Code." We will build the new endpoint using Next.js Route Handlers (`src/app/api/...`) and Prisma.  
**Alternatives considered**: 
- Scaffolding an external Express server (rejected for operational complexity).
- Adding Mongoose to the Next.js app alongside Prisma (rejected as redundant and anti-pattern).

## 2. Slug Generation Logic
**Decision**: Use a standard string parsing utility in the API route handler to generate the slug from the Category Name.  
**Rationale**: The specification (FR-011) mandates auto-generating a URL-friendly slug seamlessly in the backend. We will lowercase the string, replace spaces with hyphens, and remove special characters. This ensures the slug is safe for URLs and unique indexes.  
**Alternatives considered**: Using an external library like `slugify` (considered, but a lightweight regex solution avoids new dependencies unless Arabic characters specifically require it; we will use a robust regex that supports Arabic).

## 3. Duplicate Category Handling
**Decision**: The Prisma `create` call will be wrapped in a try/catch block to catch the `P2002` unique constraint violation error on `name` or `slug`.  
**Rationale**: The specification (FR-012) requires returning an error message if a category with the exact name already exists. Prisma throws a specific error code (`P2002`) when a unique constraint fails, making it easy to return a clean 409 Conflict HTTP response to the frontend.  
**Alternatives considered**: Querying first with `findUnique` before inserting (rejected due to theoretical race conditions, though rare. Catching the DB-level constraint error is safer and more performant).
