"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlinePlus } from "react-icons/hi";
import api from "@/src/admin/lib/axios";
import DynamicForm from "@/src/admin/components/shared/DynamicForm/DynamicForm";
import DataTable from "@/src/admin/components/shared/DataTable";
import {
  PROJECT_SECTION_LIST_FIELDS,
  PROJECT_SECTION_ENDPOINTS,
  PROJECT_SECTION_COLUMNS,
  PROJECT_SECTION_PARAMS,
} from "@/src/admin/config/projectsConfig";
import AdminLoader from "@/src/admin/components/shared/AdminLoader";
import toast from "react-hot-toast";
import { ListColumn } from "@/src/admin/config/adminConfig";



const SECTION_TITLES: Record<string, string> = {
  banner: "Banner",
  highlight: "Highlights",
  specification: "Specifications",
  floorPlan: "Floor & Master Plans",
  locationadvantage: "Location Advantages",
  gallery: "Gallery Images",
  amenities: "Amenities",
};

const SECTION_SINGULAR_NOUNS: Record<string, string> = {
  banner: "Banner",
  highlight: "Highlight",
  specification: "Specification",
  floorPlan: "Floor Plan",
  locationadvantage: "Location Advantage",
  gallery: "Gallery Image",
  amenities: "Amenity",
};

