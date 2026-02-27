import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

/**
 * Column mapping for the actual Excel file format used by Italya Oils.
 *
 * File structure:
 *   Row 1 → Merged title "البضاعة" (skip)
 *   Row 2 → Empty (skip)
 *   Row 3 → Column headers (parsed below)
 *   Rows 4+ → Data rows
 *
 * Header row columns (index → Arabic label → DB field):
 *   0  → (empty)              → skip
 *   1  → رقم الصنف            → sku       (REQUIRED)
 *   2  → اسم الصنف            → name      (REQUIRED)
 *   3  → إجمالى الكمية        → skip
 *   4  → KM                   → viscosity (optional)
 *   5  → سعر البيع            → price     (REQUIRED)
 *   6  → متوسط سعر الشراء     → skip
 *   7  → آخر سعر شراء         → skip
 *   8  → باركود               → skip (secondary identifier, not used as PK)
 *   9  → كود الصنف 1          → skip
 *   10 → بلد المنشاءة         → skip
 *   11 → التصنيف              → category name (optional – used for lookup)
 *   12 → الوحدة               → skip
 */

const REQUIRED_COLUMNS = ["رقم الصنف", "اسم الصنف", "سعر البيع"] as const;

// Header row index (0-based). In this file the real headers are on row 3 (index 2).
const HEADER_ROW_INDEX = 2;

interface MappedProduct {
  sku: string;
  name: string;
  price: number;
  viscosity?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "لم يتم إرفاق ملف. يرجى اختيار ملف Excel." } },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(buffer, { type: "buffer" });
    } catch {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "تعذّر قراءة الملف. تأكد أنه ملف Excel صالح (.xlsx أو .xls)." } },
        { status: 422 }
      );
    }

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "الملف فارغ، لا توجد ورقة بيانات." } },
        { status: 422 }
      );
    }

    const sheet = workbook.Sheets[sheetName];

    // Parse the sheet with raw row arrays (header:1) so we can control which row is the header
    const allRows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });

    if (allRows.length <= HEADER_ROW_INDEX) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "الملف لا يحتوي على بيانات كافية." } },
        { status: 422 }
      );
    }

    // Extract the header row and data rows
    const headerRow = (allRows[HEADER_ROW_INDEX] as string[]).map((h) =>
      String(h ?? "").trim()
    );
    const dataRows = allRows.slice(HEADER_ROW_INDEX + 1);

    // Validate required columns exist in the header row
    const missingRequired = REQUIRED_COLUMNS.filter((col) => !headerRow.includes(col));
    if (missingRequired.length > 0) {
      return NextResponse.json(
        {
          error: {
            code: "MISSING_HEADERS",
            message: `الأعمدة التالية مطلوبة وغير موجودة في الملف: ${missingRequired.join("، ")}`,
          },
        },
        { status: 400 }
      );
    }

    // Build a column index map for fast lookup
    const colIndex = (name: string) => headerRow.indexOf(name);
    const idxSku = colIndex("رقم الصنف");
    const idxName = colIndex("اسم الصنف");
    const idxPrice = colIndex("سعر البيع");
    const idxViscosity = colIndex("KM");

    // Iterate and validate every data row
    const importErrors: string[] = [];
    const validProducts: MappedProduct[] = [];

    dataRows.forEach((row, index) => {
      const cells = row as unknown[];
      const rowNum = HEADER_ROW_INDEX + 2 + index; // human-readable row number in spreadsheet

      const rawSku = cells[idxSku];
      const rawName = cells[idxName];
      const rawPrice = cells[idxPrice];

      const sku = rawSku != null ? String(rawSku).trim() : "";
      const name = rawName != null ? String(rawName).trim() : "";
      // Remove any commas from price strings like "1,950"
      const priceStr = String(rawPrice ?? "").replace(/,/g, "");
      const price = parseFloat(priceStr);

      // Skip completely empty rows silently
      if (!sku && !name && (rawPrice === "" || rawPrice == null)) return;

      let rowValid = true;

      if (!sku) {
        importErrors.push(`صف ${rowNum}: رقم الصنف (SKU) مفقود.`);
        rowValid = false;
      }
      if (!name) {
        importErrors.push(`صف ${rowNum}: اسم الصنف مفقود.`);
        rowValid = false;
      }
      if (isNaN(price) || price < 0) {
        importErrors.push(`صف ${rowNum}: سعر البيع غير صالح (${rawPrice}).`);
        rowValid = false;
      }

      if (rowValid) {
        const product: MappedProduct = { sku, name, price };

        // Optional: KM column → viscosity
        if (idxViscosity >= 0) {
          const rawViscosity = cells[idxViscosity];
          if (rawViscosity != null && String(rawViscosity).trim() !== "") {
            product.viscosity = String(rawViscosity).trim();
          }
        }

        validProducts.push(product);
      }
    });

    // Bulk write with upsert – duplicate رقم الصنف (SKU) updates the existing product (FR-013)
    let importedCount = 0;
    let updatedCount = 0;

    if (validProducts.length > 0) {
      const upsertOps = validProducts.map((product) =>
        prisma.product.upsert({
          where: { sku: product.sku },
          update: {
            name: product.name,
            price: product.price,
            viscosity: product.viscosity ?? null,
          },
          create: product,
        })
      );

      const results = await prisma.$transaction(upsertOps);
      const now = Date.now();
      results.forEach((r) => {
        const createdTime = new Date(r.createdAt).getTime();
        if (now - createdTime < 3000) {
          importedCount++;
        } else {
          updatedCount++;
        }
      });
    }

    return NextResponse.json({
      success: true,
      importedCount,
      updatedCount,
      skippedCount: dataRows.filter((r) => {
        const cells = r as unknown[];
        const s = String(cells[idxSku] ?? "").trim();
        const n = String(cells[idxName] ?? "").trim();
        return s || n; // non-empty rows
      }).length - validProducts.length - importErrors.length,
      errors: importErrors,
      message: `تم استيراد ${importedCount} منتج جديد، وتحديث ${updatedCount} منتج موجود.`,
    });
  } catch (err) {
    console.error("[POST /api/admin/products/import]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "حدث خطأ داخلي أثناء الاستيراد." } },
      { status: 500 }
    );
  }
}
