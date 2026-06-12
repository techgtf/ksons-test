"use client";

import React, { useLayoutEffect, useRef } from "react";
import { MicroSpecification } from "../projects";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import MicroHeader from "./MicroHeader";
import { useSlideX } from "@/src/website/hooks/useSlideX";
import { registerGSAP, gsap } from "@/src/website/utils/gsap";

type Props = {
  data?: MicroSpecification;
};

export default function Specifications({ data }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useSlideX({ target: contentRef, direction: "right" });

  useLayoutEffect(() => {
    registerGSAP();
    if (!sectionRef.current || !wrapperRef.current || !contentRef.current)
      return;

    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        return content.scrollHeight - wrapper.offsetHeight;
      };

      gsap.to(content, {
        y: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  if (!data) return null;

  const { title, description, listing } = data;

  return (
    <div
      ref={sectionRef}
      className="micro-overview text-white py-14 lg:py-20"
      style={{
        background:
          "radial-gradient(353.34% 207.4% at 108.26% 213.54%, #2FD2ED 0%, #0A3168 100%)",
      }}
    >
      <div className="app-container">
        <MicroHeader
          title={title}
          description={description}
          titleColor="#ffffff"
          descriptionColor="#ffffff"
        />

        <div className="content-wrapper lg:px-20">
          {/* visible area */}
          <div
            ref={wrapperRef}
            className={`relative overflow-hidden ${listing.length >= 3 ? "h-[60vh] lg:h-[400px]" : "h-auto"}`}
          >
            {/* animated content */}
            <div ref={contentRef}>
              {listing.map((item, index) => (
                <div key={index} className="lg:pb-20 pb-14">
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-4">
                      <Image
                        src="/images/about/about-bullet.png"
                        alt="bullet"
                        width={16}
                        height={16}
                      />

                      <h3
                        className={`${agency.className} text-[18px] md:text-[20px] uppercase font-medium leading-[28px] lg:leading-[30px]`}
                      >
                        {item.title}
                      </h3>
                    </div>

                    <div className="bg-[#33D3EE26] h-px flex-1" />
                  </div>

                  <div className="listing lg:flex justify-between pl-8 pt-4">
                    {item.children.map((child, childIndex) => (
                      <div key={childIndex} className="lg:w-[25%] py-2 lg:py-0">
                        <p
                          className={`${agency.className} text-white leading-[30px]`}
                        >
                          {child.title}
                        </p>

                        <p
                          className={`${blauerNue.className} tracking-[0.5px] font-light text-[#D9D9D9] leading-[24px]`}
                        >
                          {child.short_description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import React, { useEffect, useRef } from "react";
// import { MicroSpecification } from "../projects";
// import Image from "next/image";
// import { agency, blauerNue } from "@/src/app/fonts";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/all";
// import MicroHeader from "./MicroHeader";
// import { useSlideX } from "@/src/website/hooks/useSlideX";

// type Props = {
//   data?: MicroSpecification;
// };

// export default function Specifications({ data }: Props) {
//   if (!data) return null;
//   const { title, description, listing } = data;

//   const sectionRef = React.useRef<HTMLDivElement>(null);
//   const scrollContetRef = React.useRef<HTMLDivElement>(null);
//   const headRef = React.useRef<HTMLDivElement>(null);

//   const listRef = useRef<HTMLDivElement | null>(null);
//   useSlideX({ target: scrollContetRef, direction: "right" })

//   return (
//     <div
//       ref={sectionRef}
//       className="micro-overview py-14 lg:py-20 text-white"
//       style={{
//         background:
//           "radial-gradient(353.34% 207.4% at 108.26% 213.54%, #2FD2ED 0%, #0A3168 100%)",
//       }}
//     >
//       <div className="app-container">
//         <MicroHeader
//           title={title}
//           description={description}
//           titleColor="#ffffff"
//           descriptionColor="#ffffff"
//         />
//         <div className="content-wrapper lg:px-20">
//           <div
//             ref={scrollContetRef}
//             className=" h-[300px] lg:h-[400px] overflow-y-auto scrollbar-thin"
//             onWheelCapture={(e) => e.stopPropagation()}
//             onTouchMoveCapture={(e) => e.stopPropagation()}
//             // ref={listRef}
//           >
//             {listing.map((item, index) => {
//               return (
//                 <div key={index} className="lg:pb-20 pb-14">
//                   <div className="flex items-center gap-5">
//                     <div className="flex items-center gap-4">
//                       <Image
//                         src={"/images/about/about-bullet.png"}
//                         alt="bullet"
//                         height={16}
//                         width={16}
//                       />
//                       <h3
//                         key={index}
//                         className={`${agency.className} text-[18px] md:text-[20px] text-[#fff] uppercase font-medium leading-[28px] lg:leading-[30px]`}
//                       >
//                         {item.title}
//                       </h3>
//                     </div>
//                     <div className="bg-[#33D3EE26] h-px flex-1" />
//                   </div>
//                   <div

//                     className="listing lg:flex justify-between pl-8 pt-4">
//                     {item.children.map((child, childIndex) => {
//                       return (
//                         <div
//                           key={childIndex}
//                           className="lg:w-[25%] py-2 lg:py-0"
//                         >
//                           <p
//                             className={`${agency.className} text-white leading-[30px]`}
//                           >
//                             {child.title}
//                           </p>
//                           <p
//                             className={`${blauerNue.className} tracking-[0.5px] font-light text-[#D9D9D9] leading-[24px]`}
//                           >
//                             {child.short_description}
//                           </p>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
