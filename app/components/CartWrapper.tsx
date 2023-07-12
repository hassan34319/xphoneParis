"use client"
import React from "react";
import Cart from "./cart";
import ClientOnly from "./ClientOnly";


interface Props {
  promoCodes: PromoCode[];
  currentUser: {
    email: string | null;
    shippingAdress: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
  } | null;
}
interface PromoCode {
    code: string;
    discountPercentage: number;
  }

function CartWrapper({promoCodes,currentUser}: Props) {
  return (
    <ClientOnly>
      <Cart currentUser={currentUser} promoCodes={promoCodes} />
    </ClientOnly>
  );
}

export default CartWrapper;
