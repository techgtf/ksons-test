"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { agency } from "@/src/app/fonts";
import { LeftArrow, RightArrow } from "../common/SVGIcons";

const images = [
  "/images/career/career-slider-img.jpg",
  "/images/career/career-slider-img.jpg",
  "/images/career/career-slider-img.jpg",
  "/images/career/career-slider-img.jpg",
  "/images/career/career-slider-img.jpg",
  "/images/career/career-slider-img.jpg",
  "/images/career/career-slider-img.jpg",
  "/images/career/career-slider-img.jpg",
  "/images/career/career-slider-img.jpg",
  "/images/career/career-slider-img.jpg",
];

const CareerSlider = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [totalBarWidth, setTotalBarWidth] = useState(0);
  const [viewportRatio, setViewportRatio] = useState(0);

  // Single motion value for slider position
  const x = useMotionValue(0);

  // Handle constants
  const handleWidth = 44; // w-11 = 2.75rem = 44px
  const halfHandle = handleWidth / 2;

  // Derive everything from x
  const progress = useTransform(x, [constraints.left, 0], [1, viewportRatio], {
    clamp: true,
  });

  const handleX = useTransform(
    progress,
    [0, 1],
    [0, totalBarWidth - handleWidth],
  );

  const fillWidth = useTransform(handleX, (val) => `${val + halfHandle}px`);

  useEffect(() => {
    const updateDimensions = () => {
      if (scrollRef.current && containerRef.current && progressBarRef.current) {
        const { scrollWidth } = scrollRef.current;
        const { offsetWidth } = containerRef.current;
        setConstraints({ left: -(scrollWidth - offsetWidth), right: 0 });
        setTotalBarWidth(progressBarRef.current.offsetWidth);
        setViewportRatio(offsetWidth / scrollWidth);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handlePrev = () => {
    const target = Math.min(x.get() + 450, 0);
    animate(x, target, { type: "spring", stiffness: 300, damping: 30 });
  };

  const handleNext = () => {
    const target = Math.max(x.get() - 450, constraints.left);
    animate(x, target, { type: "spring", stiffness: 300, damping: 30 });
  };

  const onHandleDrag = (event: any, info: any) => {
    const travelRange = totalBarWidth - handleWidth;
    if (travelRange > 0) {
      const currentHandleX = handleX.get();
      const newProgress = currentHandleX / travelRange;
      const clampedProgress = Math.max(viewportRatio, Math.min(1, newProgress));

      const newX =
        constraints.left +
        (-constraints.left * (clampedProgress - 1)) / (viewportRatio - 1);
      x.set(newX);
    }
  };

  return (
    <section className="pb-24 bg-white overflow-hidden">
      <div className="app-container">
        {/* Slider Area */}
        <div
          ref={containerRef}
          className="relative cursor-grab active:cursor-grabbing"
        >
          <motion.div
            ref={scrollRef}
            drag="x"
            dragConstraints={constraints}
            style={{ x }}
            className="flex gap-4 md:gap-6"
          >
            {images.map((src, index) => (
              <motion.div
                key={index}
                className="w-[85vw] md:w-[600px] aspect-4/3 md:aspect-[1.4/1] relative rounded-xl overflow-hidden shrink-0"
              >
                <Image
                  src={src}
                  alt={`Team at work ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 85vw, 600px"
                  className="object-cover pointer-events-none"
                  priority={index < 2}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Navigation & Progress */}
        <div className="mt-20 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Progress Bar Container */}
          <div
            ref={progressBarRef}
            className="relative w-full md:flex-1 h-px bg-[#0f3c78]/15"
          >
            {/* Fill Bar */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-[#0f3c78]"
              style={{ width: fillWidth }}
            />

            {/* Drag Handle Circle */}
            <motion.div
              drag="x"
              dragConstraints={{
                left: viewportRatio * (totalBarWidth - handleWidth),
                right: totalBarWidth - handleWidth,
              }}
              dragElastic={0}
              dragMomentum={false}
              onDrag={onHandleDrag}
              style={{ x: handleX }}
              whileHover={{ scale: 1.05 }}
              className="absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0f3c78] flex flex-col items-center justify-center text-white cursor-pointer z-10"
            >
              <span
                className={`${agency.className} text-[11px] capitalize select-none`}
              >
                Drag
              </span>
            </motion.div>
          </div>
        </div>
        {/* Navigation Arrows */}
        <div className="lg:flex items-center justify-end hidden gap-6 mt-10">
          <button onClick={handlePrev} aria-label="Previous">
            <LeftArrow />
          </button>
          <button onClick={handleNext} aria-label="Next">
            <RightArrow />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CareerSlider;
