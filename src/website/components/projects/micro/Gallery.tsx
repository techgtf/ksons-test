"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { agency, blauerNue } from "@/src/app/fonts";
import { GalleryItem, MicroGallery } from "../projects";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { LeftArrow, RightArrow } from "../../common/SVGIcons";
import MicroHeader from "./MicroHeader";
import { useRef, useState } from "react";
import { useSlideY } from "@/src/website/hooks/useSlideY";
import { useReveal } from "@/src/website/hooks/useReveal";
import { useScrollScale } from "@/src/website/hooks/useScrollScale";
import { useLightbox } from "@/src/website/context/LightboxContext";
import { SlideImage } from "yet-another-react-lightbox";

interface GalleryProps {
  data?: MicroGallery;
}

const isVideoUrl = (url: string) => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

const VideoGalleryItem = ({ src }: { src: string }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  useScrollScale(cardRef, { fromScale: 0.8, start: "top 80%" });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative aspect-video w-full bg-black"
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        controls={isPlaying}
        muted
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <div
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer z-10"
        >
          <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white drop-shadow-lg transition-transform duration-300 hover:scale-110">
            <svg
              className="w-8 h-8 fill-current translate-x-0.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

const Gallery = ({ data }: GalleryProps) => {
  if (!data) return null;
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const { title, description, long_description, gallery } = data;

  useSlideY({ target: descRef, direction: "down", distance: 50 });

  const { openLightbox } = useLightbox();
  const mapSlide: SlideImage[] = gallery.map((item, i) => ({
    src: item.desktop_file,
    alt: `${"Gallery"}`,
    thumbnail: item.desktop_file,
  }));

  console.log(data, "data");

  return (
    <section
      data-cursor="light"
      className="gallery-section py-14 lg:py-24 relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/common/micro-gallery-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="app-container relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-14">
          <MicroHeader title={title} description={description} />
          <p
            ref={descRef}
            className={`${blauerNue.className} text-[#0F3C78] text-[14px] lg:text-base lg:max-w-[700px] tracking-[0.5px] leading-[24px]`}
          >
            {long_description}
          </p>
        </div>

        {/* Gallery Carousel */}
        <div className="relative max-w-[800px] mx-auto px-4 md:px-0">
          <Swiper
            modules={[Navigation, Pagination, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            navigation={{
              nextEl: ".gallery-next",
              prevEl: ".gallery-prev",
            }}
            pagination={{
              clickable: true,
              el: ".gallery-pagination",
            }}
            className="rounded-2xl overflow-hidden"
          >
            {gallery.map((item, index) => {
              const fileUrl = item.desktop_file || item.mobile_file || "";
              const isVideo = isVideoUrl(fileUrl);
              return (
                <SwiperSlide key={index}>
                  {isVideo ? (
                    <VideoGalleryItem src={fileUrl} />
                  ) : (
                    <ImgCard
                      onClick={() => openLightbox(mapSlide, index)}
                      item={item}
                      index={index}
                    />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="hidden lg:block absolute top-[20%] left-[-20%]">
            <Image
              src="/images/projects/big-triangle.svg"
              alt="Icon"
              width={270}
              height={270}
              className="object-contain"
            />
          </div>
          {/* Custom Navigation Arrows */}
          <button className="gallery-prev hidden lg:flex absolute left-[-20px] lg:left-[-145px] top-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 items-center justify-center z-20 group">
            <LeftArrow />
          </button>

          <button className="gallery-next hidden lg:flex absolute right-[-20px] lg:right-[-145px] top-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 items-center justify-center z-20 group">
            <RightArrow />
          </button>

          {/* Custom Pagination */}
          <div className="gallery-pagination flex justify-center gap-2 mt-8 md:mt-12"></div>
        </div>
      </div>

      <style jsx>{`
        :global(.gallery-pagination .swiper-pagination-bullet) {
          width: 8px;
          height: 8px;
          background: #0f3c78;
          opacity: 0.2;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border-radius: 50%;
          cursor: pointer;
          margin: 0 !important;
        }
        :global(.gallery-pagination .swiper-pagination-bullet-active) {
          opacity: 1;
          background: #0f3c78;
        }
      `}</style>
    </section>
  );
};

export default Gallery;

type cardProp = {
  item: GalleryItem;
  index: number;
  onClick: () => void;
};

const ImgCard = ({ item, index, onClick }: cardProp) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  // useReveal(cardRef, { direction: "bottom" })
  useScrollScale(cardRef, { fromScale: 0.8, start: "top 80%" });

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="relative aspect-video w-full cursor-pointer"
    >
      <picture>
        <source media="(max-width: 768px)" srcSet={item.mobile_file} />
        <Image
          src={item.desktop_file}
          alt={item.title || `Gallery Image ${index + 1}`}
          fill
          className="object-cover"
          priority={index === 0}
          unoptimized
        />
      </picture>
    </div>
  );
};
