import BlowfishTranslation from '../../utils/blowfishTranslation';
import "dotenv/config";
import ParseResponse from "../../utils/keyValueParser";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import * as SibApiV3Sdk from '@sendinblue/client'
import { getServerSession } from "next-auth/next";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { uuid } from "uuidv4";
import { prisma } from "../client/route";
import parseGatewayResponse from "../../utils/keyValueParser";
import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from "../../../lib/sanityClient";
import { variant } from '../../utils/types';
interface ResponseData {
    TransID?: string;
    Status? : string
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
  
  type Props = {
    decodedHmac: String;
  };

  export async function POST(request: NextRequest) {
    const formData  = await request.formData();
    const  hMac  = request.nextUrl.searchParams.get("hMac");
    const Data = formData.get('Data') as string ;
    const blowfish = new BlowfishTranslation(Data);
    const decryptedData = blowfish.decryptBlowfish();
  
    const obj_data = new ParseResponse(decryptedData);
    const res_final: ResponseData = obj_data.parse();
  
    const TransID = res_final.TransID;
    //   const session = await getServerSession(req, res, authOptions);
    //   console.log(session?.user)
  
    // Check if localStorage.hMac matches the hmacQuery
    if (hMac) {
      const TransId = TransID;
  
      const existingOrder = await prisma.order.findUnique({
        where: {
          id: TransID,
        },
      });
  
      if (existingOrder) {
        // Order already exists in the database, redirect the user to the home page
        return {
          redirect: {
            destination: "/", // Replace with the desired home page URL
            permanent: false, // Set to true if the redirect is permanent
          },
        };
      }
      const blowfish2 = new BlowfishTranslation(hMac);
      const decryptedData2 = blowfish2.decryptBlowfish();
      // Parse the decrypted data as JSON
      const cart = JSON.parse(decryptedData2);
      const obj_ = cart.pop();
      console.log(obj_);
      const email = obj_.email;
      const totalPrice = obj_.total;
      const discountPercentage = obj_.discount;
      const promoCode = obj_.promo;
      if (res_final.Status == "FAILED") {

        return NextResponse.error();
      }
      console.log(email, "New cart", cart);

      // Fun for price total
      const calculateTotalPrice = (cart: Item[]) => {
        return cart.reduce((totalPrice: number, item: Item) => {
          return totalPrice + item.price * item.quantity;
        }, 0);
      };
  
      const dateObject = new Date(Date.now());
  
      let date = dateObject.toISOString();

  
      // let defaultClient = SibApiV3Sdk.ApiClient.instance;

      // Storing Order in Prisma

      // Find User
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
  
      if (!user) {
        // Handle the case when the user is not found
        return NextResponse.error();
      }
  
      const activeUserId = user.id;


      //  Create order in db
      const createdOrder = await prisma.order.create({
        data: {
          id: TransID!,
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
      console.log(res_final);
      // Create new items in the database for the cart
  
      console.log("CART UPDATED SUCCESSFULLY");

      


      // Send Emeail To Client/Customer
  

  
      let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.NEXT_PUBLIC_API_KEY as string)
      var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

  
      sendSmtpEmail = {
        to: [
          {
            email: email,
          },
        ],
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
          itemUnitPrice5: cart[5]?.price || null,
          itemQuantity5: cart[4]?.quantity || null,
          itemColor5: cart[4]?.color || null,
          itemCapacity5: cart[5]?.capacity || null,
          itemImage5: cart[4]?.image || null,
        },
        headers: {
          "X-Mailin-custom":
            "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
          "api-key": process.env.NEXT_PUBLIC_API_KEY,
          "content-type": "application/json",
          accept: "application/json",
        },
      };
  
      const res3 = await apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data: any) {
          console.log("API called successfully. Returned data: " + data);
        },
        function (error: any) {
          console.error(error);
        }
      );


      // Send Emeail to Xphones


      sendSmtpEmail = {
        to: [
          {
            email: "xphones@proton.me",
          },
        ],
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
          itemUnitPrice5: cart[5]?.price || null,
          itemQuantity5: cart[4]?.quantity || null,
          itemColor5: cart[4]?.color || null,
          itemCapacity5: cart[5]?.capacity || null,
          itemImage5: cart[4]?.image || null,
        },
        headers: {
          "X-Mailin-custom":
            "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
          "api-key": process.env.NEXT_PUBLIC_API_KEY,
          "content-type": "application/json",
          accept: "application/json",
        },
      };
  
      const res4 = await apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data: any) {
          console.log("API called successfully. Returned data: " + data);
        },
        function (error: any) {
          console.error(error);
        }
      );


      
      // Update Sanity Product Inventory
      const updateProductInventory = async (productId : string, color : string, grade : string , capacity : number, quantity : number) => {
        // Fetch the current product data from Sanity
        const product = await sanityClient.getDocument(productId);
      
        // Find the variant with matching color, grade, and capacity
        const variantIndex = product?.variants.findIndex(
          (variant : variant) =>
            variant.color === color &&
            variant.grade === grade &&
            variant.capacity === capacity
        );
      
        if (variantIndex === -1) {
          throw new Error("Variant not found");
        }
      
        // Create a new array with the updated quantity
        const updatedVariants = [...product?.variants];
        updatedVariants[variantIndex].quantity -= quantity;
      
        // Update the product with the updated variants array
        await sanityClient
          .patch(productId)
          .set({ variants: updatedVariants })
          .commit();
      };
      
      cart.forEach(async (item : Item) => {
        const { productId, color, grade, capacity, quantity } = item;
      
        // Update the product inventory using the defined function
        await updateProductInventory(productId, color, grade, capacity, quantity);
      });
      
      console.log("CART UPDATED SUCCESSFULLY");
  
      
  
      return NextResponse.json({ exists: true });
    } else {
      return NextResponse.error();
    }
  }
  