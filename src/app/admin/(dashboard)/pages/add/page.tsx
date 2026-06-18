"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getSectionConfig } from "@/src/admin/config/adminConfig";
import DynamicForm from "@/src/admin/components/shared/DynamicForm/DynamicForm";
import { useCrud } from "@/src/admin/hooks/useCrud";

export default function PageAddPage() {
  const router = useRouter();
  const slug = "pages";

  const config = getSectionConfig(slug);
  const { create } = useCrud(slug);

  const handleSubmit = async (formData: FormData) => {
    try {
      await create(formData);
      toast.success(`${config.title} created successfully!`);
      router.push(`/admin/${slug}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create record");
    }
  };

  return (
    <div className="bg-[#f7f8fc] p-6 lg:p-10">
      <DynamicForm
        title={config.title}
        mode="create"
        fields={config.fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
