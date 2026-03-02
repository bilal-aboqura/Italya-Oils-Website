const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- بدء عملية إعادة تصنيف المنتجات ---');

  // 1. إنشاء الفئات الرئيسية
  const oilCategory = await prisma.category.upsert({
    where: { slug: 'engine-oils' },
    update: {},
    create: { 
      name: 'زيوت وحماية', 
      slug: 'engine-oils',
      description: 'أفضل أنواع الزيوت التخليقية والاصطناعية للعناية بمحرك سيارتك.'
    }
  });

  const partsCategory = await prisma.category.upsert({
    where: { slug: 'filters-and-parts' },
    update: {},
    create: { 
      name: 'فلاتر وقطع غيار', 
      slug: 'filters-and-parts',
      description: 'فلاتر، بواجي، وعناصر صيانة أصلية من أفضل الماركات العالمية.'
    }
  });

  // 2. قوائم الماركات حسب التخصص
  const oilsBrands = [
    'موبيل وان', 'موبيل', 'شل هيلكس', 'كاسترول', 'توتال', 'ليكوي مولي', 
    'موتول', 'مانول', 'بردال', 'RZOIL', 'بروفي كار', 'فوسير', 'ETG', 
    'كالتكس', 'فاكسول', 'اكسا', 'ابرو', 'بترومين', 'فتيس', 'اوكلاند', 
    'فلامنجو', 'WD40', 'امير', 'بوابه', 'VESLEE', 'AKAI', 'فوكس', 
    'هيبو', 'رابيدو', 'كانسلير', 'جنك'
  ];

  const partsBrands = [
    'اوسرامز', 'VDO', 'FIAMM', 'HELLA', 'NGK', 'بوش', 'ATE', 'بيندكس', 'مان', 'فلترون', 'SCL'
  ];

  // 3. تحديث المنتجات
  console.log('تحديث منتجات الزيوت...');
  await prisma.product.updateMany({
    where: { brand: { in: oilsBrands } },
    data: { categoryId: oilCategory.id }
  });

  console.log('تحديث منتجات الفلاتر والقطع...');
  await prisma.product.updateMany({
    where: { brand: { in: partsBrands } },
    data: { categoryId: partsCategory.id }
  });

  // 4. تنظيف الفئات القديمة (التي ليست الفئتين الجديدتين)
  console.log('تنظيف الفئات القديمة...');
  await prisma.category.deleteMany({
    where: {
      id: { notIn: [oilCategory.id, partsCategory.id] }
    }
  });

  console.log('--- تمت العملية بنجاح! ---');
  console.log('تم نقل المنتجات إلى فئتين منظمين: "زيوت وحماية" و "فلاتر وقطع غيار"');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
