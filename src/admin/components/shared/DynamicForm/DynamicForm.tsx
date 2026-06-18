"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineSave,
  HiOutlineArrowLeft,
  HiOutlineInformationCircle,
  HiOutlineCheck,
  HiOutlineSearch,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { IoChevronDown, IoCheckmark } from "react-icons/io5";
import SearchInput from "../SearchInput";
import Input from "./Input";
import Textarea from "./textArea";
import FileUpload from "./fileUpload";
import TiptapEditor from "./TiptapEditor";
import { flattenObject, buildFormData } from "./formTransform";
import { FieldType } from "@/src/admin/config/projectsConfig";
import { useDropdownOptions } from "@/src/admin/hooks/useDropdownOptions";
import api from "@/src/admin/lib/axios";

type FieldOption = {
  label: string;
  value: string;
};

type Field = {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string | string[];
  rows?: number;
  section?: string;
  required?: boolean;
  options?: FieldOption[]; // for select / multiselect
  dynamicSource?: string; // key to fetch options from
  searchEndpoint?: string; // API endpoint for autocomplete/search
  dependsOn?: string; // field name that this field depends on
  hint?: string; // small helper text below the field
  hideInDisplay?: boolean;
  excludeFromPayload?: boolean; // If true, field value will not be sent to backend
  excludeFromTable?: boolean; // If true, field will not be shown as a column in tables
  showIf?:
    | {
        field: string;
        value: any;
      }
    | ((formValues: any) => boolean);
  excludeExisting?: boolean;
  defaultValue?: any;
  colSpan?: string;
  repeaterFields?: Field[]; // Fields to repeat in a 'repeater' type
  addButtonText?: string;
  maxItems?: number;
  minItems?: number;
  isFlatArray?: boolean;
  disabled?: boolean;
  disabledInEdit?: boolean;
};

type Props = {
  title?: string;
  mode?: "create" | "edit";
  fields: Field[];
  initialData?: Record<string, any>;
  onSubmit?: (data: FormData) => void;
  isSubmitting?: boolean;
  showHeader?: boolean;
  layout?: "split" | "full";
};

const FILE_TYPES: FieldType[] = ["image", "video"];
const RIGHT_PANEL_TYPES: FieldType[] = ["image", "video"];
const RIGHT_SECTION_NAMES = ["images", "media", "media info"];

/** Returns true if the section should render in the right sidebar */
function isRightSection(sectionName: string, items: Field[]) {
  if (RIGHT_SECTION_NAMES.includes(sectionName.toLowerCase())) return true;
  return items.some((f) => RIGHT_PANEL_TYPES.includes(f.type ?? "text"));
}

const EMPTY_OBJ = {};

/* -------------------------------------------------------------------------- */
/*                              MAIN FORM                                     */
/* -------------------------------------------------------------------------- */

