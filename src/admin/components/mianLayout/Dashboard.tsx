"use client";

import { motion } from "framer-motion";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { logoutUser } from "../../lib/auth";

type DashboardProps = {
  children: React.ReactNode;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Dashboard({
  children,
  collapsed,
  setCollapsed,
}: DashboardProps) {
  return (
    <motion.div layout className="flex-1 h-screen overflow-y-auto bg-white">
      {" "}
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-[98px] items-center justify-between border-b border-gray-200 bg-white/80 px-8 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-xl border border-gray-200 bg-gray-50 p-3 transition-all hover:scale-105 hover:bg-gray-100"
          >
            {collapsed ? (
              <AiOutlineMenuUnfold className="text-2xl text-gray-700" />
            ) : (
              <AiOutlineMenuFold className="text-2xl text-gray-700" />
            )}
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            <p className="text-sm text-gray-500">Welcome back 👋</p>
          </div>
        </div>

        <button
        onClick={logoutUser}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 transition-all hover:bg-red-50 hover:text-red-500">
          <span className="font-medium">Logout</span>

          <BiLogOut className="text-2xl" />
        </button>
      </header>
      {/* Content */}
      <div className="p-8">{children}</div>
    </motion.div>
  );
}
