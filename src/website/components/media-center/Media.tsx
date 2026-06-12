import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import React from "react";

const Media = () => {
  return (
    <div data-cursor="light" className="py-16 lg:py-24">
      <div className="app-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#0F3C78]/10 pb-10 lg:pb-14">
          <div>
            <p
              className={`${blauerNue.className} text-[#0F3C78] lg:text-[18px] lg:leading-[20px] tracking-[0.5px]`}
            >
              Document
            </p>
            <h2
              className={`${agency.className} text-[#0F3C78] text-[24px] lg:text-[36px]`}
            >
              Press Center
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <p
              className={`${blauerNue.className} text-[#0F3C78] lg:text-[18px] mb-2 lg:mb-5 lg:leading-[20px] tracking-[0.5px]`}
            >
              Download
            </p>
            <div
              className={`${agency.className} flex items-center gap-2 text-[#0F3C78] lg:text-[20px] tracking-[0.5px] lg:leading-[20px]`}
            >
              <a href="#" className="hover:opacity-70 transition-opacity">
                Jpeg
              </a>
              <span className="text-[#0F3C78] font-normal">|</span>
              <a href="#" className="hover:opacity-70 transition-opacity">
                Png
              </a>
              <span className="text-[#0F3C78] font-normal">|</span>
              <a href="#" className="hover:opacity-70 transition-opacity">
                Eps
              </a>
              <span className="text-[#0F3C78] font-normal">|</span>
              <a href="#" className="hover:opacity-70 transition-opacity">
                Ai
              </a>
            </div>
          </div>
        </div>
        <Image
          src="/images/about/about-page-banner-bottom.png"
          alt="media"
          width={25}
          height={25}
          className="mx-auto mt-10 lg:mt-20"
        />
      </div>
    </div>
  );
};

export default Media;
