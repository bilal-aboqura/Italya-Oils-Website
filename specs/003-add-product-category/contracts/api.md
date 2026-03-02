# API Contract: Add Category

**Endpoint**: `POST /api/admin/categories`

## Request Definition

**Headers**:
- `Content-Type`: `application/json`

**Body**:
```json
{
  "name": "string",        // Required (e.g. "Motor Oils")
  "description": "string"  // Optional (e.g. "High performance racing oils")
}
```

**Client-Side Validation Constraints**:
- `name` must be a non-empty string.
- (Implicit) `name` should be stripped of leading/trailing whitespace before sending.

## Response Definition

### Success (201 Created)
Returns the created category object.

```json
{
  "success": true,
  "category": {
    "id": "64b5f923b7e9a2d3c4123456",
    "name": "Motor Oils",
    "slug": "motor-oils",
    "description": "High performance racing oils",
    "createdAt": "2026-02-28T18:00:00.000Z",
    "updatedAt": "2026-02-28T18:00:00.000Z"
  }
}
```

### Validation Error (400 Bad Request)
Returned when the `name` field is missing or empty.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "اسم التصنيف مطلوب" // "Category name is required"
  }
}
```

### Conflict Error (409 Conflict)
Returned when a category with the same name or slug already exists (FR-012).

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "يوجد تصنيف بهذا الاسم بالفعل" // "A category with this name already exists"
  }
}
```

### Server Error (500 Internal Server Error)
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "حدث خطأ داخلي أثناء حفظ التصنيف"
  }
}
```
