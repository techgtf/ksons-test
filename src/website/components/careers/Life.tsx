import { agency, blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import React from "react";

const Life = () => {
  return (
    <div
      data-cursor="light"
      className="py-16 lg:py-24 relative overflow-hidden"
    >
      <div className="app-container relative">
        {/* Background Triangle SVG */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[75%] -z-10 pointer-events-none">
          <Image
            src="/images/career/career-triangle.svg"
            alt="background triangle"
            width={250}
            height={250}
            className="w-80 lg:w-[250px]"
          />
        </div>

        <div className="flex flex-col items-center text-center mx-auto">
          <h2
            className={`${agency.className} text-[24px] lg:text-[36px] text-[#0f3c78] mb-10`}
          >
            Life at K.sons Developers
          </h2>
          <p
            className={`${blauerNue.className} text-base max-w-[882px] font-light text-[#0f3c78] lg:leading-[24px] tracking-[0.5px]`}
          >
            At K.sons, we believe in cultivating an environment where
            creativity, collaboration, and growth are not just encouraged, they
            are celebrated. Life here is about more than just work; it's about
            building lasting relationships, creating meaningful impacts, and
            contributing to projects that shape the future.
          </p>
        </div>

        {/* Bottom Border Line */}
        <hr className="border border-[#0f3c78]/8 lg:mt-24 mt-16" />
      </div>
    </div>
  );
};

export default Life;
