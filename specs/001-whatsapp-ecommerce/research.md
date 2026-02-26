# Research: Automotive Oils E-Commerce Platform

**Feature**: `001-whatsapp-ecommerce`
**Status**: Completed

## 1. Next.js Tech Stack & Architecture

- **Decision**: Next.js (App Router) + Tailwind CSS (configured to wrap the provided antigravity HTML UI) + Prisma ORM (with PostgreSQL or SQLite for local dev).
- **Rationale**: The user requested a modern Full Stack architecture like Next.js. Next.js App Router provides excellent server-side rendering for SEO (important for e-commerce) and easy integration of API routes for the admin panel. Prisma provides strong typing for the product/category schemas.
- **Alternatives considered**: MERN stack (React + Express + MongoDB). Rejected because Next.js offers a more unified full-stack developer experience without needing to manage a separate backend server.

## 2. WhatsApp Checkout Link Generation

- **Decision**: Client-side generation of `wa.me` links using standard `encodeURIComponent`.
- **Rationale**: Since there is no traditional payment gateway, the checkout process simply involves formatting the cart state and contact details into a text string and opening a WhatsApp URL. This can be handled entirely on the client, minimizing backend complexity and reducing the risk of order loss if the server temporarily goes down.
- **Alternatives considered**: Server-side generation or using a dedicated WhatsApp Business API integration. Rejected because the requirement specifies a simple "message to a designated customer service WhatsApp number" which is perfectly fulfilled by `wa.me` deep links without API overhead.

## 3. Bulk Excel Upload Parsing (`xlsx` library)

- **Decision**: Use the `xlsx` NPM package in a Next.js Server Action or API Route.
- **Rationale**: The user explicitly requested the `xlsx` library. It is well-maintained and capable of parsing standard Excel files into JSON objects which can then be validated and bulk-inserted into the database via Prisma `createMany`.
- **Alternatives considered**: `csv-parser` or `papaparse`. Rejected because the requirement explicitly mentions Excel spreadsheets and the `xlsx` library.

## 4. Admin Panel Image Management

- **Decision**: Store image metadata (URLs/paths) in the database and the actual files in a structured local `/public/uploads` directory (or AWS S3/Cloudinary for production).
- **Rationale**: The spec requires admins to "upload and attach their missing images later." A straightforward file upload API route combined with a modular React component in the admin panel provides the necessary UX.
- **Alternatives considered**: Base64 encoding images in the database. Rejected due to severe performance degradation for an e-commerce catalog.

## 5. Dynamic Promo Banners

- **Decision**: Database table mapping banners to specific page routes (e.g., `/`, `/category/engine-oils`). The frontend will fetch active banners for the current route and render them in a carousel component (per Clarification 3).
- **Rationale**: Supports the requirement to "inject promotional banners into specific storefront pages directly from the dashboard." Allowing multiple banners requires a carousel or stacking mechanism to maintain UI consistency.
