import { useRouter } from "next/router";
import React from "react";
import BlowfishTranslation from "../utils/blowfishTranslation";
import ParseResponse from "../utils/keyValueParser";

type Props = {};

function Failure({}: Props) {
  const router = useRouter();
  console.log(router.query)
  const { Data } = router.query;
  console.log(Data)
  const blowfish = new BlowfishTranslation('YOUR UNENCRYPTED STRING');
  console.log(blowfish.encryptBlowfish());
  
  // Example of how to unencrypt blowfish string
  if (Data) {
  blowfish.string = Data?.toString();
  }
  else {
    blowfish.string = ""
  }
  console.log(blowfish.decryptBlowfish());
  const result = blowfish.decryptBlowfish()
  const res = new ParseResponse(
    result
  );
  const res_final = res.parse()
  console.log(res.parse());
  console.log(router.query);
  return (
    <div className="flex flex-row align-center ">
      <h1>YOUR PAYMENT FAILED</h1>
      <h2></h2>
      <h3>res.final.Description</h3>
    </div>
  );
}

export default Failure;
