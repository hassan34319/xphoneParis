import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import {prisma} from '../client'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cartId } = req.query;
  console.log("GET QUERY IS HERE");
  if (req.method === "GET") {
    try {
      const cart = await prisma.cart.findUnique({
        where: {
          id: String(cartId),
        },
        include: {
          items: true,
        },
      });

      if (cart) {
        res.status(200).json(cart);
      } else {
        res.status(404).json({ error: "Cart not found" });
      }
    } catch (error) {
      console.error("Error retrieving cart:", error);
      res.status(500).json({ error: "Internal server error" });
    } 
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
