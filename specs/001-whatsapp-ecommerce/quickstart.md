# Quickstart: Automotive Oils E-Commerce Platform

This guide covers setting up the development environment for the `001-whatsapp-ecommerce` platform.

## Prerequisites

- Node.js 18.x or 20.x
- npm or pnpm
- Local PostgreSQL database or SQLite (for quick dev)

## Setup Steps

1. **Install Dependencies**
   Navigate to the repository root (or the initialized Next.js folder) and run:

   ```bash
   npm install
   ```

   Ensure the `xlsx` library and Prisma are installed:

   ```bash
   npm install xlsx
   npm install prisma --save-dev
   npm install @prisma/client
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/italyaoils"
   # OR for SQLite
   # DATABASE_URL="file:./dev.db"

   NEXT_PUBLIC_WHATSAPP_NUMBER="966500000000" # Target customer service number
   ```

3. **Database Initialization**
   Run Prisma migrations to create the Schema (based on `data-model.md`):

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   The storefront will be available at `http://localhost:3000` and the admin panel at `http://localhost:3000/admin`.

## Project Structure Overview

- `/app`: Next.js App Router for frontend storefront.
- `/app/admin`: Admin dashboard routes.
- `/app/api`: Backend API routes handling uploads, bulk Excel imports, etc.
- `/prisma/schema.prisma`: The database schema definition.
- `/public/uploads`: Directory where product images and promo banners will be saved locally.

## Development Notes

- The storefront UI should be ported directly from the `antigravity` HTML UI templates. Use Tailwind CSS and global stylesheets to map the existing classes perfectly.
- Ensure the admin panel uses a modular components approach (`/components/admin`) to allow easy scaling of the dashboard.
