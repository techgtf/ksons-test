"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-5 ">
      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {/* Pages */}
      <div className="flex flex-wrap items-center gap-2">
        {generatePages().map((page, idx) => {
          if (page === "...") {
            return (
              <span key={idx} className="px-2 text-sm text-gray-400">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(Number(page))}
              className={`h-9 min-w-[36px] rounded-lg px-3 text-sm font-semibold transition ${
                currentPage === page
                  ? "bg-[#0f3c78] text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
