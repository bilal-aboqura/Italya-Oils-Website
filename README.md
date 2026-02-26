# ItalyaOils — Automotive Engine Oils E-Commerce Platform

A modern full-stack e-commerce platform for automotive engine oils (Mobil 1, Shell, Castrol, TotalEnergies) built with Next.js 15, Tailwind CSS, and Prisma ORM.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (prod) / SQLite (dev) via Prisma ORM
- **Excel Parsing**: `xlsx` library
- **State Management**: Zustand (client-side cart)

## Features

- 🛒 **Storefront**: Browse products, filter by brand/category, manage shopping cart
- 📱 **WhatsApp Checkout**: Cart + contact details sent via `wa.me` deep link
- 📊 **Admin - Bulk Import**: Upload 500+ products via Excel spreadsheet
- 🏷️ **Admin - Post-Import**: Bulk-assign categories and upload product images
- 🎯 **Admin - Dynamic Promos**: Inject promotional banners on any storefront page

## Getting Started

See [`specs/001-whatsapp-ecommerce/quickstart.md`](specs/001-whatsapp-ecommerce/quickstart.md) for full setup instructions.

```bash
npm install
cp .env.example .env.local
npx prisma migrate dev --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the storefront.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin Panel.
