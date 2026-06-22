"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { agency, blauerNue } from "@/src/app/fonts";
import { MicroLocation } from "../projects";
import { MdDirectionsWalk } from "react-icons/md";
import MicroHeader from "./MicroHeader";
import { useScrollScale } from "@/src/website/hooks/useScrollScale";
import { useLightbox } from "@/src/website/context/LightboxContext";
import { SlideImage } from "yet-another-react-lightbox";
import { useSlideX } from "@/src/website/hooks/useSlideX";
import { useSlideY } from "@/src/website/hooks/useSlideY";

interface LocationProps {
  data?: MicroLocation;
}

const Location = ({ data }: LocationProps) => {
  const [activeType, setActiveType] = useState<"drive" | "walk">("drive");
  const mapImgRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const typeHeaderRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [iframeSrc, setiframeSrc] = useState<string | null>(null);

  if (!data) return null;

  const {
    title,
    description,
    desktop_file,
    mobile_file,
    iframe,
    location_data,
  } = data;

  const toggleType = () => {
    setActiveType((prev) => (prev === "drive" ? "walk" : "drive"));
  };

  const filteredList = location_data.list.filter(
    (item) => item.type === activeType,
  );

  useEffect(() => {
    if (!iframe) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(iframe, "text/html");
    const extractedSrc = doc.querySelector("iframe")?.getAttribute("src");
    setiframeSrc(extractedSrc || null);
  }, [iframe]);

  useScrollScale(mapImgRef, { start: "top 85%" });
  useSlideX({ target: contentRef, direction: "right" });
  useSlideY({
    target: typeHeaderRef,
    direction: "down",
    distance: 120,
    duration: 2,
  });
  useSlideY({ target: listRef, direction: "up", distance: 120, duration: 2.5 });

  const { openLightbox } = useLightbox();
  const mapSlide: SlideImage[] = [
    {
      src: desktop_file,
      alt: `${"Location Map"}`,
    },
  ];

  return (
    <section
      className="location-section py-14 lg:py-24 relative overflow-hidden bg-white"
      style={{
        backgroundImage: "url('/images/common/left-gradient.webp')",
        backgroundSize: "contain",
        backgroundPosition: "left",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="app-container 2xl:px-18!">
        {/* Top Header */}
        <MicroHeader title={title} description={description} />

        <div className="mb-16 lg:mb-24 overflow-hidden">
          {/* Map Image container */}
          {iframe && iframe !== "undefined" ? (
            <MapIframe src={iframeSrc ?? null} title="Google Map Location" />
          ) : (
            <div
              ref={mapImgRef}
              onClick={() => openLightbox(mapSlide, 0)}
              className="relative cursor-pointer w-full aspect-16/7 border bg-[#d9d9d9]/5 border-[#d9d9d9]/95 rounded-2xl"
            >
              <Image
                src={mobile_file ?? ""}
                alt="Location Map"
                fill
                className="object-cover block md:hidden"
              />

              {/* Desktop */}
              <Image
                src={desktop_file ?? ""}
                alt="Location Map"
                fill
                className="object-cover hidden md:block"
              />
            </div>
          )}
        </div>

        {/* Location Advantages Grid */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          <div ref={contentRef} className="lg:w-3/12 relative">
            <h3
              className={`${agency.className} text-[#0F3C78] text-[22px]! leading-[34px] tracking-[0.5px] capitalize lg:text-4xl mb-6`}
            >
              {location_data.heading}
            </h3>
            <p
              className={`${blauerNue.className} text-[#0f3c78] text-base leading-[24px] tracking-[0.5px]`}
            >
              {location_data.description}
            </p>
            <div className="absolute top-0 -translate-x-1/2 -translate-y-1/2 left-0 aspect-square pointer-events-none">
              <Image
                src="/images/projects/small-triangle.svg"
                alt="Icon"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
          </div>

          <div className="lg:w-9/12 w-full">
            {/* Type Selector Section */}
            <div
              ref={typeHeaderRef}
              className="mb-5 md:mb-10 border-b border-[#d9d9d9]/95 pb-2"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex  items-center justify-betwee w-full gap-3">
                  {activeType === "drive" ? (
                    <Image
                      src="/images/projects/car.svg"
                      alt="Car Icon"
                      width={28}
                      height={28}
                      className="w-7 h-7 object-contain"
                    />
                  ) : (
                    <MdDirectionsWalk className="text-[#0F3C78] w-7 h-7 rotate-[180deg]" />
                  )}
                  <p
                    className={`${agency.className} text-[#0F3C78] text-base capitalize`}
                  >
                    {activeType}
                  </p>
                </div>
              </div>
            </div>
            {/* Grid */}
            <div
              ref={listRef}
              className="grid grid-cols-1 md:grid-cols-2 md:gap-6 min-h-[200px] relative pr-10"
            >
              {/* Arrows */}
              {/* <div
                onClick={toggleType}
                className="absolute top-[40%] -translate-y-1/2 lg:right-0 right-[20px] flex items-center justify-center z-20 cursor-pointer"
              >
                <Image
                  src="/images/projects/right-arrow.svg"
                  alt="Right Arrow"
                  width={25}
                  height={25}
                  className="w-[25px] h-[25px] object-contain"
                />
              </div>
              <div
                onClick={toggleType}
                className="absolute top-[50%] lg:top-[55%] -translate-y-1/2 lg:right-0 right-[20px] flex items-center justify-center z-20 cursor-pointer"
              >
                <Image
                  src="/images/projects/left-arrow.svg"
                  alt="Left Arrow"
                  width={25}
                  height={25}
                  className="w-[25px] h-[25px] object-contain"
                />
              </div> */}
              {filteredList.map((item, index) => (
                <div
                  key={`${activeType}-${index}`}
                  className="flex items-center gap-5 p-5 rounded-xl"
                >
                  <div className="w-14 h-14 rounded-full bg-[#0F3C780D] flex items-center justify-center">
                    <Image
                      src={item.icons}
                      alt={item.name}
                      width={30}
                      height={30}
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-[#0F3C78] capitalize leading-[32px] ${blauerNue.className}`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`text-[#0F3C78] capitalize text-xl ${agency.className}`}
                    >
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
              {filteredList.length === 0 && (
                <div className="col-span-full py-10 text-center text-[#0F3C78]/60">
                  No {activeType} locations available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;

interface Props {
  src: string | null;
  title?: string;
}

// function MapIframe({ src, title = "Google Map Location" }: Props) {
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const isScrollingRef = useRef(false);
//   const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const isHoveredRef = useRef(false);

//   if (!iframeRef) return null;

//   useEffect(() => {
//     const wrapper = wrapperRef.current;
//     const iframe = iframeRef.current;
//     if (!wrapper || !iframe) return;

//     // Start with pointer-events disabled — Lenis scrolls freely over it
//     iframe.style.pointerEvents = "none";

//     const enableIframe = () => {
//       iframe.style.pointerEvents = "auto";
//     };

//     const disableIframe = () => {
//       iframe.style.pointerEvents = "none";
//     };

//     const handleMouseEnter = () => {
//       isHoveredRef.current = true;
//       // Only enable iframe interaction if user isn't mid-scroll
//       if (!isScrollingRef.current) {
//         enableIframe();
//       }
//     };

//     const handleMouseLeave = () => {
//       isHoveredRef.current = false;
//       disableIframe();
//     };

//     // Detect wheel/scroll gestures — disable iframe so Lenis stays in control
//     const handleWheel = () => {
//       isScrollingRef.current = true;
//       disableIframe();

//       // Clear previous timer
//       if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);

//       // Re-enable after scroll gesture settles (300ms of no wheel events)
//       scrollTimerRef.current = setTimeout(() => {
//         isScrollingRef.current = false;
//         if (isHoveredRef.current) {
//           enableIframe();
//         }
//       }, 300);
//     };

//     window.addEventListener("wheel", handleWheel, { passive: true });
//     wrapper.addEventListener("mouseenter", handleMouseEnter);
//     wrapper.addEventListener("mouseleave", handleMouseLeave);

//     return () => {
//       window.removeEventListener("wheel", handleWheel);
//       wrapper.removeEventListener("mouseenter", handleMouseEnter);
//       wrapper.removeEventListener("mouseleave", handleMouseLeave);
//       if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
//     };
//   }, []);

//   return (
//     <div ref={wrapperRef} className="iframe lg:h-[500px] h-[400px]">
//       <iframe
//         ref={iframeRef}
//         title={title}
//         src={src}
//         width="100%"
//         height="100%"
//         style={{ border: 0 }}
//         allowFullScreen
//         loading="lazy"
//         referrerPolicy="no-referrer-when-downgrade"
//       />
//     </div>
//   );
// }

function MapIframe({ src, title = "Google Map Location" }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.style.pointerEvents = isActive ? "auto" : "none";
  }, [isActive]);

  return (
    <div
      className="relative w-full lg:h-[500px] h-[400px]"
      onMouseLeave={() => setIsActive(false)}
    >
      {src && (
        <iframe
          ref={iframeRef}
          title={title}
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0, pointerEvents: "none" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}

      {!isActive && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setIsActive(true)}
        />
      )}

      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className={`bg-black/70 text-white text-sm px-4 py-2 rounded-full ${blauerNue.className}`}
          >
            Click to interact with map
          </span>
        </div>
      )}
    </div>
  );
}
