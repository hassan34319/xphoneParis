import React, { useEffect, useState } from "react";
import { BiUser, BiPencil } from "react-icons/bi";
import useChangeAdressModal from "../hooks/useChangeAdressModal";
import useChangePasswordModal from "../hooks/useChangePasswordModal";
import ChangePasswordModal from "../components/changePasswordModal";
import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import { signIn, signOut } from "next-auth/react";

const UserPage = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [shippingAdress, setShippingAdress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const sessionMain = useSession()
  useEffect(() => {
    setError("");
    const fetchData = async () => {
      const session = await getSession();
      const currentUser = session?.user;
      if (session) {
        const email = currentUser?.email;

        try {
          const response = await axios.get(`/api/user?email=${email}`);
          setEmail(response.data.email);
          setShippingAdress(response.data.shippingAdress);
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setPostalCode(response.data.postalCode);
          setPhoneNumber(response.data.phoneNumber);
        } catch (error) {
          setError(JSON.stringify(error));
        }
      }
    };

    fetchData();
  }, [sessionMain]);
  const changeAdressModal = useChangeAdressModal();
  const changePasswordModal = useChangePasswordModal();
  const { data: session } = useSession();
  const currentUser = session?.user;

  return (
    <main className="w-full ">
      {error && <h1>error</h1>}
      {currentUser ? (
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
              <p>Email : {email}</p>
              <p>Prénom : {firstName}</p>
              <p>Nom : {lastName}</p>
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
                onClick={changeAdressModal.onOpen}
              >
                <BiPencil />
              </button>
              <h2 className="font-bold text-xl flex items-center justify-between text-black">
                Détails de facturation
              </h2>
              <p>Prénom : {firstName}</p>
              <p>Nom : {lastName}</p>
              <p>Adresse e-mail : {email}</p>
              <p>Adresse de livraison : {shippingAdress}</p>
              <p>Code postal : {postalCode}</p>
            </section>

            {/* Section 3: Adresse de livraison */}
            <section className="bg-white rounded p-6 md:p-4 relative text-gray-500">
              <button
                className="absolute top-2 right-2 cursor-pointer"
                onClick={changeAdressModal.onOpen}
              >
                <BiPencil />
              </button>
              <h2 className="font-bold text-xl flex items-center justify-between text-black">
                Adresse de livraison
              </h2>
              <p>Prénom : {firstName}</p>
              <p>Nom : {lastName}</p>
              <p>Adresse e-mail : {email}</p>
              <p>Adresse de livraison : {shippingAdress} </p>
              <p>Code postal : {postalCode}</p>
              <p>numéro de téléphone : {phoneNumber}</p>
            </section>

            {/* Section 4: Mes préférences */}
            <section className="bg-white rounded p-6 md:p-4 relative text-gray-500">
              <h2 className="font-bold text-xl flex items-center justify-between text-black">
                Mes préférences
              </h2>
              <div className="flex items-center mb-2 my-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ml-3">S`abonner à notre newsletter.</span>
                </label>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ml-3">S`abonner à notre deals.</span>
                </label>
              </div>
            </section>
            <button
              onClick={() => signOut()}
              className="relative w-max  inline-flex items-center px-5 py-3 text-base font-semibold text-white bg-blue-600 border border-transparent rounded-md cursor-pointer select-none hover:bg-blue-700 focus-within:bg-blue-700"
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
        </>
      ) : (
        <h1>YOU ARE NOT LOGGED IN</h1>
      )}
    </main>
  );
};

export default UserPage;