export default function SectionSubCrudPage() {
  const router = useRouter();
  const params = useParams();
  const platter = params.platter as string;
  const projectId = params.id as string;
  const sectionList = params.sectionList as string;

  const formRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formResetKey, setFormResetKey] = useState(0);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const sectionTitle = SECTION_TITLES[sectionList] || sectionList;
  const sectionNoun = SECTION_SINGULAR_NOUNS[sectionList] || "Item";

  const fields = useMemo(() => {
    return PROJECT_SECTION_LIST_FIELDS[sectionList] || [];
  }, [sectionList]);

  const initialFormData = useMemo(() => {
    if (!editingRow) return {};
    const data = { ...editingRow };
    if (editingRow.files && typeof editingRow.files === "object") {
      Object.keys(editingRow.files).forEach((key) => {
        if (editingRow.files[key]) {
          data[key] = editingRow.files[key];
        }
      });
    }
    return data;
  }, [editingRow]);

  const getEndpoint = (type: string) => {
    return PROJECT_SECTION_ENDPOINTS[type] || `/admin/project-${type}s`;
  };

  const FetchItems = async (page = 1, limit = 10) => {
    setIsLoading(true);
    const extraParams = PROJECT_SECTION_PARAMS[sectionList] || {};
    try {
      const res = await api.get(getEndpoint(sectionList), {
        params: { projectId, page, limit, ...extraParams },
      });
      setItems(res.data?.data || []);
      if (res.data?.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error(`Failed to fetch ${sectionTitle} items`, error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId && sectionList) {
      FetchItems();
    }
  }, [projectId, sectionList]);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (editingRow) {
        const itemId = editingRow.id || editingRow._id;
        await api.patch(`${getEndpoint(sectionList)}/${itemId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(`${sectionNoun} updated successfully`);
      } else {
        formData.append("projectId", projectId);
        await api.post(getEndpoint(sectionList), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(`${sectionNoun} added successfully`);
      }

      setEditingRow(null);
      setFormResetKey((prev) => prev + 1);
      FetchItems(pagination.page, pagination.limit);

      window.scrollTo({ top: 300, behavior: "smooth" });
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          `Failed to save ${sectionNoun.toLowerCase()}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (row: any) => {
    setEditingRow(row);
    formRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleDelete = async (row: any) => {
    try {
      const itemId = row.id || row._id;
      await api.delete(`${getEndpoint(sectionList)}/${itemId}`);
      toast.success(`${sectionNoun} deleted successfully`);
      FetchItems(pagination.page, pagination.limit);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          `Failed to delete ${sectionNoun.toLowerCase()}`,
      );
    }
  };

  // ---------------------------------------------------------------------------
  // Columns Generation (Dynamically generated from current fields)
  // ---------------------------------------------------------------------------

  const columns = useMemo(() => {
    // 1. Get column configuration for this specific section type
    const columnConfigs: ListColumn[] = PROJECT_SECTION_COLUMNS[sectionList] || [];

    // 2. If no config exists, fallback to dynamic generation from fields (limited to 4)
    const effectiveColumns: ListColumn[] = columnConfigs.length
      ? columnConfigs
      : fields
          .filter((f) => f.type !== "hidden" && !f.excludeFromTable)
          .slice(0, 4)
          .map((f) => ({
            key: f.name,
            title: f.label,
            dataKey: f.name,
            type: f.type,
          }));

    if (!effectiveColumns.length) return [];

    const cols: ListColumn[] = effectiveColumns.map((col: any) => ({
      key: col.key,
      title: col.title,
      dataKey: col.dataKey,
      type: col.type,
    }));

    // 3. Add Sequence column for all tables!
    cols.push({
      key: "seq",
      title: "Sequence",
      dataKey: "seq",
      type: "number",
    });

    return cols;
  }, [fields, sectionList]);

  if (!fields.length) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f8fc] p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Config Not Found</h2>
          <p className="text-sm text-gray-500">
            No sub-fields have been configured for the section type{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-red-600 font-mono">
              {sectionList}
            </code>{" "}
            in{" "}
            <code className="font-mono text-gray-700">projectsConfig.ts</code>.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f3c78] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0b2f5e]"
          >
            <HiOutlineArrowLeft className="text-lg" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[78vh] bg-[#f7f8fc] p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <span>Admin</span>
            <span>/</span>
            <span className="capitalize">{platter}</span>
            <span>/</span>
            <span>Sections</span>
            <span>/</span>
            <span className="text-[#0f3c78] font-semibold">{sectionTitle}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Manage {sectionTitle}
          </h1>
          <p className="text-xs text-gray-500">
            Add, update, or remove details for this project section
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
        >
          <HiOutlineArrowLeft className="text-base" />
          Back
        </button>
      </div>

      <div className="" ref={formRef}>
        {/* Form Column */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-gray-50 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingRow ? `Edit ${sectionNoun}` : `Add ${sectionNoun}`}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {editingRow
                  ? "Modify current entry fields"
                  : "Create a new entry detail"}
              </p>
            </div>
            {editingRow && (
              <button
                onClick={() => setEditingRow(null)}
                className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <DynamicForm
            key={
              sectionList +
              (editingRow?.id || editingRow?._id || "new") +
              formResetKey
            }
            fields={fields}
            initialData={initialFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            mode={editingRow ? "edit" : "create"}
            title={sectionNoun}
            showHeader={false}
          />
        </div>

        {/* Table Column */}
        <div className="flex items-center justify-between mt-8">
          <h2 className="text-lg font-bold text-gray-900 pb-5">
            {sectionNoun}s List
          </h2>
          <span className="inline-flex items-center rounded-xl bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {items.length} Total Items
          </span>
        </div>

        {isLoading ? (
          <div className="flex w-full items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <AdminLoader />
          </div>
        ) : (
          <DataTable
            data={items}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage={`No ${sectionNoun.toLowerCase()}s added yet`}
            rowKey={(row, idx) => `${row.id || row._id || ""}-${idx}`}
            pagination={pagination}
            onPageChange={(page) => FetchItems(page, pagination.limit)}
            onLimitChange={(limit) => FetchItems(1, limit)}
            footerText={(total) =>
              `Showing ${total} ${sectionNoun.toLowerCase()}(s)`
            }
            endpoint={getEndpoint(sectionList)}
            onRefresh={() => FetchItems(pagination.page, pagination.limit)}
          />
        )}
      </div>
    </div>
  );
}
