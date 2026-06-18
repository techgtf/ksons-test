"use client";
import SelectRows from "@/src/admin/components/shared/SelectRows";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useParams } from "next/navigation";
import api from "@/src/admin/lib/axios";
import DynamicForm from "@/src/admin/components/shared/DynamicForm/DynamicForm";
import DataTable from "@/src/admin/components/shared/DataTable";
import {
  DEFAULT_PROJECT_SECTION_FIELDS,
  PROJECT_SECTION_FIELDS,
} from "@/src/admin/config/projectsConfig";
import { flattenObject } from "@/src/admin/components/shared/DynamicForm/formTransform";
import AdminLoader from "@/src/admin/components/shared/AdminLoader";
import toast from "react-hot-toast";
import { useCrud } from "@/src/admin/hooks/useCrud";

export default function ProjectSectionsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;
  const formRef = useRef<HTMLDivElement>(null);

  const [sectionTypes, setSectionTypes] = useState<any[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedSectionType, setSelectedSectionType] = useState<string>("");
  const [editingRow, setEditingRow] = useState<any>(null);

  const {
    rows: projectSections,
    isLoadingList: isLoading,
    isSubmitting,
    create,
    remove,
    fetchList,
    pagination,
    setPage,
    setLimit,
  } = useCrud("projectSections", { projectId: String(projectId) });

  // Projects Sections
  const GetSectionList = async () => {
    try {
      const res = await api.get(`/admin/project-sections`);
      setSectionTypes(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch section types", error);
    }
  };

  useEffect(() => {
    GetSectionList();
  }, [projectId]);

  const sectionOptions = sectionTypes
    .filter((s) => {
      if (editingRow && s.type === editingRow.type) return true;
      return !projectSections.some((ps) => ps.type === s.type);
    })
    .map((s) => ({
      value: s.id,
      label: s.name,
    }));

  const handleSectionChange = (val: string) => {
    setSelectedSectionId(val);
    const type = sectionTypes.find((s) => s.id === val)?.type || "";
    setSelectedSectionType(type);
  };

  const currentFields = React.useMemo(() => {
    const commonFields = DEFAULT_PROJECT_SECTION_FIELDS.fields.filter(
      (f) => f.name !== "sectionId",
    );
    const specificFields = PROJECT_SECTION_FIELDS[selectedSectionType] || [];
    return [...commonFields, ...specificFields];
  }, [selectedSectionType]);

  const initialFormData = React.useMemo(() => {
    if (!editingRow) return {};

    // Standard flattening handles nested paths
    const data = flattenObject(editingRow);

    // Dynamic Peek for fields not found at the expected root/nested path
    currentFields.forEach((field) => {
      if (data[field.name] === undefined || data[field.name] === null) {
        if (editingRow.files && typeof editingRow.files === "object") {
          const fallbackVal = (editingRow.files as any)[field.name];
          if (fallbackVal) {
            data[field.name] = fallbackVal;
          }
        }
      }
    });

    return data;
  }, [editingRow, currentFields]);

  const handleSubmit = async (formData: FormData) => {
    try {
      formData.set("projectId", String(projectId));
      formData.set("type", selectedSectionType);

      if (editingRow) {
        formData.set("id", String(editingRow.id));
      }

      await create(formData, { redirectTo: null });

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
      const res = await api.get(
        `/admin/project-sections/${projectId}/${row.type}`,
      );
      const data = res.data?.data;
      setEditingRow(data);

      // Find matching section config by type
      const matchedSection = sectionTypes.find((s) => s.type === data.type);

      if (matchedSection) {
        setSelectedSectionId(String(matchedSection.id || matchedSection._id));
        setSelectedSectionType(matchedSection.type);
      }

      formRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load section details");
    }
  };

  const handleDelete = async (row: any) => {
    try {
      await remove(String(row.id));
      toast.success("Section deleted successfully");
      fetchList();
    } catch (error) {
      toast.error("Failed to delete section");
    }
  };

  const columns = React.useMemo(() => {
    return DEFAULT_PROJECT_SECTION_FIELDS.listColumns.map((col) => {
      if (col.key === "more_details") {
        return {
          ...col,
          linkTemplate: `/admin/${params.platter || "project"}/${projectId}/sections/{type}`,
        };
      }
      return col;
    });
  }, [params.platter, projectId]);

  return (
    <div className="min-h-[78vh] bg-[#f7f8fc] p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Project Sections</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Manage sections for this project
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
                options={sectionOptions}
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
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Project Sections List
          </h2>
          <span className="text-sm text-gray-500">
            {projectSections.length} Items
          </span>
        </div>

        {isLoading ? (
          <AdminLoader />
        ) : (
          <DataTable
            data={projectSections}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No sections added yet"
            rowKey={(row) => String(row.id || "")}
            pagination={pagination}
            onPageChange={setPage}
            onLimitChange={setLimit}
            footerText={(total) => `Showing ${total} items`}
            endpoint="/admin/project-sections"
            onRefresh={fetchList}
          />
        )}
      </div>
    </div>
  );
}
