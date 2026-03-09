const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        select: { imageUrl: true },
        where: { imageUrl: { not: null } },
        take: 1
      }
    }
  });

  console.log("Categories in DB:");
  for (const c of categories) {
    console.log(`- ${c.name} (IMG: ${c.imageUrl ? 'YES' : 'NO'}, ProductIMG: ${c.products.length > 0 ? c.products[0].imageUrl : 'NONE'})`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
