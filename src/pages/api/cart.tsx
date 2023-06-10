import { NextApiRequest, NextApiResponse } from "next";
import {prisma} from './client'
interface Item {
  image: string;
  name: string;
  productId: string;
  color: string;
  capacity: number;
  grade: string;
  price: number;
  quantity: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      return handlePostRequest(req, res);
    case "PUT":
      return handlePutRequest(req, res);
    default:
      res.setHeader("Allow", ["POST", "PUT"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { cartId } = req.body;

  try {
    // Create a new cart in the database
    await prisma.cart.create({
      data: {
        id: cartId,
        items: {
          create: [], // Empty array to create the cart without any items
        },
      },
    });
    console.log("CREATED CART");
    res.status(201).send("Cart created successfully");
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).send("Internal Server Error");
  } 
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { cartId, items } = req.body;
  console.log("I AM ITEMS PASSED",items)
  try {
    // Find the cart in the database
    const cart = await prisma.cart.findUnique({
      where: {
        id: cartId,
      },
    });

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    // Update the cart items in the database
    const del = await prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        items: {
          deleteMany: {},
        },
      },
      include: { items: true }
    });
    
    console.log("I del", del)
    // Create new items in the database for the cart
    const add = await prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        items: {
          createMany: {
            data: items.map((item: Item) => ({
              id : item.productId,
              image: item.image,
              name: item.name,
              productId: item.productId,
              color: item.color,
              capacity: item.capacity,
              grade: item.grade,
              price: item.price,
              quantity: item.quantity,
            })),
            skipDuplicates: true
          },
        },
      },
    });

    console.log("I ADD",add)

    console.log("CART UPDATED SUCCESSFULLY");
    res.send("Cart updated successfully");
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).send("Internal Server Error");
  }
}
