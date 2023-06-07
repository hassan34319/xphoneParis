import { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";
import BlowfishTranslation from "../../utils/blowfishTranslation";
import MacGeneration from "../../utils/hmacGeneration";
import { v4 as uuid } from "uuid";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const unique_id = uuid();
  const TransactionId = "TR" + "-" + unique_id;
  const ReferenceId = "Ref" + "-" + unique_id;
  if (req.method === "POST") {
    try {
      const {
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
      console.log(items)
      const mac = new MacGeneration(
        `*${TransactionId}*${process.env.NEXT_PUBLIC_MERCHANT_ID}*${Amount}*EUR`
      );
      const mac_result = mac.generateMAC();
      console.log(mac_result);
      const unencrypt = `MerchantID=${process.env.NEXT_PUBLIC_MERCHANT_ID}&MsgVer=2.0&TransID=${TransactionId}&RefNr=${ReferenceId}&Amount=${Amount}&Currency=EUR&URLSuccess=https://www.yourshop.info/success.php&URLFailure=https://www.yourshop.info/failure.php&URLNotify=https://www.yourshop.info/notify.php&Response=encrypt&MAC=${mac_result}&Language=en`;
      const blowfish = new BlowfishTranslation(unencrypt);
      const encrypt_result = blowfish.encryptBlowfish();
      console.log("DATA", encrypt_result);

      const queryParams = querystring.stringify({
        MerchantID: process.env.NEXT_PUBLIC_MERCHANT_ID,
        Data: encrypt_result,
        Len: unencrypt.length,
        Template: "PaymentPageDropDown_BNP_v1",
        Language: "en",
        CCTemplate: "Cards_BNP_v1",
        SDDTemplate: "DirectDebit_BNP_v1",
        URLBack: "http://www.xphones.fr/",
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
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.status(405).end();
  }
}
