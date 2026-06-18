//  ================================================= //
//  ============= For Edit Page ===================== //
//  ================================================= //

"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

import { getSectionConfig } from "@/src/admin/config/adminConfig";

import DynamicForm from "@/src/admin/components/shared/DynamicForm/DynamicForm";
import { flattenObject } from "@/src/admin/components/shared/DynamicForm/formTransform";
import { useCrud } from "@/src/admin/hooks/useCrud";
import AdminLoader from "@/src/admin/components/shared/AdminLoader";

export default function PageEditPage() {
  const params = useParams();
  const id = params.slug as string; // Current parameter name is slug
  const slug = "pages";

  const config = getSectionConfig(slug);
  const { selectedRow, fetchDetail, update, isLoadingDetail } = useCrud(slug);

  useEffect(() => {
    if (id && id !== "add") {
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

    // Standard flattening handles nested paths like "title.main" or "seoTags.meta_title"
    // as long as the config field names match the API response structure.
    const data = flattenObject(selectedRow);

    /**
     * GENERIC FALLBACK:
     * If a field defined in the config is not found at the expected path (e.g., config
     * asks for "image" but API returns { files: { image: "..." } }), we look for it
     * in the 'files' container. This makes the admin code reusable across projects
     * with slightly different API response structures.
     */
    config.fields.forEach((field) => {
      const currentVal = data[field.name];
      if (currentVal === undefined || currentVal === null) {
        // Peek inside 'files' for media or other flattened keys
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
