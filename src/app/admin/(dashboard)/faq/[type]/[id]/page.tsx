"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi";
import DynamicForm from "@/src/admin/components/shared/DynamicForm/DynamicForm";
import DataTable from "@/src/admin/components/shared/DataTable";
import { FAQ_SECTIONS } from "@/src/admin/config/pageSectionFields";
import AdminLoader from "@/src/admin/components/shared/AdminLoader";
import toast from "react-hot-toast";
import { useCrud } from "@/src/admin/hooks/useCrud";

export default function GenericFaqPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const entityName = searchParams.get("title") || "";
  const entityType = params.type as string; // e.g., 'blog'
  const entityId = params.id as string; // e.g., blog ID

  const formRef = useRef<HTMLDivElement>(null);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formResetKey, setFormResetKey] = useState(0);

  const faqConfig = FAQ_SECTIONS.faq;
  const fields = faqConfig.listFields || [];

  const {
    rows: items,
    isLoadingList: isLoading,
    isSubmitting,
    create,
    update,
    remove,
    fetchList,
    pagination,
    setFilters,
    setPage,
    setLimit,
    updateSequence,
  } = useCrud("faq");

  const filterKey = `${entityType}_id`;

  useEffect(() => {
    if (entityType && entityId) {
      setFilters({ [filterKey]: entityId });
    }
  }, [entityType, entityId, filterKey, setFilters]);

  const initialFormData = useMemo(() => {
    if (!editingRow) return {};
    return { ...editingRow };
  }, [editingRow]);

  const handleSubmit = async (formData: FormData) => {
    try {
      formData.append(`${entityType}_id`, entityId);

      if (editingRow) {
        await update(editingRow.id, formData, { redirectTo: null });
        toast.success(`FAQ updated successfully`);
      } else {
        await create(formData, { redirectTo: null });
        toast.success(`FAQ added successfully`);
      }

      setEditingRow(null);
      setFormResetKey((prev) => prev + 1);
      fetchList();
      window.scrollTo({ top: 300, behavior: "smooth" });
    } catch (error: any) {
      toast.error(error.message || `Failed to save FAQ`);
    }
  };

  const handleEdit = (row: any) => {
    setEditingRow(row);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (row: any) => {
    try {
      await remove(String(row.id), { showToast: false });
      toast.success(`FAQ deleted successfully`);
      fetchList();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete FAQ");
    }
  };

  const columns = useMemo(() => {
    // Standard status and sequence fields are automatically handled by DataTable.
    return (
      faqConfig.listColumns || [
        { key: "question", title: "Question", dataKey: "question" },
        { key: "sequence", title: "Sequence", dataKey: "seq" },
        { key: "status", title: "Status", dataKey: "status" },
      ]
    );
  }, [faqConfig.listColumns]);

  return (
    <div className="min-h-[78vh] bg-[#f7f8fc] p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            FAQs for {entityType.charAt(0).toUpperCase() + entityType.slice(1)}{" "}
            - {entityName}
          </h1>
          <p className="text-xs text-gray-500">
            Add and organize frequently asked questions
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <HiOutlineArrowLeft className="text-base" />
          Back
        </button>
      </div>

      {/* Form Section */}
      <div
        ref={formRef}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          {editingRow ? `Edit FAQ` : `Add New FAQ`}
        </h2>
        <DynamicForm
          key={entityType + (editingRow?.id || "new") + formResetKey}
          fields={fields}
          initialData={initialFormData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          mode={editingRow ? "edit" : "create"}
          title="FAQ"
          showHeader={false}
          layout="full"
        />
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">FAQs List</h2>
        {isLoading ? (
          <AdminLoader />
        ) : (
          <DataTable
            data={items}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage={`No FAQs added yet`}
            rowKey={(row) => String(row.id || "")}
            pagination={pagination}
            onPageChange={setPage}
            onLimitChange={setLimit}
            // endpoint="/admin/other-faqs?type=tax-benefitsd"
            onRefresh={fetchList}
            updateSequence={updateSequence}
          />
        )}
      </div>
    </div>
  );
}
