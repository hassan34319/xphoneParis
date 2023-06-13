import { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";
import BlowfishTranslation from "../../utils/blowfishTranslation";
import MacGeneration from "../../utils/hmacGeneration";
import { v4 as uuid } from "uuid";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const {
        unique_id,
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
      const TransactionId = unique_id;
      const ReferenceId = "RG2023" + "-" + unique_id;
      console.log(items);
      const macunencrypt = `*${TransactionId}*${process.env.NEXT_PUBLIC_MERCHANT_ID}*${Amount}*EUR`
      console.log(macunencrypt)
      const mac = new MacGeneration(
        macunencrypt
      );
      const mac_result = mac.generateMAC();
      console.log(mac_result);
      const unencrypt = `MerchantID=${process.env.NEXT_PUBLIC_MERCHANT_ID}&MsgVer=2.0&TransID=${TransactionId}&Amount=${Amount*100}&Currency=EUR&URLSuccess=https://xphones.fr/success&URLFailure=https://xphones.fr/failure&URLNotify=https://xphones.fr/&Response=encrypt&MAC=${mac_result}&Language=en`;
      console.log(unencrypt)
      const blowfish = new BlowfishTranslation(unencrypt);
      const encrypt_result = blowfish.encryptBlowfish();
        blowfish.string = "FB58E6D2CF4F2903177C39BCCCB2D286887BBF5A64071261D64779BA0FB9C235DC9DD6906262D79907301751D35096C53926C6B54CB897F3E5344289E5F3AAE76A683661E3D65650D8FAE56F32562BE39F6697ADD0906E131A42523B2CB496E6673FADF63AE94B627E0477A57CA92D84E4AF6AFB511BF0BEDFD565700980E4458780F03620EDD3842D46B0B514BC7048830A9B6D688D50CB52C6F801821A58BA155E1A1063E0BAF552C33591983CE9C2188982ABBE1192DF9F4ED88C2D6B3E48854DAB5EC2FA4AD983D46F68141404A6B7CCDB2E1293F8A495C3155B0FF684C7AD0DFE4660EA9DA8BF9106CA9730726C30A48D030138AD159D6CED00C90D5EC8FCA9B36AF201A53183873B197CF36546EB804FF74AC3964751DF72C96BCA4CF7F354A579FA77ADB8D0D8745623437348982F3557F255C7D3A5BA3771A14090A860EFC01BC3ABBD0A6DF9389458ABE5DE970A5BD0F1999F1D4C2186459D5FF516DF678F95637B881FD751EBAB316D84A33716AE5AD65AF0FBD04D477430171A5DE10149892153047EC1CB685D98F11E8E6D2ED7C8AC2A056108A37938372986BBE5C9FD9E16B1A7B28719C26C822C6584B1DA4BFD700B699C5FC9C959D9F82A5D164AA24C6D9D498BCDF3A0088BB8FEC59B3B8E089DDA6190164AA24C6D9D498B3E8D33630B1A9152DFFE0D749EE7CBEA6BC232E647B52A26221705D209F4A593D5B873158C2003B13877E23DCC6B66936400EBE6CCD9ED911099A1D85E4A1A67EAFD7750FF552B68689FBB4860F55C0184744065D57ACEDC7886EC3A41F642924B9823EB80134298E151F83FA978B18AF3B5006850B8F701F02DB66662C6833A00633C387294CB78F5A3FB599B8C9F8A1B2998CDCC4A84CFC952B22A4B6E3F3F32983A95808F78210951573E191FA691CE52D5BED1E324AC"
        console.log(blowfish.decryptBlowfish())
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
