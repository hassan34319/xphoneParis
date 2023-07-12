import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../client/route";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

export async function POST(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "POST") {
    try {
      const { password, confirmPassword, email } = request.body;
      const hashedPassword = await bcrypt.hash(password, 12);

      const updateUser = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          hashedPassword,
        },
      });

      return response.status(200).json(updateUser);
    } catch {
      return response.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  return NextResponse.error();
}

export default POST;
