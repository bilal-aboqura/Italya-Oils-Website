# Data Model: Add Product Category

## Existing Entity: `Category`

This entity already exists in `prisma/schema.prisma` but is documented here for completeness of the feature.

**Mapped Collection**: `categories`

| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` | Primary Key, MongoDB ObjectId. |
| `name` | `String` | `@unique` | The display name of the category (Required). |
| `slug` | `String` | `@unique` | URL-friendly version of the name, auto-generated in backend (Required). |
| `description` | `String` | `?` (Optional) | Brief description of the category. |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp. |
| `updatedAt` | `DateTime` | `@updatedAt` | Automatic update timestamp. |
| `products` | `Product[]` | Relation | One-to-many relationship giving access to products in this category. |

**Database Constraints**:
- Unique constraint on `name` to prevent duplicate categories.
- Unique constraint on `slug` to prevent duplicate URLs.

**State Transitions**:
- Creation: Values populate `name`, `description`. `slug` is generated. Server dates are set.
