import { NextPage } from "next";
import { useStateContext } from "../../context/stateContext";
import CartItem from "../components/CartItem";
import getStripe from "../../lib/getStripe";
import toast from "react-hot-toast";
import { useState } from "react";
import MyForm from "../components/ShippingForm";

const Cart: NextPage = () => {
  const { cartItems, totalPrice } = useStateContext();
  const [openForm, setOpenForm] = useState(false);
  console.log(cartItems, totalPrice);
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

  return (
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
          {openForm ? (
            <MyForm setOpenForm={setOpenForm} />
          ) : (
            <button
              onClick={() => {
                setOpenForm(true);
              }}
              className="text-xl text-center px-4 py-2 text-white bg-black rounded w-full mt-8"
              hidden={cartItems.length == 0}
            >
              passer à l`expédition
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
