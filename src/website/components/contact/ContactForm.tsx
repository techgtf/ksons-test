import React, { useRef, useState } from "react";
import InputFields from "../common/InputFields";
import CommonBtn from "../common/CommonBtn";
import { TriangleImg } from "../common/VectorImages";
import MicroHeader from "../projects/micro/MicroHeader";
import { useScrollScale } from "../../hooks/useScrollScale";
import { useEnquiry } from "../../hooks/useEnquiry";
import StatusModal from "../common/StatusModal";
import { validateContactForm } from "../../hooks/formValidators";
type Props = {
  heading: string;
};

type Errors = {
  fname?: string;
  lname?: string;
  email?: string;
  phone?: string;
  message?: string;
};

export default function ContactForm({ heading }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  useScrollScale(formRef);

  const { submitEnquiry, loading, error, success } = useEnquiry();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "fname" || name === "lname") {
      updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = validateContactForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // commit
    // console.log("Submitting form with data:", formData);

    const isValid = validateForm();

    if (!isValid) return;

    try {
      const response = await submitEnquiry({
        name: `${formData.fname} ${formData.lname}`,
        email: formData.email,
        mobile: formData.phone,
        message: formData.message,
      });
      setModal({
        open: true,
        type: "success",
        // make first latter upperCase
        message:
          response.message.trim().charAt(0).toUpperCase() +
          response.message.trim().slice(1),
      });
      setFormData({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        message: "",
      });

      setErrors({});
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  return (
    <div className="py-16 lg:pt-30">
      <div className="app-container">
        <MicroHeader title="Enquire Now" description={heading} />
        <form
          ref={formRef}
          onSubmit={handleSubmit}
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
            {errors.fname && (
              <p className="text-red-500 text-sm mt-2">{errors.fname}</p>
            )}
          </div>
          <div className="lg:w-[48%] w-full">
            <InputFields
              label="Last Name*"
              name="lname"
              type="text"
              value={formData.lname}
              onChange={handleChange}
            />
            {errors.lname && (
              <p className="text-red-500 text-sm mt-2">{errors.lname}</p>
            )}
          </div>
          <div className="lg:w-[48%] w-full">
            <InputFields
              label="Email*"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </div>
          <div className="lg:w-[48%] w-full">
            <InputFields
              label="Phone*"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
            )}
          </div>
          <div className="w-full">
            <InputFields
              label="Message*"
              name="message"
              type="textarea"
              value={formData.message}
              onChange={handleChange}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-2">{errors.message}</p>
            )}
          </div>
          <div className="flex justify-center mx-auto">
            <CommonBtn variant="gradient" type="submit">
              {loading ? "Submitting..." : "Submit"}
            </CommonBtn>
          </div>
          <div className="absolute -z-1 left-0 right-0 flex justify-center lg:bottom-44 bottom-70">
            <TriangleImg size={"w-70"} />
          </div>
        </form>
      </div>
      <StatusModal
        isOpen={modal.open}
        onClose={() =>
          setModal((prev) => ({
            ...prev,
            open: false,
          }))
        }
        type={modal.type}
        message={modal.message}
      />
    </div>
  );
}