export default function DynamicForm({
  title = "Dynamic Form",
  mode = "create",
  fields,
  initialData = EMPTY_OBJ,
  onSubmit,
  isSubmitting = false,
  showHeader = true,
  layout = "split",
}: Props) {
  const router = useRouter();

  // scalar values (text, number, select, toggle, color, date…)
  const [form, setForm] = useState<Record<string, any>>({});
  // file objects
  const [files, setFiles] = useState<Record<string, File | null>>({});
  // validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialState = useMemo(() => {
    const flattened = flattenObject(initialData);

    fields.forEach((field) => {
      // Handle custom default values from field config
      if (
        field.defaultValue !== undefined &&
        (flattened[field.name] === undefined || flattened[field.name] === null)
      ) {
        flattened[field.name] = field.defaultValue;
      }

      // Fallback: Deriving media_type if not explicitly set
      if (
        field.name === "media_type" &&
        (flattened[field.name] === undefined || flattened[field.name] === null)
      ) {
        flattened[field.name] = flattened.iframe ? "iframe" : "image";
      }

      if (field.type === "multiselect" && !flattened[field.name]) {
        // Example: subTypologyId -> look for initialData.projectSubTypology
        if (field.name === "subTypologyId" && initialData.projectSubTypology) {
          flattened[field.name] = initialData.projectSubTypology.map(
            (item: any) => item.subTypologyId,
          );
        }

        // Example: amenityId -> look for initialData.projectAmenity
        if (field.name === "amenityId" && initialData.projectAmenity) {
          flattened[field.name] = initialData.projectAmenity.map(
            (item: any) => item.amenityId,
          );
        }
      }
    });

    return flattened;
  }, [initialData, fields]);

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleScalarChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBulkChange = (values: Record<string, any>) => {
    setForm((prev) => ({ ...prev, ...values }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(values).forEach((k) => {
        if (next[k]) delete next[k];
      });
      return next;
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      file.type === "image/svg+xml" ||
      file.name.toLowerCase().endsWith(".svg")
    ) {
      setErrors((prev) => ({ ...prev, [name]: "SVG formats are not allowed" }));
      e.target.value = "";
      return;
    }

    setFiles((prev) => ({ ...prev, [name]: file }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const visibleFields = useMemo(() => {
    return fields.filter((field) => {
      if (!field.showIf) return true;

      if (typeof field.showIf === "function") {
        return field.showIf(form);
      }

      const showIf = field.showIf as { field: string; value: any };
      const condVal = form[showIf.field];
      const expectedVal = showIf.value;

      // Handle default/fallback values when the form value is not yet set
      if (condVal === undefined || condVal === null || condVal === "") {
        const condField = fields.find((f) => f.name === showIf.field);
        const defaultValue =
          condField?.defaultValue ??
          (showIf.field === "media_type" ? "image" : undefined);
        if (defaultValue !== undefined) {
          return defaultValue === expectedVal;
        }
      }

      return condVal === expectedVal;
    });
  }, [fields, form]);

  /* ── validation ── */

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    visibleFields.forEach((field) => {
      if (!field.required) return;
      const isFile = FILE_TYPES.includes(field.type ?? "text");
      const missing = isFile
        ? !files[field.name] && !form[field.name]
        : !form[field.name] && form[field.name] !== 0;
      if (missing) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── submit ── */
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Record<string, any> = {};

    if (mode === "create") {
      // ── CREATE MODE: Send everything ──
      fields.forEach((f) => {
        if (f.excludeFromPayload) return;

        const isVisible = visibleFields.some((vf) => vf.name === f.name);
        if (!isVisible) {
          const isFile = FILE_TYPES.includes(f.type ?? "text");
          if (!isFile) {
            payload[f.name] = "";
          }
          return;
        }

        const val = form[f.name];
        payload[f.name] = val !== undefined && val !== null ? val : "";
      });
      // Include all selected files
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          payload[key] = files[key];
        }
      });
    } else {
      // ── EDIT MODE: Smart payload ──
      fields.forEach((f) => {
        if (f.excludeFromPayload) return;

        const isFile = FILE_TYPES.includes(f.type ?? "text");
        const isVisible = visibleFields.some((vf) => vf.name === f.name);

        if (!isVisible) {
          // Clear non-visible scalar fields so they get deleted in database
          if (!isFile) {
            payload[f.name] = "";
          }
          return;
        }

        if (isFile) {
          // For media: ONLY send if a new file was actually selected
          if (files[f.name]) {
            payload[f.name] = files[f.name];
          }
        } else {
          // For scalar fields: Send everything (as requested)
          const val = form[f.name];
          payload[f.name] = val !== undefined && val !== null ? val : "";
        }
      });
    }

    const formData = buildFormData(payload);
    onSubmit?.(formData);
  };

  /* ── group fields by section ── */

  const groupedFields = useMemo(
    () =>
      visibleFields.reduce((acc: Record<string, Field[]>, field) => {
        const section = field.section || "General";
        if (!acc[section]) acc[section] = [];
        acc[section].push(field);
        return acc;
      }, {}),
    [visibleFields],
  );

  const leftSections = Object.entries(groupedFields).filter(
    ([section, items]) => layout === "full" || !isRightSection(section, items),
  );

  const rightSections =
    layout === "full"
      ? []
      : Object.entries(groupedFields).filter(([section, items]) =>
          isRightSection(section, items),
        );

  /* ── render a single field ── */

  const renderField = (field: Field) => {
    const type = field.type ?? "text";

    if (type === "text" && field.searchEndpoint) {
      return (
        <div
          className={`${field.colSpan ? field.colSpan : "w-full"}`}
          key={field.name}
        >
          <LocationSearchField
            field={field}
            value={form[field.name]}
            onChange={handleScalarChange}
            onSelect={handleBulkChange}
          />
          {errors[field.name] && (
            <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
          )}
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <TextareaField
          key={field.name}
          field={field}
          value={form[field.name]}
          onChange={handleChange}
        />
      );
    }

    if (type === "textEditor") {
      return (
        <EditorField
          key={field.name}
          field={field}
          value={form[field.name]}
          onChange={handleScalarChange}
        />
      );
    }

    if (type === "select") {
      return (
        <div className={`${field.colSpan}`} key={field.name}>
          <SelectField
            field={field}
            value={form[field.name]}
            onChange={handleScalarChange}
            form={form}
            mode={mode}
          />
          {errors[field.name] && (
            <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
          )}
        </div>
      );
    }

    if (type === "multiselect") {
      return (
        <div className={`w-full`} key={field.name}>
          <MultiSelectField
            field={field}
            value={form[field.name]}
            onChange={handleScalarChange}
            form={form}
          />
          {errors[field.name] && (
            <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
          )}
        </div>
      );
    }

    if (type === "toggle") {
      return (
        <div
          className={`${field.colSpan ? field.colSpan : "w-full"}`}
          key={field.name}
        >
          <ToggleField
            field={field}
            value={form[field.name]}
            onChange={handleScalarChange}
          />
        </div>
      );
    }

    if (type === "color") {
      return (
        <div className={`w-full`} key={field.name}>
          <ColorField
            field={field}
            value={form[field.name]}
            onChange={handleScalarChange}
          />
          {errors[field.name] && (
            <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
          )}
        </div>
      );
    }

    if (type === "image" || type === "video") {
      return (
        <div className={`${field.colSpan}`} key={field.name}>
          <FileUpload
            label={field.label}
            name={field.name}
            type={type}
            value={form[field.name]}
            file={files[field.name]}
            onChange={handleFile}
          />
          {field.hint && <FieldHint hint={field.hint} />}
          {errors[field.name] && (
            <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
          )}
        </div>
      );
    }
    if (type === "hidden") {
      return (
        <div className="hidden" key={field.name}>
          <InputField
            field={field}
            value={form[field.name]}
            onChange={handleChange}
          />
        </div>
      );
    }

    if (type === "phone") {
      return (
        <div className={`${field.colSpan}`} key={field.name}>
          <PhoneField
            field={field}
            value={form[field.name]}
            onChange={handleScalarChange}
          />
          {errors[field.name] && (
            <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
          )}
        </div>
      );
    }

    if (type === "repeater") {
      return (
        <div key={field.name} className="w-full">
          <RepeaterField
            field={field}
            value={form[field.name]}
            onChange={handleScalarChange}
            files={files}
            onFileChange={handleFile}
          />
        </div>
      );
    }

    // text | number | date | email | url  → use existing Input
    return (
      <div
        className={`${field.colSpan ? field.colSpan : "w-full"}`}
        key={field.name}
      >
        <InputField
          field={field}
          value={form[field.name]}
          onChange={handleChange}
        />
        {errors[field.name] && (
          <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
        )}
      </div>
    );
  };

  /* ── layout ── */

  return (
    <form onSubmit={submitHandler} className="space-y-5" noValidate>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {mode === "edit" ? `Edit ${title}` : `Create ${title}`}
            </h1>
            <p className="mt-0.5 text-xs text-gray-500">Manage form details</p>
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
      )}

      {/* Body */}
      <div
        className={`grid gap-5  ${rightSections.length === 0 ? "lg:grid-cols-1" : "lg:grid-cols-3"}`}
      >
        {/* LEFT — all non-media sections */}
        <div
          className={`space-y-5 ${rightSections.length > 0 ? "lg:col-span-2" : "w-full"}`}
        >
          {leftSections.map(([section, items]) => {
            const isAllHidden = items.every((item) => item.hideInDisplay);
            if (isAllHidden)
              // This is for hidden fields in frontend
              return (
                <div key={section + 1} className="hidden hidden-display-field">
                  {items.map(renderField)}
                </div>
              );
            return (
              <Card key={section} title={section}>
                <div
                  className={`flex flex-wrap justify-between gap-4 w-full space-y-4`}
                >
                  {items.map(renderField)}
                </div>
              </Card>
            );
          })}
        </div>

        {/* RIGHT — image / video sections */}
        {rightSections.length > 0 && (
          <div className="sticky top-[100px] self-start space-y-5">
            {rightSections.map(([section, items]) => (
              <Card key={section} title={section}>
                <div className="space-y-4">{items.map(renderField)}</div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0f3c78] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition-all hover:bg-[#0b2f5e] active:scale-95"
          disabled={isSubmitting}
        >
          <HiOutlineSave className="text-base" />
          {/* {mode === "edit" ? "Update" : "Save"} */}
          {isSubmitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

function FieldHint({ hint }: { hint: string }) {
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
      <HiOutlineInformationCircle className="shrink-0 text-sm" />
      {hint}
    </p>
  );
}

function FieldLabel({
  label,
  required,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-gray-700"
    >
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*                            SELECT FIELD                                    */
/* -------------------------------------------------------------------------- */

function SelectField({
  field,
  value,
  onChange,
  form,
  mode,
}: {
  field: Field;
  value: string;
  onChange: (name: string, value: string) => void;
  form: Record<string, any>;
  mode?: "create" | "edit";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const dependencyValue = field.dependsOn ? form[field.dependsOn] : null;

  // Logic for custom endpoints based on dependencies
  let customEndpoint = undefined;
  if (field.dependsOn && dependencyValue) {
    if (field.name === "subTypologyId" && field.dependsOn === "typologyId") {
      customEndpoint = `/admin/typologymapping/${dependencyValue}/subtypes`;
    }
  }

  const { options: dynamicOptions, isLoading } = useDropdownOptions(
    field.dependsOn && !dependencyValue ? undefined : field.dynamicSource,
    undefined,
    "id",
    customEndpoint,
  );
  const options = useMemo(() => {
    let baseOptions = field.dynamicSource
      ? dynamicOptions
      : field.options || [];

    if (field.excludeExisting && field.dynamicSource && field.options) {
      // Filter predefined options by removing those that already exist in the dynamic source
      return field.options.filter(
        (opt) =>
          opt.value?.toLowerCase() === value?.toLowerCase() ||
          opt.label?.toLowerCase() === value?.toLowerCase() ||
          !dynamicOptions.some((d) => {
            const existingLabel = String(d.label || "").toLowerCase();
            const existingValue = String(d.value || "").toLowerCase();
            const optLabel = String(opt.label || "").toLowerCase();
            const optValue = String(opt.value || "").toLowerCase();
            return (
              existingLabel === optLabel ||
              existingLabel === optValue ||
              existingValue === optValue ||
              existingValue === optLabel
            );
          }),
      );
    }

    return baseOptions;
  }, [
    field.dynamicSource,
    dynamicOptions,
    field.options,
    field.excludeExisting,
    value,
  ]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset search and page when dropdown opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [isOpen]);

  const selectedOption = options?.find(
    (opt) =>
      opt.value?.toLowerCase() === value?.toLowerCase() ||
      opt.label?.toLowerCase() === value?.toLowerCase(),
  );

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!options) return [];
    if (!searchTerm) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  // Paginated options (10 per page)
  const itemsPerPage = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOptions.length / itemsPerPage),
  );

  // Adjust current page if search term shrinks options
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredOptions, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOptions = filteredOptions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSelect = (val: string) => {
    onChange(field.name, val);
    setIsOpen(false);
  };

  const isDisabled =
    isLoading ||
    !!(field.dependsOn && !dependencyValue) ||
    field.disabled ||
    (mode === "edit" && field.disabledInEdit);

  return (
    <div ref={containerRef} className="relative w-full">
      <FieldLabel
        label={field.label}
        required={field.required}
        htmlFor={field.name}
      />

      {/* Select Trigger Button */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#0f3c78] focus:ring-2 focus:ring-[#0f3c78]/10 disabled:bg-gray-50 text-left"
      >
        <span className={selectedOption ? "text-gray-800" : "text-gray-400"}>
          {isLoading
            ? "Loading options..."
            : !!(field.dependsOn && !dependencyValue)
              ? `Select ${field.dependsOn.replace("Id", "")} first`
              : selectedOption?.label ||
                field.placeholder ||
                `Select ${field.label}`}
        </span>

        <IoChevronDown
          className={`transition-transform duration-200 shrink-0 text-gray-500 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={18}
        />
      </button>

      {/* Dropdown Box */}
      {isOpen && (
        <div className="absolute left-0 right-0 w-full z-100 mt-2 rounded-xl border border-gray-200 bg-white shadow-xl flex flex-col overflow-hidden max-h-[380px]">
          {/* Search bar inside dropdown */}

          <div className="p-2 border-b border-gray-100 bg-gray-50/50">
            <SearchInput
              className="w-fulld"
              placeholder={`Search ${field.label.toLowerCase()}...`}
              onSearch={(term) => {
                setSearchTerm(term);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Options list */}
          <div className="overflow-y-auto p-1 flex-1 min-h-[120px] no-scrollbar">
            {paginatedOptions.length > 0 ? (
              paginatedOptions.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors duration-150 text-left ${
                      isSelected
                        ? "bg-blue-50 text-[#0f3c78] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <IoCheckmark
                        size={18}
                        className="shrink-0 text-[#0f3c78]"
                      />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-sm text-gray-400">
                No matching options found
              </div>
            )}
          </div>

          {/* Pagination controls inside dropdown */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2 bg-gray-50/80 text-xs">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white font-medium"
              >
                Prev
              </button>
              <span className="text-gray-500 font-medium font-sans">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="rounded border border-gray-200 bg-white px-2 py-1 text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {field.hint && <FieldHint hint={field.hint} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          MULTISELECT FIELD                                 */
/* -------------------------------------------------------------------------- */

function MultiSelectField({
  field,
  value,
  onChange,
  form,
}: {
  field: Field;
  value: string[];
  onChange: (name: string, value: string[]) => void;
  form: Record<string, any>;
}) {
  const dependencyValue = field.dependsOn ? form[field.dependsOn] : null;

  // Logic for custom endpoints based on dependencies
  let customEndpoint = undefined;
  if (field.dependsOn && dependencyValue) {
    if (field.name === "subTypologyId" && field.dependsOn === "typologyId") {
      customEndpoint = `/admin/typologymapping/${dependencyValue}/subtypes`;
    }
  }

  const { options: dynamicOptions, isLoading } = useDropdownOptions(
    field.dependsOn && !dependencyValue ? undefined : field.dynamicSource,
    undefined,
    "id",
    customEndpoint,
  );
  const options = field.dynamicSource ? dynamicOptions : field.options;

  const toggle = (val: string) => {
    const current = Array.isArray(value) ? value : [];
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];
    onChange(field.name, next);
  };

  const selected = Array.isArray(value) ? value : [];

  return (
    <>
      <FieldLabel label={field.label} required={field.required} />
      <div className="flex flex-wrap gap-2">
        {isLoading && <p className="text-sm text-gray-400">Loading...</p>}
        {!isLoading && !!(field.dependsOn && !dependencyValue) && (
          <p className="text-sm text-gray-400 italic">
            Select {field.dependsOn.replace("Id", "")} first
          </p>
        )}
        {options?.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                isSelected
                  ? "border-[#0f3c78] bg-[#0f3c78] text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-[#0f3c78]/40 hover:bg-blue-50"
              }`}
            >
              {isSelected && <HiOutlineCheck className="text-xs" />}
              {opt.label}
            </button>
          );
        })}
      </div>
      {field.hint && <FieldHint hint={field.hint} />}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                            TOGGLE FIELD                                    */
/* -------------------------------------------------------------------------- */

function ToggleField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: boolean;
  onChange: (name: string, value: boolean) => void;
}) {
  const checked = Boolean(value);
  return (
    <div className={`block items-start gap-3`}>
      <div>
        <p className="text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="ml-0.5 text-red-500">*</span>}
        </p>
        {field.hint && <FieldHint hint={field.hint} />}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(field.name, !checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border-2 transition-colors duration-200 ${
          checked
            ? "border-[#0f3c78] bg-[#0f3c78]"
            : "border-gray-300 bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            COLOR FIELD                                     */
/* -------------------------------------------------------------------------- */

function ColorField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (name: string, value: string) => void;
}) {
  const color = value || "#0f3c78";
  return (
    <>
      <FieldLabel
        label={field.label}
        required={field.required}
        htmlFor={field.name}
      />
      <div className="flex items-center gap-3">
        <input
          id={field.name}
          type="color"
          value={color}
          onChange={(e) => onChange(field.name, e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 p-0.5 shadow-sm"
        />
        <span className="font-mono text-sm text-gray-500">
          {color.toUpperCase()}
        </span>
      </div>
      {field.hint && <FieldHint hint={field.hint} />}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                           INPUT WRAPPER                                    */
/* -------------------------------------------------------------------------- */

/** Wraps the existing Input component and adds hint + required star */
function InputField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  // For date inputs, convert ISO strings (e.g. "2026-05-22T00:00:00.000Z") to YYYY-MM-DD
  let displayValue = value || "";
  if (field.type === "date" && displayValue) {
    displayValue = displayValue.split("T")[0];
  }

  return (
    <>
      <Input
        label={
          <>
            {field.label}
            {field.required && <span className="ml-0.5 text-red-500">*</span>}
          </>
        }
        name={field.name}
        type={field.type || "text"}
        value={displayValue}
        onChange={onChange}
        placeholder={
          Array.isArray(field.placeholder)
            ? field.placeholder[0]
            : field.placeholder
        }
        required={field.required}
        disabled={field.disabled}
      />
      {field.hint && <FieldHint hint={field.hint} />}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                        TEXTAREA WRAPPER                                    */
/* -------------------------------------------------------------------------- */

function TextareaField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}) {
  return (
    <div className={`${field.colSpan ? field.colSpan : "w-full"}`}>
      <Textarea
        label={
          <>
            {field.label}
            {field.required && <span className="ml-0.5 text-red-500">*</span>}
          </>
        }
        name={field.name}
        value={value || ""}
        onChange={onChange}
        rows={field.rows || 4}
        placeholder={
          Array.isArray(field.placeholder)
            ? field.placeholder[0]
            : field.placeholder
        }
        required={field.required}
      />
      {field.hint && <FieldHint hint={field.hint} />}
    </div>
  );
}

function EditorField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className={`${field.colSpan ? field.colSpan : "w-full"}`}>
      <FieldLabel
        label={field.label}
        required={field.required}
        htmlFor={field.name}
      />
      <TiptapEditor
        value={value || ""}
        onChange={(content) => onChange(field.name, content)}
        placeholder={
          Array.isArray(field.placeholder)
            ? field.placeholder[0]
            : field.placeholder
        }
      />
      {field.hint && <FieldHint hint={field.hint} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         LOCATION SEARCH FIELD                              */
/* -------------------------------------------------------------------------- */

function LocationSearchField({
  field,
  value,
  onChange,
  onSelect,
}: {
  field: Field;
  value: string;
  onChange: (name: string, value: string) => void;
  onSelect: (values: Record<string, any>) => void;
}) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update local query when external value changes (e.g. on initial data load)
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    if (!query || query.length < 3 || !field.searchEndpoint || !isOpen) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get(field.searchEndpoint!, {
          params: { address: query },
        });
        // Based on user provided response structure
        if (res.data?.status === "success") {
          // We show the geocode results as suggestions
          setResults(res.data.data.geocode?.results || []);
        }
      } catch (error) {
        console.error("Location search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, field.searchEndpoint, isOpen]);

  const handleSelect = async (item: any) => {
    setIsOpen(false);
    setQuery(item.formatted_address);

    try {
      // Re-fetch to get the 'saved' IDs for this specific selection
      setIsLoading(true);
      const res = await api.get(field.searchEndpoint!, {
        params: { address: item.formatted_address },
      });

      if (res.data?.status === "success") {
        const data = res.data.data;
        const saved = data.saved;
        const geocode = data.geocode.results[0];

        const updates: Record<string, any> = {
          [field.name]: saved.state?.name || item.formatted_address,
        };

        // Helper to update field if it exists in config (supporting 'body.' prefix)
        const updateField = (key: string, val: any) => {
          updates[key] = val;
          updates[`body.${key}`] = val;
        };

        updateField("latitude", geocode.geometry.location.lat);
        updateField("longitude", geocode.geometry.location.lng);
        updateField("countryId", saved.country?.id);
        updateField("stateId", saved.state?.id);
        updateField("cityId", saved.city?.id);

        onSelect(updates);
      }
    } catch (error) {
      console.error("Select location error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <FieldLabel
        label={field.label}
        required={field.required}
        htmlFor={field.name}
      />
      <div className="relative">
        <input
          type="text"
          id={field.name}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            onChange(field.name, e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={
            (Array.isArray(field.placeholder)
              ? field.placeholder[0]
              : field.placeholder) || "Search location..."
          }
          className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          autoComplete="off"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#0f3c78]" />
          ) : (
            <HiOutlineSearch className="text-lg" />
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-xl border border-gray-100 bg-white p-1 shadow-xl">
          {results.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-gray-50"
            >
              <HiOutlineLocationMarker className="mt-0.5 shrink-0 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">
                  {item.formatted_address}
                </p>
                <p className="text-xs text-gray-500">
                  {item.geometry.location.lat.toFixed(4)},{" "}
                  {item.geometry.location.lng.toFixed(4)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {field.hint && <FieldHint hint={field.hint} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            REPEATER FIELD                                  */
/* -------------------------------------------------------------------------- */

import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

function RepeaterField({
  field,
  value,
  onChange,
  files,
  onFileChange,
  prefix = "",
}: {
  field: Field;
  value: any[];
  onChange: (name: string, value: any[]) => void;
  files: Record<string, File | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
}) {
  const isFlat = field.isFlatArray;
  const items = Array.isArray(value) ? value : isFlat ? [""] : [{}];
  const repeaterFields = field.repeaterFields || [];

  const handleItemChange = (index: number, subName: string, subValue: any) => {
    const next = [...items];
    if (isFlat) {
      next[index] = subValue;
    } else {
      next[index] = { ...(next[index] as object), [subName]: subValue };
    }
    onChange(field.name, next);
  };

  const addItem = () => {
    onChange(field.name, [...items, isFlat ? "" : {}]);
  };

  const removeItem = (index: number) => {
    const min = field.minItems ?? 1;
    if (items.length <= min) {
      if (min === 1) onChange(field.name, [isFlat ? "" : {}]);
      return;
    }
    const next = items.filter((_, i) => i !== index);
    onChange(field.name, next);
  };

  const isAtMax =
    field.maxItems !== undefined && items.length >= field.maxItems;
  const isAtMin = items.length <= (field.minItems ?? 1);

  return (
    <div className="space-y-4">
      <FieldLabel label={field.label} required={field.required} />

      <div className={`space-y-6`}>
        {items.map((item, idx) => {
          const itemPrefix = `${prefix}${field.name}[${idx}].`;
          // For file uploads, we need the bracket notation for the full path
          const filePrefix = `${prefix}${field.name}[${idx}]`;

          return (
            <div
              key={idx}
              className={`group relative rounded-2xl border border-gray-100 bg-gray-50/50 p-5 pt-8 shadow-sm transition-all hover:bg-gray-50`}
            >
              {/* Header / Remove Button */}
              <div className="absolute top-4 right-4 flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Item #{idx + 1}
                </span>
                {!isAtMin && (
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="rounded-lg bg-red-50 p-1.5 text-red-500 opacity-0 transition-all hover:bg-red-100 group-hover:opacity-100"
                  >
                    <HiOutlineTrash size={16} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap justify-between space-y-4">
                {repeaterFields.map((subField) => {
                  const subType = subField.type || "text";

                  // Extract placeholder based on index if it's an array
                  const currentPlaceholder = Array.isArray(subField.placeholder)
                    ? subField.placeholder[idx] || subField.placeholder[0]
                    : subField.placeholder;

                  const commonProps = {
                    label: subField.label,
                    placeholder: currentPlaceholder,
                    required: subField.required,
                  };

                  const subValue = isFlat ? item : item[subField.name];
                  const subFieldName = isFlat
                    ? filePrefix
                    : `${filePrefix}[${subField.name}]`;

                  return (
                    <div key={subField.name} className={subField.colSpan || ""}>
                      {subType === "textarea" ? (
                        <Textarea
                          {...commonProps}
                          name={subFieldName}
                          value={subValue || ""}
                          onChange={(e) =>
                            handleItemChange(idx, subField.name, e.target.value)
                          }
                          rows={subField.rows || 3}
                        />
                      ) : subType === "textEditor" ? (
                        <TiptapEditor
                          value={subValue || ""}
                          onChange={(content) =>
                            handleItemChange(idx, subField.name, content)
                          }
                          placeholder={
                            Array.isArray(subField.placeholder)
                              ? subField.placeholder[0]
                              : subField.placeholder
                          }
                        />
                      ) : subType === "image" || subType === "video" ? (
                        <FileUpload
                          {...commonProps}
                          type={subType}
                          name={subFieldName}
                          value={subValue || ""}
                          file={files[subFieldName]}
                          onChange={onFileChange}
                        />
                      ) : subType === "repeater" ? (
                        <RepeaterField
                          field={subField}
                          value={subValue || []}
                          onChange={(name, val) =>
                            handleItemChange(idx, name, val)
                          }
                          files={files}
                          onFileChange={onFileChange}
                          prefix={`${filePrefix}[`}
                        />
                      ) : (
                        <Input
                          {...commonProps}
                          type={subType}
                          name={subFieldName}
                          value={subValue || ""}
                          onChange={(e) =>
                            handleItemChange(idx, subField.name, e.target.value)
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!isAtMax && (
        <button
          type="button"
          onClick={addItem}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white py-4 text-sm font-medium text-gray-600 transition-all hover:border-[#0f3c78] hover:bg-blue-50/50 hover:text-[#0f3c78]"
        >
          <HiOutlinePlus size={18} />
          {field.addButtonText || "Add More Items"}
        </button>
      )}

      {field.hint && <FieldHint hint={field.hint} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               PHONE FIELD                                  */
/* -------------------------------------------------------------------------- */
function PhoneField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (name: string, value: string) => void;
}) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits and limit to 10
    const phone = e.target.value.replace(/\D/g, "").slice(0, 10);

    onChange(field.name, phone);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type="tel"
        value={value || ""}
        onChange={handlePhoneChange}
        maxLength={10}
        inputMode="numeric"
        pattern="[0-9]{10}"
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        placeholder="Enter 10 digit phone number"
      />

      {field.hint && <FieldHint hint={field.hint} />}
    </div>
  );
}
