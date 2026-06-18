"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

import Pagination from "./pagination";
import { DataTableProps } from "../../types/dataTable";
import SearchInput from "./SearchInput";
import SelectRows from "./SelectRows";
import ConfirmModal from "./ConfirmModal";

import { SequenceCell } from "../cells/SequenceCell";
import { StatusToggleCell } from "../cells/StatusToggleCell";
import { TableButton } from "../cells/TableButton";
import { CellValue } from "../cells/CellValue";
import { GetNestedValue } from "../cells/GetNestedValue";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import { PROJECT_SECTION_LIST_FIELDS } from "../../config/projectsConfig";
import { PAGE_SECTION_LIST_FIELDS } from "../../config/pagesConfig";

export interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

interface ExtendedColumn<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;

  dataKey?: string;
  type?: string;
  isAction?: boolean;
  linkTemplate?: string;
  showIcon?: boolean;
  badge?: boolean;
  truncate?: boolean;
}

interface ExtendedDataTableProps<T extends { id?: string }> extends Omit<
  DataTableProps<T>,
  "columns"
> {
  columns: ExtendedColumn<T>[];

  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;

  showActions?: boolean;

  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  customActions?: {
    label: string;
    render: (row: T) => React.ReactNode;
  }[];

  endpoint?: string;
  onRefresh?: () => void;
  updateSequence?: (id: any, val: number, path?: any) => Promise<any> | any;
  slug?: string;
}

