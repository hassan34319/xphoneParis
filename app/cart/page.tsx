import React from "react";
import { sanityClient } from "../../lib/sanityClient";
import Cart from "../components/cart";
import CartWrapper from "../components/CartWrapper";
import getCurrentUser from "../utils/getUser";
interface PromoCode {
  code: string;
  discountPercentage: number;
}

type Props = {};

async function CartPage({}: Props) {
  const currentUser = await getCurrentUser();
  const query = `*[_type == "promoCode"]{
              code,
              discountPercentage
             }`;

  const promoCodes = await sanityClient.fetch<PromoCode[]>(query);
  return <CartWrapper currentUser={currentUser} promoCodes={promoCodes} />;
}

export default CartPage;
