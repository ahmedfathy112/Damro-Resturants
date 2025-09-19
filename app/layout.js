import { Poppins } from "next/font/google";

import "./globals.css";
import FirstNav from "./Shared/FisrtNav/page";
import NavBar from "./Shared/NavBar/page";
import { AuthProvider } from "../app/context/Authcontext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Damro Resturant",
  description: "Damro Resturant Menu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <AuthProvider>
          <FirstNav />
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
