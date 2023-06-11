import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "./client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, firstName,lastName, password, shippingAdress, postalCode } = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          hashedPassword,
          shippingAdress,
          postalCode,
        },
      });

      return res.status(200).json(user);
    } catch {
      res.status(404).send("An error occured")
    }
  }
}
