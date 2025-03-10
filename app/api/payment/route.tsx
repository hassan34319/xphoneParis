import { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";
import BlowfishTranslation from "../../utils/blowfishTranslation";
import MacGeneration from "../../utils/hmacGeneration";
import { v4 as uuid } from "uuid";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log('Payment endpoint reached');
  
  try {
    const formData = await request.formData();
    
    // Extract and validate required form fields
    const email = formData.get('email') as string | null;
    const unique_id = formData.get('unique_id') as string | null;
    const serializedData = formData.get('serializedData') as string | null;
    const items = formData.get('items') as string | null;
    const Amount = Number(formData.get('Amount'));
    
    // Optional fields
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
    
    // Validate required fields
    if (!email || !unique_id || !serializedData || !Amount) {
      console.error("Missing required fields:", { email: !!email, unique_id: !!unique_id, serializedData: !!serializedData, Amount: !!Amount });
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    
    if (isNaN(Amount) || Amount <= 0) {
      console.error("Invalid amount:", Amount);
      return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
    }
    
    console.log("Processing payment for cart:", { email, unique_id, amount: Amount });
    
    // Generate transaction IDs
    const TransactionId = unique_id;
    const ReferenceId = "RG2023" + "-" + unique_id;
    
    console.log("Transaction IDs:", { TransactionId, ReferenceId });
    
    // Encrypt the serialized data for later use in notification
    const blowfish2 = new BlowfishTranslation(serializedData);
    const hMacKey = blowfish2.encryptBlowfish();
    console.log("Encrypted cart data (hMacKey):", hMacKey);
    
    // Use your actual deployed domain base URL
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://xphones.fr";
    
    // Prepare MAC value
    const macunencrypt = `*${TransactionId}*${
      process.env.NEXT_PUBLIC_MERCHANT_ID
    }*${Math.round(Amount * 100)}*EUR`;
    console.log("MAC unencrypted:", macunencrypt);
    
    const mac = new MacGeneration(macunencrypt);
    const mac_result = mac.generateMAC();
    console.log("MAC result:", mac_result);
    
    // Prepare data for encryption
    const unencrypt = `MerchantID=${
      process.env.NEXT_PUBLIC_MERCHANT_ID
    }&MsgVer=2.0&TransID=${TransactionId}&Amount=${
      Math.round(Amount * 100)
    }&Currency=EUR&URLSuccess=${baseURL}/api/success&URLFailure=${baseURL}/api/failure&URLNotify=${baseURL}/api/notify?hMac=${hMacKey}&Response=encrypt&MAC=${mac_result}&Language=en`;
    
    console.log("Data to encrypt:", unencrypt);
    
    // Encrypt the payment data
    const blowfish = new BlowfishTranslation(unencrypt);
    const encrypt_result = blowfish.encryptBlowfish();
    
    // Prepare query parameters for the payment page
    const queryParams = querystring.stringify({
      MerchantID: process.env.NEXT_PUBLIC_MERCHANT_ID,
      Data: encrypt_result,
      Len: unencrypt.length,
      Template: "PaymentPageDropDown_BNP_v1",
      Language: "fr",
      CCTemplate: "Cards_BNP_v1",
      SDDTemplate: "DirectDebit_BNP_v1",
      URLBack: `${baseURL}/cart`,
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
    
    // Make sure this is the correct payment gateway URL (check with your payment provider)
    const redirectUrl = `https://paymentpage.axepta.bnpparibas.com/paymentPage.aspx?${queryParams}`;
    console.log("Redirecting to payment page:", redirectUrl);
    
    return Response.redirect(redirectUrl, 302);
  } catch (error) {
    console.error("Error processing payment request:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal Server Error",
      details: error.message 
    }, { status: 500 });
  }
}