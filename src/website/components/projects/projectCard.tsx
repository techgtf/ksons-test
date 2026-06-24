"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useRef } from "react";

import { Project } from "./projects";
import { agency, blauerNue } from "@/src/app/fonts";
import CommonBtn from "../common/CommonBtn";
import { TriangleImg } from "@/src/website/components/common/VectorImages";
import Link from "next/link";
import WaterMark from "../common/WaterMark";
import { getDisplayLabel } from "../../utils/getDisplayLabel";

export default function ProjectCard({
  project,
}: {
  project: Project & { categorySlug?: string };
}) {
  const params = useParams();
  const category = project.categorySlug || params.projects;

  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const MotionLink = motion(Link);

  return (
    <MotionLink
      href={`/${category}/${project.slug}`}
      key={project.id}
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover="hover"
      className="project-card block lg:flex justify-between gap-10 rounded-[10px] lg:rounded-0 overflow-hidden lg:even:flex-row-reverse lg:not-last:mb-16 mb-8"
    >
      {/* Image Side */}
      <motion.div
        ref={imageRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="img-side lg:w-[65%] lg:rounded-[15px] overflow-hidden relative"
      >
        {/* Reveal Layer */}
        <motion.div
          variants={{
            hidden: { scaleY: 1 },
            visible: { scaleY: 0 },
          }}
          transition={{
            duration: 1,
            ease: [0.77, 0, 0.175, 1],
          }}
          className="absolute inset-0 bg-white origin-top z-10"
        />

        {/* Image */}
        <motion.img
          src={project.featured_img || project.desktop_file}
          alt={project.title}
          variants={{
            hidden: {
              scale: 1.15,
              opacity: 0,
            },
            visible: {
              scale: 1,
              opacity: 1,
            },
          }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            scale: 1.03,
          }}
          className="project-card__img w-full lg:h-full h-[250px] object-cover"
        />
        <div className="absolute right-5 bottom-5">
          <WaterMark
            textColor="text-black"
            opacity="opacity-100"
            label={getDisplayLabel(project.featuredLabel || "")}
          />
        </div>
      </motion.div>

      {/* Content Side */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.7,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="lg:w-[35%] bg-white lg:rounded-[15px] grid items-center"
      >
        <div className="project-card__info relative lg:p-10 p-6">
          <motion.div
            initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="absolute right-5 lg:right-12 top-10 lg:top-7"
          >
            <TriangleImg />
          </motion.div>

          <div className="card-meta grid lg:gap-4 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className={`${agency.className} builder-name flex items-center gap-2 text-[#0F3C78] text-[15px]`}
            >
              <Image
                src={"/images/about/about-bullet.png"}
                alt="bullet"
                height={16}
                width={16}
              />
              K.sons
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`${agency.className} text-[22px] lg:text-[28px] leading-none text-[#0F3C78] capitalize`}
            >
              {project.title}
            </motion.h2>

            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className={`${blauerNue.className} text-[15px] card-location text-[#0F3C78] font-light tracking-[0.5px] lg:leading-[24px]`}
            >
              {project.location}
            </motion.span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-y-1 capitalize justify-between my-5 py-5 border-y border-[#0F3C78]/10"
          >
            <div className="flex">
              <Image
                src={"/images/icons/status.svg"}
                alt="icon"
                height={18}
                width={18}
              />
              <span
                className={`${agency.className} ml-2 text-[#0F3C78] text-[14px] lg:leading-[24px] tracking-[0.5px] capitalize`}
              >
                {project.status}
              </span>
            </div>
            {project.typology && (
              <div className="flex">
                <Image
                  src={"/images/icons/area.svg"}
                  alt="icon"
                  height={18}
                  width={18}
                />
                <span
                  className={`${agency.className} ml-2 text-[#0F3C78] text-[14px] lg:leading-[24px] tracking-[0.5px] capitalize`}
                >
                  {project.typology}
                </span>
              </div>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className={`${blauerNue.className} card-desc text-[#0F3C78] tracking-[0.5px] lg:leading-[24px] font-light text-base line-clamp-4 ${project.description.split(" ")?.length < 10 ? "break-all" : ""}`}
          >
            {project.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card-footer pt-9.5"
          >
            <button className="relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3 font-light transition-all duration-300 bg-[linear-gradient(180deg,#33d3ee_0%,#0f3c78_100%)] text-white shadow-[0_2px_2px_0_rgba(0,0,0,0.2)] ">
              <p
                className={`relative flex items-center gap-2.5 px-1 justify-center overflow-hidden capitalize font-light ${blauerNue.className} tracking-[0.5px]`}
              >
                <span className="relative block whitespace-nowrap overflow-hidden h-[1.5em]">
                  <span className="btn-text block">Explore Project</span>
                  <span className="btn-text clone absolute left-0 top-0 block">
                    Explore Project
                  </span>
                </span>
                <span className="flex items-center icon-scale">
                  <Image
                    alt="arrow"
                    src={"/images/icons/arrow-up.svg"}
                    width={12}
                    height={14}
                  />
                </span>
              </p>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </MotionLink>
  );
}

// "use client";
// import React, { useRef } from "react";
// import { Project } from "./projects";
// import Link from "next/link";
// import Image from "next/image";
// import { agency, blauerNue } from "@/src/app/fonts";
// import CommonBtn from "../common/CommonBtn";
// import { useParams } from "next/navigation";
// import { TriangleImg } from "@/src/website/components/common/VectorImages";
// import { useSlideY } from "../../hooks/useSlideY";

// export default function ProjectCard({ project }: { project: Project }) {
//   const params = useParams();
//   const category = params.projects;
//   const cardRef = useRef<HTMLDivElement | null>(null);
//   const contentRef = useRef<HTMLDivElement | null>(null);
//   const imageRef = useRef<HTMLDivElement | null>(null);

//   return (
//     <div
//       key={project.id}
//       ref={cardRef}
//       className={`project-card lg:flex justify-between gap-10 rounded-[10px] lg:rounded-0 overflow-hidden lg:even:flex-row-reverse lg:not-last:mb-16 mb-8`}
//     >
//       <div
//         ref={imageRef}
//         className="img-side lg:w-[65%] lg:rounded-[15px] lg:overflow-hidden"
//       >
//         {/* <Image
//                     src={project.featured_img || project.desktop_file}
//                     alt={project.title}
//                     width={800}
//                     height={800}
//                     className="project-card__img w-full h-full object-cover"
//                 /> */}
//         <img
//           src={project.featured_img || project.desktop_file}
//           alt={project.title}
//           className="project-card__img w-full h-full object-cover"
//         />
//       </div>
//       <div
//         ref={contentRef}
//         className="lg:w-[35%] bg-white lg:rounded-[15px] grid items-center"
//       >
//         <div className="project-card__info relative lg:p-10 p-6">
//           <div className="absolute right-5 lg:right-12 top-10 lg:top-7">
//             <TriangleImg />
//           </div>
//           <div className="card-meta grid lg:gap-4 gap-3">
//             <div
//               className={`${agency.className} builder-name flex items-center gap-2 text-[#0F3C78] text-[15px]`}
//             >
//               <Image
//                 src={"/images/about/about-bullet.png"}
//                 alt="bullet"
//                 height={16}
//                 width={16}
//               />
//               K.sons
//             </div>
//             <h2
//               className={`${agency.className} text-[22px] lg:text-[28px] text-[#0F3C78] capitalize`}
//             >
//               {project.title}
//             </h2>
//             <span
//               className={`${blauerNue.className} text-[15px] card-location text-[#0F3C78] font-light tracking-[0.5px] lg:leading-[24px]`}
//             >
//               {project.location}
//             </span>
//           </div>
//           <div className="flex flex-wrap gap-y-1 capitalize justify-between my-5 py-5 border-y border-[#0F3C78]/10">
//             <div className="flex">
//               <Image
//                 src={"/images/icons/status.svg"}
//                 alt="icon"
//                 height={18}
//                 width={18}
//               />
//               <span
//                 className={`${agency.className} ml-2 text-[#0F3C78] text-[14px] lg:leading-[24px] tracking-[0.5px] capitalize`}
//               >
//                 {project.status}
//               </span>
//             </div>
//             {project.typology && (
//               <div className="flex">
//                 <Image
//                   src={"/images/icons/area.svg"}
//                   alt="icon"
//                   height={18}
//                   width={18}
//                 />
//                 <span
//                   className={`${agency.className} ml-2 text-[#0F3C78] text-[14px] lg:leading-[24px] tracking-[0.5px] uppercase`}
//                 >
//                   {project.typology}
//                 </span>
//               </div>
//             )}
//           </div>
//           <p
//             className={`${blauerNue.className} card-desc text-[#0F3C78] tracking-[0.5px] lg:leading-[24px] font-light text-base`}
//           >
//             {project.description.length > 165
//               ? `${project.description.substring(0, 165)}...`
//               : project.description}
//           </p>
//           <div className="card-footer pt-9.5">
//             <CommonBtn
//               href={`/${category}/${project.slug}`}
//               variant="gradient"
//               rightIcon={
//                 <Image
//                   src={"/images/icons/arrow-up.svg"}
//                   alt="arrow"
//                   width={16}
//                   height={16}
//                 />
//               }
//             >
//               Explore Project
//             </CommonBtn>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
