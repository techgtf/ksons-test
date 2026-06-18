"use client";

import React, { useRef, useState, useEffect } from "react";
import { blauerNue, agency } from "@/src/app/fonts";
import TabSwitcher from "../common/TabSwitcher";
import Pagination from "../common/Pagination";
import OnlineNewsCard from "./OnlineNewsCard";
import OfflineNewsCard from "./OfflineNewsCard";
import { useLightbox } from "@/src/website/context/LightboxContext";
import { fetchPageData } from "../../utils/api";
import { ScrollTrigger } from "../../utils/gsap";
import { lenisInstance } from "@/src/website/components/SmoothScroller";

export interface NewsItem {
  id: string;
  date?: string;
  monthYear?: string;
  title: string;
  description?: string;
  link?: string;
  type: "online" | "offline";
  image?: string;
}

const parseDate = (dateStr: string) => {
  if (!dateStr) return { date: "", monthYear: "" };
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return { date: "", monthYear: "" };

  const date = String(dateObj.getDate()).padStart(2, "0");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[dateObj.getMonth()];
  const year = String(dateObj.getFullYear()).slice(-2);

  return {
    date,
    monthYear: `${month} / ${year}`,
  };
};

const NewsSection = () => {
  const [activeTab, setActiveTab] = useState<string>("online");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const tabs = [
    { id: "online", title: "Online News" },
    { id: "offline", title: "Offline News" },
  ];

  const { openLightbox } = useLightbox();

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const newsRes = await fetchPageData(
          `website/news?news_mode=${activeTab}`,
        );
        const data = newsRes?.data || [];
        const formatted: NewsItem[] = data.map((item: any) => {
          const { date, monthYear } = parseDate(item.dateAt);
          return {
            id: item.id,
            date,
            monthYear,
            title: item.title,
            description: item.description?.short || "",
            link: item.newsLink || "",
            type: item.news_mode,
            image: item.files?.desktop_file || item.files?.mobile_file || "",
          };
        });
        setNewsList(formatted);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [activeTab]);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [currentPage, newsList]);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(newsList.length / itemsPerPage);
  const paginatedNews = newsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (lenisInstance && containerRef.current) {
      lenisInstance.scrollTo(containerRef.current, {
        offset: -96,
        duration: 1.2,
      });
    } else {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <TabSwitcher
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => {
            setActiveTab(id);
            setCurrentPage(1);
          }}
          className="mb-12 lg:mb-20"
        />
        {activeTab === "online" ? (
          <div className="flex flex-col gap-6 lg:gap-10 px-4 lg:px-20 pb-10 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 border-b border-[#0F3C78]/10 pb-6 lg:pb-10"
              >
                <div className="hidden min-w-[80px] lg:flex flex-col items-center gap-2">
                  <div className="h-6 w-8 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 px-4 lg:px-20 pb-10 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col">
                <div className="relative w-full aspect-[1.4/1] lg:mb-10 mb-5 bg-gray-200 rounded-[10px]"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full scroll-mt-24">
      <TabSwitcher
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => {
          setActiveTab(id);
          setCurrentPage(1);
        }}
        className="mb-12 lg:mb-20"
      />

      {activeTab === "online" ? (
        <div className="flex flex-col gap-6 lg:gap-10 px-4 lg:px-20 pb-10">
          {paginatedNews.map((item) => (
            <OnlineNewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 px-4 lg:px-20 pb-10">
          {paginatedNews.map((item) => (
            <OfflineNewsCard
              key={item.id}
              item={item}
              onClick={() => {
                const actualIndex = newsList.findIndex((n) => n.id === item.id);
                openLightbox(
                  newsList.map((n) => ({
                    src: n.image || "",
                    alt: n.title,
                    thumbnail: n.image || "",
                  })),
                  actualIndex,
                );
              }}
            />
          ))}
        </div>
      )}

      {newsList.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default NewsSection;
