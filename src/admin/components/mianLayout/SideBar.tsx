"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_SECTION_REGISTRY } from "@/src/admin/config/adminConfig";
import {
  HiChevronRight,
  HiOutlineViewGrid,
  HiOutlineFolder,
  HiOutlineQuestionMarkCircle,
  HiOutlineBriefcase,
  HiOutlineHome,
  HiOutlineChatAlt2,
  HiOutlineCurrencyRupee,
  HiOutlineOfficeBuilding,
  HiOutlineDocumentText,
} from "react-icons/hi";

type ChildItem = {
  title: string;
  href: string;
};

type MenuItem = {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: ChildItem[];
};

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const dashboardItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: HiOutlineViewGrid,
    href: "/admin/dashboard",
  },
];

const applicationItems: MenuItem[] = [
  {
    title: "Enquies",
    icon: HiOutlineQuestionMarkCircle,
    href: "/admin/enquies",
  },
  {
    title: "Jobs Applications",
    icon: HiOutlineBriefcase,
    href: "/admin/jobs",
  },
  {
    title: "News Letters",
    icon: HiOutlineDocumentText,
    href: "/admin/newsletter",
  },
];
const configSidebarItems: MenuItem[] = Object.entries(ADMIN_SECTION_REGISTRY)
  .filter(([, config]) => !config.hideInSidebar)
  .map(([slug, config]) => ({
    title: config.title,
    icon: config.icon || HiOutlineFolder,
    href: `/admin/${slug}`,
  }));

const sidebarItems: MenuItem[] = [...dashboardItems, ...configSidebarItems];

type SidebarMenuProps = {
  item: MenuItem;
  index: number;
  collapsed: boolean;
  isOpen: boolean;
  toggleAccordion: (index: number) => void;
};

function SidebarMenuItem({
  item,
  index,
  collapsed,
  isOpen,
  toggleAccordion,
}: SidebarMenuProps) {
  const Icon = item.icon;

  return (
    <div>
      {item.children ? (
        <button
          onClick={() => toggleAccordion(index)}
          className={`group flex w-full items-center rounded-xl px-3 py-3 transition-all duration-300 hover:bg-gray-100 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="text-[22px] text-gray-500 group-hover:text-blue-600" />

            {!collapsed && (
              <span className="text-[16px] font-medium text-gray-700">
                {item.title}
              </span>
            )}
          </div>

          {!collapsed && (
            <motion.div
              animate={{
                rotate: isOpen ? 90 : 0,
              }}
            >
              <HiChevronRight className="text-gray-400" />
            </motion.div>
          )}
        </button>
      ) : (
        <Link
          href={item.href || "#"}
          className={`group flex items-center rounded-xl px-3 py-3 transition-all duration-300 hover:bg-gray-100 ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <Icon className="text-[22px] text-gray-500 group-hover:text-blue-600" />

          {!collapsed && (
            <span className="text-[16px] font-medium text-gray-700">
              {item.title}
            </span>
          )}
        </Link>
      )}

      {/* Accordion */}
      <AnimatePresence>
        {!collapsed && isOpen && item.children && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="overflow-hidden"
          >
            <div className="ml-10 mt-2 space-y-1 border-l border-gray-200 pl-4">
              {item.children.map((child) => (
                <Link
                  key={child.title}
                  href={child.href}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:bg-blue-50 hover:text-blue-600"
                >
                  {child.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN SIDEBAR                                */
/* -------------------------------------------------------------------------- */

export default function Sidebar({ collapsed }: SidebarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.aside
      animate={{
        width: collapsed ? 90 : 280,
      }}
      transition={{
        duration: 0.35,
        ease: "easeInOut",
      }}
      className="sticky top-0 flex h-screen w-[280px] flex-col border-r border-gray-200 bg-white shadow-sm"
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-gray-100 ${
          collapsed ? "justify-center px-2" : "px-6"
        } py-5`}
      >
        <Link href={"/admin/dashboard"}>
          <img
            src="/images/header/ksons-logo.png"
            className={`transition-all duration-300 ${
              collapsed ? "w-10" : "w-[60%]"
            }`}
            alt="logo"
          />
        </Link>
      </div>

      {/* Scroll Area */}
      <div
        className="
          flex-1 overflow-y-auto px-4 py-5
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
        "
      >
        {/* Main Menu */}
        <div className="space-y-2">
          {sidebarItems.map((item, index) => (
            <SidebarMenuItem
              key={item.title}
              item={item}
              index={index}
              collapsed={collapsed}
              isOpen={openIndex === index}
              toggleAccordion={toggleAccordion}
            />
          ))}
        </div>

        {/* Queries */}
        {!collapsed && (
          <div className="mt-8">
            <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Queries
            </h2>

            <div className="mt-3 space-y-1">
              {applicationItems.map((item, index) => (
                <SidebarMenuItem
                  key={item.title}
                  item={item}
                  index={100 + index}
                  collapsed={collapsed}
                  isOpen={false}
                  toggleAccordion={toggleAccordion}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

function giveInitialDAta() {
  const res = fetch("/api/seed-data", {
    method: "POST",
  }).then((res) => res.json());

  return res;
}
