import Link from "next/link";
import { agency } from "@/src/app/fonts";
import { LocationIcon2, MailIcon, PhoneIcon } from "../common/SVGIcons";
import { useRef } from "react";
import { useSlideY } from "../../hooks/useSlideY";

export default function ContactDetails({
  phone,
  email,
  address,
}: {
  phone: string[] | string;
  email: string[] | string;
  address: string;
}) {
  const contentWrapper = useRef<HTMLDivElement | null>(null);
  useSlideY({ target: contentWrapper });
  return (
    <div
      className="py-20"
      style={{
        background:
          "radial-gradient(353.34% 207.4% at 108.26% 213.54%, #2FD2ED 0%, #0A3168 100%)",
      }}
    >
      <div
        ref={contentWrapper}
        className="lg:flex justify-center items-start lg:items-center lg:space-y-0 space-y-6 text-white"
      >
        <div className="phone px-4 lg:px-10 flex-1">
          {Array.isArray(phone) ? (
            phone?.map((ph, i) => (
              <Link
                key={i}
                href={`tel:${ph}`}
                className={`${agency.className} lg:text-[18px] lg:leading-[43px] flex items-center md:justify-center lg:gap-6.5 gap-4`}
              >
                <span className="border rounded-full min-h-9 min-w-9 flex items-center justify-center">
                  <PhoneIcon color="#fff" />
                </span>{" "}
                <span className="opacity-80">+91-{ph}</span>
              </Link>
            ))
          ) : (
            <Link
              href={`tel:${phone}`}
              className={`${agency.className} lg:text-[18px] lg:leading-[43px] flex items-center md:justify-center lg:gap-6.5 gap-4`}
            >
              <span className="border rounded-full min-h-9 min-w-9 flex items-center justify-center">
                <PhoneIcon color="#fff" />
              </span>{" "}
              <span className="opacity-80">+91-{phone}</span>
            </Link>
          )}
        </div>
        <span className="w-px h-[125px] bg-line lg:block hidden"></span>
        <div className="mail px-4 lg:px-10 flex-1">
          {Array.isArray(email) ? (
            email?.map((em, i) => (
              <Link
                key={i}
                href={`mailto:${em}`}
                className={`${agency.className} lg:text-[18px] lg:leading-[43px]  flex md:justify-center items-center gap-4 uppercase`}
              >
                <span className="border rounded-full min-h-9 min-w-9 flex items-center justify-center">
                  <MailIcon color="#fff" />
                </span>{" "}
                <span className="opacity-80">{em}</span>
              </Link>
            ))
          ) : (
            <Link
              href={`mailto:${email}`}
              className={`${agency.className} lg:text-[18px] lg:leading-[43px]  flex md:justify-center items-center gap-4 uppercase`}
            >
              <span className="border rounded-full min-h-9 min-w-9 flex items-center justify-center">
                <MailIcon color="#fff" />
              </span>{" "}
              <span className="opacity-80">{email}</span>
            </Link>
          )}
        </div>
        <span className="w-px h-[125px] bg-line lg:block hidden"></span>
        <div className="location px-4 lg:px-10 flex items-start lg:items-center md:justify-center gap-4 flex-1">
          <span className="border rounded-full min-h-9 min-w-9 flex items-center justify-center">
            <LocationIcon2 color="#fff" />
          </span>
          <p
            className={`${agency.className} capitalize lg:text-[18px] lg:leading-[32px] flex items-center gap-4 opacity-80 lg:max-w-[279px]`}
          >
            {address}
          </p>
        </div>
      </div>
    </div>
  );
}
