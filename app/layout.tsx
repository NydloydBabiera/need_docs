import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/ui/LoadingScreen";
import Navbar from "@/ui/Navbar";
import NavbarWrapper from "@/ui/NavbarWrapper";
import Notification from "@/ui/Notification";
import AuthProvider from "@/ui/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Need Docs",
  description: "Gather your documents in one place",
  icons: {
    icon: "/document.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* <NavbarWrapper /> */}

        <Navbar />
        <AuthProvider>
          {children}
          <Notification />
          <LoadingScreen />
        </AuthProvider>
      </body>
    </html>
  );
}
