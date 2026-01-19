import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import FirstNav from "./Shared/FisrtNav/page";
import NavBar from "./Shared/NavBar/page";
import { AuthProvider } from "../app/context/Authcontext";
import { CartProvider } from "../app/context/CartContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LoaderWrapper from "./components/LoaderWrapper";
import { Analytics } from "@vercel/analytics/next";
import { RealtimeProvider } from "./context/RealtimeProvider";

// Vintage display font for hero
const vintage = localFont({
  src: "./assets/fibre-vintage/fibre-font.otf",
  display: "swap",
  variable: "--font-vintage",
});


const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
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
    <html
      lang="ar"
      className={`${vintage.variable} ${bodyFont.variable}`}
    >
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4994004617022800"
        crossorigin="anonymous"
      ></script>
      <body className="font-sans antialiased">
        <LoaderWrapper>
          <RealtimeProvider>
          <AuthProvider>
            <CartProvider>
              {/* <FirstNav /> */}
              <NavBar />
              {children}
              <SpeedInsights />
              <Analytics />
            </CartProvider>
            </AuthProvider>
            </RealtimeProvider>
        </LoaderWrapper>
      </body>
    </html>
  );
}
