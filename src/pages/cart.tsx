import { GetServerSideProps, NextPage } from "next";
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
import { sanityClient } from "../../lib/sanityClient";

interface PromoCode {
  code: string;
  discountPercentage: number;
}

interface Props {
  promoCodes: PromoCode[];
}

interface Item {
  image: string;
  name: string;
  productId: string;
  color: string;
  capacity: number;
  grade: string;
  price: number;
  quantity: number;
}

const Cart: React.FC<Props> = ({ promoCodes }) => {
  const [enteredPromoCode, setEnteredPromoCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  console.log(promoCodes);
  const { cartItems, totalPrice} = useStateContext();
  const [openForm, setOpenForm] = useState(false);
  const changeAdressModal = useChangeAdressModal();
  const registerModal = useRegisterModal();
  // console.log(cartItems, totalPrice);
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
  const [promoCodeError, setPromoCodeError] = useState("");
  const [total, setTotalPrice] = useState(totalPrice)
  const sessionMain = useSession();
  const router = useRouter();
  const calculateTotalPrice = (cart: Item[]) => {
    return cart.reduce((totalPrice: number, item: Item) => {
      return totalPrice + item.price * item.quantity;
    }, 0);
  };
  const calculatedPrice = calculateTotalPrice(cartItems)
  useEffect(() => {
    setError("");
    const fetchData = async () => {
      const session = await getSession();
      const currentUser = session?.user;
      if (session) {
        const email = currentUser?.email;
        setEmail(email!.toString());
        try {
          const response = await axios.get(`/api/user?email=${email}`);
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
    cartItems.push({ email: email, total: total, discount : discountPercentage });
    const serializedData = JSON.stringify(cartItems);
    console.log(serializedData);
    const params: Record<string, string> = {
      serializedData,
      email,
      unique_id,
      Amount: total,
      items,
      CustomField1: total + "EUR",
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

  const handlePromoCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEnteredPromoCode(event.target.value);
    setDiscountPercentage(0);
    setTotalPrice(calculatedPrice) // Reset discount percentage
    setPromoCodeError(""); // Reset promo code error
  };

  const applyPromoCode = () => {
    const promoCode = promoCodes.find((code) => code.code === enteredPromoCode);

    if (promoCode) {
      const discountedPrice =
        totalPrice - (totalPrice * promoCode.discountPercentage) / 100;
      setDiscountPercentage(promoCode.discountPercentage);
      setTotalPrice(discountedPrice);
      setPromoCodeError("");
    } else {
      setPromoCodeError("Invalid code"); // Display error message
    }
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
            <h1 className="flex flex-row justify-between text-xl mt-4">
              Montant de réduction
              <span className="text-xl font-bold">{(totalPrice * discountPercentage/100)} &euro;</span>
            </h1>
            <h1 className="flex flex-row justify-between text-2xl mt-8">
              Montant final
              <span className="text-2xl font-bold">
                {total} &euro;
              </span>
            </h1>
            <div className="flex flex-col lg:flex-row items-center mt-4">
              <label htmlFor="promoCode" className="mr-2 mb-2 lg:mb-0">
                Entrez un code promo:
              </label>
              <div className="flex flex-row items-center w-full">
                <input
                  type="text"
                  id="promoCode"
                  className="border border-gray-300 rounded px-2 py-1 w-full lg:w-auto"
                  value={enteredPromoCode}
                  onChange={handlePromoCodeChange}
                />
                <button
                  className="ml-2 px-4 py-1 bg-gray-500 text-white rounded"
                  onClick={applyPromoCode}
                >
                  Appliquer
                </button>
              </div>
            </div>
            {promoCodeError && (
              <p className="text-red-500 mt-2">{promoCodeError}</p>
            )}
            {discountPercentage > 0 && (
              <p className="text-green-500 mt-2">
                Réduction appliquée: {discountPercentage}%
              </p>
            )}
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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    // Fetch promo codes from Sanity
    const query = `*[_type == "promoCode"]{
      code,
      discountPercentage
    }`;
    const promoCodes = await sanityClient.fetch<PromoCode[]>(query);

    return {
      props: {
        promoCodes,
      },
    };
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    return {
      props: {
        promoCodes: [],
      },
    };
  }
};
