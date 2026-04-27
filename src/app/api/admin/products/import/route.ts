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
 *   1  → رقم الصنف            → sku              (REQUIRED)
 *   2  → اسم الصنف            → name             (REQUIRED)
 *   3  → إجمالى الكمية        → totalQuantity    (optional)
 *   4  → KM                   → viscosity        (optional)
 *   5  → سعر البيع            → price            (REQUIRED)
 *   6  → متوسط سعر الشراء     → avgPurchasePrice (optional)
 *   7  → آخر سعر شراء         → lastPurchasePrice(optional)
 *   8  → باركود               → barcode          (optional)
 *   9  → كود الصنف 1          → itemCode         (optional)
 *   10 → بلد المنشاءة         → countryOfOrigin  (optional)
 *   11 → التصنيف              → category name    (optional – upserted)
 *   12 → الوحدة               → unit             (optional)
 */

const REQUIRED_COLUMNS = ["رقم الصنف", "اسم الصنف", "سعر البيع"] as const;

// Header row index (0-based). In this file the real headers are on row 3 (index 2).
const HEADER_ROW_INDEX = 2;

interface MappedProduct {
  sku: string;
  name: string;
  price: number;
  viscosity?: string;
  totalQuantity?: number;
  avgPurchasePrice?: number;
  lastPurchasePrice?: number;
  barcode?: string;
  itemCode?: string;
  countryOfOrigin?: string;
  unit?: string;
  categoryName?: string;
}

/** Parse a numeric cell – strips commas, returns undefined if not a valid number */
function parseNum(raw: unknown): number | undefined {
  if (raw == null || raw === "") return undefined;
  const n = parseFloat(String(raw).replace(/,/g, ""));
  return isNaN(n) ? undefined : n;
}

/** Parse a string cell – returns undefined if empty */
function parseStr(raw: unknown): string | undefined {
  if (raw == null) return undefined;
  const s = String(raw).trim();
  return s === "" ? undefined : s;
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
    const idxTotalQty = colIndex("إجمالى الكمية");
    const idxViscosity = colIndex("KM");
    const idxAvgPurchase = colIndex("متوسط سعر الشراء");
    const idxLastPurchase = colIndex("آخر سعر شراء");
    const idxBarcode = colIndex("باركود");
    const idxItemCode = colIndex("كود الصنف 1");
    const idxCountryOfOrigin = colIndex("بلد المنشاءة");
    const idxCategory = colIndex("التصنيف");
    const idxUnit = colIndex("الوحدة");

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

        // Optional numeric fields
        const totalQty = parseNum(idxTotalQty >= 0 ? cells[idxTotalQty] : undefined);
        const avgPurchase = parseNum(idxAvgPurchase >= 0 ? cells[idxAvgPurchase] : undefined);
        const lastPurchase = parseNum(idxLastPurchase >= 0 ? cells[idxLastPurchase] : undefined);

        if (totalQty !== undefined) product.totalQuantity = totalQty;
        if (avgPurchase !== undefined) product.avgPurchasePrice = avgPurchase;
        if (lastPurchase !== undefined) product.lastPurchasePrice = lastPurchase;

        // Optional string fields
        const viscosity = parseStr(idxViscosity >= 0 ? cells[idxViscosity] : undefined);
        const barcode = parseStr(idxBarcode >= 0 ? cells[idxBarcode] : undefined);
        const itemCode = parseStr(idxItemCode >= 0 ? cells[idxItemCode] : undefined);
        const countryOfOrigin = parseStr(idxCountryOfOrigin >= 0 ? cells[idxCountryOfOrigin] : undefined);
        const unit = parseStr(idxUnit >= 0 ? cells[idxUnit] : undefined);
        const categoryName = parseStr(idxCategory >= 0 ? cells[idxCategory] : undefined);

        if (viscosity) product.viscosity = viscosity;
        if (barcode) product.barcode = barcode;
        if (itemCode) product.itemCode = itemCode;
        if (countryOfOrigin) product.countryOfOrigin = countryOfOrigin;
        if (unit) product.unit = unit;
        if (categoryName) product.categoryName = categoryName;

        validProducts.push(product);
      }
    });

    // Bulk write with upsert
    let importedCount = 0;
    let updatedCount = 0;

    if (validProducts.length > 0) {
      // Step 1: collect all unique category names and upsert them first
      const categoryNames = [
        ...new Set(
          validProducts
            .map((p) => p.categoryName)
            .filter((n): n is string => !!n)
        ),
      ];

      const categoryMap = new Map<string, string>(); // name → id

      for (const catName of categoryNames) {
        const slug = catName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\u0600-\u06FFa-z0-9-]/g, "");
        const cat = await prisma.category.upsert({
          where: { slug },
          update: { name: catName },
          create: { name: catName, slug },
        });
        categoryMap.set(catName, cat.id);
      }

      // Step 2: upsert products (WITHOUT categoryId – that lives in the join table)
      const upsertOps = validProducts.map((product) => {
        const payload = {
          name: product.name,
          price: product.price,
          viscosity: product.viscosity ?? null,
          totalQuantity: product.totalQuantity ?? null,
          avgPurchasePrice: product.avgPurchasePrice ?? null,
          lastPurchasePrice: product.lastPurchasePrice ?? null,
          barcode: product.barcode ?? null,
          itemCode: product.itemCode ?? null,
          countryOfOrigin: product.countryOfOrigin ?? null,
          unit: product.unit ?? null,
        };

        return prisma.product.upsert({
          where: { sku: product.sku },
          update: payload,
          create: { sku: product.sku, ...payload },
        });
      });

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

      // Step 3: link products to categories via the ProductCategory join table
      for (let i = 0; i < validProducts.length; i++) {
        const product = validProducts[i];
        const categoryId = product.categoryName
          ? (categoryMap.get(product.categoryName) ?? null)
          : null;

        if (categoryId) {
          const productId = results[i].id;
          await prisma.productCategory.upsert({
            where: {
              productId_categoryId: { productId, categoryId },
            },
            update: {},
            create: { productId, categoryId },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      importedCount,
      updatedCount,
      skippedCount:
        dataRows.filter((r) => {
          const cells = r as unknown[];
          const s = String(cells[idxSku] ?? "").trim();
          const n = String(cells[idxName] ?? "").trim();
          return s || n;
        }).length -
        validProducts.length -
        importErrors.length,
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
