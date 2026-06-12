"use client";
import React, { useRef, useState } from "react";
import InputFields from "../common/InputFields";
import CommonBtn from "../common/CommonBtn";
import { TriangleImg } from "../common/VectorImages";
import MicroHeader from "../projects/micro/MicroHeader";
import { useScrollScale } from "../../hooks/useScrollScale";
import { agency, blauerNue } from "@/src/app/fonts";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    message: "",
    experience: "",
    cv: "",
  });
  const [fileName, setFileName] = useState("No File Chosen");
  useScrollScale(formRef);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFileName(files[0].name);
        setFormData((prev) => ({
          ...prev,
          cv: files[0].name,
        }));
      } else {
        setFileName("No File Chosen");
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div data-cursor="light" className="py-16 lg:pt-30">
      <div className="app-container">
        <MicroHeader
          title="Apply Now"
          description="Take the First Step Toward Your Legacy—Apply Today and Shape Tomorrow."
        />
        <form
          ref={formRef}
          className="flex flex-wrap justify-between px-0 lg:px-50 space-y-12 pt-12 lg:pt-20 relative z-1"
        >
          <div className="lg:w-[48%] w-full">
            <InputFields
              label="First Name*"
              name="fname"
              type="text"
              value={formData.fname}
              onChange={handleChange}
            />
          </div>
          <div className="lg:w-[48%] w-full">
            <InputFields
              label="Last Name*"
              name="lname"
              type="text"
              value={formData.lname}
              onChange={handleChange}
            />
          </div>
          <div className="lg:w-[48%] w-full">
            <InputFields
              label="Email*"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="lg:w-[48%] w-full">
            <InputFields
              label="Phone*"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="lg:w-[48%] w-full">
            <InputFields
              label="Experience*"
              name="experience"
              type="textarea"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>
          <div className="lg:w-[48%] w-full">
            <InputFields
              label="Message*"
              name="message"
              type="textarea"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <div className="flex items-center gap-4">
              <span
                className={`${agency.className} text-[#0F3C78]/80 tracking-[0.9px] text-base lg:text-[18px] lg:leading-[43px]`}
              >
                CV*
              </span>

              <label
                className={`bg-gray-200 ${blauerNue.className} px-4 py-2 text-[#0F3C78] text-[12px] lg:leading-[18px] tracking-[0.6px] cursor-pointer hover:bg-gray-300 text-nowrap`}
              >
                CHOOSE FILE
                <input type="file" className="hidden" onChange={handleChange} />
              </label>

              <span
                className={`${blauerNue.className} text-[#0F3C78] font-light tracking-[0.6px] text-[12px] capitalize lg:leading-[18px] italic truncate`}
              >
                {fileName}
              </span>
            </div>
          </div>
          <div className="flex justify-center mx-auto">
            <CommonBtn variant="gradient">Submit</CommonBtn>
          </div>
          <div className="absolute -z-1 left-0 right-0 flex justify-center lg:bottom-44 bottom-70">
            <TriangleImg size={"w-70"} />
          </div>
        </form>
      </div>
    </div>
  );
}
