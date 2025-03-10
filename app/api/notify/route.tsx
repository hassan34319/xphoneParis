import { prisma } from "../client/route";
import { NextRequest, NextResponse } from 'next/server';
import BlowfishTranslation from '../../utils/blowfishTranslation';
import ParseResponse from "../../utils/keyValueParser";
import * as SibApiV3Sdk from '@sendinblue/client';
import { sanityClient } from "../../../lib/sanityClient";
import { variant } from '../../utils/types';

interface ResponseData {
  TransID?: string;
  Status?: string;
  // Include other properties as needed
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

export async function POST(request: NextRequest) {
  console.log('Reached notify endpoint');
  
  try {
    // Check for test mode flag in query params
    const isTestMode = request.nextUrl.searchParams.get("testMode") === "true";
    let TransID: string;
    let status: string;
    
    if (isTestMode) {
      console.log("Running in test mode");
      
      // For test mode, get TransID from query param
      TransID = request.nextUrl.searchParams.get("orderId") || "";
      
      if (!TransID) {
        console.error("Test mode requires orderId parameter");
        return NextResponse.json({ error: "Missing orderId parameter for test mode" }, { status: 400 });
      }
      
      // Always treat as accepted payment in test mode
      status = "Processed";
    } else {
      // Normal processing with real payment data
      const formData = await request.formData();
      const Data = formData.get('Data') as string;
      
      console.log("Data received:", !!Data);
      
      if (!Data) {
        console.error("No Data parameter found in request");
        return NextResponse.json({ error: "Missing Data parameter" }, { status: 400 });
      }
      
      const blowfish = new BlowfishTranslation(Data);
      const decryptedData = blowfish.decryptBlowfish();
      
      console.log("Decrypted data:", decryptedData);
      
      const obj_data = new ParseResponse(decryptedData);
      const res_final: ResponseData = obj_data.parse();
      
      console.log("Parsed response:", res_final);
      
      TransID = res_final.TransID || "";
      
      if (!TransID) {
        console.error("TransID missing from response");
        return NextResponse.json({ error: "TransID missing" }, { status: 400 });
      }
      
      // Update order status based on payment result
      status = res_final.Status === "ACCEPTED" ? "Processed" : "Failed";
      
      // If payment failed and not in test mode, return early
      if (res_final.Status !== "ACCEPTED" && !isTestMode) {
        console.log(`Updating order ${TransID} status to ${status}`);
        
        await prisma.order.update({
          where: { id: TransID },
          data: { status: status },
        });
        
        return NextResponse.json({ success: false, status: "Payment failed" });
      }
    }
    
    // Check if order exists (for both test and normal mode)
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: TransID,
      },
    });
    
    if (!existingOrder) {
      console.error("Order not found:", TransID);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    
    // Update order status
    console.log(`Updating order ${TransID} status to ${status}`);
    
    const updatedOrder = await prisma.order.update({
      where: { id: TransID },
      data: { status: status },
    });
    
    console.log("Order updated:", updatedOrder);
    
    // Get cart data from hMac or directly from the request body in test mode
    let cart: Item[];
    let email: string;
    let totalPrice: number;
    let discountPercentage: number = 0;
    let promoCode: string = "";
    
    const hMac = request.nextUrl.searchParams.get("hMac");
    
    if (isTestMode && !hMac) {
      // In test mode, try to get cart data from request body if hMac isn't provided
      try {
        const requestBody = await request.json().catch(() => null);
        if (requestBody && requestBody.cart) {
          cart = requestBody.cart;
          email = requestBody.email || "test@example.com";
          totalPrice = requestBody.totalPrice || cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          discountPercentage = requestBody.discountPercentage || 0;
          promoCode = requestBody.promoCode || "";
          
          console.log("Test mode using cart data from request body");
        } else {
          console.error("Test mode requires cart data in request body when hMac is not provided");
          return NextResponse.json({ error: "Missing cart data for test mode" }, { status: 400 });
        }
      } catch (error) {
        console.error("Error parsing test data:", error);
        return NextResponse.json({ error: "Invalid test data format" }, { status: 400 });
      }
    } else if (hMac) {
      try {
        const blowfish2 = new BlowfishTranslation(hMac);
        const decryptedData2 = blowfish2.decryptBlowfish();
        
        // Parse the decrypted data as JSON
        const cartData = JSON.parse(decryptedData2);
        const obj_ = cartData.pop();
        console.log("Cart data:", obj_);
        
        email = obj_.email;
        totalPrice = obj_.total;
        discountPercentage = obj_.discount;
        promoCode = obj_.promo;
        cart = cartData;
        
        console.log(`Processing order for ${email}, total: ${totalPrice}`);
      } catch (decryptError) {
        console.error("Error decrypting hMac or processing cart data:", decryptError);
        return NextResponse.json({ error: "Failed to process cart data" }, { status: 500 });
      }
    } else {
      console.error("No hMac provided and not in test mode with valid body data");
      return NextResponse.json({ error: "Missing hMac parameter" }, { status: 400 });
    }
    
    // Function for price total
    const calculateTotalPrice = (cart: Item[]) => {
      return cart.reduce((totalPrice: number, item: Item) => {
        return totalPrice + item.price * item.quantity;
      }, 0);
    };
    
    const dateObject = new Date(Date.now());
    let date = dateObject.toISOString();
    
    // Find User
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    
    if (!user && !isTestMode) {
      console.error("User not found:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    console.log("Found user or in test mode");
    
    // Send Email To Client/Customer
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.NEXT_PUBLIC_API_KEY as string);
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail = {
      to: [
        {
          email: email,
        },
      ],
      templateId: 3,
      params: {
        Total: Math.round(totalPrice),
        ORDERID: TransID,
        ORDERDATE: date,
        calculated: calculateTotalPrice(cart),
        discount: discountPercentage,
        itemName1: cart[0]?.name || null,
        itemPrice1: cart[0]?.price * cart[0]?.quantity || null,
        itemUnitPrice1: cart[0]?.price || null,
        itemQuantity1: cart[0]?.quantity || null,
        itemColor1: cart[0]?.color || null,
        itemCapacity1: cart[0]?.capacity || null,
        itemImage1: cart[0]?.image || null,
        itemName2: cart[1]?.name || null,
        itemPrice2: cart[1]?.price * cart[1]?.quantity || null,
        itemUnitPrice2: cart[1]?.price || null,
        itemQuantity2: cart[1]?.quantity || null,
        itemColor2: cart[1]?.color || null,
        itemCapacity2: cart[1]?.capacity || null,
        itemImage2: cart[1]?.image || null,
        itemName3: cart[2]?.name || null,
        itemPrice3: cart[2]?.price * cart[2]?.quantity || null,
        itemUnitPrice3: cart[2]?.price || null,
        itemQuantity3: cart[2]?.quantity || null,
        itemColor3: cart[2]?.color || null,
        itemCapacity3: cart[2]?.capacity || null,
        itemImage3: cart[2]?.image || null,
        itemName4: cart[3]?.name || null,
        itemPrice4: cart[3]?.price * cart[3]?.quantity || null,
        itemUnitPrice4: cart[3]?.price || null,
        itemQuantity4: cart[3]?.quantity || null,
        itemColor4: cart[3]?.color || null,
        itemCapacity4: cart[3]?.capacity || null,
        itemImage4: cart[3]?.image || null,
        itemName5: cart[4]?.name || null,
        itemPrice5: cart[4]?.price * cart[4]?.quantity || null,
        itemUnitPrice5: cart[4]?.price || null,
        itemQuantity5: cart[4]?.quantity || null,
        itemColor5: cart[4]?.color || null,
        itemCapacity5: cart[4]?.capacity || null,
        itemImage5: cart[4]?.image || null,
      },
      headers: {
        "X-Mailin-custom": "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
        "api-key": process.env.NEXT_PUBLIC_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
    };
    
    console.log("Sending email to customer:", email);
    
    try {
      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log("Customer email sent successfully");
    } catch (emailError) {
      console.error("Error sending customer email:", emailError);
    }
    
    // Send Email to Xphones
    sendSmtpEmail = {
      to: [
        {
          email: "xphones@proton.me",
        },
      ],
      templateId: 3,
      params: {
        Total: Math.round(totalPrice),
        ORDERID: TransID,
        ORDERDATE: date,
        calculated: calculateTotalPrice(cart),
        discount: discountPercentage,
        itemName1: cart[0]?.name || null,
        itemPrice1: cart[0]?.price * cart[0]?.quantity || null,
        itemUnitPrice1: cart[0]?.price || null,
        itemQuantity1: cart[0]?.quantity || null,
        itemColor1: cart[0]?.color || null,
        itemCapacity1: cart[0]?.capacity || null,
        itemImage1: cart[0]?.image || null,
        itemName2: cart[1]?.name || null,
        itemPrice2: cart[1]?.price * cart[1]?.quantity || null,
        itemUnitPrice2: cart[1]?.price || null,
        itemQuantity2: cart[1]?.quantity || null,
        itemColor2: cart[1]?.color || null,
        itemCapacity2: cart[1]?.capacity || null,
        itemImage2: cart[1]?.image || null,
        itemName3: cart[2]?.name || null,
        itemPrice3: cart[2]?.price * cart[2]?.quantity || null,
        itemUnitPrice3: cart[2]?.price || null,
        itemQuantity3: cart[2]?.quantity || null,
        itemColor3: cart[2]?.color || null,
        itemCapacity3: cart[2]?.capacity || null,
        itemImage3: cart[2]?.image || null,
        itemName4: cart[3]?.name || null,
        itemPrice4: cart[3]?.price * cart[3]?.quantity || null,
        itemUnitPrice4: cart[3]?.price || null,
        itemQuantity4: cart[3]?.quantity || null,
        itemColor4: cart[3]?.color || null,
        itemCapacity4: cart[3]?.capacity || null,
        itemImage4: cart[3]?.image || null,
        itemName5: cart[4]?.name || null,
        itemPrice5: cart[4]?.price * cart[4]?.quantity || null,
        itemUnitPrice5: cart[4]?.price || null,
        itemQuantity5: cart[4]?.quantity || null,
        itemColor5: cart[4]?.color || null,
        itemCapacity5: cart[4]?.capacity || null,
        itemImage5: cart[4]?.image || null,
      },
      headers: {
        "X-Mailin-custom": "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
        "api-key": process.env.NEXT_PUBLIC_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
    };
    
    console.log("Sending email to xphones@proton.me");
    
    try {
      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log("Xphones email sent successfully");
    } catch (emailError) {
      console.error("Error sending xphones email:", emailError);
    }
    
    // Update Sanity Product Inventory (skip in test mode if specified)
    const skipInventoryUpdate = isTestMode && request.nextUrl.searchParams.get("skipInventory") === "true";
    
    if (!skipInventoryUpdate) {
      const updateProductInventory = async (productId: string, color: string, grade: string, capacity: number, quantity: number) => {
        try {
          console.log(`Updating inventory for product ${productId}, color: ${color}, grade: ${grade}, capacity: ${capacity}, quantity: ${quantity}`);
          
          // Fetch the current product data from Sanity
          const product = await sanityClient.getDocument(productId);
          
          if (!product) {
            console.error(`Product ${productId} not found in Sanity`);
            return;
          }
          
          // Find the variant with matching color, grade, and capacity
          const variantIndex = product.variants.findIndex(
            (variant: variant) =>
              variant.color === color &&
              variant.grade === grade &&
              variant.capacity === capacity
          );
          
          if (variantIndex === -1) {
            console.error(`Variant not found for product ${productId}`);
            return;
          }
          
          // Create a new array with the updated quantity
          const updatedVariants = [...product.variants];
          updatedVariants[variantIndex].quantity -= quantity;
          
          // Ensure quantity doesn't go below zero
          if (updatedVariants[variantIndex].quantity < 0) {
            updatedVariants[variantIndex].quantity = 0;
          }
          
          // Update the product with the updated variants array
          await sanityClient
            .patch(productId)
            .set({ variants: updatedVariants })
            .commit();
            
          console.log(`Inventory updated for product ${productId}`);
        } catch (error) {
          console.error(`Error updating inventory for product ${productId}:`, error);
        }
      };
      
      // Process each item in the cart
      for (const item of cart) {
        if (item.productId) {
          try {
            await updateProductInventory(
              item.productId,
              item.color,
              item.grade,
              item.capacity,
              item.quantity
            );
          } catch (inventoryError) {
            console.error("Error updating inventory:", inventoryError);
          }
        }
      }
    } else {
      console.log("Skipping inventory updates in test mode");
    }
    
    console.log("Notification processing completed successfully");
    return NextResponse.json({ 
      success: true, 
      testMode: isTestMode ? "Used test mode" : undefined 
    });
    
  } catch (error) {
    console.error("Error in notification handling:", error);
    return NextResponse.json(
      { error: "Failed to process notification", details: error.message },
      { status: 500 }
    );
  }
}