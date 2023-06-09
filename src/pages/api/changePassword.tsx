import bcrypt from "bcrypt";

import { prisma } from "./client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { getSession } from "next-auth/react";
// export async function getSession() {
//   return await getServerSession(authOptions);
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { password, confirmPassword, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      //   const session = await getSession();
      //   console.log(session)

      // //   if (!session?.user?.email) {
      // //     return null;
      // //   }
      // //   const emailAdress = session?.user?.email;
      const updateUser = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          hashedPassword,
        },
      });

      return res.status(200).json(updateUser);
    } catch {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
}
