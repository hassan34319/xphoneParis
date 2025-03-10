import React from "react";
import getCurrentUser from "../utils/getCurrentUser";
import OrdersComponent from "../components/order";
import { prisma } from "../api/client/route";

type Props = {};

async function OrderPage({}: Props) {
  const currentUser = await getCurrentUser();
  console.log(currentUser);

  // Check if user is authenticated and has the allowed email address
  if (!currentUser) {
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

  if (![
        "xphonesparis@gmail.com",
        "contact@xphones.com",
        "Hassaniqbal19343@gmail.com",
        "alirules06@gmail.com",
      ].includes(currentUser.email ?? "")) {
        <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 shadow-lg rounded-lg text-center">
          <p className="text-2xl font-bold mb-4">You are not authorized to view this page</p>
          <p>Please log in to with your admin id to continue.</p>
        </div>
      </div>
      }
  // if (
  //   !currentUser ||
  //   ![
  //     "xphonesparis@gmail.com",
  //     "contact@xphones.com",
  //     "Hassaniqbal19343@gmail.com",
  //   ].includes(currentUser.email ?? "")
  // ) {
  //   return {
  //     redirect: {
  //       destination: "/", // Replace with the login page URL
  //       permanent: false,
  //     },
  //   };
  // }

  // Fetch all orders from the database, including associated CartItems and User details
  const orders = await prisma.order.findMany({
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

  return <OrdersComponent orders={Finalorders} />;
}

export default OrderPage;
