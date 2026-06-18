import React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className={`auth-layout ${poppins.className}`}>{children}</main>;
}
