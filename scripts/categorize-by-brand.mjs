/**
 * ============================================================
 *  سكربت التصنيف بناءً على اسم العلامة التجارية (Brand)
 *  يقرأ اسم المنتج ويستخرج منه البراند → يضبط حقلي:
 *   • brand      (String)
 *   • categoryId (ObjectId → Category يحمل اسم البراند)
 * ============================================================
 *  الأمر:  node scripts/categorize-by-brand.mjs
 * ============================================================
 */

import { MongoClient } from "mongodb";
import "dotenv/config";

// ─── خريطة البراندات ──────────────────────────────────────────
// الترتيب مهم: الأكثر تحديداً أولاً
const BRAND_MAP = [
    // ── زيوت المحركات ──
    { brand: "موبيل وان", slug: "mobil-1", keywords: ["موبل وان", "موبيل وان", "mobil 1"] },
    { brand: "موبيل", slug: "mobil", keywords: ["موبل", "موبيل"] },
    { brand: "شل هيلكس", slug: "shell-helix", keywords: ["شل"] },
    { brand: "كاسترول", slug: "castrol", keywords: ["كاسترول"] },
    { brand: "توتال", slug: "total", keywords: ["توتال"] },
    { brand: "ليكوي مولي", slug: "liqui-moly", keywords: ["لوكامولي"] },
    { brand: "موتول", slug: "motul", keywords: ["موتول"] },
    { brand: "مانول", slug: "mannol", keywords: ["مانول"] },
    { brand: "بردال", slug: "bardahl", keywords: ["بردال"] },
    { brand: "RZOIL", slug: "rzoil", keywords: ["RZOIL", "rzoil"] },
    { brand: "بروفي كار", slug: "profi-car", keywords: ["بروفي كار"] },
    { brand: "فوسير", slug: "fosser", keywords: ["فوسير"] },
    { brand: "ETG", slug: "etg", keywords: ["ETG", "etg"] },
    { brand: "كالتكس", slug: "caltex", keywords: ["كالتكس"] },
    { brand: "فاكسول", slug: "vaxxol", keywords: ["فاكسول"] },
    { brand: "اكسا", slug: "axa", keywords: ["اكسا"] },
    { brand: "ابرو", slug: "abro", keywords: ["ابرو"] },
    { brand: "بترومين", slug: "petromin", keywords: ["بترومين"] },

    // ── فتيس (ناقل الحركة) ──
    { brand: "فتيس", slug: "fetis", keywords: ["فتيس"] },

    // ── الإضاءة ──
    { brand: "اوكلاند", slug: "oakland", keywords: ["اوكلاند"] },
    { brand: "اوسرامز", slug: "osrams", keywords: ["اوسرامز"] },

    // ── الكهرباء ──
    { brand: "VDO", slug: "vdo", keywords: ["VDO", "vdo"] },
    { brand: "FIAMM", slug: "fiamm", keywords: ["FIAMM", "fiamm"] },
    { brand: "HELLA", slug: "hella", keywords: ["HELLA", "hella"] },

    // ── البوجيهات ──
    { brand: "NGK", slug: "ngk", keywords: ["NGK", "ngk"] },
    { brand: "بوش", slug: "bosch", keywords: ["بوش"] },

    // ── العناية بالسيارة ──
    { brand: "فلامنجو", slug: "flamingo", keywords: ["فلامنجو"] },
    { brand: "WD40", slug: "wd40", keywords: ["WD40", "wd40"] },
    { brand: "امير", slug: "amar", keywords: ["امير"] },
    { brand: "بوابه", slug: "bawaba", keywords: ["بوابه"] },
    { brand: "VESLEE", slug: "veslee", keywords: ["VESLEE", "veslee"] },
    { brand: "AKAI", slug: "akai", keywords: ["AKAI", "akai"] },
    { brand: "فوكس", slug: "fox", keywords: ["فوكس"] },

    // ── سوائل التبريد ──
    { brand: "هيبو", slug: "hipo", keywords: ["هيبو"] },
    { brand: "رابيدو", slug: "rapido", keywords: ["رابيدو"] },
    { brand: "كانسلير", slug: "kansler", keywords: ["كانسلير"] },
    { brand: "جنك", slug: "genk", keywords: ["جنك"] },

    // ── سوائل الفرامل ──
    { brand: "ATE", slug: "ate", keywords: ["ATE", "ate"] },
    { brand: "بيندكس", slug: "bendix", keywords: ["بيندكس"] },

    // ── فلاتر ──
    { brand: "مان", slug: "mann", keywords: ["مان"] },
    { brand: "فلترون", slug: "filtron", keywords: ["فلترون"] },

    // ── متنوع ──
    { brand: "SCL", slug: "scl", keywords: ["SCL", "scl"] },
];

