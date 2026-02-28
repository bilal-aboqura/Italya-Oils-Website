# Phase 0: Research & Architecture Decisions

Based on the prompt constraints and feature specifications, the following technology choices have been made:

## 1. File Upload Handling
- **Decision**: `multer` configured with memory buffer.
- **Rationale**: The user explicitly requested using `multer` with a memory buffer. This avoids the need to save the file to disk temporarily, which is efficient for moderate-sized Excel files and simplifies cleanup.
- **Alternatives considered**: Disk storage with `multer` (rejected per user constraint).

## 2. Excel Parsing
- **Decision**: `xlsx` library.
- **Rationale**: The user explicitly requested the `xlsx` library to parse the buffer into a JSON array, which is an industry standard for Node.js Excel parsing.
- **Alternatives considered**: `exceljs` (rejected per user constraint).

## 3. Database & Mapping
- **Decision**: Mongoose (`insertMany` or `bulkWrite`).
- **Rationale**: Required by user instructions. `insertMany` is highly efficient for bulk insertions. The Arabic keys ('باركود', 'اسم الصنف', 'سعر البيع') will be mapped to standard English keys (`sku`, `name`, `price`) before insertion. Duplicate SKUs will update existing records, which favors `bulkWrite` with `updateOne` operations (upsert).

All previous "NEEDS CLARIFICATION" items have been resolved by explicit user instructions and the clarification session.
