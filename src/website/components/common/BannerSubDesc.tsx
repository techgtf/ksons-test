"use client";

import { blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import { useRef } from "react";
import { useSlideY } from "../../hooks/useSlideY";

const BannerSubDesc = ({
  sub_desc,
  icon,
}: {
  sub_desc?: React.ReactNode;
  icon?: string;
}) => {
  const descRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLImageElement | null>(null);

  useSlideY({ target: descRef, direction: "down" });
  useSlideY({ target: descRef, direction: "up", distance: -120 });
  return (
    <>
      {sub_desc && (
        <div
          data-cursor="light"
          ref={descRef}
          className={`${blauerNue.className} mb-10 mt-10 lg:mb-15 lg:mt-20 lg:max-w-[882px] mx-auto text-center text-[#0F3C78] text-[16px] md:text-[18px] tracking-[0.5px] [&>p]:mb-4 last:[&>p]:mb-0`}
        >
          {typeof sub_desc === "string" ? (
            <p className="mb-0!">{sub_desc}</p>
          ) : (
            sub_desc
          )}
        </div>
      )}
      {icon && (
        <Image
          ref={iconRef}
          src={icon}
          alt="faq-sub-desc"
          className="block mx-auto mb-10 lg:mb-15"
          width={25}
          height={25}
        />
      )}
    </>
  );
};

export default BannerSubDesc;
