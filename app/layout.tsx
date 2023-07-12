import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { StateContext } from "./context/stateContext";
import ChangeAdressModal from "./components/ChangeAdressModal";
import ChangePasswordModal from "./components/changePasswordModal";
import ClientOnly from "./components/ClientOnly";
import Heading from "./components/Heading";
import Layout from "./components/Layout";
import LoginModal from "./components/LoginModal";
import Navbar from "./components/Navbar";
import RegisterModal from "./components/RegisterModal";
import ToasterProvider from "./components/ToasterProvider";
import getCurrentUser from "./utils/getUser";
import "./globals.css";
import { NextAuthProvider } from "./components/provider";

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body>
        <StateContext>
        <NextAuthProvider>
          <ClientOnly>
            <ToasterProvider />
            <ChangePasswordModal currentUser={currentUser} />
            <ChangeAdressModal currentUser={currentUser} />
            <LoginModal currentUser={currentUser} />
            <RegisterModal currentUser={currentUser} />
            <Navbar currentUser={currentUser} />
          </ClientOnly>
          <div
            className="flex flex-col h-screen justify-between"
            id="outer-container"
          >
            <div className="mt-6 relative mb-auto">{children}</div>
          </div>
        </NextAuthProvider>
        </StateContext>
      </body>
    </html>
  );
}
