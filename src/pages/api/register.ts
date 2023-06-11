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
      console.log(req.body)
      const { email, firstName,lastName, password, confirmPassword, shippingAdress, postalCode } = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);
      const existingUser = await prisma.user.findUnique({
        where : {
          email : email
        }
      })
      console.log(existingUser)
      if (existingUser) {
        return res.status(200).json(existingUser);
      }
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
