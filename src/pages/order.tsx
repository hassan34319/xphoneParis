import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { ParsedUrlQuery } from "querystring";
import { prisma } from "./api/client";
import { authOptions } from "./api/auth/[...nextauth]";
import { BiPencil } from "react-icons/bi";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface CartItem {
  id: string;
  image: string;
  name: string;
  productId: string;
  color: string;
  capacity: number;
  grade: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  userId: string;
  user: {
    email: string;
    shippingAdress: string;
    postalCode: string;
    city: string;
    country: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  status?: string;
  editableStatus?: Boolean;
  total: number;
  updatedStatus: string;
}

interface OrdersPageProps {
  orders: Order[];
}

const OrdersPage: React.FC<OrdersPageProps> = ({ orders }) => {
  const [ordersState, setOrdersState] = useState<Order[]>(orders);

  const handleEditStatus = (orderId: string) => {
    setOrdersState((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, editableStatus: true } : order
      )
    );
  };

  const handleSaveStatus = async (orderId: string) => {
    try {
      const order = ordersState.find((o) => o.id === orderId);
      if (!order) return;

      // Send the request to the backend API to update the order status
      const response = await axios.put(`/api/order`, {
        orderId: orderId,
        status: order.updatedStatus,
      });

      // Handle the response and update the orders state accordingly
      // Assuming the response contains the updated order details
      const updatedOrder = response.data;

      setOrdersState((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, ...updatedOrder, editableStatus: false }
            : order
        )
      );

      // Show a success toast or perform any other action
      toast.success("Order status updated successfully");
    } catch (error) {
      // Handle the error
      console.error("Error updating order status:", error);
      // Show an error toast or perform any other action
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Updated At</th>
              <th className="py-2 px-4 border-b">User Email</th>
              <th className="py-2 px-4 border-b">Shipping Address</th>
              <th className="py-2 px-4 border-b">Postal Code</th>
              <th className="py-2 px-4 border-b">City</th>
              <th className="py-2 px-4 border-b">Country</th>
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Phone Number</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Total Price</th>
              <th className="py-2 px-4 border-b">Cart Items</th>
            </tr>
          </thead>
          <tbody>
            {ordersState.map((order) => (
              <tr key={order.id}>
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.createdAt}</td>
                <td className="py-2 px-4 border-b">{order.updatedAt}</td>
                <td className="py-2 px-4 border-b">{order.user.email}</td>
                <td className="py-2 px-4 border-b">
                  {order.user.shippingAdress}
                </td>
                <td className="py-2 px-4 border-b">{order.user.postalCode}</td>
                <td className="py-2 px-4 border-b">{order.user.city}</td>
                <td className="py-2 px-4 border-b">{order.user.country}</td>
                <td className="py-2 px-4 border-b">{order.user.firstName}</td>
                <td className="py-2 px-4 border-b">{order.user.lastName}</td>
                <td className="py-2 px-4 border-b">{order.user.phoneNumber}</td>
                <td className="py-2 px-4 border-b flex flex-row space-between">
                  {order.editableStatus ? (
                    <input
                      type="text"
                      value={order.updatedStatus}
                      onChange={(e) =>
                        setOrdersState((prevOrders) =>
                          prevOrders.map((o) =>
                            o.id === order.id
                              ? { ...o, updatedStatus: e.target.value }
                              : o
                          )
                        )
                      }
                    />
                  ) : (
                    order.status
                  )}
                  <button onClick={() => handleEditStatus(order.id)}>
                    <BiPencil />
                  </button>
                  {order.editableStatus && (
                    <button
                      onClick={() => {
                        handleSaveStatus(order.id);
                      }}
                    >
                      Save
                    </button>
                  )}
                </td>

                <td className="py-2 px-4 border-b">{order.total} €</td>
                <td className="py-2 px-4 border-b">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      <p>
                        {item.name} {item.color} {item.capacity} x{" "}
                        {item.quantity}{" "}
                      </p>
                      {/* Display other properties of the cart item */}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export async function getServerSideProps({
  req,
  res,
  query,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  query: ParsedUrlQuery;
}) {
  const session = await getServerSession(req, res, authOptions);

  // Check if user is authenticated and has the allowed email address
  if (
    !session ||
    ![
      "xphonesparis@gmail.com",
      "contaxt@xphones.com",
      "Hassaniqbal19343@gmail.com",
    ].includes(session.user?.email ?? "")
  ) {
    return {
      redirect: {
        destination: "/login", // Replace with the login page URL
        permanent: false,
      },
    };
  }

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

  return {
    props: {
      orders: orders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.createdAt.toISOString(),
      })),
    },
  };
}

export default OrdersPage;
