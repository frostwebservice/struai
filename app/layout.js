import { Inter, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const sans = Source_Sans_3({ subsets: ["latin"] });

export const metadata = {
  title: "Ashva AI",
  description: "Ashva AI - AI for the masses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sans.className}>
        <Toaster />
        {/* <Header /> */}
        <div id="modal-portal" />
        {children}
      </body>
    </html>
  );
}
