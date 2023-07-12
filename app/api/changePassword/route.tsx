import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../client/route";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

export async function POST(request: Request) {

    try {
      const body = await request.json()
      const { password, confirmPassword, email } = body;
      const hashedPassword = await bcrypt.hash(password, 12);

      const updateUser = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          hashedPassword,
        },
      });

      return NextResponse.json(updateUser);
    } catch {
      return NextResponse.json({ success: false, error: "Internal Server Error" });
    }
}


