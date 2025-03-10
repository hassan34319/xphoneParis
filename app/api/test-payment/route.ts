import BlowfishTranslation from "../../utils/blowfishTranslation";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "../client/route";
import { v4 as uuid } from "uuid";
import * as SibApiV3Sdk from '@sendinblue/client';
import { sanityClient } from "../../../lib/sanityClient";
import { variant } from '../../utils/types';

export async function GET(request: NextRequest) {
  // Get test parameters from URL
  const email = request.nextUrl.searchParams.get("email") || "test@example.com";
  const testData = request.nextUrl.searchParams.get("data") || "";
  
  // Create a test transaction ID
  const TransID = uuid();
  
  try {
    // Simulate the encrypted cart data - either use the provided test data or create a mock cart
    let cart;
    
    if (testData) {
      // If test data is provided, use it
      const blowfish = new BlowfishTranslation(testData);
      const decryptedData = blowfish.decryptBlowfish();
      cart = JSON.parse(decryptedData);
    } else {
      // Create a mock cart for testing
      cart = [
        {
          image: "https://example.com/image1.jpg",
          name: "Test iPhone",
          productId: "test-product-1",
          color: "Black",
          capacity: 128,
          grade: "A",
          price: 500,
          quantity: 1
        }
      ];
      
      // Add the email and total details that would normally be in the last item
      cart.push({
        email: email,
        total: 500,
        discount: 0,
        promo: ""
      });
    }
    
    const obj_ = cart.pop();
    const totalPrice = obj_.total;
    const discountPercentage = obj_.discount;
    const promoCode = obj_.promo;
    
    // Calculate total price function
    const calculateTotalPrice = (items: any[]) => {
      return items.reduce((total: number, item: any) => {
        return total + (item.price * item.quantity);
      }, 0);
    };
    
    const dateObject = new Date(Date.now());
    let date = dateObject.toISOString();
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    
    if (!user) {
      // Create a test user if not found
      user = await prisma.user.create({
        data: {
          id: uuid(),
          email: email,
          name: "Test User"
        }
      });
    }
    
    const activeUserId = user.id;
    
    // Create order in the database
    const createdOrder = await prisma.order.create({
      data: {
        id: TransID,
        userId: activeUserId,
        status: "Received",
        calculated: calculateTotalPrice(cart),
        total: totalPrice,
        discount: discountPercentage,
        promo: obj_.promo,
        items: {
          create: cart,
        },
      },
    });
    
    console.log("Order created:", createdOrder);
    
    // Send email to customer
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.NEXT_PUBLIC_API_KEY as string);
    
    // Setup email parameters
    const sendSmtpEmail = {
      to: [{ email: email }],
      templateId: 3,
      params: {
        Total: Math.round(totalPrice),
        ORDERID: Date.now().toString(),
        ORDERDATE: date,
        calculated: calculateTotalPrice(cart),
        discount: discountPercentage,
        itemName1: cart[0].name,
        itemPrice1: cart[0].price * cart[0].quantity,
        itemUnitPrice1: cart[0].price,
        itemQuantity1: cart[0].quantity,
        itemColor1: cart[0].color,
        itemCapacity1: cart[0].capacity,
        itemImage1: cart[0].image,
      },
      headers: {
        "X-Mailin-custom": "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
        "api-key": process.env.NEXT_PUBLIC_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
    };
    
    // Send the email
    try {
      const emailResponse = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Email sending failed:", error);
    }
    
    // Optional: Update Sanity inventory (commented out for testing)
    /*
    cart.forEach(async (item: any) => {
      if (item.productId) {
        const { productId, color, grade, capacity, quantity } = item;
        try {
          // Fetch the product
          const product = await sanityClient.getDocument(productId);
          
          // Find the variant
          const variantIndex = product?.variants.findIndex(
            (variant: variant) =>
              variant.color === color &&
              variant.grade === grade &&
              variant.capacity === capacity
          );
          
          if (variantIndex !== -1) {
            // Update quantity
            const updatedVariants = [...product?.variants];
            updatedVariants[variantIndex].quantity -= quantity;
            
            // Update Sanity
            await sanityClient
              .patch(productId)
              .set({ variants: updatedVariants })
              .commit();
            
            console.log(`Updated inventory for product ${productId}`);
          }
        } catch (err) {
          console.error(`Failed to update inventory for product ${productId}:`, err);
        }
      }
    });
    */
    
    return NextResponse.json({ 
      success: true, 
      message: "Test order created and email sent",
      orderId: TransID
    });
    
  } catch (error) {
    console.error("Test payment simulation failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Test payment simulation failed" 
    }, { status: 500 });
  }
}