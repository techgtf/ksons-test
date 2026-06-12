"use client";

import React, { useRef, useState } from "react";
import { blauerNue, agency } from "@/src/app/fonts";
import TabSwitcher from "../common/TabSwitcher";
import Pagination from "../common/Pagination";
import Link from "next/link";
import Image from "next/image";
import { useSlideY } from "../../hooks/useSlideY";
import OnlineNewsCard from "./OnlineNewsCard";
import OfflineNewsCard from "./OfflineNewsCard";
import { useLightbox } from "@/src/website/context/LightboxContext";

export interface NewsItem {
  id: number;
  date?: string;
  monthYear?: string;
  title: string;
  description?: string;
  link?: string;
  type: "online" | "offline";
  image?: string;
}

const newsData: NewsItem[] = [
  {
    id: 1,
    date: "05",
    monthYear: "June / 26",
    title:
      "के.सन्स फाउंडेशन का शुभारंभ: मथुरा, वृंदावन और गोवर्धन में 500 पौधों के रोपण अभियान की शुरुआत",
    description:
      "के.सन्स फाउंडेशन का शुभारंभ: मथुरा, वृंदावन और गोवर्धन में 500 पौधों के रोपण अभियान की शुरुआतमथुरा, वृंदावन और गोवर्धन की पावन धरती पर अपनी मजबूत पहचान बना चुके के.सन्स ग्रुप के संस्थापक रियल एस्टेट क्षेत्र में 30+ वर्षों के समृद्ध अनुभव के साथ विश्वास, गुणवत्ता और उत्कृष्टता की नई मिसाल कायम कर रहे हैं। सामाजिक उत्तरदायित्व के प्रति अपनी प्रतिबद्धता को और सशक्त करते हुए कंपनी ने “के.सन्स फाउंडेशन” के शुभारंभ की घोषणा की है। रियल एस्टेट विकास के क्षेत्र में के.सन्स ग्रुप के संस्थापक अब समाज एवं प्रकृति से मिले इस विश्वास, सहयोग और अवसरों को लौटाने की भावना के साथ पर्यावरण संरक्षण और सामुदायिक कल्याण के लिए नई पहल कर रही है।",
    type: "online",
    link: "https://samacharsuperfastnews.com/ksons-foundation-launches-500-tree-plantation-drive-in-mathura-vrindavan-govardhan/",
  },
  // offline
  {
    id: 2,
    // date: "28",
    // monthYear: "July / 25",
    title: "Hindustan",
    type: "offline",
    image: "/images/offline-news/hindustan.jpeg",
  },
  {
    id: 3,
    // date: "28",
    // monthYear: "July / 25",
    title: "Dainik Jagran",
    type: "offline",
    image: "/images/offline-news/dainik-jagran.jpeg",
  },
  {
    id: 4,
    // date: "28",
    // monthYear: "July / 25",
    title: "Amar Ujala",
    type: "offline",
    image: "/images/offline-news/amar-ujala.jpeg",
  },
];

const NewsSection = () => {
  const [activeTab, setActiveTab] = useState<string>("online");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const tabs = [
    { id: "online", title: "Online News" },
    { id: "offline", title: "Offline News" },
  ];

  const { openLightbox } = useLightbox();
  const filteredNews = newsData.filter((item) => item.type === activeTab);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
        <div className="flex flex-col gap-6 lg:gap-10 px-4 lg:px-20 pb-10">
          {paginatedNews.map((item) => (
            // Online news items
            <OnlineNewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        // Offline news items
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 px-4 lg:px-20 pb-10">
          {paginatedNews.map((item) => (
            <OfflineNewsCard
              key={item.id}
              item={item}
              onClick={() => {
                const actualIndex = filteredNews.findIndex(
                  (n) => n.id === item.id,
                );
                openLightbox(
                  filteredNews.map((n) => ({
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

      {filteredNews.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default NewsSection;
