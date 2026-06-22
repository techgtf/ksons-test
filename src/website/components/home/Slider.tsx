"use client";

import { agency, blauerNue } from "@/src/app/fonts";
import NextImage from "next/image";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import CommonBtn from "../common/CommonBtn";
import { gsap, ScrollTrigger } from "../../utils/gsap";

export type SliderItem = {
  slug: string;
  title: string;
  label: string;
  description: string;
  files: {
    featured_desktop_file: string;
    featured_mobile_file: string;
  };
};

export type SliderProps = {
  slides: SliderItem[];
  buttonText?: string;
  buttonIcon?: string;
};

export default function Slider({
  slides,
  buttonText = "Explore",
  buttonIcon = "/images/home/arrow2.png",
}: SliderProps) {
  const [active, setActive] = useState(0);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    slides.forEach((slide) => {
      if (typeof window !== "undefined") {
        const img = new window.Image();
        img.src = slide.files.featured_desktop_file;
      }
    });
  }, [slides]);

  const handleHover = (i: number) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setActive(i);
    }, 100);
  };

  return (
    <div className="relative h-screen md:block hidden w-full overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            // style={{
            //   backgroundImage: `
            //     linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1)),
            //     url(${slide.files.featured_desktop_file})
            //   `,
            // }}
            style={{
              backgroundImage: `
                url(${slide.files.featured_desktop_file})
              `,
            }}
          />
        ))}
      </div>

      {/* OVERLAY */}
      {/* <div className="absolute inset-0 bg-black/10" /> */}

      {/* PANELS */}
      <div className="relative flex h-full">
        {slides.map((slide, i) => {
          const isActive = i === active;

          return (
            <div
              key={i}
              onMouseEnter={() => handleHover(i)}
              className="relative grow overflow-hidden cursor-pointer transition-all duration-700"
              style={{
                flexGrow: isActive ? 7 : 1,
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {/* BOTTOM TEXT OVERLAY */}
              <div
                className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
                style={{
                  height: "65%",
                  background: `linear-gradient(to top,
                        rgba(0,0,0,0.68) 0%,
                        rgba(0,0,0,0.48) 28%,
                        rgba(0,0,0,0.20) 55%,
                        rgba(0,0,0,0.00) 100%
                      )`,
                }}
              />
              {/* BLUR */}
              {!isActive && (
                <div className="absolute inset-0 backdrop-blur-[5px] bg-black/20" />
              )}

              {/* DIVIDER */}
              <div className="absolute right-0 top-0 h-full w-px bg-white/30" />

              {/* ACTIVE CONTENT */}
              <div
                className={`absolute inset-0 z-10 flex items-end px-16 py-24 text-white transition-all duration-500 ${
                  isActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4 pointer-events-none"
                }`}
              >
                <div className={`${blauerNue.className}`}>
                  <div className="flex items-center gap-3">
                    <NextImage
                      src={"/images/about/about-bullet.png"}
                      alt="bullet"
                      height={15}
                      width={15}
                      className="brightness-0 invert"
                    />
                    <p className="capitalize tracking-[0.5px] leading-5">
                      {slide.label}
                    </p>
                  </div>

                  <h1 className="mt-9 text-[24px] font-medium lg:text-[36px] lg:leading-[20px] capitalize tracking-[0.5px]">
                    {slide.title}
                  </h1>

                  <p className="mt-9 mb-11.5 font-light max-w-[402px]">
                    {slide.description.length > 90
                      ? slide.description.slice(0, 80) + "..."
                      : slide.description}
                  </p>
                  <CommonBtn
                    variant="outline"
                    href={`/${slide?.slug}`}
                    rightIcon={
                      <NextImage
                        src={buttonIcon}
                        alt="button arrow"
                        width={20}
                        height={20}
                      />
                    }
                  >
                    {buttonText}
                  </CommonBtn>
                </div>
              </div>

              {/* COLLAPSED LABEL */}
              <div
                className={`absolute inset-0 flex items-end justify-center transition-opacity duration-300 ${
                  isActive ? "opacity-0" : "opacity-100"
                }`}
              >
                <span
                  className={`${blauerNue.className} mb-30 capitalize tracking-[0.5px] lg:leading-[20px] font-medium text-[24px] lg:text-[36px] text-white whitespace-nowrap`}
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {slide.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MobileSlider({
  slides,
  buttonText = "Explore",
  buttonIcon = "/images/home/arrow2.png",
}: SliderProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    if (window.innerWidth >= 768) return;

    const total = slides.length - 1;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${slides.length * 200}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        fastScrollEnd: true,

        onUpdate: (self) => {
          const index = Math.min(
            Math.floor(self.progress * slides.length),
            total,
          );
          setActive(index);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [slides.length]);

  return (
    <section
      ref={sectionRef}
      className="md:hidden block h-[95vh] relative overflow-hidden bg-black"
    >
      {/* Background Images */}
      {slides.map((item, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-500 ${
            active === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <NextImage
            fill
            src={item.files.featured_mobile_file}
            alt={item.title}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      ))}

      {/* Foreground */}
      <div className="relative z-10 h-full pb-8 flex flex-col text-white">
        {/* Top Fixed Stack (Scrolled headings) */}
        {slides.slice(0, active).map((item, index) => (
          <div
            key={index}
            className={`h-[62px] shrink-0 border-b border-white/40 backdrop-blur-[2px] flex items-center justify-center tracking-[0.5px] font-medium text-[22px] ${blauerNue.className}`}
          >
            {item.label}
          </div>
        ))}

        {/* Active Expanded Card */}
        <div
          className={`${blauerNue.className} flex-1 flex items-center justify-center px-6`}
        >
          <div>
            <div className="flex items-center gap-3">
              <NextImage
                src={"/images/about/about-bullet.png"}
                alt="bullet"
                height={15}
                width={15}
                className="brightness-0 invert"
              />
              <p className="capitalize tracking-[0.5px] leading-5">
                {slides[active].label}
              </p>
            </div>

            <h2 className="text-[24px] font-medium tracking-[0.5px]">
              {slides[active].title}
            </h2>

            <p className="mt-5 pera leading-6 opacity-90 pb-6">
              {slides[active].description.length > 90
                ? slides[active].description.slice(0, 80) + "..."
                : slides[active].description}
            </p>
            <CommonBtn
              variant="outline"
              href={`/${slides[active].slug}`}
              rightIcon={
                <NextImage
                  src={buttonIcon}
                  alt="button arrow"
                  height={20}
                  width={20}
                />
              }
            >
              {buttonText}
            </CommonBtn>
          </div>
        </div>

        {/* Bottom Remaining Queue */}
        {slides.slice(active + 1).map((item, index) => (
          <div
            key={index}
            className={`h-[62px] shrink-0 border-t border-white/40 backdrop-blur-[2px] flex items-center justify-center capitalize tracking-[0.5px] font-medium text-[22px] ${blauerNue.className}`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}

export const SliderContainer = ({ slides }: SliderProps) => {
  return (
    <>
      <Slider slides={slides} />
      <MobileSlider slides={slides} />
    </>
  );
};

// "use client";

// import { blauerNue } from "@/src/app/fonts";
// import NextImage from "next/image";
// import { useState, useEffect, useRef, useLayoutEffect } from "react";
// import { gsap, ScrollTrigger, registerGSAP } from "../../utils/gsap";
// import CommonBtn from "../common/CommonBtn";

// export type SliderItem = {
//     title: string;
//     label: string;
//     description: string;
//     image: string;
// };

// export type SliderProps = {
//     slides: SliderItem[];
//     buttonText?: string;
//     buttonIcon?: string;
// };

// export default function Slider({
//     slides,
//     buttonText = "Explore",
//     buttonIcon = "/images/home/arrow2.png",
// }: SliderProps) {
//     const [active, setActive] = useState(0);
//     const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

//     const containerRef = useRef<HTMLDivElement | null>(null);

//     const [isMobile, setIsMobile] = useState(false);

//     useLayoutEffect(() => {
//         const check = () => setIsMobile(window.innerWidth < 768);
//         check();
//         window.addEventListener("resize", check);
//         setTimeout(() => ScrollTrigger.refresh(), 100);
//         return () => window.removeEventListener("resize", check);
//     }, []);

//     useLayoutEffect(() => {
//         registerGSAP();
//         if (!isMobile || !containerRef.current) return;

//         const total = slides.length;

//         const trigger = ScrollTrigger.create({
//             trigger: containerRef.current,
//             start: "top top",
//             end: `+=${total * 70}%`,
//             pin: true,
//             snap: {
//                 snapTo: 1 / (total - 1),
//                 duration: 0.3,
//                 ease: "power1.inOut",
//             },

//             onUpdate: (self) => {
//                 const index = Math.round(self.progress * (total - 1));
//                 setActive(index);
//             },
//         });

//         return () => trigger.kill();
//     }, [isMobile, slides.length]);

//     // PRELOAD IMAGES (dynamic now)
//     useLayoutEffect(() => {
//         slides.forEach((slide) => {
//             const img = new Image();
//             img.src = slide.image;
//         });
//     }, [slides]);

//     // DEBOUNCED HOVER
//     const handleHover = (i: number) => {
//         if (hoverTimeout.current !== null) {
//             clearTimeout(hoverTimeout.current);
//         }

//         hoverTimeout.current = setTimeout(() => {
//             setActive(i);
//         }, 100);
//     };

//     return (
//         <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
//             {/* BACKGROUNDS */}
//             <div className="absolute inset-0">
//                 {slides.map((slide, i) => (
//                     <div
//                         key={i}
//                         className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 will-change-opacity ${i === active ? "opacity-100" : "opacity-0"
//                             }`}
//                         style={{
//                             backgroundImage: `
//                 linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1)),
//                 url(${slide.image})
//               `,
//                         }}
//                     />
//                 ))}
//             </div>

//             {/* OVERLAY */}
//             <div className="absolute inset-0 bg-black/20" />

//             {/* PANELS */}
//             <div className={`relative ${isMobile ? "flex flex-col h-full" : "flex h-full"}`}>
//                 {slides.map((slide, i) => {
//                     const isActive = i === active;

//                     return (
//                         <div
//                             key={i}
//                             onMouseEnter={() => !isMobile && handleHover(i)}
//                             className={`relative overflow-hidden cursor-pointer transition-all duration-700 ${isMobile ? "transition-all duration-500" : "grow"}`}
//                             style={{
//                                 flexGrow: !isMobile ? (isActive ? 7 : 1) : undefined,
//                                 height: isMobile
//                                     ? isActive
//                                         ? i === slides.length - 1
//                                             ? "60%" // slightly smaller for last panel
//                                             : "70%"
//                                         : `${30 / (slides.length - 1)}%`
//                                     : undefined,
//                                 transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
//                             }}
//                         >
//                             {/* BLUR */}
//                             {!isActive && (
//                                 <div className="absolute inset-0 backdrop-blur-xs bg-black/20" />
//                             )}

//                             {/* DIVIDER */}
//                             {isMobile ? (
//                                 <>
//                                     {/* TOP BORDER (always) */}
//                                     <div className="absolute top-0 left-0 w-full h-px bg-white/30" />

//                                     {/* BOTTOM BORDER (NOT for last panel) */}
//                                     {i !== slides.length - 1 && (
//                                         <div className="absolute bottom-0 left-0 w-full h-px bg-white/30" />
//                                     )}
//                                 </>
//                             ) : (
//                                 <div className="absolute right-0 top-0 h-full w-px bg-white/30" />
//                             )}

//                             {/* ACTIVE CONTENT */}
//                             <div
//                                 className={`absolute z-2 inset-0 flex items-end py-24 px-16 text-white text-whitetransition-all duration-500 ${isActive
//                                     ? "opacity-100 translate-x-0"
//                                     : "opacity-0 translate-x-4 pointer-events-none"
//                                     }`}>
//                                 <div className={`max-w-md ${blauerNue.className}`}>
//                                     <p className="font-normal">{slide.label}</p>

//                                     <h1 className="text-4xl font-medium tracking-[0.5px] mt-6">
//                                         {slide.title}
//                                     </h1>

//                                     <p className="mb-6 font-light mt-6">
//                                         {slide.description}
//                                     </p>

//                                     {/* <button className="border px-10 py-3 rounded-full text-base flex items-center gap-4 mt-10">
//                                         {buttonText}
//                                         <NextImage
//                                             src={buttonIcon}
//                                             alt="button arrow"
//                                             height={20}
//                                             width={20}
//                                         />
//                                     </button> */}
//                                     <CommonBtn
//                                         variant="outline"
//                                         href="#"
//                                         rightIcon={<NextImage src={buttonIcon} alt="button arrow" height={20} width={20} />}
//                                     >{buttonText}</CommonBtn>
//                                 </div>
//                             </div>

//                             {/* COLLAPSED LABEL */}
//                             <div
//                                 className={`absolute inset-0 flex items-center md:items-end justify-center transition-opacity duration-300 ${isActive ? "opacity-0" : "opacity-100"}`}>
//                                 <span className={`text-white tracking-wide text-2xl ${isMobile ? "" : "-rotate-90 text-4xl mb-30"}`}>
//                                     {slide.label}
//                                 </span>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div >
//     );
// }
