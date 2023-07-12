import { prisma } from "../client/route";


import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
export default async function PATCH(request: Request) {
  const body = await request.json();
    const { orderId, status } = body

    try {
      // Update the order status in the database using Prisma
      const updatedOrder = await prisma.order.update({
        where: { id: orderId as string },
        data: { status: status as string },
      });

      return NextResponse.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      return NextResponse.json({ error: "Failed to update order status" });
    }}
