"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { agency, blauerNue } from "@/src/app/fonts";
import { createPortal } from "react-dom";
import { lenisInstance } from "../SmoothScroller";
import { validateModalForm } from "../../hooks/formValidators";
import { useEnquiry } from "../../hooks/useEnquiry";
import StatusModal from "./StatusModal";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Errors = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  authorize?: string;
};

const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { submitEnquiry, loading } = useEnquiry();
  const lenis = lenisInstance;

  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    authorize: true,
  });

  const [errors, setErrors] = useState<Errors>({});

  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }

    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [isOpen]);

  const validateForm = () => {
    const mappedData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    };

    const newErrors = validateModalForm(mappedData);

    const finalErrors: Errors = {
      name: newErrors.name,
      email: newErrors.email,
      phone: newErrors.phone,
      message: newErrors.message,
    };

    setErrors(finalErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    let updatedValue = value;

    if (name === "name") {
      updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    const val =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : updatedValue;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) return;

    try {
      const response = await submitEnquiry({
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        message: formData.message,
      });

      onClose();

      setModal({
        open: true,
        type: "success",
        message: response.message.trim(),
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        authorize: true,
      });

      setErrors({});
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong",
      });
    }
  };

  if (!mounted) return null;

  const portalRoot = document.getElementById("global-ui-root");

  if (!portalRoot) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-[550px] overflow-hidden rounded-lg shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <Image
                  src="/images/header/ksons-logo.png"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="object-contain"
                />

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="p-8 space-y-2 2xl:space-y-6"
              >
                <div className="space-y-4 2xl:space-y-6">
                  {/* Name */}
                  <div className="relative">
                    <label
                      className={`${agency.className} block text-[#0F3C78] text-sm uppercase tracking-wider mb-1`}
                    >
                      Full Name*
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full border-b ${errors.name
                        ? "border-red-500"
                        : "border-gray-200"
                        } focus:border-[#0F3C78] outline-none 2xl:py-1.5 py-0.5 text-[#0F3C78] transition-colors ${blauerNue.className} text-lg`}
                    />

                    {errors.name && (
                      <p
                        className={`text-red-500 text-xs mt-1 ${blauerNue.className}`}
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label
                      className={`${agency.className} block text-[#0F3C78] text-sm uppercase tracking-wider mb-1`}
                    >
                      Email Address*
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full border-b ${errors.email
                        ? "border-red-500"
                        : "border-gray-200"
                        } focus:border-[#0F3C78] outline-none 2xl:py-2 py-0 text-[#0F3C78] transition-colors ${blauerNue.className} text-lg`}
                    />

                    {errors.email && (
                      <p
                        className={`text-red-500 text-xs mt-1 ${blauerNue.className}`}
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <label
                      className={`${agency.className} block text-[#0F3C78] text-sm uppercase tracking-wider mb-1`}
                    >
                      Contact No.*
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full border-b ${errors.phone
                        ? "border-red-500"
                        : "border-gray-200"
                        } focus:border-[#0F3C78] outline-none 2xl:py-1.5 py-0.5 text-[#0F3C78] transition-colors ${blauerNue.className} text-lg`}
                    />

                    {errors.phone && (
                      <p
                        className={`text-red-500 text-xs mt-1 ${blauerNue.className}`}
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <label
                      className={`${agency.className} block text-[#0F3C78] text-sm uppercase tracking-wider mb-1`}
                    >
                      Message*
                    </label>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={2}
                      className={`w-full border-b ${errors.message
                        ? "border-red-500"
                        : "border-gray-200"
                        } focus:border-[#0F3C78] outline-none 2xl:py-1.5 py-0.5 text-[#0F3C78] transition-colors resize-none ${blauerNue.className} text-lg`}
                    />

                    {errors.message && (
                      <p
                        className={`text-red-500 text-xs mt-1 ${blauerNue.className}`}
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Checkbox */}
                <div className="py-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="authorize"
                      id="authorize"
                      checked={formData.authorize}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 accent-[#0F3C78] cursor-pointer"
                    />

                    <label
                      htmlFor="authorize"
                      className={`text-[13px] text-gray-600 leading-tight ${blauerNue.className}`}
                    >
                      I authorize K.sons Developers and its
                      representatives to contact me with updates and
                      notifications via Email, SMS, Whatsapp and Call.
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-fit bg-[#0F3C78] text-white px-6 py-3 tracking-[1px] text-[16px] hover:bg-[#0c3162] transition-all duration-300 ${agency.className} uppercase rounded-full shadow-md hover:shadow-lg font-light disabled:opacity-60`}
                >
                  {loading ? "Submitting..." : "Submit Now"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Status Modal */}
      <StatusModal
        isOpen={modal.open}
        onClose={() =>
          setModal((prev) => ({
            ...prev,
            open: false,
          }))
        }
        type={modal.type}
        title={
          modal.type === "success"
            ? "Enquiry Submitted"
            : "Submission Failed"
        }
        message={modal.message}
      />
    </>,
    portalRoot,
  );
};

export default EnquiryModal;