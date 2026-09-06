import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { lifetimeSpend: "desc" },
    });

    return NextResponse.json(
      customers.map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        totalOrders: c.totalOrders,
        lifetimeSpend: c.lifetimeSpend,
        isVip: c.isVip,
        favourite: "—",
      }))
    );
  } catch (err) {
    console.error("GET /api/customers", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
