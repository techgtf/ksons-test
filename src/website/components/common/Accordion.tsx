"use client";

import { useState, useRef, useEffect } from "react";
import { blauerNue, agency } from "@/src/app/fonts";
import { FiChevronDown } from "react-icons/fi";

export type AccordionItem = {
  question: string;
  answer: string;
};

type AccordionProps = {
  showQuestionPrefix?: boolean;
  showAnswerPrefix?: boolean;
  limit?: number;
  accordionData?: AccordionItem[];
};

export default function Accordion({
  showQuestionPrefix = true,
  showAnswerPrefix = true,
  limit,
  accordionData,
}: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!accordionData) return null;

  return (
    <div
      ref={containerRef}
      className={`will-change-transform space-y-8 lg:space-y-[48px]`}
    >
      {accordionData.map((item, index) => {
        const isOpen = activeIndex === index;

        return (
          <Card
            key={index}
            item={item}
            index={index}
            showQuestionPrefix={showQuestionPrefix}
            toggle={toggle}
            isOpen={isOpen}
            showAnswerPrefix={showAnswerPrefix}
          />
        );
      })}
    </div>
  );
}

const Card = ({
  item,
  index,
  showQuestionPrefix,
  toggle,
  isOpen,
  showAnswerPrefix,
}: any) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={cardRef}
      key={index}
      className="rounded-[15px] p-7 lg:p-10 transition-all duration-300 light-gradient-bg"
    >
      {/* HEADER */}
      <button
        onClick={() => toggle(index)}
        className="w-full flex justify-between items-start text-left"
      >
        <h3
          className={`${agency.className} text-[#0F3C78] text-base lg:text-[20px] leading-[24px] lg:leading-[32px] pr-3 lg:pr-6 flex items-start justify-center gap-2`}
        >
          {showQuestionPrefix && (
            <span className="mr-2 lg:mr-5">Q{index + 1}:</span>
          )}
          {item.question}
        </h3>

        <FiChevronDown
          className={`text-[#0F3C78] text-xl transition-transform duration-300 min-w-5 lg:min-w-7 min-h-5 lg:min-h-7 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DIVIDER */}
      <div
        className={`grid transition-all duration-300 ${
          isOpen
            ? "grid-rows-[1fr] mt-5 lg:mt-8 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-200 pt-5 lg:pt-8">
            <p
              className={`${blauerNue.className} flex items-start justify-start text-[#0F3C78] font-light text-sm lg:text-base tracking-[0.5px] leading-[20px] lg:leading-[25px]`}
            >
              {showAnswerPrefix && (
                <span className="font-semibold mr-2 lg:mr-2.5">Ans:</span>
              )}
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
