import CommonBanner, {
  CommonBannerProps,
} from "@/src/website/components/common/CommonBanner";
import ContactContainer, {
  ContactContainerProps,
} from "@/src/website/components/contact/ContactContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact K.Sons Group – Vrindavan & Mathura Real Estate",
  keywords:
    "K.Sons Group contact, real estate queries Vrindavan, Mathura real estate support, residential and commercial projects contact",
  description:
    "Get in touch with K.Sons Group for queries, sales, or support regarding residential and commercial projects in Vrindavan & Mathura.",
  alternates: {
    canonical: "https://ksonsgroup.com/contact",
  },
};

export default function page() {
  const bannerData: CommonBannerProps = {
    tag: "Contact Us",
    heading:
      "Your Journey to a Timeless Future Begins with a Single Step—Let’s Start the Conversation.",
    description:
      "Connecting Visionaries, Building Legacies—We’re Just a Message Away.",
    files: {
      desktop_file: "/images/contact/hero.webp",
      mobile_file: "/images/contact/hero.webp",
    },
    headingArea: "lg:w-[800px] 2xl:w-[850px]",
  };
  const contactFormHeading: ContactContainerProps = {
    heading:
      "Unlock Your Future with One Simple Question—We’re Here to Guide You.",
  };

  return (
    <div className="contact-us-page">
      <CommonBanner {...bannerData} />
      <ContactContainer {...contactFormHeading} />
    </div>
  );
}
