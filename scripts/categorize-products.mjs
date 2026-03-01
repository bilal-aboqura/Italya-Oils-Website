/**
 * ============================================================
 *  سكربت تصنيف المنتجات تلقائياً حسب اسم المنتج
 *  يستخدم MongoDB Native Driver
 * ============================================================
 *  الأمر:  node scripts/categorize-products.mjs
 * ============================================================
 */

import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

// ─── خريطة التصنيفات ───────────────────────────────────────────────
// الترتيب مهم: التصنيفات الأكثر تحديداً أولاً لتفادي التعارض
// مثلاً: "سوائل الفرامل" قبل "زيوت المحركات" حتى لا يلتقط DOT كموبيل
const CATEGORY_MAP = [
    {
        name: "سوائل الفرامل والسيليكون",
        slug: "brake-fluids-silicone",
        keywords: ["فرامل", "DOT", "سيليكون"],
    },
    {
        name: "زيوت ناقل الحركة والتروس",
        slug: "transmission-gear-oils",
        keywords: ["فتيس", "ATF", "CVT", "باور", "80W", "75W", "DCT"],
    },
    {
        name: "سوائل التبريد",
        slug: "coolants",
        keywords: ["مياه", "تبريد", "رادياتير"],
    },
    {
        name: "الفلاتر",
        slug: "filters",
        keywords: ["فلتر"],
    },
    {
        name: "البوجيهات",
        slug: "spark-plugs",
        keywords: ["بوجيه", "بوجيهات", "شمعة", "NGK", "بوش"],
    },
    {
        name: "العناية بالسيارة والإضافات",
        slug: "car-care-additives",
        keywords: [
            "منظف", "بخاخ", "WD40", "فلاش", "سبراي",
            "شحم", "ملمع", "فوم", "اسبريه", "Engine Flush",
        ],
    },
    {
        name: "الإضاءة والكهرباء",
        slug: "lighting-electrical",
        keywords: ["ليد", "طقم ليد", "زينون", "أوكلاند", "طلمبة", "كلاكس", "VDO"],
    },
    {
        // يأتي أخيراً لأنه الأوسع (يحتوي على 5W، 10W... التي قد تتعارض)
        name: "زيوت المحركات",
        slug: "engine-oils",
        keywords: [
            "موبيل", "شل", "توتال", "بريدال", "كاسترول", "موتول",
            "ليكوي مولي", "مانول", "بروفي كار", "RZOIL",
            "5W", "10W", "15W", "20W",
        ],
    },
];

// ─── Helper: بناء Regex من مصفوفة كلمات ──────────────────────────
function buildRegex(keywords) {
    const escaped = keywords.map((k) =>
        k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    return new RegExp(escaped.join("|"), "i");
}

// ─── Main ──────────────────────────────────────────────────────────
async function main() {
    const uri = process.env.DATABASE_URL;
    if (!uri) {
        console.error("❌ DATABASE_URL غير موجود في ملف .env");
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ تم الاتصال بقاعدة البيانات بنجاح\n");

        const db = client.db(); // uses the DB name from the connection string
        const categoriesCol = db.collection("categories");
        const productsCol = db.collection("products");

        // ── 1) تأكد من وجود كل التصنيفات (أنشئ المفقود) ──────────────
        console.log("📂 التحقق من التصنيفات...");
        const categoryIdMap = new Map(); // name → ObjectId

        for (const cat of CATEGORY_MAP) {
            const existing = await categoriesCol.findOne({ name: cat.name });

            if (existing) {
                categoryIdMap.set(cat.name, existing._id);
                console.log(`   ✓ "${cat.name}" موجود (${existing._id})`);
            } else {
                const now = new Date();
                const result = await categoriesCol.insertOne({
                    name: cat.name,
                    slug: cat.slug,
                    description: null,
                    createdAt: now,
                    updatedAt: now,
                });
                categoryIdMap.set(cat.name, result.insertedId);
                console.log(`   ✚ "${cat.name}" تم إنشاؤه (${result.insertedId})`);
            }
        }

        // ── 2) بناء عمليات bulkWrite ──────────────────────────────────
        console.log("\n🔄 بناء عمليات التحديث...");
        const bulkOps = CATEGORY_MAP.map((cat) => {
            const regex = buildRegex(cat.keywords);
            const categoryId = categoryIdMap.get(cat.name);

            return {
                updateMany: {
                    filter: { name: { $regex: regex } },
                    update: {
                        $set: {
                            categoryId: categoryId,
                            updatedAt: new Date(),
                        },
                    },
                },
            };
        });

        // ── 3) تنفيذ bulkWrite ────────────────────────────────────────
        console.log(`   ⚡ تنفيذ ${bulkOps.length} عمليات تحديث...\n`);
        const result = await productsCol.bulkWrite(bulkOps, { ordered: true });

        // ── 4) ملخص ───────────────────────────────────────────────────
        console.log("═══════════════════════════════════════════════════");
        console.log("              📊 ملخص عملية التصنيف              ");
        console.log("═══════════════════════════════════════════════════");
        console.log(`   العمليات المطابقة : ${result.matchedCount}`);
        console.log(`   المنتجات المعدّلة : ${result.modifiedCount}`);
        console.log(`   العمليات المنفذة  : ${result.ok ? "نجاح ✅" : "فشل ❌"}`);
        console.log("═══════════════════════════════════════════════════");

        // ── 5) تفصيل لكل تصنيف ───────────────────────────────────────
        console.log("\n📋 التفاصيل حسب التصنيف:");
        for (const cat of CATEGORY_MAP) {
            const catId = categoryIdMap.get(cat.name);
            const count = await productsCol.countDocuments({ categoryId: catId });
            console.log(`   • ${cat.name}: ${count} منتج`);
        }

        // المنتجات بدون تصنيف
        const uncategorized = await productsCol.countDocuments({
            $or: [{ categoryId: null }, { categoryId: { $exists: false } }],
        });
        console.log(`   • بدون تصنيف: ${uncategorized} منتج`);
        console.log("");

    } catch (error) {
        console.error("❌ حدث خطأ أثناء التنفيذ:", error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        await client.close();
        console.log("🔌 تم إغلاق الاتصال بقاعدة البيانات.");
    }
}

main();
