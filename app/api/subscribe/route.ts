import * as SibApiV3Sdk from '@sendinblue/client'
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
    console.log("I entered")
    const body = await request.json();
    const {email} = body
    let apiInstance = new SibApiV3Sdk.ContactsApi();
      apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, process.env.NEXT_PUBLIC_API_KEY as string)
      let createContact = new SibApiV3Sdk.CreateContact();
      console.log(email)
      createContact.email = email ;
      createContact.listIds = [3];

      const res_cont = await apiInstance.createContact(createContact).then(
        function (data: any) {
          console.log(
            "API called successfully. Returned data: " + JSON.stringify(data)
          );
          NextResponse.json("SUCCESS")
        },
        function (error: any) {
          console.error("ERROR", error);
          NextResponse.json("ERROR")
        }
      );
      console.log("Contact",res_cont)
}