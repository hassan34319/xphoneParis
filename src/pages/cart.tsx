import { NextPage } from "next";
import { useStateContext } from "../../context/stateContext";
import CartItem from "../components/CartItem";
import getStripe from "../../lib/getStripe";
import toast from "react-hot-toast";

const Cart: NextPage = () => {
  const { cartItems, totalPrice } = useStateContext();
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
  const handleFormSubmit = async () => {
    function getFullItem(item : any) {
      return ([item.name, item.color].join(" ") + ' × ' + item.quantity + '|'  )
      ;
    }
    const items = cartItems.map(getFullItem)
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/payment";
    const params: Record<string, string> = {
      Amount: totalPrice,
      items,
      CustomField1: totalPrice + "EUR",
      CustomField2: "",
      CustomField3:
        "https://cdn.shopify.com/s/files/1/0061/7929/1200/files/ephones_250x.png?v=1638106517",
      CustomField4: items,
      CustomField5:
        "Company Ltd.|John Smith|Schwarzenberstraße 2-4|96050 Bamberg",
      CustomField6:
        "Company Ltd.|John Smith|Schwarzenberstraße 2-4|96050 Bamberg",
      CustomField7: "RG-Inv 123-2021",
      CustomField8: "Some Label",
      CustomField9: "Some Text",
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
    <div className="w-11/12 mx-auto">
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
        <div className="lg:w-4/12 bg-white rounded p-4 max-h-60">
          <h1 className="text-2xl">Récapitulatif</h1>
          <h1 className="text-xl">{cartItems.length} articles</h1>
          <h1 className="flex flex-row justify-between text-xl mt-8">
            Total panier
            <span className="text-xl font-bold">{totalPrice} &euro;</span>
          </h1>
          <button
            onClick={handleFormSubmit}
            className="text-xl text-center px-4 py-2 text-white bg-black rounded w-full mt-8"
            hidden={cartItems.length == 0}
          >
            Payer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
