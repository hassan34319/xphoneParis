import Link from "next/link";
import { BsFacebook } from "react-icons/bs";
import BottomMenu from "./BottomMenu";

/* eslint-disable @next/next/no-img-element */
const Footer = () => {
  return (
    <>
      <BottomMenu />
      <div className="bg-black text-white">
        <h1 className="my-2 text-center">2023 &copy; Xphones</h1>
      </div>
    </>
  );
};

export default Footer;
