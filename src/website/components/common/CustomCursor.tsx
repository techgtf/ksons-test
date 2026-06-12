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
            {/* Main Outer Circle */}
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
                borderColor: cursorColor,
                borderWidth: isInteractive ? "2px" : "1.5px",
              }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: 32, // Slightly smaller since default cursor is present
                height: 32,
                borderStyle: "solid",
                borderRadius: "50%",
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
            />

            {/* Center Dot (Smaller and perfectly centered on hotspot) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isInteractive ? 0 : isClicked ? 1.5 : 1,
                opacity: 0.8, // Slightly more subtle
                backgroundColor: cursorColor,
              }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: 4,
                height: 4,
                borderRadius: "50%",
                translateX: mouseX,
                translateY: mouseY,
                zIndex: 10001,
                x: "-50%",
                y: "-50%",
                pointerEvents: "none",
                willChange: "transform",
              }}
            />
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;
