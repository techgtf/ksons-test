"use client";

import SelectRows from "@/src/admin/components/shared/SelectRows";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import api from "@/src/admin/lib/axios";
import DynamicForm from "@/src/admin/components/shared/DynamicForm/DynamicForm";
import DataTable from "@/src/admin/components/shared/DataTable";
import {
  DEFAULT_PAGE_SECTION_FIELDS,
  PAGE_SECTION_FIELDS,
  PAGE_SECTION_REGISTRY,
  PAGE_SECTION_LAYOUTS,
} from "@/src/admin/config/pagesConfig";
import AdminLoader from "@/src/admin/components/shared/AdminLoader";
import toast from "react-hot-toast";
import { useCrud } from "@/src/admin/hooks/useCrud";

export default function PageSectionsPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.slug; // The page database ID
  const formRef = useRef<HTMLDivElement>(null);

  const [pageData, setPageData] = useState<any>(null);

  const sectionTypes = useMemo(() => {
    if (!pageData?.slug) return [];
    return PAGE_SECTION_REGISTRY[pageData.slug] || [];
  }, [pageData?.slug]);

  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedSectionType, setSelectedSectionType] = useState<string>("");
  const [editingRow, setEditingRow] = useState<any>(null);

  const {
    rows: pageSections,
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
  } = useCrud("pageSections");

  const FetchPageDetails = async () => {
    try {
      const res = await api.get(`/admin/pages/${pageId}`);
      const data = res.data?.data || null;
      setPageData(data);
    } catch (error) {
      console.error("Failed to fetch page details", error);
    }
  };

  useEffect(() => {
    if (pageId) {
      FetchPageDetails();
    }
  }, [pageId]);

  useEffect(() => {
    if (pageData?.slug) {
      setFilters({ slug: pageData.slug });
    }
  }, [pageData?.slug]);

  const filteredSectionOptions = useMemo(() => {
    const existingTypes = pageSections.map((ps) => ps.type);

    return sectionTypes
      .filter(
        (s) =>
          !existingTypes.includes(s.type) ||
          (editingRow && s.type === editingRow.type),
      )
      .map((s) => ({
        value: s.id,
        label: s.name,
      }));
  }, [sectionTypes, pageSections, editingRow]);

  const handleSectionChange = (val: string) => {
    setSelectedSectionId(val);
    const type = sectionTypes.find((s) => s.id === val)?.type || "";
    setSelectedSectionType(type);
  };

  const currentFields = useMemo(() => {
    const commonFields = DEFAULT_PAGE_SECTION_FIELDS.fields || [];
    const specificFields = PAGE_SECTION_FIELDS[selectedSectionType] || [];

    const sectionConfig = sectionTypes.find(
      (s) => s.type === selectedSectionType,
    );
    if (sectionConfig?.excludeDefaultFields) {
      return specificFields;
    }

    return [...commonFields, ...specificFields];
  }, [selectedSectionType, sectionTypes]);

  const initialFormData = useMemo(() => {
    if (!editingRow) return {};
    const data = { ...editingRow };

    if (Array.isArray(editingRow.title)) {
      editingRow.title.forEach((item: any, index: number) => {
        Object.keys(item).forEach((key) => {
          data[`title[${index}][${key}]`] = item[key];
        });
      });
    }

    if (editingRow.files && typeof editingRow.files === "object") {
      Object.keys(editingRow.files).forEach((key) => {
        if (editingRow.files[key]) {
          data[key] = editingRow.files[key];
        }
      });
    }
    return data;
  }, [editingRow]);

  const handleSubmit = async (formData: FormData) => {
    if (!pageData?.slug) {
      toast.error("Page slug not found. Cannot add section.");
      return;
    }

    try {
      formData.append("pageSlug", pageData.slug);
      formData.append("type", selectedSectionType);

      if (editingRow) {
        await update(editingRow.id, formData, { redirectTo: null });
      } else {
        await create(formData, { redirectTo: null });
      }

      toast.success(
        editingRow
          ? "Section updated successfully"
          : "Section added successfully",
      );

      setEditingRow(null);
      setSelectedSectionId("");
      setSelectedSectionType("");
      fetchList();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleEdit = async (row: any) => {
    try {
      // Direct Axios fetch matches detail retrieval of specific section
      const res = await api.get(`/admin/page-sections/${row.id}`);
      const data = res.data?.data;
      setEditingRow(data);

      const matchedSection = sectionTypes.find((s) => s.type === data.type);
      if (matchedSection) {
        setSelectedSectionId(String(matchedSection.id));
        setSelectedSectionType(matchedSection.type);
      }

      formRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load section details");
    }
  };

  const handleDelete = async (row: any) => {
    try {
      await remove(String(row.id), { showToast: false });
      toast.success("Section deleted successfully");
      fetchList();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete section");
    }
  };

  const columns = useMemo(() => {
    return DEFAULT_PAGE_SECTION_FIELDS.listColumns.map((col) => {
      if (col.key === "more_details") {
        return {
          ...col,
          linkTemplate: `/admin/pages/${pageId}/sections/{type}`,
        };
      }
      return col;
    });
  }, [pageId]);

  return (
    <div className="min-h-[78vh] bg-[#f7f8fc] p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Page Sections: {pageData?.pageName || "..."}
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Manage sections for this page
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
      <div ref={formRef} className="space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {editingRow ? "Edit Section" : "Add New Section"}
            </h2>
            {editingRow && (
              <button
                onClick={() => {
                  setEditingRow(null);
                  setSelectedSectionId("");
                  setSelectedSectionType("");
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select Section Type <span className="text-red-500">*</span>
              </label>
              <SelectRows
                className="w-full!"
                placeholder="Select Section"
                options={filteredSectionOptions}
                value={selectedSectionId}
                disabled={!!editingRow}
                onChange={handleSectionChange}
              />
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <DynamicForm
              key={(selectedSectionId || "none") + (editingRow?.id || "new")}
              fields={currentFields}
              initialData={initialFormData}
              onSubmit={(fd) => {
                if (!selectedSectionId) {
                  toast.error("Please select a section type first");
                  return;
                }
                handleSubmit(fd);
              }}
              isSubmitting={isSubmitting}
              mode={editingRow ? "edit" : "create"}
              title={
                sectionTypes.find((s) => s.id === selectedSectionId)?.name ||
                "Section"
              }
              showHeader={false}
              layout={PAGE_SECTION_LAYOUTS[selectedSectionType] || "split"}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Page Sections List
          </h2>
          <span className="text-sm text-gray-500">
            {pageSections.length} Items
          </span>
        </div>

        {isLoading ? (
          <AdminLoader />
        ) : (
          <DataTable
            data={pageSections}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No sections added yet"
            rowKey={(row, idx) => `${row.id || ""}-${idx}`}
            pagination={pagination}
            onPageChange={setPage}
            onLimitChange={setLimit}
            footerText={(total) => `Showing ${total} items`}
            endpoint="/admin/page-sections"
            onRefresh={fetchList}
          />
        )}
      </div>
    </div>
  );
}
