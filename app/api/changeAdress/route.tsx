import bcrypt from "bcrypt";

import { prisma } from "../client/route";
import { NextResponse } from "next/server";
import getCurrentUser from "../../utils/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { shippingAdress, postalCode, email, phoneNumber, country, city } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      return NextResponse.error();
    }
  });

  const updateUser = await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      shippingAdress: shippingAdress,
      postalCode: postalCode,
      phoneNumber: phoneNumber,
      city: city,
      country: country,
    },
  });

  return NextResponse.json(updateUser);
}

