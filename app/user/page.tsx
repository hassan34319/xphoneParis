import React from "react";
import getCurrentUser from "../utils/getCurrentUser";
import UserComponent from "../components/user";
import { prisma } from "../api/client/route";
import { redirect } from "next/navigation";

type Props = {};

async function page({}: Props) {
  const currentUser = await getCurrentUser();
  console.log(currentUser);

  // Check if user is authenticated and has the allowed email address
  if (!currentUser) {
    redirect('/')
    // Show loading state or redirect to a login page
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 shadow-lg rounded-lg text-center">
          <p className="text-2xl font-bold mb-4">User Not Found</p>
          <p>Please log in to continue.</p>
        </div>
      </div>
    );
  }

  // Fetch all orders from the database, including associated CartItems and User details
  const orders = await prisma.order.findMany({
    where: {
      user: {
        email: currentUser.email,
      },
    },
    include: {
      items: true,
      user: {
        select: {
          email: true,
          shippingAdress: true,
          postalCode: true,
          city: true,
          country: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
    },
  });

  const Finalorders = orders
    .map((order) => ({
      ...order,
      createdAt: new Date(order.createdAt).toISOString(),
      updatedAt: new Date(order.createdAt).toISOString(),
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const userData = await prisma.user.findUnique({
    where: { email: currentUser.email?.toString() },
  });

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 shadow-lg rounded-lg text-center">
          <p className="text-2xl font-bold mb-4">User Not Found</p>
          <p>Please log in to continue.</p>
        </div>
      </div>
    );
  }
  return <UserComponent orders={Finalorders} user={userData} />;
}

export default page;
