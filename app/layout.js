import { Poppins } from "next/font/google";
import "./globals.css";
import FirstNav from "./Shared/FisrtNav/page";
import NavBar from "./Shared/NavBar/page";
import { AuthProvider } from "../app/context/Authcontext";
import { CartProvider } from "../app/context/CartContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LoaderWrapper from "./components/LoaderWrapper"; // هنا استدعيت الملف

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Damro Resturant",
  description: "Damro Resturant Menu",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <LoaderWrapper>
          <AuthProvider>
            <CartProvider>
              <FirstNav />
              <NavBar />
              {children}
              <SpeedInsights />
            </CartProvider>
          </AuthProvider>
        </LoaderWrapper>
      </body>
    </html>
  );
}
