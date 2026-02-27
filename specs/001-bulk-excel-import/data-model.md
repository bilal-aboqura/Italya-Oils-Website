# Data Model: Bulk Excel Import

## Entities

### `Product`
Represents an individual item in the inventory within the MongoDB database.

**Fields**:
- `sku` (String, Required, Unique): Mapped from the 'باركود' column. Used for identifying and upserting existing products.
- `name` (String, Required): Mapped from the 'اسم الصنف' column. The display name of the product.
- `price` (Number, Required): Mapped from the 'سعر البيع' column. The selling price.
- `brand` (String, Optional): Mapped from an optional Brand column if present.
- `description` (String, Optional): Mapped from an optional Description column if present.

**Validation Rules**:
- The `sku` must be unique across the collection.
- `name` and `price` must be present. Price must be a valid number ≥ 0.

---

## State Transitions / Workflows
For the bulk import process, the data flows as follows:
1. File uploaded (Memory Buffer).
2. Buffer parsed to JSON array (raw Arabic keys).
3. JSON array iterated and mapped to the `Product` schema fields.
4. Validation performed. Invalid rows are skipped or lead to file rejection (depending on strictness, but we will skip invalid rows and report them based on common bulk import UX, though SC-003 says we reject the *file* if mandatory headers are missing globally).
5. Database execution via Mongoose `bulkWrite` for upserting products by `sku`.
