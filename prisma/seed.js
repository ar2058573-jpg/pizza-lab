// Seed script for Pizza Lab
// Usage: DATABASE_URL="..." npx prisma db push && npx prisma generate && node prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Pizza Lab...");

  const menuCount = await prisma.menuItem.count();
  if (menuCount === 0) {
    await prisma.menuItem.createMany({
      data: [
        { name: "Chicken Fajita", nameUrdu: "چکن فاہیتا", category: "Pizza", largePrice: 450, regularPrice: 300, smallPrice: 200 },
        { name: "Chicken Tikka", nameUrdu: "چکن تکہ", category: "Pizza", largePrice: 450, regularPrice: 300, smallPrice: 200 },
        { name: "Arabic Green", nameUrdu: "عربی گرین", category: "Pizza", largePrice: 550, regularPrice: 350, smallPrice: 250 },
        { name: "B.B.Q Tikka", nameUrdu: "باربیکیو تکہ", category: "Pizza", largePrice: 450, regularPrice: 300, smallPrice: 200 },
        { name: "Behari Tikka", nameUrdu: "بہاری تکہ", category: "Pizza", largePrice: 450, regularPrice: 300, smallPrice: 200 },
        { name: "Cheese Lover", nameUrdu: "چیز لوور", category: "Pizza", largePrice: 450, regularPrice: 300, smallPrice: 200 },
        { name: "Malai Boti", nameUrdu: "ملائی بوٹی", category: "Pizza", largePrice: 450, regularPrice: 300, smallPrice: 200 },
        { name: "Chicken Supreme", nameUrdu: "چکن سپریم", category: "Pizza", largePrice: 550, regularPrice: 350, smallPrice: 250 },
      ],
    });
    console.log("Menu items created");
  }

  const riders = [
    { name: "Haris Sohail", phone: "923164522326", status: "AVAILABLE" },
    { name: "Zeeshan Tariq", phone: "923009159243", status: "AVAILABLE" },
    { name: "Haider Ali", phone: "923354622317", status: "AVAILABLE" },
    { name: "Suleman Kamran", phone: "923154342125", status: "AVAILABLE" },
  ];

  for (const r of riders) {
    await prisma.rider.upsert({
      where: { phone: r.phone },
      update: { name: r.name, status: r.status },
      create: r,
    });
  }
  console.log("Riders ready");

  await prisma.customer.upsert({
    where: { phone: "923166511225" },
    update: { name: "Moiz Chouhan", totalOrders: 12, lifetimeSpend: 17470, isVip: true },
    create: {
      name: "Moiz Chouhan",
      phone: "923166511225",
      totalOrders: 12,
      lifetimeSpend: 17470,
      isVip: true,
    },
  });
  console.log("Sample customer ready");
  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
