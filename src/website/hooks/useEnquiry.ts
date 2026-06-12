import { BASE_ADMIN } from "@/config";
import { useState } from "react";

export type EnquiryPayload = {
  name: string;
  email: string;
  mobile: string;
  message: string;
  city?: string;
};

type EnquiryResponse = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string | null;
  message: string;
  dateAt: string;
  createdAt: string;
};

type ApiResponse = {
  status: "success" | "error";
  message: string;
  data?: EnquiryResponse;
};

export const useEnquiry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submitEnquiry = async (
    payload: EnquiryPayload,
  ): Promise<ApiResponse> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("email", payload.email);
      formData.append("mobile", payload.mobile);
      formData.append("message", payload.message);

      const response = await fetch(`${BASE_ADMIN}website/enquiry`, {
        method: "POST",
        body: formData,
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error("Something went wrong");
      }

      setSuccess("Enquiry submitted successfully");

      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    submitEnquiry,
    loading,
    error,
    success,
  };
};
