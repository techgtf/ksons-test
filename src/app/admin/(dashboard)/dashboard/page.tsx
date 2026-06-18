"use client";

import { motion } from "framer-motion";

import {
  HiOutlineFolder,
  HiOutlineDocumentText,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBuildingOffice2,
  HiOutlineStar,
  HiOutlineBriefcase,
} from "react-icons/hi2";

import { useAppDispatch, useAppSelector } from "@/src/admin/hooks/hooks";
import { useEffect } from "react";
import { fetchDashboardStats } from "@/src/admin/redux/features/dashboardSlice";

export default function Page() {
  const dispatch = useAppDispatch();

  const stats = useAppSelector((state) => state.dashboard.stats);
  const loading = useAppSelector((state) => state.dashboard.loading);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const dashboardStats = [
    {
      title: "Total Platter",
      value: stats.platter,
      icon: HiOutlineFolder,
    },
    {
      title: "Total Projects",
      value: stats.projects,
      icon: HiOutlineChatBubbleLeftRight,
    },
    {
      title: "Total Typologies",
      value: stats.typologies,
      icon: HiOutlineBriefcase,
    },
    {
      title: "Total Sub Typologies",
      value: stats.subTypologies,
      icon: HiOutlineBuildingOffice2,
    },
    {
      title: "Total Amenities",
      value: stats.amenities,
      icon: HiOutlineDocumentText,
    },
    {
      title: "Total Pages",
      value: stats.pages,
      icon: HiOutlineStar,
    },
  ];

  return (
    <div className="bg-white px-6 py-10 text-black md:px-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardStats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -6,
                scale: 1.02,
              }}
              className="
                group relative overflow-hidden rounded-3xl
                border border-black/10 bg-white p-7
                shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                transition-all duration-300
              "
            >
              <div
                className="
                  mb-6 flex h-14 w-14 items-center justify-center
                  rounded-2xl bg-black text-white
                "
              >
                <Icon className="text-[28px]" />
              </div>

              <h2 className="text-5xl font-bold tracking-tight">
                {loading ? "..." : item.value}
              </h2>

              <p className="mt-2 text-lg text-black/60">{item.title}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
