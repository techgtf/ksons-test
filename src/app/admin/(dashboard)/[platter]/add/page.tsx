// app/admin/(dashboard)/[platter]/add/page.tsx

"use client";

import { useMemo } from "react";
import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
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
      const query = searchParams.toString();
      await create(formData, {
        redirectTo: `/admin/${slug}${query ? `?${query}` : ""}`,
      });
      toast.success(`${config.title} created successfully!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create record................");
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
