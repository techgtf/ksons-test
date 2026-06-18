"use client";

import { useEffect, useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import toast from "react-hot-toast";

import {
  getSectionConfig,
  ADMIN_SECTION_REGISTRY,
} from "@/src/admin/config/adminConfig";
import { flattenObject } from "@/src/admin/components/shared/DynamicForm/formTransform";

import DynamicForm from "@/src/admin/components/shared/DynamicForm/DynamicForm";

import { useCrud } from "@/src/admin/hooks/useCrud";
import AdminLoader from "@/src/admin/components/shared/AdminLoader";

export default function DynamicEditPage() {
  const params = useParams();

  const slug = params.platter as string;
  const id = params.id as string;

  if (!ADMIN_SECTION_REGISTRY[slug]) {
    return notFound();
  }

  const config = getSectionConfig(slug);

  const { selectedRow, fetchDetail, update, isLoadingDetail } = useCrud(slug);

  // fetch record
  useEffect(() => {
    if (id) {
      fetchDetail(id);
    }
  }, [id, fetchDetail]);

  const handleSubmit = async (formData: FormData) => {
    try {
      await update(id, formData);
      toast.success(`${config.title} updated successfully!`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update record");
    }
  };

  const mappedData = useMemo(() => {
    if (!selectedRow) return {};

    const data = flattenObject(selectedRow);

    // Generic fallback for media or missing keys
    config.fields.forEach((field) => {
      if (data[field.name] === undefined || data[field.name] === null) {
        if (selectedRow.files && typeof selectedRow.files === "object") {
          const fallbackVal = (selectedRow.files as any)[field.name];
          if (fallbackVal) {
            data[field.name] = fallbackVal;
          }
        }
      }
    });

    return data;
  }, [selectedRow, config.fields]);

  if (isLoadingDetail) {
    return <AdminLoader />;
  }

  return (
    <div className="bg-[#f7f8fc] p-6 lg:p-10">
      <DynamicForm
        title={config.title}
        mode="edit"
        initialData={mappedData}
        fields={config.fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
