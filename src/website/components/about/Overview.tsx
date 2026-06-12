"use client";
import { blauerNue } from "@/src/app/fonts";
import Image from "next/image";
import React, { useRef } from "react";
import { useSlideY } from "../../hooks/useSlideY";
type Items = {
  pera: string;
};
export interface OverViewProps {
  descriptions: Items[];
  Icons?: string;
}

export default function Overview({ descriptions, Icons = "" }: OverViewProps) {
  const bottomParaRef = useRef<HTMLDivElement | null>(null);
  const TriangleRef = useRef<HTMLImageElement | null>(null);

  useSlideY({ target: TriangleRef, direction: "up" });

  return (
    <div
      data-cursor="light"
      ref={bottomParaRef}
      className="app-container mt-20! lg:mt-40!"
    >
      <div className="lg:px-68 2xl:px-78 flex items-center justify-center flex-col">
        {descriptions.map((item, i) => (
          <PeraItem text={item.pera} i={i} key={i} />
        ))}
        <Image
          ref={TriangleRef}
          src={Icons}
          alt="icon"
          height={22}
          width={22}
          className="mt-6"
        />
      </div>
    </div>
  );
}

type Pera = {
  text: string;
  i: number;
};

export const PeraItem = ({ text, i }: Pera) => {
  const peraRef = useRef<HTMLParagraphElement | null>(null);

  useSlideY({ target: peraRef, direction: "down" });

  return (
    <p
      ref={peraRef}
      key={i}
      className={`${blauerNue.className} text-[var(--blue)] font-light leading-[24px] tracking-[0.5px]  text-center text-sm lg:text-base`}
    >
      {text}
    </p>
  );
};
