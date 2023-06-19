import { NextPage } from "next";
import { useStateContext } from "../../context/stateContext";
import CartItem from "../components/CartItem";
import getStripe from "../../lib/getStripe";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import MyForm from "../components/ShippingForm";
import Layout from "../components/Layout";
import useChangeAdressModal from "../hooks/useChangeAdressModal";
import { uuid } from "uuidv4";
import { getSession, useSession } from "next-auth/react";
import RegisterModal from "../components/RegisterModal";
import useRegisterModal from "../hooks/useRegisterModal";
import { useRouter } from "next/router";
import axios from "axios";
import { count } from "console";

const Cart: NextPage = () => {
  const { cartItems, totalPrice } = useStateContext();
  const [openForm, setOpenForm] = useState(false);
  const changeAdressModal = useChangeAdressModal();
  const registerModal = useRegisterModal()
  console.log(cartItems, totalPrice);
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [shippingAdress, setShippingAdress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const sessionMain = useSession();
  const router = useRouter()

  useEffect(() => {
    setError("");
    const fetchData = async () => {
      const session = await getSession();
      const currentUser = session?.user;
      if (session) {
        const email = currentUser?.email;
        setEmail(email!.toString())
        try {
          const response = await axios.get(`/api/user?email=${email}`);;
          setShippingAdress(response.data.shippingAdress);
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setPostalCode(response.data.postalCode);
          setPhoneNumber(response.data.phoneNumber);
          setCountry(response.data.country);
        } catch (error) {
          setError(JSON.stringify(error));
        }
      }
    };

    fetchData();
  }, [sessionMain]);

  // const checkoutHandler = async () => {
  //   if (cartItems.length == 0) {
  //     return;
  //   }

  //   const stripe = await getStripe();

  //   const res = await fetch("/api/stripe", {
  //     method: "POST",
  //     headers: {
  //       // prettier-ignore
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(cartItems),
  //   });

  //   if (res.status === 500) return;

  //   const data = await res.json();

  //   toast.loading("Redirecting...");

  //   stripe.redirectToCheckout({ sessionId: data.id });
  // };
  const handleFormSubmit = async () => {
    function getFullItem(item: any) {
      return [item.name, item.color].join(" ") + " × " + item.quantity + "|";
    }
    const items = cartItems.map(getFullItem);
    const unique_id = Date.now().toString();
    const session = await getSession();
    const currentUser = session?.user;
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/payment";
    const cartItemsNew = cartItems.push({email : email})
    console.log(cartItemsNew)
    const serializedData = JSON.stringify(cartItemsNew);
    console.log(serializedData);
    const params: Record<string, string> = {
      serializedData,
      email,
      unique_id,
      Amount: totalPrice,
      items,
      CustomField1: totalPrice + "EUR",
      CustomField2: `TR-${unique_id}`,
      CustomField3:
        "https://cdn.shopify.com/s/files/1/0061/7929/1200/files/ephones_250x.png?v=1638106517",
      CustomField4: items,
      CustomField5: `${firstName}|${lastName}|${email}|`,
      CustomField6: `${firstName}|${lastName}|${phoneNumber}|${shippingAdress}|${country}|${postalCode}`,
      CustomField7: `${firstName}|${lastName}|${phoneNumber}|${shippingAdress}|${country}|${postalCode}`,
      PayType: "0",
    };

    for (const key in params) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <Layout>
      <div className="w-11/12 mx-auto h-full vh-full">
        <h1 className="text-3xl underline-offset-8 underline my-4">
          Votre panier
        </h1>
        {cartItems.length == 0 && (
          <h1 className="text-xl my-4">C&apos;est vide... trop vide...</h1>
        )}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-8/12">
            {cartItems.map((cartItem: any) => (
              <CartItem
                item={cartItem}
                key={cartItem.productId + cartItem.color}
              />
            ))}
          </div>
          <div className="lg:w-4/12 bg-white rounded p-4 max-h-full">
            <h1 className="text-2xl">Récapitulatif</h1>
            <h1 className="text-xl">{cartItems.length} articles</h1>
            <h1 className="flex flex-row justify-between text-xl mt-8">
              Total panier
              <span className="text-xl font-bold">{totalPrice} &euro;</span>
            </h1>
            {currentUser ? (
              <>
                <button
                  onClick={handleFormSubmit}
                  className="text-xl text-center px-4 py-2 text-white bg-black rounded w-full mt-8"
                  hidden={cartItems.length == 0}
                >
                  Payer
                </button>
                <button
                  className="text-md text-blue-700 cursor-pointer transition hover:underline "
                  onClick={changeAdressModal.onOpen}
                >
                  Changement d`adresse?
                </button>
              </>
            ) : (
              <button
                onClick={registerModal.onOpen}
                className="text-xl text-center px-4 py-2 text-white bg-black rounded w-full mt-8"
                hidden={cartItems.length == 0}
              >
                Payer
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
