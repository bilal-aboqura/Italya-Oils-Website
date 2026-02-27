# API Contract: Bulk Excel Import

## Endpoint: Import Products
- **Path**: `/api/admin/products/import` (or similar depending on routing structure)
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

### Request
- **Body**: 
  - `file`: The Excel file (`.xlsx` or `.xls`) to be uploaded.

### Successful Response
- **Status Name**: `200 OK`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "success": true,
    "importedCount": 150,
    "message": "Successfully imported 150 products."
  }
  ```

### Error Responses

#### Missing Mandatory Headers
- **Status Name**: `400 Bad Request`
- **Body**:
  ```json
  {
    "success": false,
    "message": "Missing required column headers: 'باركود', 'اسم الصنف', 'سعر البيع'"
  }
  ```

#### No File Uploaded or Invalid Type
- **Status Name**: `400 Bad Request`
- **Body**:
  ```json
  {
    "success": false,
    "message": "Please upload a valid Excel file (.xlsx or .xls)"
  }
  ```
