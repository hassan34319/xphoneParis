import { useRouter } from "next/router";
import React from "react";
import BlowfishTranslation from "../utils/blowfishTranslation";
import ParseResponse from "../utils/keyValueParser";

type Props = {};

function Failure({}: Props) {

  // Example of how to unencrypt blowfish string
  return (
    <div className="flex items-center justify-start mt-20 h-screen">
      <h1 className="text-4xl font-bold text-red-500">Payment Failed</h1>
    </div>
  );
}

export default Failure;