export default function DataTable<T extends { id?: string }>({
  data,
  columns,
  pagination,
  onPageChange,
  onLimitChange,
  emptyMessage = "No data found",
  footerText,
  rowKey,
  animated = true,

  onEdit,
  onDelete,

  showActions = true,

  onSearch,
  searchPlaceholder = "Search...",

  customActions = [],

  endpoint,
  onRefresh,
  updateSequence,
  slug,
}: ExtendedDataTableProps<T>) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const openDeleteModal = (row: T) => {
    setSelectedRow(row);
    setConfirmOpen(true);
  };

  const closeDeleteModal = () => {
    setConfirmOpen(false);
    setSelectedRow(null);
  };

  const handleDelete = () => {
    if (selectedRow && onDelete) {
      onDelete(selectedRow);
    }

    closeDeleteModal();
  };

  const truncate = (val: any) =>
    typeof val === "string" && val.length > 40
      ? `${val.slice(0, 40)}...`
      : (val ?? "-");

  const isImageUrl = (value: any) =>
    typeof value === "string" &&
    (value.startsWith("http") || value.startsWith("/")) &&
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(value);

  const isVideoUrl = (value: any) =>
    typeof value === "string" &&
    (value.startsWith("http") || value.startsWith("/")) &&
    /\.(mp4|webm|ogg)$/i.test(value);

  const renderValue = (value: any) => {
    if (isImageUrl(value)) {
      return (
        <img
          src={value}
          alt="preview"
          className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
        />
      );
    }

    if (isVideoUrl(value)) {
      return (
        <video
          src={value}
          controls
          className="w-32 rounded-lg border border-gray-200"
        />
      );
    }

    return truncate(value);
  };

  const getLinkHref = (template: string, row: any) => {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      if (key === "slug" && slug) return slug;
      let value = GetNestedValue(row, key);
      if (key === "id" && (value === undefined || value === null)) {
        value = GetNestedValue(row, "_id");
      }
      return value !== undefined && value !== null ? String(value) : match;
    });
  };

  const renderCellContent = (
    column: ExtendedColumn<T>,
    row: T,
    rowIndex: number,
  ) => {
    if (column.render) {
      return column.render(row, rowIndex);
    }

    const rowId = String(row.id || (row as any)._id || "");
    const dataKey = column.dataKey || String(column.key);

    // 1. Sequence Cell
    if (dataKey === "seq" || dataKey === "sequence") {
      const seqPath = column.linkTemplate
        ? getLinkHref(column.linkTemplate, row)
        : endpoint
          ? `${endpoint.split("?")[0]}/${rowId}/seq`
          : undefined;

      return (
        <SequenceCell
          rowId={rowId}
          value={Number(GetNestedValue(row as any, dataKey)) || 0}
          path={seqPath}
          updateSequence={async (id, val, path) => {
            if (updateSequence) {
              await updateSequence(id, val, path);
            } else if (path) {
              try {
                await api.patch(path, { seq: val });
                toast.success("Sequence updated successfully");
                if (onRefresh) onRefresh();
              } catch (error) {
                toast.error("Failed to update sequence");
              }
            }
          }}
        />
      );
    }

    // 2. Status Toggle Cell
    if (
      column.type === "toggle" ||
      dataKey === "status" ||
      dataKey === "isFeatured" ||
      dataKey === "isPopular" ||
      dataKey === "isHome" ||
      dataKey === "is_featured"
    ) {
      const fieldName = dataKey === "is_featured" ? "feature" : dataKey;
      const base = endpoint ? endpoint.split("?")[0] : "";
      let togglePath = "";
      if (dataKey === "status") {
        togglePath = `${base}/${rowId}/status`;
      } else if (dataKey === "is_featured" || dataKey === "isFeatured") {
        togglePath = `${base}/${rowId}/feature`;
      } else {
        togglePath = `${base}/${rowId}/${dataKey}`;
      }

      return (
        <StatusToggleCell
          rowId={rowId}
          status={GetNestedValue(row as any, dataKey)}
          fieldName={fieldName}
          endpoint={togglePath}
          onRefresh={onRefresh || (() => {})}
        />
      );
    }

    // 3. Action / Link Button Cell
    if (column.isAction && column.linkTemplate) {
      const href = getLinkHref(column.linkTemplate, row);
      return (
        <TableButton
          label={column.title}
          icon={column.showIcon !== false}
          href={href}
        />
      );
    }

    // 4. More Details Cell
    if (column.key === "more_details") {
      const type = (row as any).type;
      const listFields =
        PROJECT_SECTION_LIST_FIELDS[type] || PAGE_SECTION_LIST_FIELDS[type];
      const hasListFields = listFields && listFields.length > 0;
      if (!hasListFields) {
        return (
          <span className="text-gray-400 text-xs italic">No more details</span>
        );
      }

      const href = column.linkTemplate
        ? getLinkHref(column.linkTemplate, row)
        : `/admin/project/${(row as any).projectId || rowId}/sections/${type}`;

      return <TableButton label="More Details" icon={true} href={href} />;
    }

    // 5. Fallback to CellValue
    return <CellValue column={column as any} row={row as any} />;
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      {onSearch && (
        <SearchInput onSearch={onSearch} placeholder={searchPlaceholder} />
      )}

      {/* Table */}
      <motion.div
        initial={animated ? { opacity: 0.7, y: 8 } : false}
        animate={animated ? { opacity: 1, y: 0 } : false}
        className=" rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200/60"
      >
        {data.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-sm text-gray-400">
            {emptyMessage}
          </div>
        ) : (
          <div className="">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    #
                  </th>

                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={`px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 ${column.className || ""}`}
                      style={{
                        width: column.width,
                      }}
                    >
                      {column.title}
                    </th>
                  ))}

                  {showActions && (
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  )}

                  {customActions.length > 0 && (
                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Custom Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {data.map((row, rowIndex) => {
                    const serial =
                      ((pagination?.page || 1) - 1) *
                        (pagination?.limit || 10) +
                      rowIndex +
                      1;

                    return (
                      <motion.tr
                        key={rowKey(row)}
                        initial={animated ? { opacity: 0, y: 8 } : false}
                        animate={animated ? { opacity: 1, y: 0 } : false}
                        transition={{
                          delay: rowIndex * 0.01,
                        }}
                        className="group transition-colors hover:bg-blue-50/30"
                      >
                        {/* Serial */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-gray-400">
                            {String(serial).padStart(2, "0")}
                          </span>
                        </td>

                        {/* Dynamic Columns */}
                        {columns.map((column) => (
                          <td key={String(column.key)} className="px-5 py-4">
                            {renderCellContent(column, row, rowIndex)}
                          </td>
                        ))}

                        {/* Actions */}
                        {showActions && (
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {onEdit && (
                                <button
                                  onClick={() => onEdit(row)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                                >
                                  <HiOutlinePencil className="text-sm" />
                                </button>
                              )}

                              {onDelete && (
                                <button
                                  onClick={() => openDeleteModal(row)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                                >
                                  <HiOutlineTrash className="text-sm" />
                                </button>
                              )}
                            </div>
                          </td>
                        )}

                        {/* Custom Actions */}
                        {customActions.length > 0 && (
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {customActions.map((action, index) => (
                                <div key={index}>{action.render(row)}</div>
                              ))}
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {data.length > 0 && (
          <motion.div className="border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center px-5 py-3">
            <div className="">
              {footerText
                ? footerText(pagination.total)
                : `Showing ${pagination.total} items`}
            </div>

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />

            <SelectRows
              value={pagination.limit.toString()}
              onChange={(e) => onLimitChange?.(Number(e))}
              placeholder="Select rows"
              options={[
                { label: "10 Rows", value: "10" },
                { label: "25 Rows", value: "25" },
                { label: "50 Rows", value: "50" },
              ]}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Item?"
        message="This action cannot be undone."
      />
    </div>
  );
}
