"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";

import { HiOutlineSearch } from "react-icons/hi";

interface SearchInputProps {
  onSearch?: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Search...",
  className = "max-w-sm",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const prevTermRef = useRef<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const term = debouncedTerm.trim();

    if (term === prevTermRef.current) return;

    onSearch?.(term);

    prevTermRef.current = term;
  }, [debouncedTerm, onSearch]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const term = searchTerm.trim();

      if (term === prevTermRef.current) return;

      onSearch?.(term);

      prevTermRef.current = term;
    }
  };

  return (
    <div className="flex justify-end">
      <div className={`relative w-full ${className}`}>
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-11 
            w-full
            rounded-xl
            border
            border-gray-200
            bg-white
            pl-11
            pr-4
            text-sm
            text-gray-700
            shadow-sm
            outline-none
            transition-all
            placeholder:text-gray-400
            focus:border-[#0f3c78]
            focus:ring-4
            focus:ring-blue-100
          "
        />
      </div>
    </div>
  );
};

export default SearchInput;
