import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

interface ExcelRow {
  SKU?: string;
  Name?: string;
  Price?: number | string;
  Brand?: string;
  Description?: string;
  Viscosity?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "No Excel file provided." } },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Excel file is empty." } },
        { status: 422 }
      );
    }

    const sheet = workbook.Sheets[sheetName];
    const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "No data rows found in the spreadsheet." } },
        { status: 422 }
      );
    }

    const errors: string[] = [];
    const validProducts: {
      sku: string;
      name: string;
      price: number;
      brand?: string;
      description?: string;
      viscosity?: string;
    }[] = [];

    rows.forEach((row, index) => {
      const rowNum = index + 2; // 1 for header, 1 for 0-index
      if (!row.SKU) errors.push(`Row ${rowNum}: missing SKU`);
      if (!row.Name) errors.push(`Row ${rowNum}: missing Name`);
      const price = parseFloat(String(row.Price ?? ""));
      if (isNaN(price) || price <= 0)
        errors.push(`Row ${rowNum}: invalid Price`);

      if (row.SKU && row.Name && !isNaN(price) && price > 0) {
        validProducts.push({
          sku: String(row.SKU),
          name: String(row.Name),
          price,
          brand: row.Brand ? String(row.Brand) : undefined,
          description: row.Description ? String(row.Description) : undefined,
          viscosity: row.Viscosity ? String(row.Viscosity) : undefined,
        });
      }
    });

    // Bulk insert valid products using skipDuplicates
    let importedCount = 0;
    if (validProducts.length > 0) {
      const result = await prisma.product.createMany({
        data: validProducts,
        skipDuplicates: true,
      });
      importedCount = result.count;
    }

    return NextResponse.json({
      importedCount,
      skippedCount: rows.length - importedCount - errors.length,
      errors,
    });
  } catch (err) {
    console.error("[POST /api/admin/products/import]", err);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Import failed." } },
      { status: 500 }
    );
  }
}
