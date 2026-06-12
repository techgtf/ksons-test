"use client";
import { agency, blauerNue } from "@/src/app/fonts";
import React, { useState } from "react";

export interface ProjectFiltersState {
  search: string;
  cities: string[];
  budgets: string[];
  statuses: string[];
}

interface ProjectsFiltersProps {
  cities: string[];
  budgets: string[];
  status: string[];
  filters: ProjectFiltersState;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<ProjectFiltersState>>;
  title?: string;
}

export default function ProjectsFilters({
  cities,
  budgets,
  status,
  filters,
  showFilters,
  setShowFilters,
  setFilters,
  title = "Project Preferences",
}: ProjectsFiltersProps) {
  const [openSections, setOpenSections] = useState<{
    city: boolean;
    budget: boolean;
    status: boolean;
  }>({
    city: false,
    budget: false,
    status: false,
  });
  const toggleSection = (section: "city" | "budget" | "status") => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleCityChange = (city: string) => {
    setFilters((prev) => {
      const isSelected = prev.cities.includes(city);
      return {
        ...prev,
        cities: isSelected
          ? prev.cities.filter((c) => c !== city)
          : [...prev.cities, city],
      };
    });
  };

  const handleStatusChange = (statusVal: string) => {
    setFilters((prev) => {
      const isSelected = prev.statuses.includes(statusVal);
      return {
        ...prev,
        statuses: isSelected
          ? prev.statuses.filter((s) => s !== statusVal)
          : [...prev.statuses, statusVal],
      };
    });
  };

  const handleBudgetChange = (budget: string) => {
    setFilters((prev) => {
      const isSelected = prev.budgets.includes(budget);
      return {
        ...prev,
        budgets: isSelected
          ? prev.budgets.filter((b) => b !== budget)
          : [...prev.budgets, budget],
      };
    });
  };

  return (
    <div className="app-container py-6">
      <div className="rounded-[10px]  bg-white p-6 shadow-[0_10px_40px_rgba(15,60,120,0.08)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className={`${blauerNue.className} text-[#0F3C78] text-[22px] leading-[24px] tracking-[0.5px]`}
          >
            {title}
          </span>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`${blauerNue.className} rounded-full border border-[#0F3C78] px-4 py-2 text-sm font-medium text-[#0F3C78] transition-all duration-300 hover:bg-[#0F3C78] hover:text-white`}
          >
            {showFilters ? (
              <span className="text-sm">Close Filters</span>
            ) : (
              <span className="text-sm">Show Filters</span>
            )}
          </button>
        </div>

        {/* Search Field */}
        <div className="mt-4 border-t border-[#0F3C78]/15 pt-4">
          <div className="relative">
            <input
              value={filters.search}
              onChange={handleSearchChange}
              onClick={() => setShowFilters(true)}
              type="text"
              placeholder="Search by project name..."
              className={`${blauerNue.className} w-full rounded-2xl border border-[#D9E3F0] bg-[#FAFCFF] px-5 py-3 pr-12 text-[15px] text-[#2B2B2B] outline-none transition-all duration-300 placeholder:text-[#7C8BA1] focus:border-[#0F3C78] focus:bg-white`}
            />

            {/* Search Icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0F3C78]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m0 0A7.65 7.65 0 1 0 5.85 5.85a7.65 7.65 0 0 0 10.8 10.8Z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Filters Grid */}
        <div
          className={` transition-all duration-500 overflow-hidden ${showFilters ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3  pt-4 ">
            {/* City Filter */}
            <div className="block gap-3 lg:rounded-2xl lg:border border-b border-[#E5ECF5] lg:bg-[#FAFCFF] lg:p-5">
              <button
                type="button"
                onClick={() => toggleSection("city")}
                className="flex w-full items-center justify-between lg:cursor-default"
              >
                <h3
                  className={`${agency.className} mb-0 text-[16px] tracking-[1px] text-[#0F3C78]`}
                >
                  City{" "}
                  <span className="text-[#0F3C78]/50">({cities.length})</span>
                </h3>

                {/* Mobile Arrow */}
                <span className="lg:hidden text-[#0F3C78]">
                  {openSections.city ? "−" : "+"}
                </span>
              </button>

              <div
                className={`space-y-3 lg:block flex flex-wrap gap-x-3 items-center lg:pb-0 pb-4 overflow-hidden transition-all duration-300 ${
                  openSections.city
                    ? "max-h-[500px] opacity-100 mt-4"
                    : "max-h-0 opacity-0 lg:max-h-[500px] lg:opacity-100 lg:mt-4"
                }`}
              >
                {cities.map((city) => (
                  <label
                    key={city}
                    className="flex cursor-pointer items-center w-fit gap-3 rounded-[5px] py-0.5 px-3 transition-all duration-200 hover:bg-[#EEF4FB]"
                  >
                    <input
                      type="checkbox"
                      checked={filters.cities.includes(city)}
                      onChange={() => handleCityChange(city)}
                      className="h-4 w-4 rounded border-gray-300 accent-[#0F3C78]"
                    />

                    <span
                      className={`${blauerNue.className} text-[15px] text-[#2B2B2B]`}
                    >
                      {city}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Filter */}
            <div className="block gap-3 lg:rounded-2xl lg:border border-b border-[#E5ECF5] lg:bg-[#FAFCFF] lg:p-5">
              <button
                type="button"
                onClick={() => toggleSection("budget")}
                className="flex w-full items-center justify-between lg:cursor-default"
              >
                <h3
                  className={`${agency.className} mb-0 text-[16px] tracking-[1px] text-[#0F3C78]`}
                >
                  Budget{" "}
                  <span className="text-[#0F3C78]/50">({budgets.length})</span>
                </h3>

                {/* Mobile Arrow */}
                <span className="lg:hidden text-[#0F3C78]">
                  {openSections.budget ? "−" : "+"}
                </span>
              </button>

              <div
                className={`space-y-3 flex flex-wrap gap-x-3 items-center lg:pb-0 pb-4 overflow-hidden transition-all duration-300 ${
                  openSections.budget
                    ? "max-h-[500px] opacity-100 mt-4"
                    : "max-h-0 opacity-0 lg:max-h-[500px] lg:opacity-100 lg:mt-4"
                }`}
              >
                {budgets.map((budget) => (
                  <button
                    key={budget}
                    onClick={() => handleBudgetChange(budget)}
                    className={`${blauerNue.className} rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      filters.budgets.includes(budget)
                        ? "border-[#0F3C78] bg-[#0F3C78] text-white"
                        : "border-[#C9D8EA] bg-white text-[#0F3C78] hover:border-[#0F3C78] hover:bg-[#0F3C78] hover:text-white"
                    }`}
                  >
                    {budget}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="block gap-3 lg:rounded-2xl lg:border border-b border-[#E5ECF5] lg:bg-[#FAFCFF] lg:p-5">
              <button
                type="button"
                onClick={() => toggleSection("status")}
                className="flex w-full items-center justify-between lg:cursor-default"
              >
                <h3
                  className={`${agency.className} mb-0 text-[16px] tracking-[1px] text-[#0F3C78]`}
                >
                  Status{" "}
                  <span className="text-[#0F3C78]/50">({status.length})</span>
                </h3>

                {/* Mobile Arrow */}
                <span className="lg:hidden text-[#0F3C78]">
                  {openSections.status ? "−" : "+"}
                </span>
              </button>

              <div
                className={`space-y-3 lg:block flex flex-wrap gap-x-3 items-center lg:pb-0 pb-4 overflow-hidden transition-all duration-300 ${
                  openSections.status
                    ? "max-h-[500px] opacity-100 mt-4"
                    : "max-h-0 opacity-0 lg:max-h-[500px] lg:opacity-100 lg:mt-4"
                }`}
              >
                {status.map((statusVal) => (
                  <label
                    key={statusVal}
                    className={`${blauerNue.className} flex cursor-pointer items-center w-fit gap-3 rounded-[5px] py-0.5 px-3 transition-all duration-200 hover:bg-[#EEF4FB]`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.statuses.includes(statusVal)}
                      onChange={() => handleStatusChange(statusVal)}
                      className="h-4 w-4 rounded border-gray-300 accent-[#0F3C78]"
                    />

                    <span className="text-[15px] text-[#2B2B2B]">
                      {statusVal}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
