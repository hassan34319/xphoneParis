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
import ChangeAddressModal from "../components/ChangeAddressModal"; // Fixed typo
import { SessionProvider } from "next-auth/react";
import ChangePasswordModal from "../components/changePasswordModal";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <StateContext>
        <div
          className="flex flex-col h-screen justify-between"
          id="outer-container"
        >
          <Toaster />
          <ChangePasswordModal/>
          <ChangeAddressModal />
          <LoginModal />
          <RegisterModal />
          <Navbar />
          <div className="mt-6 relative mb-auto" id="page-wrap">
            <Head>
              <title>Xphones</title>
              <meta name="description" content="Your meta description here" />
              {/* Replace the URL with your logo image */}
              <link rel="icon" href="/logo2.jpeg" />
            </Head>
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </StateContext>
    </SessionProvider>
  );
}

export default MyApp;
