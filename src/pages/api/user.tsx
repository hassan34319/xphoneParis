import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Get the email from the query parameters
      const { email } = req.query;

      // Fetch the user data based on the email using Prisma
      const userData = await prisma.user.findUnique({
        where: { email: email?.toString() },
      });

      // Return the user data in the response
      res.status(200).json(userData);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
