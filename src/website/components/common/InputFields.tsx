import { agency } from "@/src/app/fonts";
import React from "react";

export interface InputFieldsProp {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
}

export default function InputFields({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}: InputFieldsProp) {
  const classes =
    "border-b border-[#0F3C78] w-full outline-0 py-2 text-base lg:text-[18px] form-input text-[#0F3C78]/80 placeholder:text-[#0F3C78]";

  const renderInput = () => {
    switch (type) {
      case "text":
      case "email":
      case "password":
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`${classes}`}
          />
        );
      case "textarea":
        return (
          <textarea
            name={name}
            value={value}
            onChange={
              onChange as React.ChangeEventHandler<HTMLTextAreaElement>
            }
            placeholder={placeholder}
            required={required}
            className={classes}
          />
        );

      default:
        return <input type="text" className={`${classes}`} />;
    }
  };

  return (
    <>
      <label
        htmlFor={name}
        className={`${agency.className} block text-[#0F3C78]/80 tracking-[0.9px] text-base lg:text-[18px] lg:leading-[43px] uppercase`}
      >
        {label}
      </label>
      {renderInput()}
    </>
  );
}
