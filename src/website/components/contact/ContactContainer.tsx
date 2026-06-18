"use client";
import ContactDetails from "./ContactDetails";
import ContactForm from "./ContactForm";

export default function ContactContainer({
  contactHeading,
  mainDetails,
}: {
  contactHeading: {
    title: string;
    heading: string;
  };
  mainDetails: {
    email: string[] | string;
    phone: string[] | string;
    address: string;
  };
}) {
  return (
    <div data-cursor="light" className="wrapper">
      <ContactDetails phone={mainDetails.phone} email={mainDetails.email} address={mainDetails.address} />
      <ContactForm
        title={contactHeading.title}
        heading={contactHeading.heading}
      />
    </div>
  );
}
