"use client";
import React, { useEffect, useState } from "react";
import { BiUser, BiPencil } from "react-icons/bi";
import useChangeAdressModal from "../../hooks/useChangeAdressModal";
import useChangePasswordModal from "../../hooks/useChangePasswordModal";
import ChangePasswordModal from "./changePasswordModal";
import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@prisma/client";
import useLoginModal from "../../hooks/useLoginModal";

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

interface UserPageProps {
  orders: Order[];
  user : User
}

const UserComponent: React.FC<UserPageProps> = ({ orders,user }) => {
  const [error, setError] = useState("");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  function signOutLogic() {
    router.push('/')
    signOut()
  }

  function changePage() {
    router.push("/");
  }
  const changeAdressModal = useChangeAdressModal();
  const changePasswordModal = useChangePasswordModal();
  const loginModal = useLoginModal();

  useEffect(() => {
    if (!user) {
      loginModal.onOpen()
    }
  }, [user, router,loginModal]);

  return (
    <main className="w-full mt-6 ">
      {error && <h1>error</h1>}
      {user ? (
        <>
          <div className="flex flex-col items-center mt-0 mb-10">
            <nav className="bg-white flex flex-wrap justify-center">
              <button
                className={`${
                  activeTab === "profile" ? "text-blue-500" : "text-black"
                } md:px-4 py-2 px-2 rounded border-b-2 border-transparent hover:border-blue-500`}
                onClick={() => handleTabChange("profile")}
              >
                Profil
              </button>
              <button
                className={`${
                  activeTab === "orderHistory" ? "text-blue-500" : "text-black"
                } md:px-4 px-2 py-2 rounded border-b-2 border-transparent hover:border-blue-500`}
                onClick={() => handleTabChange("orderHistory")}
              >
                Historique des commandes
              </button>
              <button
                className={`${
                  activeTab === "disconnect" ? "text-blue-500" : "text-black"
                } md:px-4 px-2 py-2 rounded border-b-2 border-transparent hover:border-blue-500`}
                onClick={() => signOut()}
              >
                Déconnexion
              </button>
            </nav>
          </div>
          {activeTab === "profile" && (
            <>
              <div className="flex flex-row justify-center items-center space-x-4">
                <h1 className="text-center font-bold text-2xl lg:text-4xl border-b-2">
                  Profil Utilisateur
                </h1>
                <BiUser className="text-2xl lg:text-4xl" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mx-4 md:mx-8">
                {/* Section 1: Informations personnelles */}
                <section className="bg-white rounded p-6 md:p-4 relative text-gray-500">
                  <button
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={changePasswordModal.onOpen}
                  >
                    <BiPencil />
                  </button>
                  <h2 className="font-bold text-xl flex items-center justify-between text-black">
                    Informations personnelles
                  </h2>
                  <p>Email : {user.email}</p>
                  <p>Prénom : {user.firstName}</p>
                  <p>Nom : {user.lastName}</p>
                  <button
                    className="text-blue-500 underline mt-2"
                    onClick={changePasswordModal.onOpen}
                  >
                    Changer le mot de passe
                  </button>
                </section>

                {/* Section 2: Détails de facturation */}
                <section className="bg-white rounded p-6 md:p-4 relative text-gray-500">
                <button
  className="absolute top-2 right-2 cursor-pointer"
  onClick={() => changeAdressModal.onOpen(user)}
>
  <BiPencil />
</button>
                  <h2 className="font-bold text-xl flex items-center justify-between text-black">
                    Détails de facturation
                  </h2>
                  <p>Prénom : {user.firstName}</p>
                  <p>Nom : {user.lastName}</p>
                  <p>Adresse e-mail : {user.email}</p>
                  <p>Adresse de livraison : {user.shippingAdress}</p>
                  <p>Code postal : {user.postalCode}</p>
                  <p>Ville : {user.city}</p>
                  <p>Pays : {user.country}</p>
                </section>

                {/* Section 3: Adresse de livraison */}
                <section className="bg-white rounded p-6 md:p-4 relative text-gray-500">
                <button
  className="absolute top-2 right-2 cursor-pointer"
  onClick={() => changeAdressModal.onOpen(user)}
>
  <BiPencil />
</button>
                  <h2 className="font-bold text-xl flex items-center justify-between text-black">
                    Adresse de livraison
                  </h2>
                  <p>Prénom : {user.firstName}</p>
                  <p>Nom : {user.lastName}</p>
                  <p>Adresse e-mail : {user.email}</p>
                  <p>Adresse de livraison : {user.shippingAdress} </p>
                  <p>Code postal : {user.postalCode}</p>
                  <p>Ville : {user.city}</p>
                  <p>Pays : {user.country}</p>
                  <p>Numéro de téléphone : {user.phoneNumber}</p>
                </section>

                {/* Section 4: Mes préférences */}
                <section className="bg-white rounded p-6 md:p-4 relative text-gray-500">
                  <h2 className="font-bold text-xl flex items-center justify-between text-black">
                    Mes préférences
                  </h2>
                  <div className="flex items-center mb-2 my-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ml-3">
                        S`abonner à notre newsletter.
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ml-3">S`abonner à notre deals.</span>
                    </label>
                  </div>
                </section>
              </div>
            </>
          )}
          {activeTab === "orderHistory" && (
            <div className="container mx-auto p-4">
              <h1 className="text-2xl font-bold mb-4">Order History</h1>
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b">Cart Items</th>
                      <th className="py-2 px-4 border-b">Total Price</th>
                      <th className="py-2 px-4 border-b">Order ID</th>
                      <th className="py-2 px-4 border-b">Order Date</th>
                      <th className="py-2 px-4 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="py-4 px-4 border-b text-center border-gray-500 ">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="mb-4 flex items-center justify-center"
                            >
                              <div className="w-20 h-20 mr-4">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={80}
                                  height={80}
                                />
                              </div>
                              <div>
                                <p className="text-lg font-bold mb-2">
                                  {item.name}
                                </p>
                                <p className="text-gray-600 mb-2">
                                  Color: {item.color}
                                </p>
                                <p className="text-gray-600 mb-2">
                                  Capacity: {item.capacity}
                                </p>
                                <p className="mb-2">
                                  Quantity: {item.quantity} | Price:{" "}
                                  {item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </td>
                        <td className="py-2 px-4 border-b text-center border-gray-500">
                          {order.total} €
                        </td>
                        <td className="py-2 px-4 border-b text-center border-gray-500">
                          {order.id}
                        </td>
                        <td className="py-2 px-4 border-b text-center border-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border-b text-center border-gray-500">
                          {order.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "disconnect" && (
            <div className="flex flex-row justify-center items-center space-x-4 ">
              <button
                onClick={() => signOutLogic()}
                className="relative w-max text-center mt-4  inline-flex items-center px-5 py-3 text-base font-semibold text-white bg-red-600 border border-transparent rounded-md cursor-pointer select-none hover:bg-red-700 focus-within:bg-red-700"
              >
                Se déconnecter
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </main>
  );
};


export default UserComponent;
