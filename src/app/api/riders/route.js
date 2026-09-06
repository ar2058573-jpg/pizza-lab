import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const riders = await prisma.rider.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      riders.map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        status: r.status,
        cashInHand: r.cashInHand,
        currentLat: r.currentLat,
        currentLng: r.currentLng,
        currentOrderId: null,
      }))
    );
  } catch (err) {
    console.error("GET /api/riders", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, cashInHand } = body;

    const data = {};
    if (status) data.status = status;
    if (cashInHand !== undefined) data.cashInHand = cashInHand;

    const rider = await prisma.rider.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      id: rider.id,
      name: rider.name,
      phone: rider.phone,
      status: rider.status,
      cashInHand: rider.cashInHand,
    });
  } catch (err) {
    console.error("PATCH /api/riders", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
