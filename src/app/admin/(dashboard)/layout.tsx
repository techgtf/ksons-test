"use client";

import React, { useState } from "react";
import { Poppins } from "next/font/google";
import Sidebar from "@/src/admin/components/mianLayout/SideBar";
import Dashboard from "@/src/admin/components/mianLayout/Dashboard";

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
  const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <main className={`admin-layout ${poppins.className} scrollbar-hide`}>
      <div className="flex w-full">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
          {children}
        </Dashboard>
      </div>
    </main>
  );
}
