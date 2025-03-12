"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { BiPencil, BiChevronDown, BiChevronUp } from "react-icons/bi";
import ClientOnly from "./ClientOnly";

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
    email: string | null;
    shippingAdress: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
  };
  status?: string | null;
  editableStatus?: boolean;
  total: number;
  calculated: number | null;
  discount: number | null;
  updatedStatus?: string;
  promo: string | null;
}

interface OrdersPageProps {
  orders: Order[];
}

const OrdersComponent: React.FC<OrdersPageProps> = ({ orders }) => {
  const [ordersState, setOrdersState] = useState<Order[]>(orders);
  const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: boolean }>({});

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleEditStatus = (orderId: string) => {
    setOrdersState((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, editableStatus: true, updatedStatus: order.status } : order
      )
    );
  };

  const handleSaveStatus = async (orderId: string) => {
    try {
      const order = ordersState.find((o) => o.id === orderId);
      if (!order) return;

      const response = await axios.post(`/api/order`, {
        orderId: orderId,
        status: order.updatedStatus,
      });

      const updatedOrder = response.data;

      setOrdersState((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: order.updatedStatus, editableStatus: false }
            : order
        )
      );

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ClientOnly>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="overflow-x-auto">
          <table className="w-full border bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left">Order Details</th>
                <th className="py-3 px-4 border-b text-center">Status</th>
                <th className="py-3 px-4 border-b text-center">Total</th>
                <th className="py-3 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersState.map((order) => (
                <>
                  <tr 
                    key={order.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    <td className="py-4 px-4 border-b">
                      <div className="flex items-center">
                        {expandedOrders[order.id] ? (
                          <BiChevronUp className="mr-2 text-gray-500" />
                        ) : (
                          <BiChevronDown className="mr-2 text-gray-500" />
                        )}
                        <div>
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user.firstName} {order.user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 border-b text-center">
                      <div className="flex items-center justify-center">
                        {order.editableStatus ? (
                          <input
                            type="text"
                            className="border rounded px-2 py-1 w-full"
                            value={order.updatedStatus || ""}
                            onClick={(e) => e.stopPropagation()}
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
                          <span className={`px-2 py-1 rounded text-sm ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 border-b text-center">
                      <div className="font-medium">{order.total} €</div>
                      {order.discount && (
                        <div className="text-sm text-green-600">-{order.discount} €</div>
                      )}
                    </td>
                    <td className="py-4 px-4 border-b text-center">
                      {!order.editableStatus ? (
                        <button 
                          className="p-2 hover:bg-gray-100 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStatus(order.id);
                          }}
                        >
                          <BiPencil className="text-gray-600" />
                        </button>
                      ) : (
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveStatus(order.id);
                          }}
                        >
                          Save
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedOrders[order.id] && (
                    <tr>
                      <td colSpan={4} className="bg-gray-50 p-0">
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h3 className="font-medium mb-2">Customer Details</h3>
                              <div className="bg-white p-3 rounded border">
                                <p><span className="font-medium">Name:</span> {order.user.firstName} {order.user.lastName}</p>
                                <p><span className="font-medium">Email:</span> {order.user.email}</p>
                                <p><span className="font-medium">Phone:</span> {order.user.phoneNumber}</p>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium mb-2">Shipping Address</h3>
                              <div className="bg-white p-3 rounded border">
                                <p>{order.user.shippingAdress}</p>
                                <p>{order.user.postalCode}, {order.user.city}</p>
                                <p>{order.user.country}</p>
                              </div>
                            </div>
                          </div>
                          
                          <h3 className="font-medium mb-2">Order Items</h3>
                          <div className="bg-white rounded border overflow-hidden">
                            {order.items.map((item) => (
                              <div key={item.id} className="p-3 border-b last:border-b-0 flex justify-between">
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {item.color} • {item.capacity}GB • Grade: {item.grade}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p>{item.price} € x {item.quantity}</p>
                                  <p className="font-medium">{item.price * item.quantity} €</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 bg-white p-3 rounded border flex flex-col items-end">
                            <div className="w-48">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>{order.calculated} €</span>
                              </div>
                              {order.discount && (
                                <div className="flex justify-between text-green-600">
                                  <span>Discount {order.promo ? `(${order.promo})` : ''}:</span>
                                  <span>-{order.discount} €</span>
                                </div>
                              )}
                              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                                <span>Total:</span>
                                <span>{order.total} €</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ClientOnly>
  );
};

export default OrdersComponent;