import React from "react";
import { HiOutlinePlus } from "react-icons/hi";

interface Props {
  label: string;
  onClick: () => void;
  icon?: boolean;
}

export function ActionButtonCell({ label, onClick, icon = true }: Props) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
    >
      {icon && <HiOutlinePlus className="text-sm" />}
      {label}
    </button>
  );
}
