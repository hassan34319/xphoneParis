import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import { StateContext } from "../../context/stateContext";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StateContext>
      <Head>
        <title>XPHONES</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        className="flex flex-col h-screen justify-between"
        id="outer-container"
      >
        <Toaster />
        <Navbar />
        <div className="mt-6 relative mb-auto" id="page-wrap">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </StateContext>
  );
}

export default MyApp;