// ─── Helper: بناء Regex من مصفوفة كلمات ──────────────────────
function buildRegex(keywords) {
    const escaped = keywords.map((k) =>
        k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    return new RegExp(escaped.join("|"), "i");
}

// ─── Main ──────────────────────────────────────────────────────
async function main() {
    const uri = process.env.DATABASE_URL;
    if (!uri) { console.error("❌ DATABASE_URL غير موجود"); process.exit(1); }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("✅ تم الاتصال بقاعدة البيانات\n");

        const db = client.db();
        const categoriesCol = db.collection("categories");
        const productsCol = db.collection("products");

        // ── 1) حذف التصنيفات القديمة (النوعية) وإنشاء التصنيفات الجديدة (البراند) ──
        console.log("🗑️  حذف التصنيفات القديمة...");
        await categoriesCol.deleteMany({});
        console.log("   ✓ تم الحذف\n");

        // ── 2) إنشاء تصنيف لكل براند ─────────────────────────────
        console.log("📂 إنشاء تصنيفات البراندات...");
        const brandCategoryMap = new Map(); // brand → ObjectId

        for (const item of BRAND_MAP) {
            const now = new Date();
            const result = await categoriesCol.insertOne({
                name: item.brand,
                slug: item.slug,
                description: null,
                createdAt: now,
                updatedAt: now,
            });
            brandCategoryMap.set(item.brand, result.insertedId);
            console.log(`   ✚ "${item.brand}" (${result.insertedId})`);
        }

        // ── 3) تصنيف كل منتج + ضبط حقل brand ────────────────────
        console.log("\n🔄 تحديث المنتجات...");

        const products = await productsCol.find({}).toArray();
        let matched = 0;
        let unmatched = 0;

        const bulkOps = [];

        for (const product of products) {
            let foundBrand = null;
            let foundCategoryId = null;

            for (const item of BRAND_MAP) {
                const regex = buildRegex(item.keywords);
                if (regex.test(product.name)) {
                    foundBrand = item.brand;
                    foundCategoryId = brandCategoryMap.get(item.brand);
                    break; // first match wins
                }
            }

            if (foundBrand) {
                matched++;
                bulkOps.push({
                    updateOne: {
                        filter: { _id: product._id },
                        update: {
                            $set: {
                                brand: foundBrand,
                                categoryId: foundCategoryId,
                                updatedAt: new Date(),
                            },
                        },
                    },
                });
            } else {
                unmatched++;
                console.log(`   ⚠️  لم يُعثر على براند: "${product.name}"`);
            }
        }

        if (bulkOps.length > 0) {
            await productsCol.bulkWrite(bulkOps, { ordered: false });
        }

        // ── 4) ملخص ───────────────────────────────────────────────
        console.log("\n═══════════════════════════════════════════════════");
        console.log("              📊 ملخص عملية التصنيف              ");
        console.log("═══════════════════════════════════════════════════");
        console.log(`   إجمالي المنتجات  : ${products.length}`);
        console.log(`   تم تصنيفها       : ${matched} ✅`);
        console.log(`   بدون تصنيف      : ${unmatched} ⚠️`);
        console.log("═══════════════════════════════════════════════════");

        // تفاصيل لكل براند
        console.log("\n📋 التفاصيل حسب البراند:");
        for (const item of BRAND_MAP) {
            const catId = brandCategoryMap.get(item.brand);
            const count = await productsCol.countDocuments({ categoryId: catId });
            if (count > 0) console.log(`   • ${item.brand}: ${count} منتج`);
        }
        console.log("");

    } catch (err) {
        console.error("❌ خطأ:", err.message);
        process.exit(1);
    } finally {
        await client.close();
        console.log("🔌 تم إغلاق الاتصال.");
    }
}

main();
