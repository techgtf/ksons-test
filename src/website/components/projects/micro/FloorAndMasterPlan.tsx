"use client";
import React, { useState, useRef } from "react";
import { MicroFloorAndMasterPlan } from "../projects";
import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { FiMaximize } from "react-icons/fi";
import TabSwitcher from "../../common/TabSwitcher";
import EnquiryModal from "../../common/EnquiryModal";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { LeftArrow, RightArrow } from "../../common/SVGIcons";
import MicroHeader from "./MicroHeader";
import { useSlideY } from "@/src/website/hooks/useSlideY";
import { useLightbox } from "@/src/website/context/LightboxContext";
import { SlideImage } from "yet-another-react-lightbox";
import { useSlideX } from "@/src/website/hooks/useSlideX";

type Props = {
  data?: MicroFloorAndMasterPlan;
};

export default function FloorAndMasterPlan({ data }: Props) {
  if (!data) return null;

  const { title, description, planTypes, masterPlan, floorPlans } = data;
  const [activePlan, setActivePlan] = useState(planTypes[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const swiperRef = useRef<any>(null);

  const tabsRef = useRef<HTMLDivElement | null>(null);
  const plansGridRef = useRef<HTMLDivElement | null>(null);

  useSlideY({ target: tabsRef });
  useSlideX({ target: plansGridRef });

  // Reset swiper when active plan type changes
  React.useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(0);
    }
  }, [activePlan]);

  const getPlans = () => {
    if (activePlan === "master-plan") {
      return masterPlan && masterPlan.image ? [masterPlan] : [];
    }
    if (activePlan === "floor-plan") {
      return floorPlans;
    }
    return [];
  };

  const plansToRender = getPlans();
  const isEmpty = plansToRender.length === 0;

  const { openLightbox } = useLightbox();

  const slides: SlideImage[] = plansToRender.map((item, index) => ({
    src: item.image ?? "",
    alt: `${item?.title}`,
  }));

  return (
    <div
      data-cursor="light"
      className="micro-floor-plan-section py-14 lg:py-20 overflow-hidden"
      style={{
        backgroundImage: "url('/images/common/center-gradient.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="app-container">
        {/* Custom Header Section */}

        <MicroHeader title={title} description={description} />

        {/* Plan Type Toggles */}
        <div ref={tabsRef} className="w-full">
          <TabSwitcher
            tabs={planTypes}
            activeTab={activePlan}
            onChange={setActivePlan}
            className="mb-12 2xl:mb-20"
          />
        </div>

        {/* Carousel Area */}
        <div className="relative max-w-[1200px] mx-auto">
          {isEmpty ? (
            <div className="flex justify-center w-fit mx-auto pt-10">
              <Image
                src={"/images/projects/residential/plans/plan.png"}
                height={350}
                width={350}
                alt="plan"
                quality={40}
                className="blur"
              />
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#0F3C78] text-white px-6 py-3 rounded-md flex items-center gap-2 font-bold tracking-wider text-[14px]"
                >
                  <FiMaximize className="text-xl" />
                  View Plans
                </button>
              </div>
            </div>
          ) : (
            <>
              <Swiper
                key={activePlan}
                modules={[Navigation, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                spaceBetween={30}
                slidesPerView={1}
                loop={false}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination-custom",
                }}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                className="pb-12"
              >
                {plansToRender.map((plan, index) => {
                  const nextIndex = (index + 1) % plansToRender.length;
                  const nextPlan = plansToRender[nextIndex];

                  return (
                    <SwiperSlide key={index}>
                      <div
                        ref={plansGridRef}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
                      >
                        {/* Left Side Info (Title) */}
                        <div className="hidden lg:flex lg:col-span-3 flex-col justify-center relative h-full mx-8">
                          <h4
                            className={`${agency.className} text-[24px]! text-[#0F3C78] leading-[1.1] uppercase tracking-[2px]`}
                          >
                            {plan.title}
                          </h4>
                          <div className="absolute top-1/2 -translate-y-1/2 left-0 aspect-square pointer-events-none">
                            <Image
                              src="/images/projects/small-triangle.svg"
                              alt="Icon"
                              width={150}
                              height={150}
                              className="object-contain"
                            />
                          </div>
                        </div>

                        {/* Center Main Image */}
                        <div className="lg:col-span-6 relative group">
                          <div className="relative rounded-xl overflow-hidden">
                            <Image
                              src={plan.image ?? ""}
                              alt={plan.title ?? ""}
                              width={500}
                              height={500}
                              className="object-contain p-4 mx-auto"
                            />
                            {/* View Fullscreen Overlay */}
                            <div
                              onClick={() => openLightbox(slides, index)}
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                            >
                              <button className="bg-[#0F3C78] text-white px-6 py-3 rounded-md flex items-center gap-2 font-bold tracking-wider text-[14px]">
                                <FiMaximize className="text-xl" />
                                View Fullscreen
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Right Side Next Preview */}
                        <div className="lg:col-span-3 hidden rounded-lg lg:flex flex-col items-center gap-4 mx-8 bg-[#0F3C7805]">
                          {plansToRender[index + 1] && (
                            <div className="w-full">
                              <div
                                className="p-3.5 opacity-60 hover:opacity-100 transition-all cursor-pointer bg-[#0F3C7805]"
                                onClick={() => swiperRef.current?.slideNext()}
                              >
                                <div className="relative aspect-square flex justify-center items-center mb-2">
                                  <Image
                                    src={plansToRender[index + 1].image ?? ""}
                                    alt="Next Plan"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <p
                                  className={`${agency.className} text-[#0F3C78] text-center text-[14px] uppercase tracking-wider`}
                                >
                                  {plansToRender[index + 1].title}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-center lg:hidden relative h-full">
                        <h4
                          className={`${agency.className} text-[18px] text-[#0F3C78] leading-[1.1] uppercase tracking-[2px]`}
                        >
                          {plan.title}
                        </h4>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              {/* Custom Navigation Button (Left Arrow) */}
              <button className="swiper-button-prev-custom absolute left-[-20px] lg:left-[-30px] 2xl:left-[-60px] top-[45%] -translate-y-1/2 w-14 h-14 text-[#0F3C78] rounded-full cursor-pointer items-center justify-center z-20 hidden md:flex">
                <LeftArrow />
              </button>

              {/* Custom Navigation Button (Right Arrow) */}
              <button className="swiper-button-next-custom absolute right-[-20px] lg:right-[-30px] 2xl:right-[-60px] top-[45%] -translate-y-1/2 w-14 h-14 text-[#0F3C78] rounded-full cursor-pointer items-center justify-center z-20 hidden md:flex">
                <RightArrow />
              </button>
            </>
          )}

          {/* Custom Pagination Dots */}
          <div className="swiper-pagination-custom flex justify-center gap-1 mt-8"></div>
        </div>
      </div>

      <style jsx>{`
        :global(.swiper-pagination-custom .swiper-pagination-bullet) {
          width: 8px;
          height: 8px;
          background: #0f3c78;
          opacity: 0.3;
          transition: all 0.3s ease;
          border-radius: 50%;
          cursor: pointer;
          margin: 0 !important;
        }
        :global(.swiper-pagination-custom .swiper-pagination-bullet-active) {
          opacity: 1;
        }
        :global(.swiper-button-disabled) {
          opacity: 0 !important;
          pointer-events: none;
        }
      `}</style>
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
