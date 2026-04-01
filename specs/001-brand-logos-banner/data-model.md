# Data Model: Brand Logos Banner

## Entities

### `BrandLogo`

Represents a featured brand partner whose logo is displayed on the storefront.

**Fields:**
- `id` (String / ObjectID, Primary Key): Unique identifier.
- `name` (String): The name of the brand.
- `imageUrl` (String): The fully qualified URL of the uploaded image (e.g. from Cloudinary) or the storage reference.
- `isActive` (Boolean): Defines whether the logo should currently be displayed in the banner. Defaults to true.
- `order` (Integer): Optional sorting index for the brand logo to control its sequence in the banner. Defaults to 0.
- `createdAt` (DateTime): Record creation timestamp.
- `updatedAt` (DateTime): Record last modification timestamp.

**Prisma Schema Representation:**

```prisma
model BrandLogo {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  imageUrl  String
  isActive  Boolean  @default(true)
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Validation Rules

- **name**: Must be non-empty, max 100 characters.
- **imageUrl**: Must be a valid URL string from an allowed hostname.

## Data Lifecycle

- **Create**: Admins submit a name and an image file, the image is uploaded to Cloudinary, and the returned URL is stored in the `BrandLogo` document.
- **Read**: The storefront fetches only the records where `isActive === true`.
- **Update**: Admins can toggle `isActive`, update the `order` index, or update the `name`.
- **Delete**: Admins can hard delete a logo. (Optionally, also trigger Cloudinary file deletion to prevent orphaned assets).
