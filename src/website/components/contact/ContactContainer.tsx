"use client";
import React from "react";
import ContactDetails from "./ContactDetails";
import ContactForm from "./ContactForm";

export interface ContactContainerProps {
  heading: string;
}

export default function ContactContainer({ heading }: ContactContainerProps) {
  return (
    <div data-cursor="light" className="wrapper">
      <ContactDetails />
      <ContactForm heading={heading} />
    </div>
  );
}
