import { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";
import BlowfishTranslation from "../../utils/blowfishTranslation";
import MacGeneration from "../../utils/hmacGeneration";
import { v4 as uuid } from "uuid";
import MACGeneration from "../../utils/hmacGeneration";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  console.log('reached here')
  console.log(request)
  const formData = await request.formData();
    // try {
    //   const {
    //     email,
    //     unique_id,
    //     serializedData,
    //     items,
    //     Amount,
    //     CustomField1,
    //     CustomField2,
    //     CustomField3,
    //     CustomField4,
    //     CustomField5,
    //     CustomField6,
    //     CustomField7,
    //     CustomField8,
    //     CustomField9,
    //     PayType,
    //   } = body;

    const email = formData.get('email') as string | null;
    const unique_id = formData.get('unique_id') as string | null;
    const serializedData = formData.get('serializedData') as string | null;
    const items = formData.get('items') as string | null;
    const Amount = formData.get('Amount') as number | null;
    const CustomField1 = formData.get('CustomField1') as string | null;
    const CustomField2 = formData.get('CustomField2') as string | null;
    const CustomField3 = formData.get('CustomField3') as string | null;
    const CustomField4 = formData.get('CustomField4') as string | null;
    const CustomField5 = formData.get('CustomField5') as string | null;
    const CustomField6 = formData.get('CustomField6') as string | null;
    const CustomField7 = formData.get('CustomField7') as string | null;
    const CustomField8 = formData.get('CustomField8') as string | null;
    const CustomField9 = formData.get('CustomField9') as string | null;
    const PayType = formData.get('PayType') as string | null;

    
      console.log("passed Cart",serializedData)
      

      // Encrypt the serialized data
      const blowfish2 = new BlowfishTranslation(serializedData);
      const hMacKey = blowfish2.encryptBlowfish();
      console.log(hMacKey)
      const TransactionId = unique_id;
      const ReferenceId = "RG2023" + "-" + unique_id;
      console.log(items);
      const macunencrypt = `*${TransactionId}*${
        process.env.NEXT_PUBLIC_MERCHANT_ID
      }*${Amount! * 100}*EUR`;
      console.log(macunencrypt);
      const mac = new MacGeneration(macunencrypt);
      const mac_result = mac.generateMAC();
      console.log(mac_result);
      const unencrypt = `MerchantID=${
        process.env.NEXT_PUBLIC_MERCHANT_ID
      }&MsgVer=2.0&TransID=${TransactionId}&Amount=${
        Amount! * 100
      }&Currency=EUR&URLSuccess=https://test-xphones.vercel.app/api/success&URLFailure=https://test-xphones.vercel.app/api/failure&URLNotify=https://test-xphones.vercel.app/api/notify?hMac=${hMacKey}&Response=encrypt&MAC=${mac_result}&Language=en`;
      console.log(unencrypt);
      const blowfish = new BlowfishTranslation(unencrypt);
      const encrypt_result = blowfish.encryptBlowfish();
      const queryParams = querystring.stringify({
        MerchantID: process.env.NEXT_PUBLIC_MERCHANT_ID,
        Data: encrypt_result,
        Len: unencrypt.length,
        Template: "PaymentPageDropDown_BNP_v1",
        Language: "fr",
        CCTemplate: "Cards_BNP_v1",
        SDDTemplate: "DirectDebit_BNP_v1",
        URLBack: "https://xphones.fr/cart",
        CustomField1,
        CustomField2,
        CustomField3,
        CustomField4,
        CustomField5,
        CustomField6,
        CustomField7,
        CustomField8,
        CustomField9,
        PayType,
      });
      
      try {
      const redirectUrl = `https://paymentpage.axepta.bnpparibas/paymentPage.aspx?${queryParams}`;

      return Response.redirect(redirectUrl, 302);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: "Internal Server Error" });
    }
  }
