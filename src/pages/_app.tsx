import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import { StateContext } from "../../context/stateContext";
import { Toaster } from "react-hot-toast";
import Modal from "../components/Modal";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import ChangeAdressModal from "../components/ChangeAdressModal";
import { SessionProvider } from "next-auth/react";
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <StateContext>
        <div
          className="flex flex-col h-screen justify-between"
          id="outer-container"
        >
          <Toaster />
          <ChangeAdressModal />
          <LoginModal />
          <RegisterModal />
          <Navbar />
          <div className="mt-6 relative mb-auto" id="page-wrap">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </StateContext>
    </SessionProvider>
  );
}

export default MyApp;
