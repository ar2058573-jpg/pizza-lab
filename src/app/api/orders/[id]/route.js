import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data = {};
    if (body.status) data.status = body.status;
    if (body.riderId !== undefined) data.riderId = body.riderId;
    if (body.status === "OUT_FOR_DELIVERY") data.dispatchedAt = new Date();
    if (body.status === "DELIVERED") data.deliveredAt = new Date();

    const order = await prisma.order.update({
      where: { id },
      data,
      include: { customer: true, rider: true, items: true },
    });

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer?.name,
      customerPhone: order.customer?.phone,
      address: order.deliveryAddress,
      items: order.items.map((i) => ({
        name: i.name,
        size: i.size,
        qty: i.quantity,
        price: i.unitPrice,
      })),
      total: order.totalAmount,
      status: order.status,
      source: order.source,
      riderId: order.riderId,
      riderName: order.rider?.name || null,
      createdAt: order.createdAt.toISOString(),
      shipping: order.shippingFee,
    });
  } catch (err) {
    console.error("PATCH /api/orders/[id]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
