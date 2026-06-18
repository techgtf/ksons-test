import React from "react";
import { HiOutlinePlus } from "react-icons/hi";
import Link from "next/link";

interface Props {
  label: string;
  icon?: boolean;
  bg?: string;
  textColor?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
}

export function TableButton({
  label,
  icon = true,
  bg = "bg-blue-50",
  textColor = "text-blue-700",
  onClick,
  href,
}: Props) {
  const className = `inline-flex items-center gap-1 rounded-lg ${bg} px-3 py-1.5 text-xs font-medium ${textColor} hover:bg-blue-100 transition-colors`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {icon && <HiOutlinePlus className="text-sm" />}
        {label}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {icon && <HiOutlinePlus className="text-sm" />}
      {label}
    </button>
  );
}

