# API Contracts: Brand Logos Banner

## `GET /api/admin/brand-logos`
Fetches a list of all brand logos for the admin panel.

**Response:**
```json
{
  "logos": [
    {
      "id": "abc123xyz",
      "name": "Brand A",
      "imageUrl": "https://res.cloudinary.com/...",
      "isActive": true,
      "order": 0
    }
  ]
}
```

## `POST /api/admin/brand-logos`
Creates a newly uploaded brand logo. The image payload will be handled likely through a form-data payload or a pre-uploaded Cloudinary secure URL string depending on the upload flow.

**Request Body (JSON):**
```json
{
  "name": "Brand A",
  "imageUrl": "https://res.cloudinary.com/..."
}
```

**Response (201 Created):**
```json
{
  "id": "abc123xyz",
  "name": "Brand A",
  "imageUrl": "https://res.cloudinary.com/...",
  "isActive": true,
  "order": 0
}
```

## `PUT /api/admin/brand-logos/:id`
Updates properties like `isActive` or `order` for a logo.

**Request Body (JSON):**
```json
{
  "isActive": false,
  "order": 1
}
```

## `DELETE /api/admin/brand-logos/:id`
Deletes a brand logo entry.

**Response (200 OK):**
```json
{
  "success": true
}
```

## `GET /api/storefront/brand-logos` (Optional)
If not using Server Components directly, this endpoint fetches active logos for the marquee.

**Response:**
```json
{
  "logos": [
    {
      "id": "abc123xyz",
      "name": "Brand A",
      "imageUrl": "https://res.cloudinary.com/...",
      "order": 0
    }
  ]
}
```
