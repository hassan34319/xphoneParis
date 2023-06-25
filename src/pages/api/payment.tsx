import { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";
import BlowfishTranslation from "../../utils/blowfishTranslation";
import MacGeneration from "../../utils/hmacGeneration";
import { v4 as uuid } from "uuid";
import MACGeneration from "../../utils/hmacGeneration";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const {
        email,
        unique_id,
        serializedData,
        items,
        Amount,
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
      } = req.body;
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
      }*${Amount * 100}*EUR`;
      console.log(macunencrypt);
      const mac = new MacGeneration(macunencrypt);
      const mac_result = mac.generateMAC();
      console.log(mac_result);
      const unencrypt = `MerchantID=${
        process.env.NEXT_PUBLIC_MERCHANT_ID
      }&MsgVer=2.0&TransID=${TransactionId}&Amount=${
        Amount * 100
      }&Currency=EUR&URLSuccess=https://xphones.fr/api/success&URLFailure=https://xphones.fr/api/failure&URLNotify=https://xphones.fr/api/notify?hMac=${hMacKey}&Response=encrypt&MAC=${mac_result}&Language=en`;
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

      const redirectUrl = `https://paymentpage.axepta.bnpparibas/paymentPage.aspx?${queryParams}`;

      res.writeHead(302, { Location: redirectUrl });
      res.end();
    } catch (error) {
      console.error(error);
      res.status(200).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.status(405).end();
  }
}
