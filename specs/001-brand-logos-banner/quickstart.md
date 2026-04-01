# Quickstart: Brand Logos Banner Development

## Prerequisites

1. MongoDB connection URI must be valid in `.env` (`DATABASE_URL`).
2. Cloudinary credentials must be set in `.env` for image uploads.
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## Setup

1. **Database Update**: The Prisma schema will have a new `BrandLogo` model. Make sure to generate the Prisma client after updating the schema:
   ```bash
   npx prisma generate
   ```
2. **Push to DB**:
   ```bash
   npx prisma db push
   ```

## Local Development

Start the development server:
```bash
npm run dev
```

- **Admin UI**: Navigate to `/admin/brand-logos` to add, view, or remove brands.
- **Storefront UI**: Navigate to the home page `/` to verify the CSS marquee animation is rendering correctly.

**Testing Notes**:
- Upload an image in the admin panel and ensure it appears immediately on the home page.
- Test responsive layout by viewing the scrolling banner on a mobile-sized viewport (e.g. using browser dev tools).
