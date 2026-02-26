# API Contracts: Automotive Oils E-Commerce Platform

Since the architecture separates the Next.js React frontend from the Next.js API Routes (acting as the backend), we define the following contracts.

## 1. Storefront

### GET /api/storefront/products

Fetches the active product catalog for the customer storefront.

- **Query Params**:
  - `brand` (optional): Filter by brand.
  - `category` (optional): Filter by category slug.
- **Response**:
  ```json
  {
    "products": [
      {
        "id": "uuid",
        "name": "Mobil 1 Advanced",
        "price": 45.99,
        "brand": "Mobil 1",
        "imageUrl": "/uploads/image.jpg",
        "category": { "name": "Engine Oils" }
      }
    ]
  }
  ```

### GET /api/storefront/promos

Fetches active dynamic banners for a specific page.

- **Query Params**:
  - `targetPage` (required): e.g., `/`, `/category/engine-oils`.
- **Response**:
  ```json
  {
    "banners": [
      {
        "imageUrl": "/uploads/promo1.jpg",
        "linkUrl": "/product/sale",
        "sortOrder": 1
      }
    ]
  }
  ```

## 2. Admin Panel

### POST /api/admin/products/import

Bulk creates products from a parsed Excel file.

- **Content-Type**: `application/json` (Frontend parses `.xlsx` using `xlsx` library and sends JSON to avoid complex multi-part streaming, or sends the `FormData` file buffer directly for server parsing).
- **Body** (if JSON): array of parsed objects `[{ "SKU": "123", "Name": "Oil", "Price": 50 }]`
- **Response**: `200 OK`, `{ "importedCount": 500, "errors": [] }`

### PATCH /api/admin/products/bulk-category

Assigns a single category to multiple products.

- **Body**:
  ```json
  {
    "productIds": ["uuid1", "uuid2"],
    "categoryId": "uuid_cat"
  }
  ```
- **Response**: `200 OK`, `{ "updatedCount": 2 }`

### POST /api/admin/upload

Handles single image uploads (Promos and individual Products).

- **Content-Type**: `multipart/form-data`
- **Body**: `file` (binary)
- **Response**: `200 OK`, `{ "url": "/uploads/filename.jpg" }`
