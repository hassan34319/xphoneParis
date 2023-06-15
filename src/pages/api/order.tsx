import { prisma } from "./client";


import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { orderId, status } = req.body;

    try {
      // Update the order status in the database using Prisma
      const updatedOrder = await prisma.order.update({
        where: { id: orderId as string },
        data: { status: status as string },
      });

      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
