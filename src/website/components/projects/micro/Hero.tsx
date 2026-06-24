import React from "react";
import WaterMark from "../../common/WaterMark";
import { getDisplayLabel } from "@/src/website/utils/getDisplayLabel";

export interface HeroProps {
  dekstop_file: string;
  mobile_file: string;
  mainLabel?: string;
}

export default function Hero({
  dekstop_file,
  mobile_file,
  mainLabel,
}: HeroProps) {
  return (
    <div>
      <picture className="h-[400px] lg:h-[100vh] block overflow-hidden">
        <source media="(max-width: 768px)" srcSet={mobile_file} />
        <img
          className="w-full object-cover h-full"
          src={dekstop_file}
          alt="Project Hero Image"
        />
      </picture>
      <div className="absolute right-5 bottom-5">
        <WaterMark
          textColor="text-black"
          opacity="opacity-100"
          label={getDisplayLabel(mainLabel || "")}
        />
      </div>
    </div>
  );
}
