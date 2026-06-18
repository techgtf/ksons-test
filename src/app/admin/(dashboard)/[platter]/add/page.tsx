// app/admin/(dashboard)/[platter]/add/page.tsx

"use client";

import { useMemo } from "react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { HiOutlineEmojiSad } from "react-icons/hi";
import {
  getSectionConfig,
  ADMIN_SECTION_REGISTRY,
} from "@/src/admin/config/adminConfig";
import DynamicForm from "@/src/admin/components/shared/DynamicForm/DynamicForm";
import { useCrud } from "@/src/admin/hooks/useCrud";

export default function DynamicAddPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.platter as string;

  // ── 404 guard ─────────────────────────────────────────────────────────────
  if (!ADMIN_SECTION_REGISTRY[slug]) {
    return notFound();
  }

  const config = getSectionConfig(slug);
  const { create } = useCrud(slug);

  const initialData = useMemo(() => {
    const data: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }, [searchParams]);

  const handleSubmit = async (formData: FormData) => {
    try {
      await create(formData);
      toast.success(`${config.title} created successfully!`);
      // When redirecting back, preserve query parameters if any (so we go back to filtered list)
      const query = searchParams.toString();
      router.push(`/admin/${slug}${query ? `?${query}` : ""}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error[0]?.message || "Failed to create record");
    }
  };

  return (
    <div className="bg-[#f7f8fc] p-6 rounded-xl">
      <DynamicForm
        title={config.title}
        mode="create"
        initialData={initialData}
        fields={config.fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
