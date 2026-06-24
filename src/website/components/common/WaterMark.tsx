import React from "react";

export default function WaterMark({
  label = "stock image",
  textColor = "text-white",
  opacity = "opacity-40",
  alignment = "text-center",
}: {
  label: string;
  textColor?: string;
  opacity?: string;
  alignment?: string;
}) {
  return (
    <span
      className={`block ${opacity} ${textColor} ${alignment} text-sm capitalize`}
    >
      {label}
    </span>
  );
}
