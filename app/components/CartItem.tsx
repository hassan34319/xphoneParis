import Link from "next/link";
import { BsTrash } from "react-icons/bs";
import { useStateContext } from "../context/stateContext";

/* eslint-disable @next/next/no-img-element */
interface CartItemProps {
  item: any;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, addToCart } = useStateContext();

  const removeFromCartHandler = () => {
    const product = {
      image: item.image,
      name: item.name,
      productId: item.productId,
      color: item.color,
      capacity: item.capacity,
      grade: item.grade,
      price: item.price,
      quantity: item.quantity,
    };
    removeFromCart(product);
  };

  const addToCartHandler = () => {
    const product = {
      image: item.image,
      name: item.name,
      productId: item.productId,
      color: item.color,
      capacity: item.capacity,
      grade: item.grade,
      price: item.price,
      quantity: item.quantity,
    };
    addToCart(product);
  };

  return (
    <div className=" bg-white rounded p-4 flex flex-row gap-8 mb-4 items-center justify-center">
      <Link href={`/products/${item.productId}`}>
        <img
          alt="product image in cart"
          src={item.image}
          className="w-52 object-contain"
        />
      </Link>
      <div className="flex-1">
        <Link href={`/products/${item.productId}`} className="cursor-pointer hover:underline">
          <h1 className="text-2xl font-semibold">{item.name}</h1>
        </Link>
        <h1>
          {item.name} - {item.capacity}gb - {item.color}
        </h1>
        <h1>Etat: {item.grade}</h1>
        <h1 className="text-xl font-bold">{item.price} &euro;</h1>
        <div className="flex flex-row gap-4 justify-start items-center mt-4">
          <button
            className="text-xl border border-black rounded px-2"
            onClick={removeFromCartHandler}
          >
            -
          </button>
          <h1 className="text-xl">{item.quantity}</h1>
          <button
            className={`text-xl border border-black rounded px-2 ${
              item.quantity >= item.maxQuantity ? "bg-gray-300" : ""
            }`}
            onClick={addToCartHandler}
            disabled={item.quantity >= item.maxQuantity}
          >
            +
          </button>
          {item.quantity >= item.maxQuantity && (
            <p className="text-sm text-red-500">Stock épuisé</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
