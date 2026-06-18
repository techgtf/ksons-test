import React, { useEffect, useRef, useState } from "react";
import { IoChevronDown, IoCheckmark } from "react-icons/io5";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectRowsProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SelectRows: React.FC<SelectRowsProps> = ({
  value = "",
  onChange,
  options,
  placeholder = "Select",
  className = "",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative min-w-[180px] w-fit ${className}`}
    >
      {/* Select Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`
          w-full
          flex items-center justify-between gap-3
          rounded-xl
          border border-gray-200
          bg-white
          px-4 py-2.5
          text-sm
          shadow-sm
          transition-all duration-200
          hover:border-gray-300
          hover:shadow-md
          focus:outline-none
          focus:ring-4
          focus:ring-blue-100
          focus:border-[#0f3c78]
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={`truncate ${
            selectedOption ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {selectedOption?.label || placeholder}
        </span>

        <IoChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`
          absolute left-0 top-full z-50 mt-2 w-full
          overflow-hidden rounded-xl border border-gray-200
          bg-white shadow-xl
          transition-all duration-200
          ${
            open
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0"
          }
        `}
      >
        <div className="max-h-60 overflow-y-auto p-1">
          {options.length > 0 ? (
            options.map((opt) => {
              const isSelected = value === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`
                    flex w-full items-center justify-between
                    rounded-lg px-3 py-2.5 text-sm
                    transition-colors duration-150
                    ${
                      isSelected
                        ? "bg-blue-50 text-[#0f3c78]"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <span>{opt.label}</span>

                  {isSelected && <IoCheckmark size={18} className="shrink-0" />}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm text-gray-400">No options</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectRows;
