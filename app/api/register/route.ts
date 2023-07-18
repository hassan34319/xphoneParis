import "dotenv/config";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import SibApi from "sib-api-v3-sdk";
import { ApiClient } from "@getbrevo/brevo";
import * as SibApiV3Sdk from '@sendinblue/client'

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "../client/route";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(request: Request) {
  console.log("I entered")
  const body = await request.json();
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
      } = body;

      const hashedPassword = await bcrypt.hash(password, 12);
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      console.log(existingUser);
      if (existingUser) {
        return NextResponse.json({ exists: true });
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

      // let defaultClient = SibApi.ApiClient.instance;

      // let apiKey = defaultClient.authentications["api-key"];
      // apiKey.apiKey = process.env.NEXT_PUBLIC_API_KEY;

      let apiInstance = new SibApiV3Sdk.ContactsApi();
      apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, process.env.NEXT_PUBLIC_API_KEY as string)
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
      var apiInstance2 = new SibApiV3Sdk.TransactionalEmailsApi();
      apiInstance2.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.NEXT_PUBLIC_API_KEY as string)
      var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

      sendSmtpEmail = {
        to: [
          {
            email: email ,
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

      const res3 = await apiInstance2.sendTransacEmail(sendSmtpEmail).then(
        function (data: any) {
          console.log("API called successfully. Returned data: " + data);
        },
        function (error: any) {
          console.error(error);
        }
      );
      console.log(res3)
      if (!user) {
        let apiInstance = new SibApiV3Sdk.ContactsApi();
      apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, process.env.NEXT_PUBLIC_API_KEY as string)
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
      console.log("Contact",res_cont);;
      }
      return NextResponse.json(user);
    } catch {
      console.log("error");
    }
  }

