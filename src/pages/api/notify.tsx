
import BlowfishTranslation from '../../utils/blowfishTranslation';
import "dotenv/config";
import ParseResponse from "../../utils/keyValueParser";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { authOptions } from ".././api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { CartItem } from "@prisma/client";
import { uuid } from "uuidv4";
import { prisma } from ".././api/client";
import parseGatewayResponse from "../../utils/keyValueParser";
interface ResponseData {
    TransID?: string;
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.query,req.body)
  const { hMac,email } = req.query;
  const { Data } = req.body;

  const blowfish = new BlowfishTranslation(Data);
  const decryptedData = blowfish.decryptBlowfish();

  const obj_data = new ParseResponse(decryptedData);
  const res_final: ResponseData = obj_data.parse();
  console.log("pRINTING FROM HERE", res_final);
  const TransID = res_final.TransID
  console.log(TransID)


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
    console.log("hmac", hMac)
    const blowfish2 = new BlowfishTranslation(hMac);
    const decryptedData2 = blowfish2.decryptBlowfish();
    console.log("decrypted", decryptedData2)
    // Parse the decrypted data as JSON
    const cart = JSON.parse(decryptedData2);

    console.log("cart",cart);
    let defaultClient = SibApiV3Sdk.ApiClient.instance;

    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.NEXT_PUBLIC_API_KEY;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

    const calculateTotalPrice = (cart: Item[]) => {
      return cart.reduce((totalPrice: number, item: Item) => {
        return totalPrice + item.price * item.quantity;
      }, 0);
    };

    const dateObject = new Date();

    let date = dateObject.toUTCString();

    console.log(date);

    if (!email) {
      return "User not found";
    }

    sendSmtpEmail = {
      to: [
        {
          email: email,
        },
      ],
      templateId: 3,
      params: {
        Total: calculateTotalPrice(cart),
        ORDERID: Date.now().toString(),
        ORDERDATE: date,
        itemName1: cart[0].name,
        itemPrice1: cart[0].price * cart[0].quantity,
        itemQuantity1: cart[0].quantity,
        itemColor1: cart[0].color,
        itemCapacity1: cart[0].capacity,
        itemImage1: cart[0].image,
        itemName2: cart[1]?.name || null,
        itemPrice2: cart[1]?.price * cart[1]?.quantity || null,
        itemQuantity2: cart[1]?.quantity || null,
        itemColor2: cart[1]?.color || null,
        itemCapacity2: cart[1]?.capacity || null,
        itemImage2: cart[1]?.image || null,
        itemName3: cart[2]?.name || null,
        itemPrice3: cart[2]?.price * cart[2]?.quantity || null,
        itemQuantity3: cart[2]?.quantity || null,
        itemColor3: cart[2]?.color || null,
        itemCapacity3: cart[2]?.capacity || null,
        itemImage3: cart[2]?.image || null,
        itemName4: cart[3]?.name || null,
        itemPrice4: cart[3]?.price * cart[3]?.quantity || null,
        itemQuantity4: cart[3]?.quantity || null,
        itemColor4: cart[3]?.color || null,
        itemCapacity4: cart[3]?.capacity || null,
        itemImage4: cart[3]?.image || null,
        itemName5: cart[4]?.name || null,
        itemPrice5: cart[4]?.price * cart[4]?.quantity || null,
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
    console.log(res3);

    const user = await prisma.user.findUnique({
      where: {
        email: email.toString().toLowerCase(),
      },
    });

    if (!user) {
      // Handle the case when the user is not found
      throw new Error("User not found");
    }

    const activeUserId = user.id;

    const createdOrder = await prisma.order.create({
      data: {
        id: TransID!,
        userId: activeUserId,
        status: "Received",
        total : calculateTotalPrice(cart),
        items: {
          create: cart,
        },
      },
    });
    // Create new items in the database for the cart

    console.log("CART UPDATED SUCCESSFULLY");;

  res.status(200).end();
  }}