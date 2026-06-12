"use client";
import React from "react";
import { blauerNue } from "@/src/app/fonts";

interface Tab {
  id: string;
  title: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  activeTab,
  onChange,
  className = "mb-12 lg:mb-16",
}) => {
  return (
    <div className={`flex justify-center gap-4 md:gap-6 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${blauerNue.className} px-6 md:px-8 py-3 2xl:py-4 text-[14px] md:text-[16px] capitalize leading-none tracking-[1px] transition-all duration-300 rounded-[4px] font-medium ${activeTab === tab.id
              ? "gradient-bg text-white border-2 border-[#0F3C78] ring-2 ring-white"
              : "bg-transparent border-2 border-[#0F3C78] text-[#0F3C78] hover:bg-[#0F3C78]/5"
            }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
