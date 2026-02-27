# Quickstart: Bulk Excel Import Feature

This guide explains how to get started with the bulk Excel import feature for products.

## Prerequisites
- Node.js and Express.js environment set up.
- MongoDB database running with Mongoose connected.
- The `multer` and `xlsx` packages installed:
  ```bash
  npm install multer xlsx
  ```

## Overview
The feature allows administrators to upload an Excel file containing product data with specific Arabic column headers. The system parses the file in-memory and upserts the products into the MongoDB `Product` collection using the `sku` as the unique identifier.

## Testing the API
You can test the API endpoint using cURL, Postman, or the frontend UI once integrated.

**Example cURL command:**
```bash
curl -X POST http://localhost:3000/api/admin/products/import \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/products.xlsx"
```

Ensure your Excel file has the following columns at minimum:
- `باركود` (SKU)
- `اسم الصنف` (Name)
- `سعر البيع` (Price)
