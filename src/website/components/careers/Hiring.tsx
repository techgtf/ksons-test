import { agency, blauerNue } from "@/src/app/fonts";
import React from "react";
import MicroHeader from "../projects/micro/MicroHeader";
import CommonBtn from "../common/CommonBtn";

const hiringData = [
  {
    title: "Front Desk Executive",
    location: "Doddabanalhalli, Bengaluru.",
    skills: ["Engaging People", "Customer Delight", "Project Management"],
    experience: "+3 Years",
  },
  {
    title: "Front Desk Executive",
    location: "Doddabanalhalli, Bengaluru.",
    skills: ["Engaging People", "Customer Delight", "Project Management"],
    experience: "+3 Years",
  },
  {
    title: "Front Desk Executive",
    location: "Doddabanalhalli, Bengaluru.",
    skills: ["Engaging People", "Customer Delight", "Project Management"],
    experience: "+3 Years",
  },
];

const Hiring = () => {
  return (
    <section data-cursor="light" className="py-16 lg:py-24 bg-[#f1f9fe]">
      <div className="app-container">
        {/* Header */}
        <MicroHeader
          title="Now Hiring"
          description="Your Future Starts Here, Where Innovation and Opportunity Meet."
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 gap-4 mb-16">
          {hiringData.map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-[15px] p-8 lg:p-12 flex flex-col"
            >
              <h3
                className={`${agency.className} lg:text-[24px] text-[#0f3c78] mb-3`}
              >
                {job.title}
              </h3>
              <p
                className={`${blauerNue.className} text-[14px] text-[#0f3c78] tracking-[0.5px] lg:mb-5 mb-4`}
              >
                Location: {job.location}
              </p>

              <div className="border-y border-[#0f3c78]/8 lg:py-5 py-4 lg:mb-7.5 mb-4">
                <h4
                  className={`${agency.className} lg:text-[18px] text-[#0f3c78] lg:mb-[25px] mb-4`}
                >
                  Required Skills:
                </h4>
                <ul className="space-y-4 mb-8">
                  {job.skills.map((skill, sIndex) => (
                    <li
                      key={sIndex}
                      className={`${blauerNue.className} text-base text-[#0f3c78] flex items-center gap-3 font-light tracking-[0.5px]`}
                    >
                      <span className="w-[4px] h-[4px] bg-[#0f3c78] rounded-full shrink-0"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
                <p
                  className={`${blauerNue.className} text-base text-[#0f3c78] tracking-[0.5px] flex items-center lg:gap-4 gap-2`}
                >
                  Required Experience{" "}
                  <span className="text-[14px] tracking-[1px]">
                    {job.experience}
                  </span>
                </p>
              </div>

              <CommonBtn variant="gradient" className="w-fit">
                APPLY NOW
              </CommonBtn>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="text-center">
          <p
            className={`${blauerNue.className} text-[#0f3c78] lg:leading-[24px] tracking-[0.5px]`}
          >
            To apply: mail your resume to{" "}
            <a
              href="mailto:hr@K.sons.com"
              className="hover:underline underline-offset-8"
            >
              hr@K.sons.com
            </a>{" "}
            or Call us on:{" "}
            <a
              href="tel:+919999888844"
              className="hover:underline underline-offset-8"
            >
              +91-9999-8888-44
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hiring;
