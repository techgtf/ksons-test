"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";

const CustomCursor = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [cursorColor, setCursorColor] = useState("#ffffff");
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring configuration - balanced for "synced but smooth"
  // Adjusted for tighter sync with browser cursor
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const updateCursorState = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    // 1. Detect Interaction (links, buttons)
    const interactive = target.closest(
      "a, button, [data-cursor='pointer'], .swiper-button-next, .swiper-button-prev, [role='button'], input, textarea",
    );
    setIsInteractive(!!interactive);

    // 2. Detect Section Zoom
    const section = target.closest(
      "section, [data-cursor='zoom'], .section-container, .app-container",
    );
    setIsZoomed(!!section);

    // 3. Detect Color Theme
    const lightContext = target.closest(
      "[data-cursor='light'], .light-theme, .bg-white, .bg-gray-50, .bg-gray-100, .light-gradient-bg, #testimonials",
    );
    if (lightContext) {
      setCursorColor("#0f3c78"); // Blue
    } else {
      setCursorColor("#ffffff");
    }
  }, []);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      // Hotspot correction: browser cursors are top-left aligned,
      // but we want our custom circle centered on the hotspot.
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
      updateCursorState(e);
    };

    const handleMouseOver = (e: MouseEvent) => {
      updateCursorState(e);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible, updateCursorState]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <style jsx global>{`
            @media (max-width: 1024px) {
              .custom-cursor-container {
                display: none !important;
              }
            }
          `}</style>

          <div
            className="custom-cursor-container"
            style={{ pointerEvents: "none", zIndex: 10000 }}
          >
            {/* Main Outer Triangle */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isClicked
                  ? 0.7
                  : isInteractive
                    ? 1.4
                    : isZoomed
                      ? 1.1
                      : 1,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: 32, // Match size of original outer circle
                height: 32,
                translateX: cursorX,
                translateY: cursorY,
                zIndex: 10000,
                x: "-50%",
                y: "-50%",
                pointerEvents: "none",
                willChange: "transform",
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 250,
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: "visible" }}
              >
                <polygon
                  points="16,5 4,26 28,26"
                  stroke={cursorColor}
                  strokeWidth={isInteractive ? 2 : 1.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{
                    transition: "stroke 0.2s ease, stroke-width 0.2s ease",
                  }}
                />
              </svg>
            </motion.div>

            {/* Center Triangle (Smaller and perfectly centered on hotspot) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isInteractive ? 0 : isClicked ? 1.5 : 1,
                opacity: 0.8, // Slightly more subtle
              }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: 8,
                height: 8,
                translateX: mouseX,
                translateY: mouseY,
                zIndex: 10001,
                x: "-50%",
                y: "-50%",
                pointerEvents: "none",
                willChange: "transform",
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon
                  points="4,1 1,6 7,6"
                  fill={cursorColor}
                  stroke={cursorColor}
                  strokeWidth={0.5}
                  strokeLinejoin="round"
                  style={{
                    transition: "fill 0.2s ease, stroke 0.2s ease",
                  }}
                />
              </svg>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;
