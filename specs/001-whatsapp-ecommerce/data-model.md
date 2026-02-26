# Data Model: Automotive Oils E-Commerce Platform

This data model supports the Next.js + Prisma ORM architecture outlined in `research.md`.

## Core Entities

### Product

Represents a physical engine oil item in the catalog.

- `id`: String (UUID, Prisma default) @id
- `sku`: String @unique - Stock Keeping Unit (from Excel import)
- `name`: String - Full product name (e.g., "Mobil 1 Advanced Full Synthetic Motor Oil 5W-30")
- `description`: String - Detailed description from Excel
- `price`: Float - Selling price (stored as float/decimal to match Salla/Shopify CSV format, or integer cents if precision required)
- `brand`: String - e.g., Mobil 1, Shell, Castrol (from Excel import)
- `viscosity`: String? - e.g., 5W-30, 10W-40 (optional, extracted from text or explicit column)
- `imageUrl`: String? - Path to the attached image in the `/public/uploads/` directory. Nullable since Excel imports lack images initially.
- `categoryId`: String? - Foreign key to Category. Nullable for newly imported products awaiting bulk assignment.
- `createdAt`: DateTime @default(now())
- `updatedAt`: DateTime @updatedAt

_Relationships:_

- Belongs to one `Category` (optional)

### Category

Represents a logical grouping of products for storefront browsing.

- `id`: String (UUID) @id
- `name`: String @unique - e.g., "Engine Oils", "Transmission Fluids", "Castrol Products"
- `slug`: String @unique - URL-friendly version of name
- `description`: String?
- `createdAt`: DateTime @default(now())
- `updatedAt`: DateTime @updatedAt

_Relationships:_

- Has many `Product`s

### PromoBanner

Represents a dynamic marketing banner to be injected into specific pages.

- `id`: String (UUID) @id
- `title`: String - Internal name for the admin (e.g., "Ramadan Oil Sale")
- `imageUrl`: String - Path to the uploaded banner graphic.
- `linkUrl`: String? - Action URL if a customer clicks the banner.
- `targetPage`: String - The route where this banner should appear (e.g., `/`, `/category/engine-oils`).
- `isActive`: Boolean @default(true)
- `sortOrder`: Int @default(0) - To control stacking/carousel order if multiple banners target the same page.
- `createdAt`: DateTime @default(now())
- `updatedAt`: DateTime @updatedAt

_Relationships:_

- Standalone entity queried by `targetPage` and `isActive`.

## Storefront State (Client-Side Only)

The shopping cart and contact form state are entirely managed on the client side (e.g., using React Context, Zustand, or simple LocalStorage/SessionStorage) to maintain a fast, stateless frontend for the "no payment gateway" flow.

### CartState

- `items`: Array of CartItem objects
  - `productId`: String
  - `sku`: String
  - `name`: String
  - `price`: Float
  - `quantity`: Int
- `customerDetails`: Object
  - `name`: String
  - `deliveryAddress`: String
  - `phoneNumber`: String
- `totalPrice`: Float (computed)

## Validation Rules & Requirements

1. **WhatsApp Checkout (CartState)**
   - `customerDetails.name`: Required, min 2 characters.
   - `customerDetails.deliveryAddress`: Required, min 10 characters (ensure enough detail for driver).
   - `customerDetails.phoneNumber`: Required, valid phone number format (regex check).
   - `items`: Must contain at least 1 item with quantity > 0.
   - _Action_: If valid, frontend `encodeURIComponent`s the order summary and opens `wa.me/GlobalBusinessNumber?text=EncodedString`.

2. **Bulk Excel Upload (`Product`)**
   - The `/api/admin/products/import` route must accept an Excel payload via the `xlsx` library.
   - Required columns in Excel: `SKU`, `Name`, `Price`.
   - Optional columns: `Brand`, `Description`, `Viscosity`.
   - _Action_: Server parses JSON from `xlsx`, maps to Prisma `ProductCreateManyInput`, and executes bulk insert.

3. **Promo Banner Upload (`PromoBanner`)**
   - `imageUrl`: Must be an uploaded image file (validate MIME type: `image/jpeg`, `image/png`, `image/webp`).
   - `targetPage`: Required route string.
