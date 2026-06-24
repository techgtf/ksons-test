"use client";

import Image from "next/image";
import { agency, blauerNue } from "@/src/app/fonts";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { gsap } from "../../utils/gsap";
import Link from "next/link";
import { HEADER_MENU_ITEMS, ProjectsLinks } from "../../utils/givePages";
import { useSocialLinks } from "../../utils/giveSocialLinks";

/* =========================
   CONFIG (EDIT HERE ONLY)
========================= */

// const NAV_ITEMS = ["Residential", "Commercial", "Hospitality"];
const NAV_ITEMS = ProjectsLinks;

const MENU_ITEMS = HEADER_MENU_ITEMS;



/* =========================
   REUSABLE COMPONENTS
========================= */

const MenuItem = ({ item, onClick }: any) => {
  const [open, setOpen] = useState(false);

  const hasAccordion = item.projects?.length > 0;

  return (
    <div className={`menu-item`}>
      <div className="flex gap-4 items-center cursor-pointer">
        {item.href ? (
          <Link
            href={item.href}
            onClick={onClick}
            className="text-[18px] block min-w-[180px] lg:text-[22px] uppercase tracking-[0.88px]"
          >
            {item.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => hasAccordion && setOpen(!open)}
            className="flex-1 text-left text-[17px] lg:text-[22px] uppercase tracking-wide"
          >
            {item.label}
          </button>
        )}

        {hasAccordion && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          >
            <Image
              src="/images/common/dropdown.svg"
              alt="Dropdown"
              width={30}
              height={30}
            />
          </button>
        )}
      </div>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          open ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`lg:space-y-3 flex flex-wrap gap-5 text-[#A7C3DA] uppercase lg:leading-[45px] text-base tracking-[0.16px] ${blauerNue.className}`}
          >
            {item.projects?.map((project: any, i: number) => (
              <Link
                key={i}
                href={project.href}
                onClick={onClick}
                className="block hover:text-white transition-colors duration-300"
              >
                {project.label}
                {i !== item.projects.length - 1 && (
                  <span className="ml-5 text-[#A7C3DA]">/</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialIcons = ({ links }: { links: any[] }) => {
  return links.map((item, i) => (
    <Link
      key={i}
      href={item.link}
      className="w-9 h-9 flex items-center justify-center border border-white/30 rounded-full transition-all duration-500 hover:bg-[#0f3c78] hover:border-[#0f3c78] hover:scale-110 group shadow-sm hover:shadow-[0_0_15px_rgba(51,211,238,0.4)]"
    >
      <Image
        src={item.icon}
        alt=""
        width={16}
        height={16}
        className="transition-all duration-500 opacity-80 group-hover:opacity-100 group-hover:invert group-hover:brightness-0"
      />
    </Link>
  ));
};

/* =========================
   MAIN COMPONENT
========================= */

export default function Header() {
  const socialLinks = useSocialLinks();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [showHeader, setShowHeader] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);

  /* =========================
       HEADER SCROLL
    ========================= */
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const currentY = window.scrollY;

      setIsAtTop(currentY <= 10);

      if (currentY > lastScrollY.current && currentY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const portalRoot =
    typeof window !== "undefined"
      ? document.getElementById("global-ui-root")
      : null;

  /* =========================
       MENU ANIMATION
    ========================= */
  useEffect(() => {
    if (!overlayRef.current) return;

    document.body.style.overflow = menuOpen ? "hidden" : "";

    let targets: any;

    if (menuOpen) {
      targets = overlayRef.current.querySelectorAll(".menu-item");

      gsap.fromTo(
        targets,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: "power3.out",
        },
      );
    }

    return () => {
      if (targets) {
        gsap.killTweensOf(targets);
      }
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen || !scrollRef.current) return;

    const el = scrollRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation(); // prevent body interference
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [menuOpen]);

  if (!mounted || !portalRoot) return null;

  /* =========================
       HEADER UI
    ========================= */
  const header = (
    <div
      // ref={headerRef}
      data-cursor="light"
      className={`fixed  w-full z-[1000] px-6 lg:px-12 py-1 transition-all duration-300 ease-in-out 
                    ${showHeader ? "translate-y-0" : "-translate-y-full"} 
                    ${isAtTop ? "bg-transparent top-6 text-black" : "bg-white top-0 text-black"}`}
    >
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <nav
          className={`flex-1 hidden md:flex gap-8 text-[14px]  w-[30%] uppercase ${blauerNue.className}`}
        >
          {NAV_ITEMS.slice(0, 2).map((item, i) => {
            // if (i >= 3) return null;
            return (
              <span key={i}>
                <Link
                  className={`${blauerNue.className} text-[14px] tracking-[1px] uppercase text-[#0F3C78]`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </span>
            );
          })}
        </nav>

        {/* LOGO */}
        <div className=" hidden lg:flex justify-center">
          <Link href="/">
            <Image
              src="/images/header/ksons-logo.png"
              alt="logo"
              width={120}
              height={0}
              priority
            />
          </Link>
        </div>

        <Link href="/">
          <Image
            src="/images/header/ksons-logo.png"
            alt="logo"
            width={100}
            height={0}
            priority
            className="block lg:hidden"
          />
        </Link>

        {/* RIGHT */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <nav
            className={`hidden md:flex gap-8 text-[14px] pr-10  uppercase ${blauerNue.className}`}
          >
            {NAV_ITEMS.slice(2, 4).map((item, i) => {
              // if (i >= 3) return null;
              return (
                <span key={i}>
                  <Link
                    className={`${blauerNue.className} text-[14px] tracking-[1px] uppercase text-[#0F3C78]`}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </span>
              );
            })}
          </nav>
          {/* <span
            className={`${blauerNue.className} hidden md:inline text-[14px] tracking-[1px] uppercase text-[#0F3C78]`}
          >
            Menu
          </span> */}

          <div
            onClick={() => setMenuOpen(true)}
            className="group w-12 h-8 rounded-full bg-[#0F3C78] flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-101 hover:bg-[#124a94] hover:shadow-[0_0_1px_rgba(15,60,120,0.1)]"
          >
            <div className="flex flex-col items-end gap-[3px]">
              <span className="w-5 h-[1.5px] bg-white transition-all duration-300 group-hover:shadow-[0_0_1px_rgba(255,255,255,0.6)]" />
              <span className="w-4 h-[1.5px] bg-white transition-all duration-300 group-hover:shadow-[0_0_1px_rgba(255,255,255,0.6)]" />
              <span className="w-3 h-[1.5px] bg-white transition-all duration-300 group-hover:shadow-[0_0_1px_rgba(255,255,255,0.6)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* =========================
       MENU OVERLAY
    ========================= */
  const menuOverlay = (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[10000] lg:flex transition-opacity duration-300
        ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <Image
        src="/images/header/header-bg.png"
        alt="Header background"
        width={200}
        height={200}
        className="absolute inset-0 w-full h-full object-cover -z-1"
      />

      {/* LEFT */}
      <div className="w-1/2 hidden lg:flex flex-col items-center justify-center relative overflow-hidden">
        <Image
          src="/images/header/triangle.png"
          alt=""
          width={360}
          height={360}
          className="absolute"
        />

        <Link onClick={() => setMenuOpen(false)} href={"/"}>
          <Image
            src="/images/header/ksons-logo-white.png"
            alt=""
            width={230}
            height={0}
            className="relative z-10 mb-8 mt-12"
          />
        </Link>
        <div className="flex gap-4 z-10">
          <SocialIcons links={socialLinks} />
        </div>

        <Image
          src="/images/header/header-design.png"
          alt=""
          width={500}
          height={0}
          className="absolute bottom-0 left-0 w-full"
        />
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/2 flex flex-col h-screen">
        <Image
          src="/images/header/right-overlay.png"
          alt="Header right overlay"
          height={200}
          width={200}
          className="absolute h-full w-full -z-1"
        />

        {/* TOP BAR (fixed) */}
        <div className="flex justify-between lg:justify-end px-6 lg:px-16 pt-6 lg:pt-12 pb-4 lg:pb-6 shrink-0 z-1">
          <Image
            src="/images/header/ksons-logo-white.png"
            alt=""
            width={100}
            height={50}
            className="block lg:hidden"
          />
          <div
            onClick={() => setMenuOpen(false)}
            className="group cursor-pointer w-10 h-10 relative transition-transform duration-300 hover:scale-102"
          >
            <span className="absolute w-6 lg:w-8 h-[2px] bg-white rotate-45 top-1/2 transition-all duration-300 group-hover:bg-white/80 group-hover:shadow-[0_0_1px_rgba(255,255,255,0.9)]" />
            <span className="absolute w-6 lg:w-8 h-[2px] bg-white -rotate-45 top-1/2 transition-all duration-300 group-hover:bg-white/80 group-hover:shadow-[0_0_1px_rgba(255,255,255,0.9)]" />
          </div>
        </div>

        {/* 🔥 THIS IS THE REAL SCROLL AREA */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-8 lg:px-16 pb-6 lg:pb-12 custom-scrollbar mt-4 lg:mt-0"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div
            className={`flex flex-col gap-8 lg:gap-10 text-white lg:pt-0 pt-14 ${agency.className}`}
          >
            {MENU_ITEMS.map((item, i) => (
              <MenuItem
                key={i}
                item={item}
                onClick={() => setMenuOpen(false)}
              />
            ))}
          </div>
          {/* mob icons */}
          <div className="md:hidden flex gap-5 py-10 ">
            <SocialIcons links={socialLinks} />
          </div>

          {/* bottom spacing + design */}
          <div className="mt-0 lg:mt-20 flex justify-end">
            {/* <div className="w-4 h-4 bg-cyan-400 rotate-45" /> */}
            <Image
              src="/images/header/bottom-triangle.png"
              alt=""
              height={42}
              width={42}
              className=""
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div key="global-header-root">
      {header}
      {menuOverlay}
    </div>,
    portalRoot,
  );
}
