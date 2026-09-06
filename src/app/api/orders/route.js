import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        rider: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const mapped = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customer?.name || "Unknown",
      customerPhone: o.customer?.phone || "",
      address: o.deliveryAddress,
      items: o.items.map((i) => ({
        name: i.name,
        size: i.size,
        qty: i.quantity,
        price: i.unitPrice,
      })),
      total: o.totalAmount,
      status: o.status,
      source: o.source,
      riderId: o.riderId,
      riderName: o.rider?.name || null,
      createdAt: o.createdAt.toISOString(),
      shipping: o.shippingFee,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET /api/orders", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { phone: body.customerPhone || "0000000000" },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: body.customerName || "Customer",
          phone: body.customerPhone || `temp-${Date.now()}`,
        },
      });
    } else {
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          totalOrders: { increment: 1 },
          lifetimeSpend: { increment: body.total || 0 },
        },
      });
    }

    const orderNumber = body.orderNumber || `#PL${Date.now().toString().slice(-10)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: body.status || "PENDING",
        totalAmount: body.total || 0,
        shippingFee: body.shipping || 0,
        paymentMethod: "COD",
        deliveryAddress: body.address || "Address pending",
        source: body.source || "WEB",
        items: {
          create: (body.items || []).map((i) => ({
            name: i.name,
            size: i.size || "Large",
            quantity: i.qty || 1,
            unitPrice: i.price || 0,
            totalPrice: (i.price || 0) * (i.qty || 1),
          })),
        },
      },
      include: { customer: true, items: true, rider: true },
    });

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      customerPhone: order.customer.phone,
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
    console.error("POST /api/orders", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
