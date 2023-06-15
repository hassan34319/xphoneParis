import "dotenv/config";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import SibApiV3Sdk from "sib-api-v3-sdk";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "./client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
        shippingAdress,
        postalCode,
        phoneNumber,
        city,
        country,
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      console.log(existingUser);
      if (existingUser) {
        console.log("I WAS HERE");
        return res.status(200).json(existingUser);
      }
      console.log("I WAS ON CREATE");

      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          hashedPassword,
          phoneNumber,
          shippingAdress,
          postalCode,
          city,
          country,
        },
      });

      let defaultClient = SibApiV3Sdk.ApiClient.instance;

      let apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = process.env.NEXT_PUBLIC_API_KEY;

      let apiInstance = new SibApiV3Sdk.ContactsApi();

      let createContact = new SibApiV3Sdk.CreateContact();
      console.log(email)
      createContact.email = email ;
      createContact.attributes = {
        FIRSTNAME : firstName,
        LASTNAME : lastName,
        ADDRESS : shippingAdress,
        CITY : city,
        COUNTRY : country,
        POSTALCODE : postalCode
      }
      createContact.listIds = [2];

      const res_cont = await apiInstance.createContact(createContact).then(
        function (data: any) {
          console.log(
            "API called successfully. Returned data: " + JSON.stringify(data)
          );
        },
        function (error: any) {
          console.error("ERROR", error);
        }
      );
      console.log("Contact",res_cont);

      // Configure API key authorization: api-key

      // Uncomment below two lines to configure authorization using: partner-key
      // var partnerKey = defaultClient.authentications['partner-key'];
      // partnerKey.apiKey = 'YOUR API KEY';
      apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

      sendSmtpEmail = {
        to: [
          {
            email: email ,
            firstName:  firstName ,
            lastName:  lastName ,
          },
        ],
        templateId: 1,
        params: {
          firstName:  firstName ,
          lastName:  lastName ,
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
      console.log(res3)
      if (!user) {
        return res.status(200).json("No user Registered")
      }
      return res.status(200).json(user);
    } catch {
      console.log("error");
    }
  }
}
