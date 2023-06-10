import { useStateContext } from "../../context/stateContext";

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

export async function fetchCart(
  cartId: string,
  setCart: (items: Item[]) => void
) {
  try {
    const response = await fetch(`/api/cart/${cartId}`);
    const data = await response.json();

    if (response.ok) {
      const {items}  = data;
      console.log(items)
      if(items.length==0){
        return
      }
      const cartItems = items.map((item: any) => ({
        image: item.image,
        name: item.name,
        productId: item.productId,
        color: item.color,
        capacity: item.capacity,
        grade: item.grade,
        price: item.price,
        quantity: item.quantity,
      }));

      // Add each cart item to the cart context
      if (cartItems.length>0) {
      setCart(cartItems)
      };
    } else {
      console.error("Failed to fetch cart:", data.error);
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}
