"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { blauerNue } from "@/src/app/fonts";

type Variant = "primary" | "gradient" | "outline" | "white";

type CommonBtnProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?: Variant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean
};

export default function CommonBtn({
  children,
  href,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
  leftIcon,
  rightIcon,
  disabled = false
}: CommonBtnProps) {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const baseStyles =
    "relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3 font-light transition-all duration-300";

  const variants: Record<Variant, string> = {
    primary: "bg-[#0F3C78] text-white",
    gradient:
      "bg-[linear-gradient(180deg,#33d3ee_0%,#0f3c78_100%)] text-white shadow-[0_2px_2px_0_rgba(0,0,0,0.2)]",
    outline: "hover:bg-white/20 transition tracking-[0.5px] border",
    white: "bg-white text-[#0F3C78]",
  };

  const combinedClass = baseStyles + " " + variants[variant] + " " + className;

  const content = (
    <p
      className={`relative flex items-center gap-2.5 px-1 justify-center overflow-hidden capitalize font-light ${blauerNue.className} tracking-[0.5px]`}
    >
      {leftIcon && (
        <span className="flex items-center icon-scale">{leftIcon}</span>
      )}

      <span
        className={`relative block whitespace-nowrap overflow-hidden h-[1.5em]`}
      >
        <span className={`btn-text block`}>{children}</span>
        <span className={`btn-text clone absolute left-0 top-0 block`}>
          {children}
        </span>
      </span>

      {rightIcon && (
        <span className="flex items-center icon-scale">{rightIcon}</span>
      )}
    </p>
  );

  if (href) {
    return (
      <Link
        href={href}
        ref={btnRef as React.RefObject<HTMLAnchorElement>}
        className={combinedClass}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={combinedClass}
    >
      {content}
    </button>
  );
}
