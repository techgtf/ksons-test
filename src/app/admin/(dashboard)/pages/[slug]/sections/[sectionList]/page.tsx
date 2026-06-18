"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlinePlus } from "react-icons/hi";
import api from "@/src/admin/lib/axios";
import DynamicForm from "@/src/admin/components/shared/DynamicForm/DynamicForm";
import DataTable from "@/src/admin/components/shared/DataTable";
import {
  PAGE_SECTION_LIST_FIELDS,
  PAGE_SECTION_ENDPOINTS,
  PAGE_SECTION_PARAMS,
  PAGE_SECTION_TABLE_DATA_API,
  PAGE_SECTION_LAYOUTS,
  PAGE_SECTION_CUSTOM_ACTIONS,
  PAGE_SECTION_COLUMNS,
} from "@/src/admin/config/pagesConfig";
import AdminLoader from "@/src/admin/components/shared/AdminLoader";
import toast from "react-hot-toast";
import { GetNestedValue } from "@/src/admin/components/cells/GetNestedValue";
import { ListColumn } from "@/src/admin/config/adminConfig";

const SECTION_TITLES: Record<string, string> = {
  our_vison_and_mission: "Vision & Mission Items",
  about_brand_metrics: "Brand Metrics",
};

const SECTION_SINGULAR_NOUNS: Record<string, string> = {
  our_vison_and_mission: "Vision Item",
  about_brand_metrics: "Metric",
};

export default function PageSectionSubCrudPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.slug as string;
  const sectionType = params.sectionList as string;

  const formRef = useRef<HTMLDivElement>(null);

  const [pageData, setPageData] = useState<any>(null);
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

  const sectionTitle = SECTION_TITLES[sectionType] || sectionType;
  const sectionNoun = SECTION_SINGULAR_NOUNS[sectionType] || "Item";

  const fields = useMemo(() => {
    return PAGE_SECTION_LIST_FIELDS[sectionType] || [];
  }, [sectionType]);

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

  const getEndpoint = () => {
    return PAGE_SECTION_ENDPOINTS[sectionType] || `/admin/page-section-items`;
  };

  const getTableApi = () => {
    return PAGE_SECTION_TABLE_DATA_API[sectionType] || getEndpoint();
  };

  const FetchPageDetails = async () => {
    try {
      const res = await api.get(`/admin/pages/${pageId}`);
      setPageData(res.data?.data || null);
    } catch (error) {
      console.error("Failed to fetch page details", error);
    }
  };

  const FetchItems = async (page = 1, limit = 10) => {
    setIsLoading(true);
    const extraParams = PAGE_SECTION_PARAMS[sectionType] || {};
    try {
      const res = await api.get(getTableApi(), {
        params: { page, limit, ...extraParams },
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
    if (pageId && sectionType) {
      FetchPageDetails();
      FetchItems();
    }
  }, [pageId, sectionType]);

  const handleSubmit = async (formData: FormData) => {
    if (!pageData?.slug) {
      toast.error("Page details not loaded. Cannot save.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingRow) {
        await api.patch(`${getEndpoint()}/${editingRow.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(`${sectionNoun} updated successfully`);
      } else {
        // formData.append("pageId", pageId);
        await api.post(getEndpoint(), formData, {
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

  const handleEdit = async (row: any) => {
    try {
      const res = await api.get(`${getEndpoint()}/${row.id}`);
      setEditingRow(res.data?.data || null);
      toast.success(
        `${res.data?.message || `${sectionNoun} fetched successfully`}`,
      );
      FetchItems(pagination.page, pagination.limit);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          `Failed to fetch ${sectionNoun.toLowerCase()}`,
      );
    }
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (row: any) => {
    try {
      const res = await api.delete(`${getEndpoint()}/${row.id}`);
      toast.success(
        `${res.data?.message || `${sectionNoun} deleted successfully`}`,
      );
      FetchItems(pagination.page, pagination.limit);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          `Failed to delete ${sectionNoun.toLowerCase()}`,
      );
    }
  };

  const columns = useMemo(() => {
    // 1. Use listColumns from config if present, otherwise fallback to listFields
    const columnConfigs: ListColumn[] =
      PAGE_SECTION_COLUMNS[sectionType] ||
      fields
        .filter((f: any) => f.type !== "hidden" && !f.excludeFromTable)
        .slice(0, 2)
        .map((f: any) => ({
          key: f.name,
          title: f.label,
          dataKey: f.name,
          type: f.type,
        }));

    const cols: ListColumn[] = columnConfigs.map((col: any) => ({
      key: col.key,
      title: col.title,
      dataKey: col.dataKey,
      type: col.type,
    }));

    // 2. Add Custom Actions if defined
    const customActions = PAGE_SECTION_CUSTOM_ACTIONS[sectionType] || [];
    customActions.forEach((action) => {
      cols.push({
        key: `action_${action.label.replace(/\s+/g, "_").toLowerCase()}`,
        title: action.label,
        dataKey: "", // Not used for action
        render: (row: any) => {
          const href = action.linkTemplate.replace(
            /\{(\w+)\}/g,
            (match: string, key: string) => {
              const val = GetNestedValue(row, key);
              return val !== undefined && val !== null ? String(val) : match;
            },
          );
          return (
            <button
              onClick={() => router.push(href)}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              {action.showIcon && <HiOutlinePlus className="text-sm" />}
              {action.label}
            </button>
          );
        },
      });
    });

    return cols;
  }, [fields, sectionType, router]);

  if (!fields.length) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f8fc] p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Config Not Found</h2>
        <p className="text-sm text-gray-500 mb-4">
          No sub-fields have been configured for the section type {sectionType}.
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0f3c78] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[78vh] bg-[#f7f8fc] p-6 lg:p-10 space-y-8">
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Manage {sectionTitle}
          </h1>
          <p className="text-xs text-gray-500">
            For page: {pageData?.pageName || "..."}
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

      <div
        ref={formRef}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          {editingRow ? `Edit ${sectionNoun}` : `Add ${sectionNoun}`}
        </h2>
        <DynamicForm
          key={sectionType + (editingRow?.id || "new") + formResetKey}
          fields={fields}
          initialData={initialFormData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          mode={editingRow ? "edit" : "create"}
          title={sectionNoun}
          showHeader={false}
          layout={PAGE_SECTION_LAYOUTS[sectionType] || "split"}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">{sectionNoun}s List</h2>
        {isLoading ? (
          <AdminLoader />
        ) : (
          <DataTable
            data={items}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage={`No items added yet`}
            rowKey={(row) => row.id || Math.random().toString()}
            pagination={pagination}
            onPageChange={(page) => FetchItems(page, pagination.limit)}
            onLimitChange={(limit) => FetchItems(1, limit)}
            endpoint={getEndpoint()}
            onRefresh={() => FetchItems(pagination.page, pagination.limit)}
          />
        )}
      </div>
    </div>
  );
}
