import React from "react";
import api from "@/src/admin/lib/axios";

interface Props {
  rowId: string;
  status: unknown;
  endpoint: string;
  onRefresh: () => void;
  fieldName?: string; // The key to send to the backend (e.g. "status" or "feature")
}

export function StatusToggleCell({
  rowId,
  status,
  endpoint,
  onRefresh,
  fieldName = "status",
}: Props) {
  const isActive = status === true || status === "true" || status === 1;

  const handleToggle = async () => {
    try {
      const path = endpoint.includes(rowId) ? endpoint : `${endpoint}/${rowId}`;
      await api.patch(path, { [fieldName]: !isActive });
      onRefresh();
    } catch (error) {
      console.error(`Failed to update ${fieldName}`, error);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
        isActive ? "bg-blue-900" : "bg-gray-300"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isActive ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
