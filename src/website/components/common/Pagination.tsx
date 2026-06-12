"use client";

import React from "react";
import { LeftArrow, RightArrow } from "../common/SVGIcons";
import { blauerNue } from "@/src/app/fonts";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={`flex items-center justify-center gap-6 lg:py-20 py-10 select-none ${blauerNue.className}`}
    >
      {/* Left Arrow Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`transition-all duration-300 transform ${
          currentPage === 1
            ? "opacity-20 cursor-not-allowed"
            : "hover:scale-105 active:scale-95"
        }`}
        aria-label="Previous page"
      >
        <LeftArrow />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-3">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 flex items-center justify-center rounded-full text-[18px] leading-[24px] tracking-[0.5px] transition-all duration-300
              ${
                currentPage === page
                  ? "bg-[#0F3C78]/15 text-[#0F3C78] font-normal"
                  : "text-[#0F3C78] font-light hover:bg-[#0F3C78]/5"
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Right Arrow Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`transition-all duration-300 transform ${
          currentPage === totalPages
            ? "opacity-20 cursor-not-allowed"
            : "hover:scale-105 active:scale-95"
        }`}
        aria-label="Next page"
      >
        <RightArrow />
      </button>
    </div>
  );
};

export default Pagination;
