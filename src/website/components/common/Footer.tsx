"use client";

import Image from "next/image";
import Link from "next/link";
import { blauerNue } from "@/src/app/fonts";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useLayoutEffect, useRef } from "react";
import { gsap, registerGSAP, ScrollTrigger } from "../../utils/gsap";
import { useContact } from "../../hooks/useContact";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/website/utils/motion";
import { usePathname } from "next/navigation";
import { OtherPagesLinks, ProjectsLinks } from "../../utils/givePages";
import { SocialMediaLinks } from "../../utils/giveSocialLinks";

gsap.registerPlugin(ScrollTrigger);
type FooterLinkerProps = {
  href: string;
  label: string;
};
/* ================= DATA (EDIT HERE ONLY) ================= */

const socialLinks = SocialMediaLinks;
const projectPages = ProjectsLinks;
const ourProjects = {
  title: "quick links",
  links: projectPages,
};

const quickLinks = {
  title: "other Links",
  links: OtherPagesLinks,
};

const FooterLinker = ({ href, label }: FooterLinkerProps) => {
  return (
    <>
      <li className="even:text-right md:even:text-left">
        <Link href={href} className="hover:opacity-80 transition capitalize">
          {label}
        </Link>
      </li>
    </>
  );
};

export default function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);
  const footerLogoSide = useRef<HTMLDivElement | null>(null);
  const footerSocSide = useRef<HTMLDivElement | null>(null);
  const builderRef = useRef<HTMLDivElement | null>(null);
  const quickLinksRef = useRef<HTMLDivElement | null>(null);
  const ourProjectsRef = useRef<HTMLUListElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  const { contact } = useContact();
  const pathname = usePathname();

  // useSlideX({ target: footerRef })

  return (
    <motion.footer
      ref={footerRef}
      key={pathname}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="w-full text-white bg-gradient-to-r from-[#0F3C78] to-[#2A86A6] pt-12 pb-6 px-6 md:px-16 overflow-x-hidden"
    >
      {/* TOP SECTION */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-10 mb-12 md:mb-16"
      >
        {/* LEFT */}
        <div
          ref={footerLogoSide}
          className="max-w-sm mx-auto md:mx-0 text-center md:text-left"
        >
          <Link href={"/"}>
            <Image
              src="/images/footer/footer-logo.webp"
              alt="K.sons"
              width={160}
              height={50}
              className="mb-4 mx-auto md:mx-0 footer-logo"
            />
          </Link>

          {/* SOCIAL */}
          <div
            ref={footerSocSide}
            className="flex gap-4 justify-center md:justify-start"
          >
            {socialLinks.map((item, i) => (
              <Link
                key={i}
                href={item.link}
                target="_blank"
                className="w-8 h-8 flex items-center justify-center border-2 border-white rounded-full social-item hover:bg-white transition-all duration-300 hover:scale-110 group"
              >
                <Image
                  src={item.icon}
                  alt="social"
                  width={16}
                  height={16}
                  className="group-hover:invert transition-all duration-300"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT TEXT */}
        <div
          ref={builderRef}
          className={`${blauerNue.className} footer-desc max-w-xl text-base md:text-lg font-normal leading-6 md:leading-7 tracking-[0.5px] text-center md:text-left`}
        >
          At K.sons, every development is a deliberate step toward enduring
          excellence. With foresight, discipline, and responsibility at our
          core, we craft spaces where heritage, progress, and community coexist
          in perfect harmony.
        </div>
      </motion.div>

      {/* LINKS */}
      <motion.div
        className={`lg:flex justify-between space-y-10 lg:space-y- mb-12 md:mb-16 text-sm border-t border-white/20 pt-14 ${blauerNue.className}`}
      >
        <motion.div variants={fadeUp} className={`footer-col lg:w-[30%]`}>
          <h3 className="mb-7.5 uppercase tracking-wider underline text-base font-semibold">
            {ourProjects.title}
          </h3>

          <ul
            ref={ourProjectsRef}
            className={`space-y-2 md:space-y-3 font-light text-sm md:text-base lg:block grid grid-cols-2 justify-between`}
          >
            <FooterLinker href="/" label="home" />
            <FooterLinker href="/about" label="about us" />

            {ourProjects.links.map((link, i) => (
              <FooterLinker key={i} href={link.href} label={link.label} />
            ))}
          </ul>
        </motion.div>
        <motion.div
          variants={fadeUp}
          ref={quickLinksRef}
          className={`footer-col lg:w-[50%]`}
        >
          <h3 className="mb-7.5 uppercase tracking-wider underline text-base font-semibold">
            {quickLinks.title}
          </h3>
          <ul className="space-y-2 md:space-y-3 font-light text-sm md:text-base grid grid-cols-2 justify-between">
            {quickLinks.links.map((link, i) => (
              <FooterLinker key={i} href={link.href} label={link.label} />
            ))}
          </ul>
        </motion.div>

        {/* CONTACT */}
        <motion.div
          variants={fadeUp}
          ref={contactRef}
          className="footer-col lg:w-[23%]"
        >
          <h3 className="mb-7.5 uppercase tracking-wider underline text-base font-semibold">
            Contact
          </h3>

          <ul className="space-y-3 text-sm md:text-base font-light">
            {/* {contact.phone.map((ph, i) => (
              <li key={i} className="flex items-center footer-link">
                <FaPhoneAlt className="mr-2" />
                <a href={`tel:${ph}`}>{ph}</a>
              </li>
            ))} */}
            {contact.email.map((em, i) => (
              <li key={i} className="flex items-center footer-link">
                <MdEmail className="mr-2" />
                <a href={`mailto:${em}`}>{em}</a>
              </li>
            ))}

            <li className="flex items-start footer-link">
              <FaLocationDot className="mr-2 mt-1" />
              <span>{contact.address}</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* BOTTOM */}
      <div
        className={`${blauerNue.className} footer-bottom border-t border-white/20 pt-6 text-center flex flex-col lg:flex-row items-center justify-between`}
      >
        <p className="text-sm">
          Copyright © {new Date().getFullYear()} K.sons Group.
        </p>

        <p className="text-xs mt-1">
          Developed & Marketed By{" "}
          <a href="https://gtftechnologies.com/" target="_blank">
            GTF Technologies
          </a>
        </p>
      </div>
    </motion.footer>
  );
}
